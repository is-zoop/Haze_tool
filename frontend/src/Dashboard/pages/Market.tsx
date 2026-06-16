import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Sparkles, 
  Cpu, 
  Star, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  AlertCircle,
  Terminal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CUSTOM_CATEGORIES } from "../../temp/sharedOptions";
import { MOCK_MARKETPLACE_SKILLS } from "../../temp/marketplaceSkills";
import { MOCK_MARKETPLACE_MCP_SERVERS } from "../../temp/marketplaceMcpServers";
import { CapabilityItem } from "../../types/capability";

interface MarketPageProps {
  onBackToHome: () => void;
  langCode?: "ZH" | "EN" | "JA" | "ES";
  setActiveMenu?: (menu: string) => void;
}

export function Market({ onBackToHome: _onBackToHome, langCode: _langCode = "ZH", setActiveMenu: _setActiveMenu }: MarketPageProps) {
  // Combine all items into a state to support toggling favorites locally
  const [skills, setSkills] = useState<CapabilityItem[]>(MOCK_MARKETPLACE_SKILLS);
  const [mcps, setMcps] = useState<CapabilityItem[]>(MOCK_MARKETPLACE_MCP_SERVERS);
  
  // UI states
  const [activeTypeTab, setActiveTypeTab] = useState<"all" | "Skill" | "MCP">("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showRecentlyUsedOnly, setShowRecentlyUsedOnly] = useState(false);
  
  // Details Modal
  const [selectedItem, setSelectedItem] = useState<CapabilityItem | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Toggle Favorite
  const toggleFavorite = (itemId: string, isMcp: boolean) => {
    if (isMcp) {
      setMcps(prev => prev.map(m => m.id === itemId ? { ...m, isFavorite: !m.isFavorite } : m));
    } else {
      setSkills(prev => prev.map(s => s.id === itemId ? { ...s, isFavorite: !s.isFavorite } : s));
    }
    // Sync to currently open selected item
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  // Combine lists for filtering
  const allItems = useMemo(() => {
    const list: (CapabilityItem & { isMcp: boolean })[] = [];
    skills.forEach(s => list.push({ ...s, isMcp: false }));
    mcps.forEach(m => list.push({ ...m, isMcp: true }));
    return list;
  }, [skills, mcps]);

  // Execute Pipeline Filters
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      // 1. Type switch of V1 (all / Skill / MCP)
      if (activeTypeTab === "Skill" && item.isMcp) return false;
      if (activeTypeTab === "MCP" && !item.isMcp) return false;

      // 2. Favorite filter
      if (showFavoritesOnly && !item.isFavorite) return false;

      // 3. Recently used mapping (mock representation)
      if (showRecentlyUsedOnly && item.calls < 1000) return false; 

      // 4. Category filter
      if (selectedCategory !== "all") {
        const matchesCategory = item.tags?.some(
          t => t.toLowerCase() === selectedCategory.toLowerCase() || 
          CUSTOM_CATEGORIES.find(c => c.id === selectedCategory)?.zh.includes(t)
        );
        if (!matchesCategory) return false;
      }

      // 5. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesAuthor = item.author.toLowerCase().includes(query);
        const matchesDept = item.department.toLowerCase().includes(query);
        const matchesTags = item.tags?.some(t => t.toLowerCase().includes(query));
        
        if (!matchesName && !matchesDesc && !matchesAuthor && !matchesDept && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [allItems, activeTypeTab, selectedCategory, searchQuery, showFavoritesOnly, showRecentlyUsedOnly]);

  // Handle Copy of configuration command
  const handleCopyConfig = (item: CapabilityItem) => {
    let configObj = {};
    if (item.type === "MCP") {
      configObj = {
        "mcpServers": {
          [item.name.replace(/\s+/g, "-").toLowerCase()]: {
            "command": item.connectType === "STDIO" ? "npx" : "node",
            "args": ["@haze-mcp/connector", "--server-url", item.id],
            "env": {
              "HAZE_API_KEY": "SEC_SECRET_REF"
            }
          }
        }
      };
    } else {
      configObj = {
        "skillId": item.id,
        "name": item.name,
        "instructions": item.scenarios || [],
        "version": item.version
      };
    }

    navigator.clipboard.writeText(JSON.stringify(configObj, null, 2));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 1500);
  };

  return (
    <div className="dashboard-page-stack h-full flex flex-col overflow-hidden" id="haze-market-page-container">
      {/* 2. Market Layout Grid with left categories sidebar */}
      <div className="flex-1 min-h-0 bg-neutral-50/20 grid grid-cols-1 lg:grid-cols-[210px_1fr] divide-x divide-black/[0.04]">
        
        {/* Left Side: Category bar & Quick selectors */}
        <div className="bg-white p-4 overflow-y-auto hidden lg:flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            {/* Quick selectors */}
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-bold text-neutral-400 px-2 uppercase tracking-wider block mb-1">常用快捷</span>
              <button 
                onClick={() => {
                  setShowFavoritesOnly(prev => !prev);
                  setShowRecentlyUsedOnly(false);
                }}
                className={`w-full h-8 flex items-center justify-between px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  showFavoritesOnly 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star size={13} className={showFavoritesOnly ? "text-blue-500 fill-blue-500" : "text-neutral-400"} />
                  <span>我的收藏</span>
                </div>
                <Badge className="bg-neutral-100 text-neutral-500 hover:bg-neutral-100 px-1 py-0 text-[10px] border-0">
                  {allItems.filter(i => i.isFavorite).length}
                </Badge>
              </button>

              <button 
                onClick={() => {
                  setShowRecentlyUsedOnly(prev => !prev);
                  setShowFavoritesOnly(false);
                }}
                className={`w-full h-8 flex items-center justify-between px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  showRecentlyUsedOnly 
                    ? "bg-purple-50 text-purple-700" 
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock size={13} className={showRecentlyUsedOnly ? "text-purple-500" : "text-neutral-400"} />
                  <span>高频使用</span>
                </div>
              </button>
            </div>

            {/* Business Category list */}
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-bold text-neutral-400 px-2 uppercase tracking-wider block mb-1">业务领域分类</span>
              <button 
                onClick={() => setSelectedCategory("all")}
                className={`w-full h-8 flex items-center px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedCategory === "all" 
                    ? "bg-neutral-900 text-white" 
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                全部类别
              </button>
              {CUSTOM_CATEGORIES.filter(c => c.id !== "all").map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full h-8 flex items-center px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    selectedCategory === cat.id 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {cat.zh}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Main Marketplace Toolbar & Grid */}
        <div className="flex flex-col h-full overflow-hidden bg-white">
          {/* Main Search and Type tabs */}
          <div className="p-3 bg-white border-b border-black/[0.04] flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
            {/* Filter types tabs - STRICTLY Skill & MCP only */}
            <div className="bg-neutral-105 p-0.5 border border-black/[0.05] rounded-xl flex items-center w-full sm:w-auto shrink-0 select-none">
              <button
                onClick={() => setActiveTypeTab("all")}
                className={`text-xs p-1 px-3.5 font-bold rounded-lg transition-all cursor-pointer ${
                  activeTypeTab === "all" 
                    ? "bg-white text-neutral-900 shadow-sm" 
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setActiveTypeTab("Skill")}
                className={`text-xs p-1 px-3.5 font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeTypeTab === "Skill" 
                    ? "bg-white text-blue-600 shadow-s" 
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <Sparkles size={11} />
                Skill 技能包
              </button>
              <button
                onClick={() => setActiveTypeTab("MCP")}
                className={`text-xs p-1 px-3.5 font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeTypeTab === "MCP" 
                    ? "bg-white text-purple-600 shadow-s" 
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                <Cpu size={11} />
                MCP Server
              </button>
            </div>

            {/* Searching bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={13.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="在能力中检索名字、标签、作者或部门..."
                className="w-full h-8.5 px-8.5 pr-3 text-xs bg-neutral-50 border border-black/[0.05] rounded-xl focus:outline-hidden focus:border-blue-500 transition-all font-medium text-neutral-900"
              />
            </div>
          </div>

          {/* Active filter badges indicator */}
          {(selectedCategory !== "all" || showFavoritesOnly || showRecentlyUsedOnly || searchQuery) && (
            <div className="px-4 py-2 bg-neutral-50/60 border-b border-black/[0.03] flex flex-wrap gap-2 items-center text-[11px] text-neutral-400 shrink-0">
              <span>当前活动过滤:</span>
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="text-[10px] font-medium bg-white border px-2 py-0">
                  分类: {CUSTOM_CATEGORIES.find(c => c.id === selectedCategory)?.zh}
                  <X size={10} className="ml-1 cursor-pointer hover:text-rose-500" onClick={() => setSelectedCategory("all")} />
                </Badge>
              )}
              {showFavoritesOnly && (
                <Badge variant="secondary" className="text-[10px] font-medium bg-white border px-2 py-0 text-blue-600">
                  仅看我的收藏
                  <X size={10} className="ml-1 cursor-pointer hover:text-rose-500" onClick={() => setShowFavoritesOnly(false)} />
                </Badge>
              )}
              {showRecentlyUsedOnly && (
                <Badge variant="secondary" className="text-[10px] font-medium bg-white border px-2 py-0 text-purple-600">
                  高频使用筛选
                  <X size={10} className="ml-1 cursor-pointer hover:text-rose-500" onClick={() => setShowRecentlyUsedOnly(false)} />
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="text-[10px] font-medium bg-white border px-2 py-0">
                  搜索: "{searchQuery}"
                  <X size={10} className="ml-1 cursor-pointer hover:text-rose-500" onClick={() => setSearchQuery("")} />
                </Badge>
              )}
            </div>
          )}

          {/* Cards Grid viewport */}
          <div className="flex-1 min-h-0 bg-neutral-50/10">
            <ScrollArea className="h-full w-full">
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {filteredItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className="border border-black/[0.06] hover:border-black/[0.12] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all bg-white rounded-xl flex flex-col justify-between h-[180px] text-left p-4 overflow-hidden relative group"
                  >
                    {/* Upper Row */}
                    <div>
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xs font-bold text-neutral-900 truncate tracking-tight">{item.name}</span>
                            <Badge className={`text-[9px] px-1 py-0 font-medium ${item.isMcp ? "bg-purple-50 text-purple-700 border-0" : "bg-blue-50 text-blue-700 border-0"}`}>
                              {item.isMcp ? "MCP" : "Skill"}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-neutral-500 font-normal leading-normal line-clamp-3 mt-0.5">{item.description}</p>
                        </div>

                        {/* Favorite button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id, item.isMcp);
                          }}
                          className="text-neutral-300 hover:text-amber-500 cursor-pointer p-0.5"
                        >
                          <Star size={14} className={item.isFavorite ? "text-amber-500 fill-amber-500" : ""} />
                        </button>
                      </div>
                    </div>

                    {/* Bottom row metrics */}
                    <div className="mt-2.5 pt-2 border-t border-black/[0.03] flex items-center justify-between shrink-0">
                      <div className="text-[10px] text-neutral-400 font-normal leading-relaxed">
                        <p>拥有者: <b className="text-neutral-600 font-medium">{item.author}</b></p>
                        <p className="mt-0.5">{item.department}</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                          className="h-7 px-2.5 text-[11px] font-bold rounded-lg border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 shadow-xs cursor-pointer"
                        >
                          查看详情
                          <ExternalLink size={10} className="ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {filteredItems.length === 0 && (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center text-neutral-400">
                    <AlertCircle size={22} className="text-neutral-300 mb-2" />
                    <p className="text-xs font-semibold">没有在这个分类中找到满足筛选条件的 Skill 或 MCP Server</p>
                    <p className="text-[10px] text-neutral-400 mt-1">您可以试着清空查询关键词或点击“全部类别”</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* 3. Detailed sheet drawer (Fully styled zero external dependency screen sheet overlay) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs select-none">
          <div className="absolute inset-0" onClick={() => setSelectedItem(null)} />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.2 }}
            className="relative w-full max-w-lg h-full bg-white border-l border-zinc-200 flex flex-col shadow-2xl text-left"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 p-4 border-b border-black/[0.04] bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-neutral-150 text-neutral-500">
                  {selectedItem.isMcp ? <Cpu size={14} /> : <Sparkles size={14} />}
                </span>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    {selectedItem.name}
                    <Badge className={`text-[9px] px-1 py-0 font-medium ${selectedItem.isMcp ? "bg-purple-50 text-purple-700 border-0" : "bg-blue-50 text-blue-700 border-0"}`}>
                      {selectedItem.isMcp ? "MCP Server" : "AI Skill"}
                    </Badge>
                  </h3>
                  <p className="text-[10px] text-neutral-400 leading-none mt-0.5">版本: {selectedItem.version} | 发布于 {selectedItem.updateTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => toggleFavorite(selectedItem.id, selectedItem.isMcp)}
                  className="p-1 text-neutral-300 hover:text-amber-500 cursor-pointer"
                >
                  <Star size={15} className={selectedItem.isFavorite ? "text-amber-500 fill-amber-500" : ""} />
                </button>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="p-1 text-neutral-400 hover:text-neutral-750 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Scrollable specs */}
            <ScrollArea className="flex-1 min-h-0 bg-neutral-50/10">
              <div className="p-5 space-y-4">
                {/* Intro Card */}
                <Card className="border border-black/[0.04] rounded-xl bg-white p-4">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block mb-1">能力简介</span>
                  <p className="text-xs text-neutral-700 font-normal leading-relaxed">{selectedItem.description}</p>
                  
                  {/* Basic Metadata Info */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5 border-t border-black/[0.03] text-[10px] text-neutral-500">
                    <div>
                      <p className="font-normal text-neutral-400">所有部门</p>
                      <p className="font-bold text-neutral-700 mt-1">{selectedItem.department}</p>
                    </div>
                    <div>
                      <p className="font-normal text-neutral-400">开发者 / 负责人</p>
                      <p className="font-bold text-neutral-700 mt-1">{selectedItem.author}</p>
                    </div>
                    <div>
                      <p className="font-normal text-neutral-400">累计调用请求</p>
                      <p className="font-bold text-neutral-750 mt-1">{selectedItem.calls} 次调用</p>
                    </div>
                    <div>
                      <p className="font-normal text-neutral-400">安全风险等级</p>
                      <p className="font-bold mt-1 text-emerald-600">低风险 (Low)</p>
                    </div>
                  </div>
                </Card>

                {/* If Skill type: Render instructions, inputs, expected outputs */}
                {!selectedItem.isMcp && (
                  <div className="space-y-4">
                    {/* Input case */}
                    <Card className="border border-black/[0.04] p-4 bg-white">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide flex items-center gap-1 mb-1">
                        <Terminal size={11} />
                        输入调用提示词(示例)
                      </span>
                      <p className="text-xs text-neutral-700 font-medium font-mono leading-relaxed bg-neutral-50 p-2.5 rounded-lg border border-black/[0.03]">
                        {selectedItem.inputExample}
                      </p>
                    </Card>

                    {/* Output case */}
                    <Card className="border border-black/[0.04] p-4 bg-white">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide flex items-center gap-1 mb-1">
                        <Check size={11} />
                        模型输出(预期)
                      </span>
                      <div className="text-xs text-neutral-700 font-normal leading-relaxed bg-zinc-900 text-zinc-100 p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap">
                        {selectedItem.outputExample}
                      </div>
                    </Card>

                    {/* Scenario List */}
                    <Card className="border border-black/[0.04] p-4 bg-white text-xs font-normal">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block mb-2">适用深度场景</span>
                      <ul className="list-disc pl-4 text-neutral-600 space-y-1.5 leading-relaxed">
                        {selectedItem.scenarios?.map((s, idx) => <li key={idx}>{s}</li>)}
                        {(!selectedItem.scenarios || selectedItem.scenarios.length === 0) && (
                          <li>适用于大部分通用的日常行政、对账单识别、合同结构诊断场景</li>
                        )}
                      </ul>
                    </Card>
                  </div>
                )}

                {/* If MCP Server Type: Discovery Tools list & configurations */}
                {selectedItem.isMcp && (
                  <div className="space-y-4">
                    {/* Instructions how to import config */}
                    <Card className="border border-black/[0.04] p-4 bg-white relative">
                      <div className="flex justify-between items-center mb-2 shrink-0">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide flex items-center gap-1">
                          <Terminal size={11} />
                          一键调用配置 (JSON)
                        </span>
                        
                        <Button 
                          onClick={() => handleCopyConfig(selectedItem)}
                          className={`h-6 px-1.5 text-[10px] font-bold flex items-center gap-1 rounded-md border text-neutral-750 bg-white border-neutral-200 hover:bg-neutral-50 cursor-pointer ${
                            copiedText ? "text-emerald-600 border-emerald-250 bg-emerald-50/50" : ""
                          }`}
                        >
                          {copiedText ? (
                            <>
                              <Check size={10} className="text-emerald-600" />
                              <span>已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy size={10} />
                              <span>复制配置</span>
                            </>
                          )}
                        </Button>
                      </div>

                      <p className="text-[11px] text-neutral-500 font-normal leading-relaxed mb-2.5">
                        将以下配置拷贝输入您的独立 AI 端（支持 Cursor, Claude Desktop 或 Haze Shell）中即可免密调试接入：
                      </p>

                      <div className="text-[10.5px] text-zinc-200 font-mono leading-relaxed bg-zinc-900 p-3 rounded-lg overflow-x-auto whitespace-pre">
                        {JSON.stringify({
                          "mcpServers": {
                            [selectedItem.name.replace(/\s+/g, "-").toLowerCase()]: {
                              "command": selectedItem.connectType === "STDIO" ? "npx" : "node",
                              "args": ["@haze-mcp/connector", "--server-url", selectedItem.id],
                              "env": {
                                "HAZE_API_KEY": "SEC_SECRET_REF"
                              }
                            }
                          }
                        }, null, 2)}
                      </div>
                    </Card>

                    {/* Discovered tools list under MCP */}
                    <Card className="border border-black/[0.04] p-4 bg-white text-xs font-normal">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block mb-2.5">自动探测发现的 Tools (工具集)</span>
                      
                      <div className="space-y-2">
                        {selectedItem.toolsList?.map((tool, idx) => (
                          <div key={idx} className="p-2.5 bg-neutral-50 border border-black/[0.04] rounded-lg">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="font-mono text-[11px] font-bold text-neutral-900 bg-neutral-200 p-0.5 px-1.5 rounded-md leading-none">{tool.name}</span>
                              <Badge className="bg-emerald-50 text-emerald-700 border-0 text-[9px] py-0 font-medium">Auto-Discovery</Badge>
                            </div>
                            <p className="text-[11px] text-neutral-500 leading-relaxed font-normal">{tool.description}</p>
                          </div>
                        ))}
                        {(!selectedItem.toolsList || selectedItem.toolsList.length === 0) && (
                          <div className="p-3 text-center text-neutral-400">暂无探测到的 Tool 接口，请验证 serverUrl 配置</div>
                        )}
                      </div>
                    </Card>

                    {/* Resources */}
                    <Card className="border border-black/[0.04] p-4 bg-white text-xs font-normal">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block mb-2">自动发现的 Resources (物理数据映射)</span>
                      <ul className="list-disc pl-4 text-neutral-500 space-y-1 font-mono text-[10.5px]">
                        {selectedItem.resourcesList?.map((res, idx) => <li key={idx}>{res}</li>)}
                        {(!selectedItem.resourcesList || selectedItem.resourcesList.length === 0) && (
                          <li className="text-neutral-400 list-none pl-0 text-center">暂无自动解析的物理数据源路径</li>
                        )}
                      </ul>
                    </Card>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Bottom Actions button */}
            <div className="sticky bottom-0 z-10 p-4 border-t border-black/[0.04] bg-white flex items-center justify-end gap-2.5 shrink-0">
              <Button 
                variant="outline"
                onClick={() => setSelectedItem(null)}
                className="h-8.5 px-4 text-xs font-semibold rounded-lg border-neutral-200 text-neutral-600 bg-white hover:bg-neutral-50 cursor-pointer"
              >
                关闭详情
              </Button>
              <Button 
                onClick={() => handleCopyConfig(selectedItem)}
                className="h-8.5 px-4 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-750 cursor-pointer flex items-center gap-1"
              >
                <Copy size={12} />
                <span>复制挂载指令</span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
