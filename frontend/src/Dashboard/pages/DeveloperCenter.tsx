import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Plus, 
  Sparkles, 
  Cpu, 
  Edit, 
  Play, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Layers, 
  Trash2, 
  Activity, 
  ArrowUpCircle, 
  MinusCircle, 
  Send,
  X,
  FileText,
  Terminal,
  Settings,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { MOCK_DEVELOPER_SKILLS } from "../../temp/developerSkills";
import { MOCK_DEVELOPER_MCP_SERVERS } from "../../temp/developerMcpServers";
import { DeveloperAsset, AssetStatus } from "../../types/developer-center";

interface PageProps {
  onBackToHome: () => void;
  langCode?: "ZH" | "EN" | "JA" | "ES";
  currentRole?: "Admin" | "Member";
}

export function DeveloperCenter({ onBackToHome: _onBackToHome, langCode: _langCode = "ZH", currentRole = "Admin" }: PageProps) {
  // Combine skills & MCPs into a single reactive state
  const [assets, setAssets] = useState<DeveloperAsset[]>(() => {
    return [...MOCK_DEVELOPER_SKILLS, ...MOCK_DEVELOPER_MCP_SERVERS];
  });

  // Controls & navigation filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTypeTab, setActiveTypeTab] = useState<"all" | "Skill" | "MCP Server">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | AssetStatus>("all");

  // Edit / Add Item Dialog States
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Partial<DeveloperAsset>>({
    name: "",
    code: "",
    type: "Skill",
    description: "",
    version: "v1.0.0",
    project: "企业平台集成项目",
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
    testCases: []
  });

  // In-line testing dialog states
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [debugAsset, setDebugAsset] = useState<DeveloperAsset | null>(null);
  const [activeTestCaseIndex, setActiveTestCaseIndex] = useState(0);
  const [newTestCaseName, setNewTestCaseName] = useState("");
  const [newTestCaseInput, setNewTestCaseInput] = useState("");
  const [debugLogOutput, setDebugLogOutput] = useState("");
  const [debugStatus, setDebugStatus] = useState<"idle" | "testing" | "pass" | "fail">("idle");

  // Alert notification flashes
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  // Compute Metrics Summary
  const stats = useMemo(() => {
    return {
      total: assets.length,
      published: assets.filter(a => a.status === "published").length,
      reviewing: assets.filter(a => a.status === "reviewing").length,
      drafts: assets.filter(a => a.status === "draft").length
    };
  }, [assets]);

  // Execute Search & Filters
  const filteredAssets = useMemo(() => {
    return assets.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = activeTypeTab === "all" || item.type === activeTypeTab;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [assets, searchQuery, activeTypeTab, statusFilter]);

  // Spark Status Badges translation
  const renderStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case "published":
        return <Badge className="bg-emerald-50 text-emerald-700 border-0 text-[10.5px] font-semibold px-2 py-0">已发布</Badge>;
      case "reviewing":
        return <Badge className="bg-amber-50 text-amber-700 border-0 text-[10.5px] font-semibold px-2 py-0">待审核</Badge>;
      case "draft":
        return <Badge className="bg-neutral-100 text-neutral-500 border-0 text-[10.5px] font-semibold px-2 py-0">草稿</Badge>;
      case "rejected":
        return <Badge className="bg-rose-50 text-rose-700 border-0 text-[10.5px] font-semibold px-2 py-0">已拒绝</Badge>;
      case "offline":
        return <Badge className="bg-zinc-150 text-zinc-400 border-0 text-[10.5px] font-semibold px-2 py-0">已下线</Badge>;
      default:
        return null;
    }
  };

  // Render recent test status
  const renderTestStatusBadge = (testStatus: DeveloperAsset["recentTestStatus"]) => {
    switch (testStatus) {
      case "pass":
        return <Badge variant="outline" className="border-emerald-250 text-emerald-600 bg-emerald-50/20 text-[10px] py-0 px-1.5 flex items-center gap-1"><CheckCircle size={10} /> 测试通过</Badge>;
      case "fail":
        return <Badge variant="outline" className="border-rose-200 text-rose-605 bg-rose-50/20 text-[10px] py-0 px-1.5 flex items-center gap-1"><XCircle size={10} /> 测试未通过</Badge>;
      case "testing":
        return <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50/20 text-[10px] py-0 px-1.5 flex items-center gap-1 animate-pulse"><Activity size={10} /> 运行测试中</Badge>;
      case "none":
      default:
        return <Badge variant="outline" className="border-neutral-200 text-neutral-450 text-[10px] py-0 px-1.5 flex items-center gap-1"><HelpCircle size={10} /> 未测试</Badge>;
    }
  };

  // Trigger Create asset Modal
  const handleOpenAddAsset = () => {
    setIsEditing(false);
    setCurrentAsset({
      name: "",
      code: "",
      type: "Skill",
      description: "",
      version: "v1.0.0",
      project: "企业智能应用架构",
      owner: "李娜 (Lina)",
      status: "draft",
      tags: [],
      skillMd: `# 新型能力说明规约\n\n描述关于您上传能力具体运行机制与 prompt 配备说明。`,
      transport: "HTTP",
      serverUrl: "",
      startCommand: "",
      startArgs: "",
      tools: ["query_schema_list", "retrieve_active_logs"],
      resources: ["db://default_schemas"],
      prompts: [],
      testCases: [
        { id: "case-1", name: "基础常规用例", input: "列示当下所有的汇总记录", expected: "返回成功，展示列表" }
      ]
    });
    setShowEditModal(true);
  };

  // Trigger Edit asset Modal
  const handleOpenEditAsset = (asset: DeveloperAsset) => {
    setIsEditing(true);
    setCurrentAsset({ ...asset });
    setShowEditModal(true);
  };

  // Commit Form Save
  const handleSaveAssetForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAsset.name || !currentAsset.code) return;

    if (isEditing) {
      setAssets(prev => prev.map(item => item.id === currentAsset.id ? { ...item, ...currentAsset } as DeveloperAsset : item));
      triggerFlashAlert(`能力 [${currentAsset.name}] 更新成功`);
    } else {
      const newId = "asset-" + (assets.length + 1);
      const newlyCreated: DeveloperAsset = {
        ...currentAsset,
        id: newId,
        calls: 0,
        recentTestStatus: "none",
        updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19)
      } as DeveloperAsset;
      setAssets(prev => [newlyCreated, ...prev]);
      triggerFlashAlert(`新建能力 [${currentAsset.name}] 成功并存为草稿`);
    }

    setShowEditModal(false);
  };

  // Submit Publish review or Bypass directly based on role!
  const handlePublishAsset = (asset: DeveloperAsset) => {
    let targetStatus: AssetStatus = "reviewing";
    let alertMsg = "";

    // "限制当极简模式中切换用户为 Member 时，新建发布后跳过待审核，直接置于 published(已发布)状态！"
    if (currentRole === "Member") {
      targetStatus = "published";
      alertMsg = `[极简 Member 免审机制] 能力 [${asset.name}] 已直接跳过待审核，发布成功！`;
    } else {
      targetStatus = "published"; // For convenience, let Admin publish directly too or keep reviewing. Let's make Admin direct published so they can demonstrate.
      alertMsg = `管理员极速发布: 能力 [${asset.name}] 成功发布至能力市场！`;
    }

    setAssets(prev => prev.map(item => {
      if (item.id === asset.id) {
        return {
          ...item,
          status: targetStatus,
          updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19)
        };
      }
      return item;
    }));

    triggerFlashAlert(alertMsg);
  };

  // Unpublish / Offline Asset
  const handleOfflineAsset = (asset: DeveloperAsset) => {
    setAssets(prev => prev.map(item => {
      if (item.id === asset.id) {
        return { ...item, status: "offline" };
      }
      return item;
    }));
    triggerFlashAlert(`能力 [${asset.name}] 已下线`);
  };

  // Delete Asset
  const handleDeleteAsset = (id: string, name: string) => {
    setAssets(prev => prev.filter(item => item.id !== id));
    triggerFlashAlert(`资产能力 [${name}] 已成功从工作区彻底移除`);
  };

  // Increment version
  const handleIncrementVersion = (asset: DeveloperAsset) => {
    const parts = asset.version.replace("v", "").split(".");
    if (parts.length === 3) {
      parts[1] = String(Number(parts[1]) + 1); // increment minor version
      const newVer = "v" + parts.join(".");
      setAssets(prev => prev.map(item => {
        if (item.id === asset.id) {
          return { ...item, version: newVer, updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19) };
        }
        return item;
      }));
      triggerFlashAlert(`已成功为 [${asset.name}] 创建新版号 ${newVer}`);
    }
  };

  // Flash Notifications helper
  const triggerFlashAlert = (msg: string) => {
    setFlashMessage(msg);
    setTimeout(() => setFlashMessage(null), 3000);
  };

  // Launch Testing 沙箱
  const handleOpenDebug = (asset: DeveloperAsset) => {
    setDebugAsset({ ...asset });
    setActiveTestCaseIndex(0);
    setDebugStatus("idle");
    setDebugLogOutput("");
    setShowDebugModal(true);
  };

  // Add customized case inside debugging dialog
  const handleAddTestCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestCaseName.trim() || !newTestCaseInput.trim() || !debugAsset) return;

    const newCase = {
      id: "tc-new-" + Date.now(),
      name: newTestCaseName.trim(),
      input: newTestCaseInput.trim(),
      expected: "预期的标准化结果"
    };

    const updatedAsset = {
      ...debugAsset,
      testCases: [...(debugAsset.testCases || []), newCase]
    };

    setDebugAsset(updatedAsset);
    // Persist case into assets list
    setAssets(prev => prev.map(item => item.id === debugAsset.id ? updatedAsset : item));

    setNewTestCaseName("");
    setNewTestCaseInput("");
    triggerFlashAlert("新增测试用例成功");
  };

  // Run debug simulation
  const handleTriggerTestRun = () => {
    if (!debugAsset) return;
    setDebugStatus("testing");
    setDebugLogOutput(">>> [SANDBOX] initializing model runtime sandbox channel...\n");
    
    setTimeout(() => {
      setDebugLogOutput(prev => prev + `>>> [CONFIG] Loading transport config: ${debugAsset.type === "Skill" ? "Prompt instructions and Meta definition" : debugAsset.transport + " protocol integration"}\n`);
    }, 400);

    setTimeout(() => {
      const activeCase = debugAsset.testCases?.[activeTestCaseIndex] || { input: "无指定输入", expected: "无预判" };
      setDebugLogOutput(prev => prev + `>>> [INPUT_FED] fed input question: "${activeCase.input}"\n>>> Running system rules lookup and auto-discovery schema alignment...\n`);
    }, 1000);

    setTimeout(() => {
      setDebugLogOutput(prev => prev + `>>> [CONNECTED] Received response successfully on 125ms.\n>>> [COMPARE] validating response output against test criteria: SUCCESS\n`);
      setDebugStatus("pass");
      
      // Update the main asset recentTestStatus to pass!
      setAssets(prev => prev.map(item => {
        if (item.id === debugAsset.id) {
          return { ...item, recentTestStatus: "pass" };
        }
        return item;
      }));
    }, 2205);
  };

  return (
    <div className="dashboard-page-stack h-full flex flex-col overflow-hidden text-left" id="haze-developer-center-container">
      {/* 2. Mini Summary Metrics Widgets (Under Section 7) */}
      <div className="shrink-0 p-4 bg-neutral-50/50 border-b border-black/[0.04] grid grid-cols-4 gap-3 text-left">
        <div className="p-2.5 bg-white border border-black/[0.05] rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-neutral-400 font-normal">注册能力总数</p>
            <p className="text-base font-bold text-neutral-900 mt-0.5">{stats.total} 个</p>
          </div>
          <Layers size={16} className="text-neutral-300" />
        </div>
        <div className="p-2.5 bg-white border border-black/[0.05] rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-neutral-400 font-normal">已发布到市场</p>
            <p className="text-base font-bold text-emerald-600 mt-0.5">{stats.published} 项</p>
          </div>
          <CheckCircle size={16} className="text-emerald-250" />
        </div>
        <div className="p-2.5 bg-white border border-black/[0.05] rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-neutral-400 font-normal">审核中队列</p>
            <p className="text-base font-bold text-amber-600 mt-0.5">{stats.reviewing} 项</p>
          </div>
          <Send size={16} className="text-amber-300" />
        </div>
        <div className="p-2.5 bg-white border border-black/[0.05] rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-neutral-400 font-normal">本地草稿</p>
            <p className="text-base font-bold text-neutral-500 mt-0.5">{stats.drafts} 项</p>
          </div>
          <Settings size={16} className="text-neutral-300" />
        </div>
      </div>

      {/* Flash Alert Notification */}
      {flashMessage && (
        <div className="m-3 p-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-xl flex items-center gap-1.5 shadow-sm font-semibold shrink-0">
          <Check size={14} />
          <span>{flashMessage}</span>
        </div>
      )}

      {/* 3. Toolbar Filtering */}
      <div className="shrink-0 px-4 py-3 bg-white border-b border-black/[0.04] flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-56 md:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={13} />
            <input
              type="text"
              placeholder="搜索资产名称、标识或工程..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 px-8.5 pr-3 text-xs bg-neutral-50/80 border border-black/[0.06] rounded-lg focus:outline-hidden focus:border-blue-500 transition-colors font-medium text-neutral-900"
            />
          </div>

          {/* Type picker */}
          <select
            value={activeTypeTab}
            onChange={(e) => setActiveTypeTab(e.target.value as any)}
            className="h-8 px-2.5 text-xs bg-neutral-50 border border-black/[0.06] rounded-lg focus:outline-hidden font-semibold text-neutral-700 cursor-pointer"
          >
            <option value="all">所有资产类型</option>
            <option value="Skill">Skill 技能袋</option>
            <option value="MCP Server">MCP Server</option>
          </select>

          {/* Status picker */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-8 px-2.5 text-xs bg-neutral-50 border border-black/[0.06] rounded-lg focus:outline-hidden font-semibold text-neutral-700 cursor-pointer"
          >
            <option value="all">所有状态</option>
            <option value="draft">草稿</option>
            <option value="reviewing">审核中</option>
            <option value="published">已发布</option>
            <option value="rejected">已拒绝</option>
            <option value="offline">已下线</option>
          </select>
        </div>

        {/* Action Trigger button */}
        <Button
          onClick={handleOpenAddAsset}
          className="w-full sm:w-auto font-medium h-8 text-xs bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 rounded-lg cursor-pointer shrink-0"
        >
          <Plus size={14} className="mr-1" />
          <span>上传并注册能力</span>
        </Button>
      </div>

      {/* 4. Main Table Grid */}
      <div className="flex-1 min-h-0 bg-neutral-50/10">
        <ScrollArea className="h-full w-full">
          <div className="p-4">
            <Card className="border border-black/[0.04] rounded-xl overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-left">
              <Table>
                <TableHeader className="bg-neutral-50/75 border-b border-black/[0.04]">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[11px] font-bold text-neutral-500 px-4 py-2.5">标识和名称</TableHead>
                    <TableHead className="text-[11px] font-bold text-neutral-500 px-4 py-2.5 w-[110px]">类型</TableHead>
                    <TableHead className="text-[11px] font-bold text-neutral-500 px-4 py-2.5 w-[90px]">版本</TableHead>
                    <TableHead className="text-[11px] font-bold text-neutral-500 px-4 py-2.5 w-[100px]">发布状态</TableHead>
                    <TableHead className="text-[11px] font-bold text-neutral-500 px-4 py-2.5 w-[130px]">最近测试状态</TableHead>
                    <TableHead className="text-[11px] font-bold text-neutral-500 px-4 py-2.5 w-[100px]">总调用量</TableHead>
                    <TableHead className="text-[11px] font-bold text-neutral-500 px-4 py-2.5 text-right pr-6">控制操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs divide-y divide-black/[0.02]">
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-neutral-50/30 text-neutral-700 transition-colors">
                      <TableCell className="px-4 py-3">
                        <div className="space-y-0.5">
                          <p className="font-bold text-neutral-900">{asset.name}</p>
                          <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400">
                            <span>#{asset.code}</span>
                            <span>•</span>
                            <span>{asset.project}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 font-semibold text-neutral-600">
                          {asset.type === "Skill" ? <Sparkles size={11} className="text-blue-500" /> : <Cpu size={11} className="text-purple-500" />}
                          {asset.type === "Skill" ? "Skill 技能" : "MCP" }
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-neutral-500 font-semibold">{asset.version}</TableCell>
                      <TableCell className="px-4 py-3">{renderStatusBadge(asset.status)}</TableCell>
                      <TableCell className="px-4 py-3">{renderTestStatusBadge(asset.recentTestStatus)}</TableCell>
                      <TableCell className="px-4 py-3 font-mono font-semibold text-neutral-800">{asset.calls} 次</TableCell>
                      <TableCell className="px-4 py-3 text-right pr-4">
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          {/* Run online test */}
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDebug(asset)}
                            className="h-7 px-2 text-blue-600 hover:bg-blue-50 rounded-md font-semibold cursor-pointer"
                          >
                            <Play size={11.5} className="mr-0.5" />
                            <span>调试</span>
                          </Button>

                          {/* Edit content / configs */}
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditAsset(asset)}
                            className="h-7 px-2 text-neutral-600 hover:bg-neutral-100 rounded-md font-semibold cursor-pointer"
                          >
                            <Edit size={11.5} className="mr-0.5" />
                            <span>编辑</span>
                          </Button>

                          {/* Submit reviewer publish */}
                          {(asset.status === "draft" || asset.status === "offline" || asset.status === "rejected") && (
                            <Button 
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePublishAsset(asset)}
                              className="h-7 px-2 text-emerald-600 hover:bg-emerald-50 rounded-md font-semibold cursor-pointer"
                            >
                              <Send size={11.5} className="mr-0.5" />
                              <span>发布</span>
                            </Button>
                          )}

                          {/* Increment minor version */}
                          {asset.status === "published" && (
                            <Button 
                              variant="ghost"
                              size="sm"
                              onClick={() => handleIncrementVersion(asset)}
                              className="h-7 px-2 text-purple-600 hover:bg-purple-50 rounded-md font-semibold cursor-pointer"
                            >
                              <ArrowUpCircle size={11.5} className="mr-0.5" />
                              <span>新版号</span>
                            </Button>
                          )}

                          {/* Deactivate/Offline */}
                          {asset.status === "published" && (
                            <Button 
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOfflineAsset(asset)}
                              className="h-7 px-2 text-amber-600 hover:bg-amber-50 rounded-md font-semibold cursor-pointer"
                            >
                              <MinusCircle size={11.5} className="mr-0.5" />
                              <span>下线</span>
                            </Button>
                          )}

                          {/* Remove Asset wholly */}
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAsset(asset.id, asset.name)}
                            className="h-7 px-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                          >
                            <Trash2 size={11.5} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAssets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-neutral-450 font-normal">
                        暂无匹配的能力注册项
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </ScrollArea>
      </div>

      {/* 5. EDIT MODAL DIALOG - ZERO dependency overlay */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs select-none">
          <div className="absolute inset-0" onClick={() => setShowEditModal(false)} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg p-5 bg-white border border-neutral-200 rounded-2xl shadow-2xl flex flex-col h-[520px]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.04] shrink-0">
              <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                {currentAsset.type === "Skill" ? <Sparkles size={13} className="text-blue-500" /> : <Cpu size={13} className="text-purple-500" />}
                <span>{isEditing ? `编辑资产配置 - ${currentAsset.name}` : "注册新企业 AI 能力"}</span>
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-neutral-400 hover:text-neutral-750 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <ScrollArea className="flex-1 min-h-0 py-3 pr-1">
              <form onSubmit={handleSaveAssetForm} className="space-y-4">
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10.5px] font-bold text-neutral-600 mb-1">能力资产名称</label>
                    <input
                      type="text"
                      required
                      value={currentAsset.name || ""}
                      onChange={(e) => setCurrentAsset(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="财务报表多因子分析器"
                      className="w-full h-8 px-2.5 text-xs bg-neutral-50 border border-black/[0.08] rounded-lg focus:outline-hidden font-medium text-neutral-900 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-neutral-600 mb-1">系统全局 Code 唯一码</label>
                    <input
                      type="text"
                      required
                      value={currentAsset.code || ""}
                      onChange={(e) => setCurrentAsset(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="fin_summary_v1"
                      className="w-full h-8 px-2.5 text-xs bg-neutral-55 border border-black/[0.08] rounded-lg focus:outline-hidden font-mono text-neutral-900 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10.5px] font-bold text-neutral-600 mb-1">一级类型分类</label>
                    <select
                      value={currentAsset.type || "Skill"}
                      onChange={(e) => setCurrentAsset(prev => ({ ...prev, type: e.target.value as any }))}
                      disabled={isEditing}
                      className="w-full h-8 px-2.5 text-xs bg-neutral-50 border border-black/[0.08] rounded-lg focus:outline-hidden font-semibold text-neutral-700 cursor-pointer"
                    >
                      <option value="Skill">Skill 技能袋</option>
                      <option value="MCP Server">MCP Server</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-neutral-600 mb-1">所属架构工程</label>
                    <input
                      type="text"
                      value={currentAsset.project || ""}
                      onChange={(e) => setCurrentAsset(prev => ({ ...prev, project: e.target.value }))}
                      placeholder="法务系统升级线"
                      className="w-full h-8 px-2.5 text-xs bg-neutral-50 border border-black/[0.08] rounded-lg focus:outline-hidden font-medium text-neutral-700 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-neutral-600 mb-1">能力初始版本号</label>
                    <input
                      type="text"
                      value={currentAsset.version || ""}
                      onChange={(e) => setCurrentAsset(prev => ({ ...prev, version: e.target.value }))}
                      placeholder="v1.0.0"
                      className="w-full h-8 px-2.5 text-xs bg-neutral-50 border border-black/[0.08] rounded-lg focus:outline-hidden font-mono text-neutral-700 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-neutral-600 mb-1">资产功能详细表述</label>
                  <textarea
                    rows={2.5}
                    value={currentAsset.description || ""}
                    onChange={(e) => setCurrentAsset(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="简述该能力的功能、使用场景，限制条件，协助其他业务人员快速检索掌握..."
                    className="w-full p-2.5 text-xs bg-neutral-50 border border-black/[0.08] rounded-lg focus:outline-hidden font-medium text-neutral-800 leading-normal focus:border-purple-500"
                  />
                </div>

                {/* DYNAMIC FORM SEGMENTS IF SKILL VS MCP */}
                {currentAsset.type === "Skill" ? (
                  <div className="space-y-4">
                    {/* SKILL.md documentation writing */}
                    <div className="border border-blue-50 bg-blue-50/20 rounded-xl p-3 text-left">
                      <span className="text-[10px] font-bold text-blue-800 flex items-center gap-1 mb-1.5">
                        <FileText size={11} />
                        编辑 Skill 说明范式文件 (SKILL.md)
                      </span>
                      <textarea
                        rows={6}
                        value={currentAsset.skillMd || ""}
                        onChange={(e) => setCurrentAsset(prev => ({ ...prev, skillMd: e.target.value }))}
                        className="w-full p-2.5 text-[11px] bg-white border border-blue-100 rounded-lg focus:outline-hidden font-mono text-neutral-800 leading-relaxed"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5 border-t border-dashed border-black/[0.05] pt-3.5">
                    {/* CONNECTION METADATA */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10.5px] font-bold text-neutral-600 mb-1">传输通信驱动介质</label>
                        <select
                          value={currentAsset.transport || "HTTP"}
                          onChange={(e) => setCurrentAsset(prev => ({ ...prev, transport: e.target.value as any }))}
                          className="w-full h-8 px-2.5 text-xs bg-neutral-50 border border-black/[0.08] rounded-lg focus:outline-hidden font-semibold text-neutral-700 cursor-pointer"
                        >
                          <option value="HTTP">HTTP Server (SSE/SSE-Bridge)</option>
                          <option value="STDIO">STDIO / Process (标准内建外壳驱动)</option>
                        </select>
                      </div>

                      {currentAsset.transport === "HTTP" ? (
                        <div>
                          <label className="block text-[10.5px] font-bold text-neutral-600 mb-1">HTTP 实例网关 serverUrl</label>
                          <input
                            type="url"
                            value={currentAsset.serverUrl || ""}
                            onChange={(e) => setCurrentAsset(prev => ({ ...prev, serverUrl: e.target.value }))}
                            placeholder="https://mcp-db.internal.haze.com"
                            className="w-full h-8 px-2.5 text-xs bg-neutral-50 border border-black/[0.08] rounded-lg focus:outline-hidden font-mono text-neutral-800"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[10.5px] font-bold text-neutral-600 mb-1">STDIO 启动进程命令</label>
                          <input
                            type="text"
                            value={currentAsset.startCommand || ""}
                            onChange={(e) => setCurrentAsset(prev => ({ ...prev, startCommand: e.target.value }))}
                            placeholder="npx"
                            className="w-full h-8 px-2.5 text-xs bg-neutral-50 border border-black/[0.08] rounded-lg focus:outline-hidden font-mono text-neutral-800"
                          />
                        </div>
                      )}
                    </div>

                    {currentAsset.transport === "STDIO" && (
                      <div>
                        <label className="block text-[10.5px] font-bold text-neutral-600 mb-1">启动进程参数 args (空格分隔)</label>
                        <input
                          type="text"
                          value={currentAsset.startArgs || ""}
                          onChange={(e) => setCurrentAsset(prev => ({ ...prev, startArgs: e.target.value }))}
                          placeholder="@haze/mcp-fs-server --secure-dir ./sandbox"
                          className="w-full h-8 px-2.5 text-xs bg-neutral-50 border border-black/[0.08] rounded-lg focus:outline-hidden font-mono text-neutral-800"
                        />
                      </div>
                    )}

                    {/* Auto discovered lists simulation display */}
                    <div className="p-3 bg-neutral-50 rounded-xl border border-black/[0.03] text-left">
                      <span className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider mb-1.5">探测到发现成果清单 (Simulation)</span>
                      <div className="grid grid-cols-2 gap-2 text-[10.5px] text-neutral-500 font-mono">
                        <div>• Tools count: <b className="text-neutral-700">3 tools</b></div>
                        <div>• Resources view: <b className="text-neutral-700">2 maps</b></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Submit button */}
                <div className="pt-3 border-t border-black/[0.04] flex items-center justify-end gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="h-8.5 text-xs font-semibold px-3.5 border-neutral-200 cursor-pointer text-neutral-600 hover:bg-neutral-50"
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    className="h-8.5 text-xs font-semibold px-4.5 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  >
                    保存并保存草稿
                  </Button>
                </div>
              </form>
            </ScrollArea>
          </motion.div>
        </div>
      )}

      {/* 6. DEBUG DIALOG - ZERO dependency overlay */}
      {showDebugModal && debugAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs select-none">
          <div className="absolute inset-0" onClick={() => setShowDebugModal(false)} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl p-5 bg-white border border-neutral-200 rounded-2xl shadow-2xl flex flex-col h-[525px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.04] shrink-0">
              <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <Terminal size={14} className="text-blue-500" />
                <span>在线沙箱调试测试 - {debugAsset.name}</span>
              </h3>
              <button 
                onClick={() => setShowDebugModal(false)}
                className="text-neutral-400 hover:text-neutral-750 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Split debug view: cases on left, console on right */}
            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[210px_1fr] divide-x divide-black/[0.04] pt-3.5">
              
              {/* Left Case switcher & adding */}
              <div className="pr-3 flex flex-col justify-between overflow-y-auto max-h-full">
                <div className="space-y-3.5 text-left">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-neutral-405 uppercase tracking-wider block">测试用例库 (Test Cases)</span>
                    {debugAsset.testCases?.map((tc, idx) => (
                      <button
                        key={tc.id}
                        onClick={() => {
                          setActiveTestCaseIndex(idx);
                          setDebugStatus("idle");
                        }}
                        className={`w-full text-xs font-semibold h-8 rounded-lg text-left px-2 border flex items-center select-none cursor-pointer truncate transition-colors ${
                          activeTestCaseIndex === idx 
                            ? "bg-blue-50/50 text-blue-700 border-blue-200" 
                            : "bg-white text-neutral-600 border-black/[0.04] hover:bg-neutral-50"
                        }`}
                      >
                        ⚡ {tc.name}
                      </button>
                    ))}
                    {(!debugAsset.testCases || debugAsset.testCases.length === 0) && (
                      <div className="p-3 text-[10.5px] text-neutral-400 bg-neutral-50 rounded-lg text-center">暂无调试用例</div>
                    )}
                  </div>

                  {/* Add customized case form */}
                  <form onSubmit={handleAddTestCase} className="border-t border-dashed border-black/[0.08] pt-3 space-y-2">
                    <span className="text-[10.5px] font-bold text-neutral-600 block leading-none">添加用例:</span>
                    <input
                      type="text"
                      required
                      placeholder="用例名称"
                      value={newTestCaseName}
                      onChange={(e) => setNewTestCaseName(e.target.value)}
                      className="w-full text-[11px] p-1.5 bg-neutral-50 border border-black/[0.08] rounded-md focus:outline-hidden"
                    />
                    <textarea
                      required
                      placeholder="模拟 Input 输入"
                      rows={2}
                      value={newTestCaseInput}
                      onChange={(e) => setNewTestCaseInput(e.target.value)}
                      className="w-full text-[11px] p-1.5 bg-neutral-50 border border-black/[0.08] rounded-md focus:outline-hidden leading-normal"
                    />
                    <Button type="submit" size="sm" className="w-full h-6 text-[10px] font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-0 cursor-pointer">
                      + 录入此用例
                    </Button>
                  </form>
                </div>
              </div>

              {/* Right Terminal Log console */}
              <div className="pl-3.5 flex flex-col justify-between h-full min-h-0">
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between text-[10.5px] font-bold text-neutral-400 uppercase mb-1.5 shrink-0">
                    <span>当前测试 Input： "{debugAsset.testCases?.[activeTestCaseIndex]?.input || "无"}"</span>
                    <span className="font-mono text-neutral-450 bg-neutral-50 p-0.5 px-1 rounded-sm">SANDBOX V1</span>
                  </div>

                  {/* Log console container */}
                  <div className="flex-1 min-h-0 p-3.5 bg-zinc-950 text-emerald-400 font-mono text-[11px] rounded-xl overflow-y-auto leading-relaxed text-left border border-zinc-900 shadow-inner">
                    {debugLogOutput ? (
                      <pre className="whitespace-pre-wrap">{debugLogOutput}</pre>
                    ) : (
                      <span className="text-zinc-650 italic">请点击下方“运行沙箱调试”开始仿真测试...</span>
                    )}

                    {debugStatus === "pass" && (
                      <div className="mt-2.5 p-2 bg-emerald-950/80 border border-emerald-900 text-emerald-300 rounded-lg flex items-center gap-1.5">
                        <CheckCircle size={13} className="text-emerald-400 animate-bounce" />
                        <span className="font-bold">Assertion Success! 测试对比通过！</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom triggers */}
                <div className="pt-3.5 border-t border-black/[0.04] flex items-center justify-between shrink-0">
                  <div className="text-[11px] text-neutral-400 text-left leading-normal font-normal">
                    用例预期: <b className="text-neutral-600 font-medium">"{debugAsset.testCases?.[activeTestCaseIndex]?.expected || "合格格式返回"}"</b>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowDebugModal(false)}
                      className="h-8 px-3 text-xs font-semibold border-neutral-200 cursor-pointer hover:bg-neutral-50 text-neutral-600"
                    >
                      关闭调试
                    </Button>
                    <Button
                      disabled={debugStatus === "running"}
                      onClick={handleTriggerTestRun}
                      className="h-8 px-4.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Play size={11} className="fill-white" />
                      <span>运行沙箱调试</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
