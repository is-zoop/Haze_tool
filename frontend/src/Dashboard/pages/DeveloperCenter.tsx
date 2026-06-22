import React, { useMemo, useState } from "react";
import {
  Plus,
  RotateCcw,
  Search,
  Check,
  Code,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { UnifiedTabs, TabItem } from "@/components/UnifiedTabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { MOCK_DEVELOPER_SKILLS } from "../../temp/developerSkills";
import { MOCK_DEVELOPER_MCP_SERVERS } from "../../temp/developerMcpServers";
import { AssetStatus, DeveloperAsset } from "../../types/developer-center";
import { PageHeader } from "../../components/common/PageHeader";
import { DataTableFooter } from "../../components/common/DataTableFooter";
import { getI18n } from "../../i18n";

// Modular Developer Center Subcomponents
import { DeveloperAssetTable } from "../../components/developer-center/DeveloperAssetTable";
import { DeveloperAssetFormDialog } from "../../components/developer-center/DeveloperAssetFormDialog";
import { NewVersionDialog } from "../../components/developer-center/NewVersionDialog";
import { McpConnectionTestDialog } from "../../components/developer-center/McpConnectionTestDialog";

// Shared options & Temporary data imports
import {
  DEFAULT_ASSET,
  SIMULATION_LOGS,
  SIMULATION_FINISH_DELAY,
} from "../../temp/developerCenterTestData";

interface PageProps {
  onBackToHome: () => void;
  langCode?: "ZH" | "EN" | "JA" | "ES";
  currentRole?: "Admin" | "Member";
}

type AssetTypeFilter = "all" | "Skill" | "MCP Server";

export function DeveloperCenter({
  onBackToHome: _onBackToHome,
  langCode: _langCode = "ZH",
  currentRole = "Admin",
}: PageProps) {
  const t = getI18n(_langCode);
  const [assets, setAssets] = useState<DeveloperAsset[]>(() => [
    ...MOCK_DEVELOPER_SKILLS,
    ...MOCK_DEVELOPER_MCP_SERVERS,
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTypeTab, setActiveTypeTab] = useState<AssetTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | AssetStatus>("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Partial<DeveloperAsset>>(DEFAULT_ASSET);
  const [tagsInputText, setTagsInputText] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [showNewVersionModal, setShowNewVersionModal] = useState(false);
  const [newVersionAsset, setNewVersionAsset] = useState<DeveloperAsset | null>(null);
  const [newVersionNum, setNewVersionNum] = useState("");
  const [newVersionDesc, setNewVersionDesc] = useState("");
  const [newVersionZipName, setNewVersionZipName] = useState("");
  const [newVersionZipSize, setNewVersionZipSize] = useState("");
  const [newVersionZipFiles, setNewVersionZipFiles] = useState<{ name: string; size: string }[]>([]);
  const [newVersionErrors, setNewVersionErrors] = useState<Record<string, string>>({});

  const [showDebugModal, setShowDebugModal] = useState(false);
  const [debugAsset, setDebugAsset] = useState<DeveloperAsset | null>(null);
  const [debugStatus, setDebugStatus] = useState<"idle" | "testing" | "pass" | "fail">("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [terminalLogs, setTerminalLogs] = useState<Array<{ time: string; type: string; text: string }>>([]);
  const [testStarted, setTestStarted] = useState(false);
  const timeoutsRef = React.useRef<any[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<DeveloperAsset | null>(null);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const filteredAssets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return assets.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.project.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      const matchesType = activeTypeTab === "all" || item.type === activeTypeTab;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [assets, searchQuery, activeTypeTab, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedAssets = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredAssets.slice(start, start + pageSize);
  }, [filteredAssets, pageSize, safeCurrentPage]);

  const triggerFlashAlert = (msg: string) => {
    setFlashMessage(msg);
    setTimeout(() => setFlashMessage(null), 3000);
  };

  const resetToFirstPage = () => setCurrentPage(1);

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveTypeTab("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleOpenAddAsset = (type: "Skill" | "MCP Server" = "Skill") => {
    setIsEditing(false);
    setFormErrors({});
    setTagsInputText("");
    setCurrentAsset({
      ...DEFAULT_ASSET,
      type,
      project: "企业办公",
      version: "v1.2.0",
      description: "",
      skillMd: "# 新能力说明\n\n描述该能力的运行机制、适用范围 and prompt 配置。",
      tools: ["query_schema_list", "retrieve_active_logs"],
      resources: ["db://default_schemas"],
      testCases: [
        {
          id: "case-1",
          name: "基础用例",
          input: "列出当前所有汇总记录",
          expected: "返回成功，展示列表",
        },
      ],
    });
    setShowEditModal(true);
  };

  const handleOpenEditAsset = (asset: DeveloperAsset) => {
    setIsEditing(true);
    setFormErrors({});
    setTagsInputText((asset.tags || []).join("，"));
    const updated = { ...asset };
    if (updated.type === "Skill") {
      if (!updated.zipName) {
        updated.zipName = `${updated.code || "skill"}_${updated.version || "v1.2.0"}.zip`;
      }
      if (!updated.zipSize) {
        updated.zipSize = "32.1 KB";
      }
      if (!updated.zipFiles) {
        updated.zipFiles = [
          { name: "business_analysis_README.md", size: "18.2 KB" },
          { name: "TASK_TEMPLATE.md", size: "14.0 KB" }
        ];
      }
    }
    setCurrentAsset(updated);
    setShowEditModal(true);
  };

  const handleZipFileUploaded = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setFormErrors(prev => ({ ...prev, zipName: "zip 大小不能超过 10MB" }));
      return;
    }
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || "skill";
    setCurrentAsset(prev => ({
      ...prev,
      zipName: file.name,
      zipSize: `${(file.size / 1024).toFixed(1)} KB`,
      zipFiles: [
        { name: `${baseName}_README.md`, size: `${Math.max(1, Math.round(file.size * 0.45 / 1024))} KB` },
        { name: "index.ts", size: `${Math.max(1, Math.round(file.size * 0.4 / 1024))} KB` },
        { name: "package.json", size: "380 B" }
      ]
    }));
    setFormErrors(prev => ({ ...prev, zipName: "" }));
  };

  const handleSaveAssetForm = (event: React.FormEvent) => {
    event.preventDefault();

    const errors: Record<string, string> = {};
    if (currentAsset.type === "Skill") {
      if (!currentAsset.name || !currentAsset.name.trim()) {
        errors.name = "Skill 名称不能为空";
      } else if (currentAsset.name.length > 100) {
        errors.name = "Skill 名称不能超过 100 个字符";
      }

      if (!currentAsset.code || !currentAsset.code.trim()) {
        errors.code = "Slug 不能为空";
      } else if (!/^[a-z0-9_-]{3,50}$/.test(currentAsset.code)) {
        errors.code = "Slug 只允许小写字母、数字、下划线和中划线，3-50 个字符";
      }

      if (!currentAsset.project || !currentAsset.project.trim()) {
        errors.project = "请选择业务分类";
      }

      const versionStr = currentAsset.version || "";
      if (!versionStr.trim()) {
        errors.version = "版本必填";
      } else if (!/^v\d+\.\d+\.\d+$/.test(versionStr)) {
        errors.version = "版本建议格式为 v1.2.0";
      }

      if (!currentAsset.zipName) {
        errors.zipName = "Skill 文件必填";
      }

      const descStr = currentAsset.description || "";
      if (!descStr.trim()) {
        errors.description = "Skill 描述不能为空";
      } else if (descStr.length > 300) {
        errors.description = "Skill 描述不能超过 300 个字符";
      }
    } else {
      if (!currentAsset.name || !currentAsset.name.trim()) {
        errors.name = "能力资产名称不能为空";
      }
      if (!currentAsset.code || !currentAsset.code.trim()) {
        errors.code = "系统唯一 Code 不能为空";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (isEditing) {
      setAssets((prev) =>
        prev.map((item) =>
          item.id === currentAsset.id ? ({ ...item, ...currentAsset } as DeveloperAsset) : item,
        ),
      );
      triggerFlashAlert(
        _langCode === "ZH" ? `能力 [${currentAsset.name}] 更新成功`
        : _langCode === "JA" ? `機能 [${currentAsset.name}] を更新しました`
        : _langCode === "ES" ? `Capacidad [${currentAsset.name}] actualizada con éxito`
        : `Capability [${currentAsset.name}] updated successfully`
      );
    } else {
      const newlyCreated: DeveloperAsset = {
        ...DEFAULT_ASSET,
        ...currentAsset,
        id: `asset-${assets.length + 1}`,
        calls: 0,
        recentTestStatus: "none",
        visibility: "internal",
        updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      } as DeveloperAsset;
      setAssets((prev) => [newlyCreated, ...prev]);
      triggerFlashAlert(
        _langCode === "ZH" ? `新建能力 [${currentAsset.name}] 成功并保存为草稿`
        : _langCode === "JA" ? `新規機能 [${currentAsset.name}] を作成し、下書きとして保存しました`
        : _langCode === "ES" ? `Nueva capacidad [${currentAsset.name}] creada y guardada como borrador`
        : `New capability [${currentAsset.name}] created and saved as draft`
      );
    }

    setShowEditModal(false);
  };

  const handlePublishAsset = (asset: DeveloperAsset) => {
    // Requirement 9: Resolve invalid currentRole check inside handlePublishAsset
    const targetStatus: AssetStatus = currentRole === "Member" ? "reviewing" : "published";
    setAssets((prev) =>
      prev.map((item) =>
        item.id === asset.id
          ? { ...item, status: targetStatus, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) }
          : item,
      ),
    );

    const isSubmitted = currentRole === "Member";
    const msg = isSubmitted
      ? (_langCode === "ZH" ? `已成功提交能力 [${asset.name}] 的发布申请至审核中心`
         : _langCode === "JA" ? `機能 [${asset.name}] の公開申請を送信しました`
         : _langCode === "ES" ? `La solicitud de publicación para [${asset.name}] ha sido enviada`
         : `Capability [${asset.name}] has been submitted for review`)
      : (_langCode === "ZH" ? `能力 [${asset.name}] 已发布到能力市场`
         : _langCode === "JA" ? `機能 [${asset.name}] をマーケットに公開しました`
         : _langCode === "ES" ? `La capacidad [${asset.name}] ha sido publicada en el mercado`
         : `Capability [${asset.name}] has been published to market`);

    triggerFlashAlert(msg);
  };

  const handleOfflineAsset = (asset: DeveloperAsset) => {
    setAssets((prev) => prev.map((item) => (item.id === asset.id ? { ...item, status: "offline" } : item)));
    triggerFlashAlert(
      _langCode === "ZH" ? `能力 [${asset.name}] 已下线`
      : _langCode === "JA" ? `機能 [${asset.name}] はオフラインになりました`
      : _langCode === "ES" ? `La capacidad [${asset.name}] ahora está fuera de línea`
      : `Capability [${asset.name}] is now offline`
    );
  };

  const handleIncrementVersion = (asset: DeveloperAsset) => {
    const parts = asset.version.replace("v", "").split(".");
    let nextVersion = "1.3.0";
    if (parts.length === 3) {
      parts[1] = String(Number(parts[1]) + 1);
      nextVersion = parts.join(".");
    }
    setNewVersionAsset(asset);
    setNewVersionNum(nextVersion);
    setNewVersionDesc("");
    setNewVersionZipName("");
    setNewVersionZipSize("");
    setNewVersionZipFiles([]);
    setNewVersionErrors({});
    setShowNewVersionModal(true);
  };

  const handleNewVersionZipUploaded = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setNewVersionErrors(prev => ({ ...prev, zipName: "zip 大小不能超过 10MB" }));
      return;
    }
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || "skill";
    setNewVersionZipName(file.name);
    setNewVersionZipSize(`${(file.size / 1024).toFixed(1)} KB`);
    setNewVersionZipFiles([
      { name: `${baseName}_README.md`, size: `${Math.max(1, Math.round(file.size * 0.45 / 1024))} KB` },
      { name: "index.ts", size: `${Math.max(1, Math.round(file.size * 0.4 / 1024))} KB` },
      { name: "package.json", size: "380 B" }
    ]);
    setNewVersionErrors(prev => ({ ...prev, zipName: "" }));
  };

  const handleSaveNewVersion = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newVersionAsset) return;

    const errors: Record<string, string> = {};
    if (!newVersionNum.trim()) {
      errors.version = t.developerVersionRequired;
    } else if (!/^\d+\.\d+\.\d+$/.test(newVersionNum.trim())) {
      errors.version = t.developerVersionFormat;
    }

    if (!newVersionDesc.trim()) {
      errors.description = t.developerDescriptionRequired;
    }

    if (newVersionAsset.type === "Skill" && !newVersionZipName) {
      errors.zipName = t.developerSkillZipRequired;
    }

    if (Object.keys(errors).length > 0) {
      setNewVersionErrors(errors);
      return;
    }

    const versionStr = `v${newVersionNum.trim()}`;
    setAssets((prev) =>
      prev.map((item) =>
        item.id === newVersionAsset.id
          ? {
              ...item,
              version: versionStr,
              zipName: newVersionAsset.type === "Skill" ? newVersionZipName : item.zipName,
              zipSize: newVersionAsset.type === "Skill" ? newVersionZipSize : item.zipSize,
              zipFiles: newVersionAsset.type === "Skill" ? newVersionZipFiles : item.zipFiles,
              updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
            }
          : item
      )
    );

    triggerFlashAlert(
      _langCode === "ZH" ? `已成功创建新版本 [${newVersionAsset.name}] ${versionStr}`
      : `Successfully created new version ${versionStr} for [${newVersionAsset.name}]`
    );
    setShowNewVersionModal(false);
  };

  const handleDeleteAsset = (asset: DeveloperAsset) => {
    setAssets((prev) => prev.filter((item) => item.id !== asset.id));
    setDeleteTarget(null);
    triggerFlashAlert(
      _langCode === "ZH" ? `资产能力 [${asset.name}] 已从工作区移除`
      : _langCode === "JA" ? `機能 [${asset.name}] をワークスペースから削除しました`
      : _langCode === "ES" ? `La capacidad [${asset.name}] ha sido de-registrada`
      : `Capability [${asset.name}] was removed from active workspace`
    );
  };

  const handleCopyAssetCode = (asset: DeveloperAsset) => {
    const textToCopy = asset.type === "Skill" ? `${asset.name} (Slug: ${asset.code}):\n${asset.description || ""}` : asset.code;
    navigator.clipboard.writeText(textToCopy);
    triggerFlashAlert(
      _langCode === "ZH" ? `已复制 Prompt 到剪贴板`
      : _langCode === "JA" ? `Prompt をクリップボードにコピーしました`
      : _langCode === "ES" ? `Prompt copiado al portapapeles`
      : `Prompt copied to clipboard`
    );
  };

  const handleOpenDebug = (asset: DeveloperAsset) => {
    setDebugAsset({ ...asset });
    setDebugStatus("idle");
    setCurrentStepIndex(-1);
    setTerminalLogs([]);
    setTestStarted(false);
    setShowDebugModal(true);
  };

  const formatTerminalTime = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    const mmm = String(d.getMilliseconds()).padStart(3, '0');
    return `${hh}:${mm}:${ss}.${mmm}`;
  };

  const runSimulation = (assetArg?: DeveloperAsset) => {
    const targetAsset = assetArg || debugAsset;
    if (!targetAsset) return;

    // Clear prior timeouts
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    setTerminalLogs([]);
    setCurrentStepIndex(0);
    setDebugStatus("testing");

    const pushLog = (type: string, text: string) => {
      setTerminalLogs((prev) => [
        ...prev,
        {
          time: formatTerminalTime(),
          type,
          text,
        },
      ]);
    };

    const serverUrl = targetAsset.serverUrl || `http://127.0.0.1:3000/api/mcp/${targetAsset.code}`;

    pushLog("START", `开始测试 MCP 服务: ${serverUrl}`);

    // Offload simulation logs & steps to separate config
    SIMULATION_LOGS.forEach((log) => {
      const t = setTimeout(() => {
        if (log.type === "SYSTEM_STEP") {
          setCurrentStepIndex(log.nextStepIdx);
        } else {
          pushLog(log.type, log.text);
        }
      }, log.delay);
      timeoutsRef.current.push(t);
    });

    const tFinish = setTimeout(() => {
      setDebugStatus("pass");
      setAssets((prev) =>
        prev.map((item) =>
          item.id === targetAsset.id ? { ...item, recentTestStatus: "pass" } : item
        )
      );
    }, SIMULATION_FINISH_DELAY);
    timeoutsRef.current.push(tFinish);
  };

  // Dynamic Type Tab Counts
  const allCount = assets.length;
  const skillCount = assets.filter((item) => item.type === "Skill").length;
  const mcpCount = assets.filter((item) => item.type === "MCP Server").length;

  const developerCenterTabs: TabItem[] = [
    {
      value: "all",
      label: (
        <span className="flex items-center gap-1">
          {_langCode === "ZH" ? "全部" : _langCode === "JA" ? "全て" : _langCode === "ES" ? "Todo" : "All"} <span className="font-normal opacity-80">{allCount}</span>
        </span>
      ),
    },
    {
      value: "Skill",
      label: (
        <span className="flex items-center gap-1">
          Skill <span className="font-normal opacity-80">{skillCount}</span>
        </span>
      ),
    },
    {
      value: "MCP Server",
      label: (
        <span className="flex items-center gap-1">
          MCP <span className="font-normal opacity-80">{mcpCount}</span>
        </span>
      ),
    },
  ];

  return (
    <div className="dashboard-page-stack h-full overflow-hidden text-left font-sans flex flex-col gap-3 animate-in fade-in duration-300" id="haze-developer-center-container">
      {/* Dynamic Animated Toast */}
      <AnimatePresence>
        {flashMessage && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-900 px-4 py-3 text-xs font-bold text-white shadow-xl/90"
          >
            <Check size={14} className="text-emerald-400 shrink-0" />
            <span>{flashMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader
        title={_langCode === "ZH" ? "开发者中心" : _langCode === "JA" ? "開発者センター" : _langCode === "ES" ? "Centro de Desarrolladores" : "Developer Center"}
        description={_langCode === "ZH" ? "在此登记或上传托管的 Skill 及受控 MCP 节点服务并执行全沙箱运行调试" : _langCode === "JA" ? "ホスト型 Skill および制御された MCP ノードの登録・公開とデバッグを実行" : _langCode === "ES" ? "Registre y cargue servicios de Skill y MCP para pruebas de depuración" : "Configure and spin up hosted Skill engines or custom controlled MCP server nodes"}
        breadcrumbs={[_langCode === "ZH" ? "首页" : _langCode === "JA" ? "ホーム" : _langCode === "ES" ? "Inicio" : "Home", _langCode === "ZH" ? "开发者中心" : _langCode === "JA" ? "開発者センター" : _langCode === "ES" ? "Centro de Desarrolladores" : "Developer Center"]}
        actions={(
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full sm:w-auto font-bold bg-slate-900 hover:bg-slate-800 text-white h-10 px-4 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                <Plus size={16} />
                <span>{_langCode === "ZH" ? "注册能力" : _langCode === "JA" ? "新規追加" : _langCode === "ES" ? "Registrar" : "Add Capability"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs bg-white text-slate-700 border border-slate-100 shadow-md rounded-xl p-1 w-[140px] z-50 animate-none">
              <DropdownMenuItem
                onClick={() => handleOpenAddAsset("Skill")}
                className="cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center gap-1.5 animate-none"
              >
                <Code size={12} className="text-slate-400 animate-none" />
                <span>{t.developerUploadSkill}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleOpenAddAsset("MCP Server")}
                className="cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center gap-1.5 animate-none"
              >
                <Cpu size={12} className="text-slate-400 animate-none" />
                <span>{t.developerRegisterMcp}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-border/75 bg-white shadow-sm p-4 pt-2.5 pb-2.5 gap-3 overflow-hidden" id="haze-developer-page-overhaul">

        {/* Dynamic Type Filter Tabs */}
        <div id="haze-developer-tabs-container" className="shrink-0">
          <UnifiedTabs
            value={activeTypeTab}
            onValueChange={(value) => {
              setActiveTypeTab(value as AssetTypeFilter);
              resetToFirstPage();
            }}
            className="shrink-0 animate-fade-in"
            listClassName="h-9 rounded-lg bg-slate-100/80 p-1 border-none"
            triggerClassName="h-7 text-xs px-4 font-bold"
            tabs={developerCenterTabs}
          />
        </div>

        {/* Left Aligned Filters Toolbar - Heights of 40px */}
        <div className="flex flex-wrap items-center gap-3 shrink-0" id="haze-developer-filter-toolbar">
          <div className="relative w-full sm:w-[340px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 w-4 h-4" />
            <Input
              type="text"
              placeholder={
                _langCode === "ZH" ? "搜索资产名称、标识或工程..." 
                : _langCode === "JA" ? "名前、ID、またはプロジェクトで検索..." 
                : _langCode === "ES" ? "Buscar por nombre, ID o proyecto..." 
                : "Search asset name, code or project..."
              }
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 pl-10 pr-4 text-xs bg-background border border-border/70 rounded-lg focus-visible:ring-blue-500 text-foreground placeholder:text-muted-foreground font-semibold text-left"
            />
          </div>

          <Combobox
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val as any);
              setCurrentPage(1);
            }}
            items={[
              { value: "all", label: _langCode === "ZH" ? "全部状态" : _langCode === "JA" ? "全ステータス" : _langCode === "ES" ? "Todos estados" : "All Status" },
              { value: "published", label: _langCode === "ZH" ? "已发布" : _langCode === "JA" ? "公開済み" : _langCode === "ES" ? "Publicado" : "Published" },
              { value: "draft", label: _langCode === "ZH" ? "草稿" : _langCode === "JA" ? "下書き" : _langCode === "ES" ? "Borrador" : "Draft" },
              { value: "offline", label: _langCode === "ZH" ? "已下线" : _langCode === "JA" ? "オフライン" : _langCode === "ES" ? "Fuera de línea" : "Offline" },
              { value: "reviewing", label: _langCode === "ZH" ? "审核中" : _langCode === "JA" ? "審査中" : _langCode === "ES" ? "En revisión" : "Reviewing" }
            ]}
            className="w-[180px]"
          >
            <ComboboxInput className="h-10 w-[180px] bg-background border border-border/70 font-semibold text-xs rounded-lg text-foreground focus:outline-hidden" placeholder={_langCode === "ZH" ? "全部状态" : _langCode === "JA" ? "全ステータス" : _langCode === "ES" ? "Todos estados" : "All Status"} />
            <ComboboxContent className="w-[180px] bg-white">
              <ComboboxList>
                <ComboboxItem value="all">{_langCode === "ZH" ? "全部状态" : _langCode === "JA" ? "全ステータス" : _langCode === "ES" ? "Todos estados" : "All Status"}</ComboboxItem>
                <ComboboxItem value="published">{_langCode === "ZH" ? "已发布" : _langCode === "JA" ? "公开済み" : _langCode === "ES" ? "Publicado" : "Published"}</ComboboxItem>
                <ComboboxItem value="draft">{_langCode === "ZH" ? "草稿" : _langCode === "JA" ? "下書き" : _langCode === "ES" ? "Borrador" : "Draft"}</ComboboxItem>
                <ComboboxItem value="offline">{_langCode === "ZH" ? "已下线" : _langCode === "JA" ? "オフライン" : _langCode === "ES" ? "Fuera de línea" : "Offline"}</ComboboxItem>
                <ComboboxItem value="reviewing">{_langCode === "ZH" ? "审核中" : _langCode === "JA" ? "審査中" : _langCode === "ES" ? "En revisión" : "Reviewing"}</ComboboxItem>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <Button
            variant="ghost"
            disabled={searchQuery === "" && statusFilter === "all" && activeTypeTab === "all"}
            onClick={handleResetFilters}
            className="h-10 px-4 text-xs font-semibold flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground hover:bg-slate-100 rounded-lg cursor-pointer transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <RotateCcw size={13} />
            <span>{_langCode === "ZH" ? "重置" : _langCode === "JA" ? "リセット" : _langCode === "ES" ? "Reiniciar" : "Reset"}</span>
          </Button>
        </div>

        {/* Assets Main Table Content and Pagination Wrapper */}
        <div className="flex-grow flex-1 min-h-0 flex flex-col gap-2" id="haze-developer-table-wrapper">
          <DeveloperAssetTable
            paginatedAssets={paginatedAssets}
            langCode={_langCode}
            onOpenDebug={handleOpenDebug}
            onOpenEditAsset={handleOpenEditAsset}
            onIncrementVersion={handleIncrementVersion}
            onCopyAssetCode={handleCopyAssetCode}
            onPublishAsset={handlePublishAsset}
            onOfflineAsset={handleOfflineAsset}
            onSetDeleteTarget={setDeleteTarget}
          />

          <DataTableFooter
            totalItems={filteredAssets.length}
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            langCode={_langCode}
          />
        </div>
      </div>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent size="sm" className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base text-left">
              {_langCode === "ZH" ? "删除能力" : _langCode === "JA" ? "機能の削除" : _langCode === "ES" ? "Eliminar capacidad" : "Delete Capability"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-left">
              {_langCode === "ZH" ? `确认删除 ${deleteTarget?.name}？该操作会从当前工作区移除此能力。` 
               : _langCode === "JA" ? `本当に ${deleteTarget?.name} を削除しますか？この操作によりワークスペースからアセットがクリーアされます。` 
               : _langCode === "ES" ? `¿Está seguro de que desea eliminar ${deleteTarget?.name}? Esta acción eliminará esta capacidad de su espacio de trabajo.` 
               : `Are you sure you want to delete ${deleteTarget?.name}? This action will remove this capability from the active workspace.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="sm" className="cursor-pointer">
              {_langCode === "ZH" ? "取消" : _langCode === "JA" ? "キャンセル" : _langCode === "ES" ? "Cancelar" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction size="sm" variant="destructive" className="bg-rose-600 hover:bg-rose-700 text-white cursor-pointer border-none" onClick={() => deleteTarget && handleDeleteAsset(deleteTarget)}>
              {_langCode === "ZH" ? "删除" : _langCode === "JA" ? "削除" : _langCode === "ES" ? "Eliminar" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modularized Configuration Modal for Adding/Editing */}
      <DeveloperAssetFormDialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentAsset={currentAsset}
        setCurrentAsset={setCurrentAsset}
        tagsInputText={tagsInputText}
        setTagsInputText={setTagsInputText}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        onSave={handleSaveAssetForm}
        onZipUploaded={handleZipFileUploaded}
        onClearZip={() => {
          setCurrentAsset(prev => ({ ...prev, zipName: undefined, zipSize: undefined, zipFiles: undefined }));
        }}
      />

      {/* Modularized Versioning Dialogue */}
      <NewVersionDialog
        open={showNewVersionModal}
        onClose={() => setShowNewVersionModal(false)}
        newVersionAsset={newVersionAsset}
        newVersionNum={newVersionNum}
        setNewVersionNum={setNewVersionNum}
        newVersionDesc={newVersionDesc}
        setNewVersionDesc={setNewVersionDesc}
        newVersionZipName={newVersionZipName}
        newVersionZipSize={newVersionZipSize}
        newVersionZipFiles={newVersionZipFiles}
        onZipUploaded={handleNewVersionZipUploaded}
        onClearZip={() => {
          setNewVersionZipName("");
          setNewVersionZipSize("");
          setNewVersionZipFiles([]);
        }}
        newVersionErrors={newVersionErrors}
        onSave={handleSaveNewVersion}
      />

      {/* Modularized Sandboxed MCP debugging terminal simulator */}
      <McpConnectionTestDialog
        open={showDebugModal}
        onClose={() => setShowDebugModal(false)}
        debugAsset={debugAsset}
        langCode={_langCode}
        debugStatus={debugStatus}
        currentStepIndex={currentStepIndex}
        terminalLogs={terminalLogs}
        testStarted={testStarted}
        onStartTest={() => {
          if (!testStarted) {
            setTestStarted(true);
          }
          runSimulation(debugAsset || undefined);
        }}
        onClearLogs={() => setTerminalLogs([])}
        onTriggerAlert={triggerFlashAlert}
      />
    </div>
  );
}
