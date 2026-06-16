import React, { useMemo, useState } from "react";
import {
  ArrowUpCircle,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Cpu,
  Edit,
  History,
  MinusCircle,
  MoreHorizontal,
  Play,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Terminal,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { AssetStatus, DeveloperAsset, TestStatus } from "../../types/developer-center";

interface PageProps {
  onBackToHome: () => void;
  langCode?: "ZH" | "EN" | "JA" | "ES";
  currentRole?: "Admin" | "Member";
}

type AssetTypeFilter = "all" | "Skill" | "MCP Server";

const defaultAsset: Partial<DeveloperAsset> = {
  name: "",
  code: "",
  type: "Skill",
  description: "",
  version: "v1.0.0",
  project: "企业智能应用架构",
  owner: "李娜 (Lina)",
  status: "draft",
  tags: [],
  skillMd: "",
  transport: "HTTP",
  serverUrl: "",
  startCommand: "",
  startArgs: "",
  tools: [],
  resources: [],
  prompts: [],
  testCases: [],
};

const statusBadgeConfig: Record<AssetStatus, { label: string; className: string }> = {
  published: {
    label: "已发布",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  draft: {
    label: "草稿",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  reviewing: {
    label: "审核中",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  rejected: {
    label: "已拒绝",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  offline: {
    label: "已下线",
    className: "border-border bg-muted text-muted-foreground",
  },
};

const testBadgeConfig: Record<TestStatus, { label: string; className: string }> = {
  pass: {
    label: "测试通过",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  fail: {
    label: "测试失败",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  testing: {
    label: "测试中",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  none: {
    label: "未测试",
    className: "border-border bg-muted text-muted-foreground",
  },
};

function renderStatusBadge(status: AssetStatus) {
  const config = statusBadgeConfig[status];
  return (
    <Badge variant="outline" className={`gap-1 rounded-md px-2 py-1 text-xs font-semibold ${config.className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}

function renderTestStatusBadge(status: TestStatus) {
  const config = testBadgeConfig[status];
  return (
    <Badge variant="outline" className={`gap-1 rounded-md px-2 py-1 text-xs font-semibold ${config.className}`}>
      {status === "pass" ? <CheckCircle size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {config.label}
    </Badge>
  );
}

export function DeveloperCenter({
  onBackToHome: _onBackToHome,
  langCode: _langCode = "ZH",
  currentRole = "Admin",
}: PageProps) {
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
  const [currentAsset, setCurrentAsset] = useState<Partial<DeveloperAsset>>(defaultAsset);

  const [showDebugModal, setShowDebugModal] = useState(false);
  const [debugAsset, setDebugAsset] = useState<DeveloperAsset | null>(null);
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);
  const [newTestCaseName, setNewTestCaseName] = useState("");
  const [newTestCaseInput, setNewTestCaseInput] = useState("");
  const [debugLogOutput, setDebugLogOutput] = useState("");
  const [debugStatus, setDebugStatus] = useState<"idle" | "testing" | "pass" | "fail">("idle");

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

  const handleOpenAddAsset = () => {
    setIsEditing(false);
    setCurrentAsset({
      ...defaultAsset,
      skillMd: "# 新能力说明\n\n描述该能力的运行机制、适用范围和 prompt 配置。",
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
    setCurrentAsset({ ...asset });
    setShowEditModal(true);
  };

  const handleSaveAssetForm = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentAsset.name || !currentAsset.code) return;

    if (isEditing) {
      setAssets((prev) =>
        prev.map((item) =>
          item.id === currentAsset.id ? ({ ...item, ...currentAsset } as DeveloperAsset) : item,
        ),
      );
      triggerFlashAlert(`能力 [${currentAsset.name}] 更新成功`);
    } else {
      const newlyCreated: DeveloperAsset = {
        ...defaultAsset,
        ...currentAsset,
        id: `asset-${assets.length + 1}`,
        calls: 0,
        recentTestStatus: "none",
        visibility: "internal",
        updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      } as DeveloperAsset;
      setAssets((prev) => [newlyCreated, ...prev]);
      triggerFlashAlert(`新建能力 [${currentAsset.name}] 成功并保存为草稿`);
    }

    setShowEditModal(false);
  };

  const handlePublishAsset = (asset: DeveloperAsset) => {
    const targetStatus: AssetStatus = currentRole === "Member" ? "published" : "published";
    setAssets((prev) =>
      prev.map((item) =>
        item.id === asset.id
          ? { ...item, status: targetStatus, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) }
          : item,
      ),
    );
    triggerFlashAlert(`能力 [${asset.name}] 已发布到能力市场`);
  };

  const handleOfflineAsset = (asset: DeveloperAsset) => {
    setAssets((prev) => prev.map((item) => (item.id === asset.id ? { ...item, status: "offline" } : item)));
    triggerFlashAlert(`能力 [${asset.name}] 已下线`);
  };

  const handleIncrementVersion = (asset: DeveloperAsset) => {
    const parts = asset.version.replace("v", "").split(".");
    if (parts.length !== 3) return;
    parts[1] = String(Number(parts[1]) + 1);
    const version = `v${parts.join(".")}`;
    setAssets((prev) =>
      prev.map((item) =>
        item.id === asset.id
          ? { ...item, version, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) }
          : item,
      ),
    );
    triggerFlashAlert(`已为 [${asset.name}] 创建新版本 ${version}`);
  };

  const handleDeleteAsset = (asset: DeveloperAsset) => {
    setAssets((prev) => prev.filter((item) => item.id !== asset.id));
    setDeleteTarget(null);
    triggerFlashAlert(`资产能力 [${asset.name}] 已从工作区移除`);
  };

  const handleCopyAssetCode = (asset: DeveloperAsset) => {
    navigator.clipboard.writeText(asset.code);
    triggerFlashAlert(`已复制标识：${asset.code}`);
  };

  const handleViewCallHistory = (asset: DeveloperAsset) => {
    triggerFlashAlert(`调用记录入口：${asset.name}`);
  };

  const handleOpenDebug = (asset: DeveloperAsset) => {
    setDebugAsset({ ...asset });
    setActiveTestCaseIndex(0);
    setDebugStatus("idle");
    setDebugLogOutput("");
    setShowDebugModal(true);
  };

  const handleAddTestCase = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTestCaseName.trim() || !newTestCaseInput.trim() || !debugAsset) return;

    const newCase = {
      id: `tc-new-${Date.now()}`,
      name: newTestCaseName.trim(),
      input: newTestCaseInput.trim(),
      expected: "预期的标准化结果",
    };

    const updatedAsset = {
      ...debugAsset,
      testCases: [...(debugAsset.testCases || []), newCase],
    };

    setDebugAsset(updatedAsset);
    setAssets((prev) => prev.map((item) => (item.id === debugAsset.id ? updatedAsset : item)));
    setNewTestCaseName("");
    setNewTestCaseInput("");
    triggerFlashAlert("新增测试用例成功");
  };

  const handleTriggerTestRun = () => {
    if (!debugAsset) return;
    setDebugStatus("testing");
    setDebugLogOutput(">>> [SANDBOX] initializing model runtime sandbox channel...\n");

    setTimeout(() => {
      setDebugLogOutput((prev) =>
        prev + `>>> [CONFIG] Loading transport config: ${debugAsset.type === "Skill" ? "Prompt instructions and meta definition" : `${debugAsset.transport} protocol integration`}\n`,
      );
    }, 400);

    setTimeout(() => {
      const activeCase = debugAsset.testCases?.[activeTestCaseIndex] || {
        input: "无指定输入",
        expected: "无预期",
      };
      setDebugLogOutput((prev) =>
        prev + `>>> [INPUT_FED] fed input question: "${activeCase.input}"\n>>> Running system rules lookup and schema alignment...\n`,
      );
    }, 1000);

    setTimeout(() => {
      setDebugLogOutput((prev) =>
        prev + ">>> [CONNECTED] Received response successfully on 125ms.\n>>> [COMPARE] validating response output against test criteria: SUCCESS\n",
      );
      setDebugStatus("pass");
      setAssets((prev) =>
        prev.map((item) => (item.id === debugAsset.id ? { ...item, recentTestStatus: "pass" } : item)),
      );
    }, 2205);
  };

  return (
    <div className="dashboard-page-stack h-full overflow-hidden text-left" id="haze-developer-center-container">
      {flashMessage && (
        <div className="mx-4 mt-3 flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card p-2 text-xs font-semibold text-foreground shadow-sm">
          <Check size={14} />
          <span>{flashMessage}</span>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-4 rounded-xl border border-border bg-background p-4">
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">开发者中心</h1>
            <p className="mt-1 text-sm text-muted-foreground">管理和发布企业内部的 Skill 与 MCP 能力</p>
          </div>
          <Button onClick={handleOpenAddAsset} className="h-9 w-full shrink-0 px-4 sm:w-auto">
            <Plus size={15} />
            <span>注册能力</span>
          </Button>
        </div>

        <Card className="shrink-0 rounded-lg border-border bg-card shadow-sm">
          <CardContent className="flex flex-col gap-3 p-4 xl:flex-row xl:items-center">
            <Tabs
              value={activeTypeTab}
              onValueChange={(value) => {
                setActiveTypeTab(value as AssetTypeFilter);
                resetToFirstPage();
              }}
              className="w-full xl:w-[360px]"
            >
              <TabsList className="h-9 rounded-lg bg-muted/40">
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="Skill" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Skill
                </TabsTrigger>
                <TabsTrigger value="MCP Server" className="gap-1">
                  <Cpu className="h-3 w-3" />
                  MCP
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full xl:max-w-[360px]">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="搜索资产名称、标识或工程"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  resetToFirstPage();
                }}
                className="h-9 bg-background pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as "all" | AssetStatus);
                resetToFirstPage();
              }}
            >
              <SelectTrigger className="h-9 w-full bg-background text-xs xl:w-[170px]">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="reviewing">审核中</SelectItem>
                <SelectItem value="published">已发布</SelectItem>
                <SelectItem value="offline">已下线</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-9 w-full xl:ml-auto xl:w-auto" onClick={handleResetFilters}>
              <RotateCcw size={14} />
              重置
            </Button>
          </CardContent>
        </Card>

        <Card className="min-h-0 flex-1 overflow-hidden rounded-lg border-border bg-card shadow-sm">
          <ScrollArea className="h-full w-full">
            <div className="min-w-[980px]">
              <Table>
                <TableHeader className="border-b border-border bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground">资产</TableHead>
                    <TableHead className="w-[130px] px-4 py-3 text-xs font-semibold text-muted-foreground">类型</TableHead>
                    <TableHead className="w-[90px] px-4 py-3 text-xs font-semibold text-muted-foreground">版本</TableHead>
                    <TableHead className="w-[105px] px-4 py-3 text-xs font-semibold text-muted-foreground">状态</TableHead>
                    <TableHead className="w-[130px] px-4 py-3 text-xs font-semibold text-muted-foreground">测试</TableHead>
                    <TableHead className="w-[100px] px-4 py-3 text-xs font-semibold text-muted-foreground">调用</TableHead>
                    <TableHead className="w-[230px] px-4 py-3 pr-6 text-right text-xs font-semibold text-muted-foreground">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border text-xs">
                  {paginatedAssets.map((asset) => (
                    <TableRow key={asset.id} className="text-foreground transition-colors hover:bg-muted/30">
                      <TableCell className="px-4 py-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-foreground">{asset.name}</p>
                          <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-mono">#{asset.code}</span>
                            <span>/</span>
                            <span className="truncate">{asset.project}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge variant="secondary" className="gap-1 rounded-md px-2 py-1 text-xs font-semibold">
                          {asset.type === "Skill" ? <Sparkles size={12} /> : <Cpu size={12} />}
                          {asset.type === "Skill" ? "Skill 技能" : "MCP"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono font-semibold text-muted-foreground">{asset.version}</TableCell>
                      <TableCell className="px-4 py-3">{renderStatusBadge(asset.status)}</TableCell>
                      <TableCell className="px-4 py-3">{renderTestStatusBadge(asset.recentTestStatus)}</TableCell>
                      <TableCell className="px-4 py-3 font-mono font-semibold text-foreground">{asset.calls} 次</TableCell>
                      <TableCell className="px-4 py-3 text-right pr-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenDebug(asset)} className="h-8 px-2.5">
                            <Play size={13} />
                            <span>调试</span>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleOpenEditAsset(asset)} className="h-8 px-2.5">
                            <Edit size={13} />
                            <span>编辑</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <MoreHorizontal size={14} />
                                <span className="sr-only">更多操作</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {asset.status === "published" && (
                                <DropdownMenuItem onClick={() => handleIncrementVersion(asset)}>
                                  <ArrowUpCircle size={13} className="mr-2" />
                                  新建版本
                                </DropdownMenuItem>
                              )}
                              {(asset.status === "draft" || asset.status === "offline" || asset.status === "rejected") && (
                                <DropdownMenuItem onClick={() => handlePublishAsset(asset)}>
                                  <Send size={13} className="mr-2" />
                                  发布
                                </DropdownMenuItem>
                              )}
                              {asset.status === "published" && (
                                <DropdownMenuItem onClick={() => handleOfflineAsset(asset)}>
                                  <MinusCircle size={13} className="mr-2" />
                                  下线
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleCopyAssetCode(asset)}>
                                <Copy size={13} className="mr-2" />
                                复制标识
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewCallHistory(asset)}>
                                <History size={13} className="mr-2" />
                                查看调用记录
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onSelect={(event) => { event.preventDefault(); setDeleteTarget(asset); }}>
                                <Trash2 size={13} className="mr-2" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedAssets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-40 text-center font-normal text-muted-foreground">
                        暂无匹配的能力注册项
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>

          <div className="flex shrink-0 flex-col gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>共 {filteredAssets.length} 条</span>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[110px] bg-background text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 条/页</SelectItem>
                  <SelectItem value="20">20 条/页</SelectItem>
                  <SelectItem value="50">50 条/页</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={safeCurrentPage <= 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                <ChevronLeft size={14} />
              </Button>
              <span className="flex h-8 min-w-8 items-center justify-center rounded-md border border-border bg-primary px-2 font-semibold text-primary-foreground">
                {safeCurrentPage}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={safeCurrentPage >= totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">删除能力</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              确认删除 {deleteTarget?.name}？该操作会从当前工作区移除此能力。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="sm">取消</AlertDialogCancel>
            <AlertDialogAction size="sm" variant="destructive" onClick={() => deleteTarget && handleDeleteAsset(deleteTarget)}>
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs select-none">
          <div className="absolute inset-0" onClick={() => setShowEditModal(false)} />
          <div className="relative flex h-[560px] w-full max-w-2xl flex-col rounded-lg border border-border bg-card p-5 shadow-lg">
            <div className="flex shrink-0 items-center justify-between border-b border-border pb-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                {currentAsset.type === "Skill" ? <Sparkles size={14} /> : <Cpu size={14} />}
                <span>{isEditing ? `编辑资产配置 - ${currentAsset.name}` : "注册新企业 AI 能力"}</span>
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            <ScrollArea className="min-h-0 flex-1 py-4 pr-1">
              <form onSubmit={handleSaveAssetForm} className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FormField label="能力资产名称">
                    <Input
                      required
                      value={currentAsset.name || ""}
                      onChange={(event) => setCurrentAsset((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="财务报表摘要智能生成器"
                    />
                  </FormField>
                  <FormField label="系统唯一 Code">
                    <Input
                      required
                      value={currentAsset.code || ""}
                      onChange={(event) => setCurrentAsset((prev) => ({ ...prev, code: event.target.value }))}
                      placeholder="fin_summary_v1"
                      className="font-mono"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <FormField label="类型">
                    <Select
                      value={currentAsset.type || "Skill"}
                      disabled={isEditing}
                      onValueChange={(value) => setCurrentAsset((prev) => ({ ...prev, type: value as DeveloperAsset["type"] }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Skill">Skill</SelectItem>
                        <SelectItem value="MCP Server">MCP Server</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField label="所属工程">
                    <Input
                      value={currentAsset.project || ""}
                      onChange={(event) => setCurrentAsset((prev) => ({ ...prev, project: event.target.value }))}
                    />
                  </FormField>
                  <FormField label="版本">
                    <Input
                      value={currentAsset.version || ""}
                      onChange={(event) => setCurrentAsset((prev) => ({ ...prev, version: event.target.value }))}
                      className="font-mono"
                    />
                  </FormField>
                </div>

                <FormField label="能力描述">
                  <textarea
                    rows={3}
                    value={currentAsset.description || ""}
                    onChange={(event) => setCurrentAsset((prev) => ({ ...prev, description: event.target.value }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </FormField>

                {currentAsset.type === "Skill" ? (
                  <FormField label="SKILL.md">
                    <textarea
                      rows={8}
                      value={currentAsset.skillMd || ""}
                      onChange={(event) => setCurrentAsset((prev) => ({ ...prev, skillMd: event.target.value }))}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-xs text-foreground shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </FormField>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField label="Transport">
                      <Select
                        value={currentAsset.transport || "HTTP"}
                        onValueChange={(value) => setCurrentAsset((prev) => ({ ...prev, transport: value as DeveloperAsset["transport"] }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HTTP">HTTP</SelectItem>
                          <SelectItem value="STDIO">STDIO</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField label="Server URL / Start Command">
                      <Input
                        value={currentAsset.serverUrl || currentAsset.startCommand || ""}
                        onChange={(event) =>
                          setCurrentAsset((prev) => ({
                            ...prev,
                            serverUrl: prev.transport === "HTTP" ? event.target.value : prev.serverUrl,
                            startCommand: prev.transport === "STDIO" ? event.target.value : prev.startCommand,
                          }))
                        }
                      />
                    </FormField>
                  </div>
                )}
              </form>
            </ScrollArea>

            <div className="flex shrink-0 justify-end gap-2 border-t border-border pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                取消
              </Button>
              <Button type="button" onClick={(event) => handleSaveAssetForm(event as unknown as React.FormEvent)}>
                保存草稿
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDebugModal && debugAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs select-none">
          <div className="absolute inset-0" onClick={() => setShowDebugModal(false)} />
          <div className="relative flex h-[620px] w-full max-w-4xl flex-col rounded-lg border border-border bg-card p-5 shadow-lg">
            <div className="flex shrink-0 items-center justify-between border-b border-border pb-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Terminal size={14} />
                <span>在线沙箱调试 - {debugAsset.name}</span>
              </h3>
              <button onClick={() => setShowDebugModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 py-4 lg:grid-cols-[260px_1fr]">
              <div className="min-h-0 rounded-lg border border-border bg-background p-3">
                <p className="mb-2 text-xs font-bold text-foreground">测试用例</p>
                <div className="space-y-2">
                  {(debugAsset.testCases || []).map((testCase, index) => (
                    <button
                      key={testCase.id}
                      type="button"
                      onClick={() => setActiveTestCaseIndex(index)}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-xs ${
                        activeTestCaseIndex === index ? "border-border bg-muted text-foreground" : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      <span className="block font-semibold">{testCase.name}</span>
                      <span className="mt-1 block truncate">{testCase.input}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleAddTestCase} className="mt-4 space-y-2">
                  <Input
                    value={newTestCaseName}
                    onChange={(event) => setNewTestCaseName(event.target.value)}
                    placeholder="用例名称"
                  />
                  <textarea
                    rows={3}
                    value={newTestCaseInput}
                    onChange={(event) => setNewTestCaseInput(event.target.value)}
                    placeholder="输入内容"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  <Button type="submit" variant="outline" className="w-full">
                    新增用例
                  </Button>
                </form>
              </div>

              <div className="flex min-h-0 flex-col rounded-lg border border-border bg-background p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold text-foreground">运行日志</p>
                  <Button onClick={handleTriggerTestRun} disabled={debugStatus === "testing"}>
                    <Play size={13} />
                    运行测试
                  </Button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto rounded-lg bg-foreground p-3 font-mono text-[11px] leading-relaxed text-background">
                  {debugLogOutput ? <pre className="whitespace-pre-wrap">{debugLogOutput}</pre> : "等待运行..."}
                </div>
                {debugStatus === "pass" && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs font-semibold text-emerald-700">
                    <CheckCircle size={13} />
                    测试对比通过
                  </div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 justify-end border-t border-border pt-4">
              <Button variant="outline" onClick={() => setShowDebugModal(false)}>
                关闭调试
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}
