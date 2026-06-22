import React, { useMemo, useState } from "react";
import {
  Sparkles,
  Cpu,
  Plus,
  ChevronRight,
  TrendingUp,
  ClipboardList,
  Clock,
  Eye,
  CheckCircle2,
  Search
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {
  MOCK_HOME_METRICS,
  MOCK_RECENT_PUBLISHES,
  MOCK_HOME_RECOMMEND,
  MOCK_HOME_POPULAR
} from "../../temp/homeData";
import { getI18n } from "../../i18n";

interface HomeProps {
  userName: string;
  setPrefilledPublishType: (type: "Skill" | "MCP" | "Tool") => void;
  setNewCapType: (type: "Skill" | "MCP" | "Tool") => void;
  setShowPublishModal: (show: boolean) => void;
  setShowDocDrawer: (show: boolean) => void;
  setActiveMenu: (menu: any) => void;
  searchQuery?: string;
  metrics?: any;
  filteredSkills?: any;
  recentLogs?: any;
  todos?: any;
  langCode?: string;
}

export function Home({
  userName,
  setPrefilledPublishType,
  setNewCapType,
  setShowPublishModal,
  setActiveMenu,
  searchQuery = "",
  langCode = "ZH"
}: HomeProps) {
  const t = getI18n(langCode);
  // Local states for search input and tabs
  const [localSearch, setLocalSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"recommend" | "latest" | "popular">("recommend");

  // Sync parent search query
  React.useEffect(() => {
    if (searchQuery !== undefined) {
      setLocalSearch(searchQuery);
    }
  }, [searchQuery]);

  // Hot Search click handler
  const handleHotSearchClick = (keyword: string) => {
    setLocalSearch(keyword);
  };

  // Helper trigger action for capability uploads
  const triggerPublish = (type: "Skill" | "MCP" | "Tool") => {
    setPrefilledPublishType(type);
    setNewCapType(type);
    setShowPublishModal(true);
  };

  // Capabilities Mock datasets formatted beautifully to display in tabs list
  const tabCapabilities = useMemo(() => {
    // Standard structure for consistent list rendering
    const listToFilter = (() => {
      if (activeTab === "recommend") {
        // Find selected item list representing high-tier recommended services
        return MOCK_HOME_RECOMMEND.map(item => ({
          ...item,
          icon: item.iconName === "Cpu" ? Cpu : Sparkles
        }));
      } else if (activeTab === "latest") {
        return MOCK_RECENT_PUBLISHES.map(p => ({
          id: p.id,
          name: p.name,
          type: p.type === "MCP Server" ? "MCP Server" : "Skill",
          description: p.description,
          author: p.author,
          time: p.time,
          calls: p.id === "pub-1" ? "1.5k" : p.id === "pub-2" ? "2.1k" : "862",
          status: p.status,
          iconColor: p.type === "MCP Server" ? "bg-indigo-550/10 text-indigo-600" : "bg-primary/10 text-primary",
          icon: p.type === "MCP Server" ? Cpu : Sparkles
        }));
      } else {
        // Popular uses
        return MOCK_HOME_POPULAR.map(item => ({
          ...item,
          icon: item.iconName === "Cpu" ? Cpu : Sparkles
        }));
      }
    })();

    // Perform query filter
    if (!localSearch.trim()) return listToFilter;
    const query = localSearch.toLowerCase().trim();
    return listToFilter.filter(
      item => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
    );
  }, [activeTab, localSearch]);

  return (
    <div className="dashboard-page-stack" id="haze-home-page-container">
      <motion.div
        key="workbench-content-optimized"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex flex-col gap-5 h-full overflow-y-auto pr-1 select-text"
      >

        {/* 1. Welcoming Hero Banner / Blue-White Tech Art Jumbotron */}
        <div className="relative w-full rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-xs min-h-[200px]">
          {/* Abstract Vector Backdrop Layer */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl select-none z-0 bg-gradient-to-r from-blue-50/95 via-sky-100/70 to-indigo-50/95">
            {/* Modern ambient geometric shapes and gradient orbs */}
            <div className="absolute top-[-25%] left-[-10%] w-[45%] h-[85%] rounded-full bg-radial from-sky-400/25 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute bottom-[-15%] right-[-5%] w-[45%] h-[75%] rounded-full bg-radial from-blue-400/20 to-transparent blur-3xl" />

            {/* Low opacity abstract rolling mountain curves (vector SVGs) */}
            <svg className="absolute bottom-0 left-0 w-full h-[60%] opacity-40" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="#cbdff7" fillOpacity="0.5" d="M0,192L48,181.3C96,171,192,149,288,149.3C384,149,480,171,576,192C672,213,768,235,864,213.3C960,192,1056,128,1152,122.7C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              <path fill="#aacbf3" fillOpacity="0.4" d="M0,256L60,234.7C120,213,240,171,360,176C480,181,600,235,720,245.3C840,256,960,224,1080,186.7C1200,149,1320,107,1380,85.3L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            </svg>

            {/* Floating glassmorphic 3D Transparent Cube */}
            <div className="absolute right-[11%] top-[12%] w-32 h-32 hidden md:block">
              <div className="absolute inset-0 rounded-2xl bg-white/20 border border-white/40 backdrop-blur-md shadow-lg transform rotate-12 -translate-y-2 translate-x-2 flex items-center justify-center">
                {/* Cube inner details */}
                <div className="w-16 h-16 rounded-lg bg-sky-200/30 border border-sky-400/35 transform -rotate-6" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-400/10 via-white/5 to-white/30 border border-sky-300/30 transform -rotate-12 translate-y-3 -translate-x-3 backdrop-blur-[2px]" />
              {/* Highlight reflection */}
              <div className="absolute top-2 left-6 w-2 h-2 rounded-full bg-white/60 blur-[1px]" />
              <div className="absolute bottom-4 right-8 w-1 h-1 rounded-full bg-white/40" />
            </div>

            {/* Float Bubbles */}
            <div className="absolute right-[28%] bottom-[25%] w-10 h-10 rounded-full bg-gradient-to-tr from-blue-300/30 to-sky-100/20 backdrop-blur-xs border border-white/40 shadow-sm animate-bounce hidden md:block" style={{ animationDuration: '4s' }} />
            <div className="absolute right-[5%] top-[55%] w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs border border-white/40 shadow-xs hidden md:block" />
          </div>

          {/* Actual Header Content Layer on top of background */}
          <div className="relative z-10 w-full flex flex-col justify-between gap-6">

            {/* Upper row: Greetings and Dropdown Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
              <div className="space-y-1 text-left">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-1.5 leading-normal">
                  {langCode === "ZH" ? "欢迎回来，" : langCode === "JA" ? "お帰りなさい、" : langCode === "ES" ? "Bienvenido de nuevo, " : "Welcome back, "}<span>{userName}</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600/90 leading-relaxed font-normal">
                  {t.homeDesc}
                </p>
              </div>

              {/* Header create dropdown action button */}
              <div className="flex items-center self-start sm:self-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-slate-900 border-0 text-white hover:bg-slate-800 text-xs font-semibold h-9 px-4 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} className="stroke-[2.5px]" />
                      <span>{langCode === "ZH" ? "创建能力" : langCode === "JA" ? "能力の作成" : langCode === "ES" ? "Crear capacidad" : "Create Capability"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 border border-black/[0.06] bg-white text-slate-800 shadow-md p-1.5 rounded-xl">
                    <DropdownMenuItem
                      onClick={() => triggerPublish("Skill")}
                      className="text-xs flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-lg hover:bg-blue-50/50 hover:text-blue-600 font-medium transition-colors"
                    >
                      <Sparkles size={14} className="text-blue-500" />
                      <span>{langCode === "ZH" ? "上传 Skill" : langCode === "JA" ? "Skill アップロード" : langCode === "ES" ? "Subir Skill" : "Upload Skill"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => triggerPublish("MCP")}
                      className="text-xs flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-lg hover:bg-purple-50/50 hover:text-purple-600 font-medium transition-colors"
                    >
                      <Cpu size={14} className="text-purple-500" />
                      <span>{langCode === "ZH" ? "注册 MCP Server" : langCode === "JA" ? "MCP サーバー登録" : langCode === "ES" ? "Registrar servidor MCP" : "Register MCP Server"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Lower row: Elegant Search Bar & Search Tags */}
            <div className="w-full max-w-xl text-left">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 stroke-[2px]" size={16} />
                <Input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-white/95 border border-sky-200/90 pl-10 pr-9 text-xs sm:text-sm h-10 rounded-xl shadow-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/80 transition-all font-sans"
                />
                {localSearch && (
                  <button
                    onClick={() => setLocalSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold uppercase tracking-tight"
                  >
                    {t.searchClear}
                  </button>
                )}
              </div>

              {/* Hot searches */}
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                <span className="text-xs text-slate-500 font-medium">
                  {langCode === "ZH" ? "热门搜索:" : langCode === "JA" ? "急上昇検索:" : langCode === "ES" ? "Búsquedas populares:" : "Hot Searches:"}
                </span>
                {["财务分析", "合同审核", "数据库", "文件处理", "风险控制"].map((kw) => (
                  <button
                    key={kw}
                    onClick={() => handleHotSearchClick(kw)}
                    className="text-xs text-slate-600/90 hover:text-blue-600 hover:bg-blue-100/50 bg-white/40 border border-slate-200/50 px-2 py-0.5 rounded-md cursor-pointer transition-all"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 2. Interactive Data Metrics Dashboard Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* Card 1: 可用能力 */}
          <div
            onClick={() => setActiveMenu("market")}
            className="p-4 bg-white hover:bg-slate-50/50 border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-xs rounded-xl flex items-center justify-between text-left cursor-pointer transition-all duration-150 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 border border-blue-100/60 flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="stroke-[2.2px]" />
              </div>
              <div className="space-y-0.5 leading-tight">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">
                  {langCode === "ZH" ? "可用能力" : langCode === "JA" ? "利用可能能力" : langCode === "ES" ? "Capacidades dispon." : "Avail. Capab."}
                </p>
                <p className="text-2xl font-bold tracking-tight text-slate-800">
                  {MOCK_HOME_METRICS.skillsCount + MOCK_HOME_METRICS.mcpCount}
                </p>
                <p className="text-xs text-slate-400/95 font-normal">
                  Skill {MOCK_HOME_METRICS.skillsCount} / MCP {MOCK_HOME_METRICS.mcpCount}
                </p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </div>

          {/* Card 2: 我的发布 */}
          <div
            onClick={() => setActiveMenu("developer")}
            className="p-4 bg-white hover:bg-slate-50/50 border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-xs rounded-xl flex items-center justify-between text-left cursor-pointer transition-all duration-150 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/60 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={18} className="stroke-[2.2px]" />
              </div>
              <div className="space-y-0.5 leading-tight">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">
                  {langCode === "ZH" ? "我的发布" : langCode === "JA" ? "マイ配信" : langCode === "ES" ? "Mis publicaciones" : "My Publications"}
                </p>
                <p className="text-2xl font-bold tracking-tight text-slate-800">
                  {MOCK_HOME_METRICS.myPublishCount}
                </p>
                <p className="text-xs text-slate-400/95 font-normal">
                  {langCode === "ZH" ? "已发布 2 / 草稿 1" : langCode === "JA" ? "リリース済 2 / 下書き 1" : langCode === "ES" ? "Publicadas 2 / Borrador 1" : "Published 2 / Drafts 1"}
                </p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </div>

          {/* Card 3: 待我处理 */}
          <div
            onClick={() => setActiveMenu("developer")}
            className="p-4 bg-white hover:bg-slate-50/50 border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-xs rounded-xl flex items-center justify-between text-left cursor-pointer transition-all duration-150 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 border border-amber-100/60 flex items-center justify-center flex-shrink-0">
                <ClipboardList size={18} className="stroke-[2.2px]" />
              </div>
              <div className="space-y-0.5 leading-tight">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">
                  {langCode === "ZH" ? "待我处理" : langCode === "JA" ? "要対応タスク" : langCode === "ES" ? "Mis pendientes" : "My Pending Tasks"}
                </p>
                <p className="text-2xl font-bold tracking-tight text-slate-800">
                  {MOCK_RECENT_PUBLISHES.filter(p => p.status === "reviewing").length}
                </p>
                <p className="text-xs text-slate-400/95 font-normal">
                  {langCode === "ZH" ? "待审核或待完善" : langCode === "JA" ? "承認・推敲待ち" : langCode === "ES" ? "Espera de revisión" : "Awaiting review/fixes"}
                </p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </div>

          {/* Card 4: 本周新增 */}
          <div
            onClick={() => setActiveMenu("market")}
            className="p-4 bg-white hover:bg-slate-50/50 border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-xs rounded-xl flex items-center justify-between text-left cursor-pointer transition-all duration-150 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-600 border border-purple-100/60 flex items-center justify-center flex-shrink-0">
                <TrendingUp size={18} className="stroke-[2.2px]" />
              </div>
              <div className="space-y-0.5 leading-tight">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">
                  {langCode === "ZH" ? "本周新增" : langCode === "JA" ? "今週の新規" : langCode === "ES" ? "Añadido esta sem." : "Added This Week"}
                </p>
                <p className="text-2xl font-bold tracking-tight text-slate-800">
                  {MOCK_HOME_METRICS.recentPublishCount}
                </p>
                <p className="text-xs text-slate-400/95 font-normal">
                  {langCode === "ZH" ? "较上周 +3" : langCode === "JA" ? "先週比 +3" : langCode === "ES" ? "+3 vs semana ant." : "vs last week +3"}
                </p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </div>
        </div>

        {/* 3. Split Layout: Recommended/Latest list (Left 2/3) vs. My Workbench (Right 1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full items-start">

          {/* LEFT 2/3 CAPABILITY PANELS */}
          <div className="lg:col-span-2 flex flex-col gap-3 h-full">
            <div className="bg-white border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.01)] rounded-xl overflow-hidden flex flex-col">

              {/* List Section Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-sm sm:text-base font-bold text-slate-800">
                    {langCode === "ZH" ? "推荐与最新能力" : langCode === "JA" ? "おすすめと最新能力" : langCode === "ES" ? "Capacidades recomendadas y recientes" : "Recommended & Latest"}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveMenu("market")}
                  className="text-xs text-blue-600 hover:text-blue-700 font-black flex items-center gap-1 cursor-pointer hover:underline transition-all group"

                >
                  <span>{langCode === "ZH" ? "查看全部" : langCode === "JA" ? "すべて表示" : langCode === "ES" ? "Ver todo" : "View All"}</span>
                  <span className="font-bold font-mono transition-transform group-hover:translate-x-0.5">&gt;</span>
                </button>
              </div>

              {/* Selection Tabs Bar */}
              <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/15 flex items-center gap-4">
                <button
                  onClick={() => setActiveTab("recommend")}
                  className={`text-xs font-semibold pb-1.5 pt-0.5 relative transition-colors cursor-pointer ${activeTab === "recommend" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <span>{langCode === "ZH" ? "推荐" : langCode === "JA" ? "おすすめ" : langCode === "ES" ? "Recomendado" : "Recommended"}</span>
                  {activeTab === "recommend" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("latest")}
                  className={`text-xs font-semibold pb-1.5 pt-0.5 relative transition-colors cursor-pointer ${activeTab === "latest" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <span>{langCode === "ZH" ? "最新发布" : langCode === "JA" ? "最新の追加" : langCode === "ES" ? "Novedades" : "Latest"}</span>
                  {activeTab === "latest" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("popular")}
                  className={`text-xs font-semibold pb-1.5 pt-0.5 relative transition-colors cursor-pointer ${activeTab === "popular" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <span>{langCode === "ZH" ? "热门使用" : langCode === "JA" ? "人気急上昇" : langCode === "ES" ? "Popular" : "Popular"}</span>
                  {activeTab === "popular" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              </div>

              {/* Tabs Content - Capabilities rendering with flat list & dividers */}
              <div className="p-1">
                {tabCapabilities.length === 0 ? (
                  <div className="text-center py-16 text-xs text-slate-400 font-normal">
                    {langCode === "ZH" ? "暂无满足条件的能力" : langCode === "JA" ? "一致する能力はありません" : langCode === "ES" ? "No hay capacidades que coincidan" : "No matching capabilities"}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {tabCapabilities.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <div key={item.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left hover:bg-slate-50/20 transition-colors">

                          {/* Left: Icon container & Metadata details */}
                          <div className="flex items-start gap-3.5 flex-1 min-w-0">
                            <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 border ${item.iconColor || "bg-blue-50 text-blue-600 border-blue-100/50"}`}>
                              <IconComp size={18} className="stroke-[2.2px]" />
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                              {/* Title block with badges */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-slate-800 tracking-tight block truncate" title={item.name}>
                                  {item.name}
                                </span>
                                <Badge variant="outline" className="text-xs font-semibold tracking-wide py-0 px-2 uppercase bg-slate-50 text-slate-500 border-slate-200">
                                  {item.type}
                                </Badge>
                              </div>
                              {/* Short Description */}
                              <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-1">
                                {item.description}
                              </p>
                              {/* Metadata indicators below description */}
                              <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap pt-0.5 font-normal">
                                <span className="flex items-center gap-1">{langCode === "ZH" ? "上传者" : langCode === "JA" ? "開発者" : langCode === "ES" ? "Autor" : "Author"}: <b className="text-slate-600 font-medium">{item.author}</b></span>
                                <span className="text-slate-200">|</span>
                                <span>{langCode === "ZH" ? "更新于" : langCode === "JA" ? "更新日時" : langCode === "ES" ? "Actualizado" : "Updated"}: {item.time}</span>
                                <span className="text-slate-200">|</span>
                                <span>{langCode === "ZH" ? "调用" : langCode === "JA" ? "呼び出し" : langCode === "ES" ? "Llamadas" : "Calls"} {item.calls} {langCode === "ZH" ? "次" : langCode === "JA" ? "回" : langCode === "ES" ? "veces" : "times"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Actions, status */}
                          <div className="flex items-center gap-3.5 self-end md:self-center flex-shrink-0 pl-14 md:pl-0">
                            {/* Interactive Buttons */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveMenu("market")}
                                className="border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg h-8 px-3 text-xs font-medium cursor-pointer"
                              >
                                {t.viewDetail}
                              </Button>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT 1/3 MY WORKBENCH */}
          <div className="flex flex-col gap-3 h-full">
            <div className="bg-white border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.01)] rounded-xl overflow-hidden flex flex-col text-left">

              {/* Workbench Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  {langCode === "ZH" ? "我的工作台" : langCode === "JA" ? "マイ・ワークベンチ" : langCode === "ES" ? "Mi mesa de trabajo" : "My Workbench"}
                </h3>
                <button
                  onClick={() => setActiveMenu("developer")}
                  className="text-xs text-blue-600 hover:text-blue-700 font-black flex items-center gap-1 cursor-pointer hover:underline transition-all group"

                >
                  <span>{langCode === "ZH" ? "进入开发者中心" : langCode === "JA" ? "開発者センターへ" : langCode === "ES" ? "Ver centro de desarr." : "Go to Developer Center"}</span>
                  <span className="font-bold font-mono transition-transform group-hover:translate-x-0.5">&gt;</span>
                </button>
              </div>

              {/* Workbench Content list in clean shallow groups */}
              <div className="p-4 space-y-4">

                {/* Subsection A: 待处理事项 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <ClipboardList size={13} className="text-amber-500" />
                      <span>{langCode === "ZH" ? "待处理事项" : langCode === "JA" ? "要対応事項" : langCode === "ES" ? "Pendientes" : "Pending Tasks"}</span>
                    </span>
                    <span className="text-xs bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
                      {langCode === "ZH" ? "2 条需要跟进" : langCode === "JA" ? "2件のフォローアップ" : langCode === "ES" ? "2 por revisar" : "2 need action"}
                    </span>
                  </div>
                  <div className="bg-slate-55/40 rounded-xl border border-slate-100 p-2.5 space-y-2">
                    {/* Item 1 */}
                    <div className="flex items-center justify-between text-xs gap-3">
                      <div className="min-w-0 flex-1 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                        <span className="text-slate-750 font-medium truncate">合同法律条款风险审核</span>
                      </div>
                      <Badge className="bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 border-amber-500/15 text-xs font-semibold py-0 px-1.5 shadow-none flex-shrink-0">
                        {langCode === "ZH" ? "待审核" : langCode === "JA" ? "承認待ち" : langCode === "ES" ? "Por revisar" : "Pending"}
                      </Badge>
                    </div>
                    {/* Item 2 */}
                    <div className="flex items-center justify-between text-xs gap-3">
                      <div className="min-w-0 flex-1 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
                        <span className="text-slate-750 font-medium truncate">企业数据脱敏规则引擎</span>
                      </div>
                      <Badge className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200/60 text-xs font-semibold py-0 px-1.5 shadow-none flex-shrink-0">
                        {langCode === "ZH" ? "草稿" : langCode === "JA" ? "下書" : langCode === "ES" ? "Borrador" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Subsection B: 最近发布 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock size={13} className="text-emerald-500" />
                    <span>{langCode === "ZH" ? "最近发布" : langCode === "JA" ? "最近の配信" : langCode === "ES" ? "Recientemente pub." : "Recent Pubs"}</span>
                  </span>
                  <div className="bg-slate-55/40 rounded-xl border border-slate-100 p-2.5 space-y-2">
                    {/* Item 1 */}
                    <div className="flex items-center justify-between text-xs gap-3">
                      <div className="min-w-0 flex-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-lg bg-emerald-500 flex-shrink-0" />
                        <span className="text-slate-750 font-medium truncate">财务报表摘要智能生成器</span>
                      </div>
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                        {langCode === "ZH" ? "已发布" : langCode === "JA" ? "リリース済" : langCode === "ES" ? "Publicada" : "Published"}
                      </span>
                    </div>
                    {/* Item 2 */}
                    <div className="flex items-center justify-between text-xs gap-3">
                      <div className="min-w-0 flex-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-lg bg-slate-350 flex-shrink-0" />
                        <span className="text-slate-750 font-medium truncate">工作区受控文件系统沙箱服务</span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {langCode === "ZH" ? "草稿" : langCode === "JA" ? "下書" : langCode === "ES" ? "Borrador" : "Draft"}
                      </span>
                    </div>
                    {/* Item 3 */}
                    <div className="flex items-center justify-between text-xs gap-3">
                      <div className="min-w-0 flex-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-lg bg-slate-350 flex-shrink-0" />
                        <span className="text-slate-750 font-medium truncate">文件区域监控系统</span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {langCode === "ZH" ? "草稿" : langCode === "JA" ? "下書" : langCode === "ES" ? "Borrador" : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subsection C: 最近使用 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Eye size={13} className="text-sky-500" />
                    <span>{langCode === "ZH" ? "最近使用" : langCode === "JA" ? "最近の使用" : langCode === "ES" ? "Leídos recientemente" : "Recently Used"}</span>
                  </span>
                  <div className="bg-slate-55/40 rounded-xl border border-slate-100 p-2.5 space-y-2">
                    {/* Item 1 */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-750 font-medium truncate pr-2">财务报表摘要智能生成器</span>
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        {langCode === "ZH" ? "30分钟前" : langCode === "JA" ? "30分前" : langCode === "ES" ? "hace 30 min" : "30 mins ago"}
                      </span>
                    </div>
                    {/* Item 2 */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-750 font-medium truncate pr-2">数据库安全连接服务</span>
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        {langCode === "ZH" ? "2小时前" : langCode === "JA" ? "2時間前" : langCode === "ES" ? "hace 2 horas" : "2 hours ago"}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
