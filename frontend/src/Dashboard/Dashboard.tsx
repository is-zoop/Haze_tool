import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Code,
  ShieldCheck,
  Settings,
  Bell,
  PanelLeft,
  Menu,
  MoreHorizontal,
  User,
  BookOpen,
  LogOut,
  Activity,
} from "lucide-react";
import { motion } from "motion/react";

import { Home } from "./pages/Home";
import { Market } from "./pages/Market";
import { DeveloperCenter } from "./pages/DeveloperCenter";
import { AuditCenter } from "./pages/AuditCenter";
import { Settings as SettingsPage } from "./pages/Settings";
import { PersonalCenter } from "./pages/PersonalCenter";
import { Guide } from "./pages/Guide";
import { McpRuntime } from "./pages/McpRuntime";

// Import real shadcn/ui components
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose
} from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { GuidelineSheet } from "@/components/GuidelineSheet";
import { PublishCapabilityDialog } from "@/components/PublishCapabilityDialog";
import { AuthUser } from "@/lib/auth";

// Import real, typed mock data from homeData
import {
  MOCK_DASHBOARD_NOTIFICATIONS,
  MOCK_DASHBOARD_SKILLS,
  MOCK_DASHBOARD_LOGS,
  MOCK_DASHBOARD_METRICS,
  MOCK_DASHBOARD_TODOS
} from "@/temp/homeData";

interface DashboardProps {
  user: AuthUser;
  onLogout: () => void;
  currentLang?: {
    code: string;
    name: string;
    flag: string;
  };
}

const i18n = {
  ZH: {
    brandName: "HAZE.",
    brandSubtitle: "AI 能力工具箱",
    workbench: "首页",
    market: "能力市场",
    skill: "Skill 中心",
    mcp: "MCP 中心",
    workspace: "我的工作区",
    developer: "开发者中心",
    audit: "审核中心",
    monitor: "运行监控",
    settings: "系统管理",
    secCore: "工作核心",
    secSupport: "服务与支持",
    devGuide: "开发者指引",
    sysSettings: "系统设置",
    getHelp: "获取帮助",
    search: "搜索",
    searchPlaceholder: "搜索 Skill、MCP、Tool",
    searchClear: "清除",
    notifCenter: "通知中心",
    markAllRead: "标记全部已读",
    docs: "帮助文档",
    personalCenter: "个人中心",
    devGuideDdown: "开发指南",
    logout: "退出登录",
    hazeAiHub: "AI 能力工具箱"
  },
  EN: {
    brandName: "HAZE.",
    brandSubtitle: "Enterprise AI Center",
    workbench: "Home",
    market: "Capability Market",
    skill: "Skill Center",
    mcp: "MCP Center",
    workspace: "My Workspace",
    developer: "Developer Center",
    audit: "Audit Center",
    monitor: "Monitoring",
    settings: "System Admin",
    secCore: "Core Operations",
    secSupport: "Service & Support",
    devGuide: "Developer Guide",
    sysSettings: "System Settings",
    getHelp: "Get Help",
    search: "Search",
    searchPlaceholder: "Search Skill, MCP, Tool",
    searchClear: "Clear",
    notifCenter: "Notifications",
    markAllRead: "Mark all read",
    docs: "Help Docs",
    personalCenter: "Personal Center",
    devGuideDdown: "Development Guide",
    logout: "Log out",
    hazeAiHub: "Enterprise AI Center"
  },
  JA: {
    brandName: "HAZE.",
    brandSubtitle: "エンタープライズ AI センター",
    workbench: "ホーム",
    market: "機能マーケット",
    skill: "Skill センター",
    mcp: "MCP センター",
    workspace: "マイワークスペース",
    developer: "開発者センター",
    audit: "監査センター",
    monitor: "運用監視",
    settings: "システム管理",
    secCore: "コア業務",
    secSupport: "サービスとサポート",
    devGuide: "開発者ガイド",
    sysSettings: "システム設定",
    getHelp: "ヘルプ",
    search: "検索",
    searchPlaceholder: "Skill、MCP、Tool を検索",
    searchClear: "クリア",
    notifCenter: "通知センター",
    markAllRead: "すべて既読にする",
    docs: "ヘルプドキュメント",
    personalCenter: "マイページ",
    devGuideDdown: "開発ガイド",
    logout: "ログアウト",
    hazeAiHub: "エンタープライズ AI センター"
  },
  ES: {
    brandName: "HAZE.",
    brandSubtitle: "Centro de IA Empresarial",
    workbench: "Inicio",
    market: "Canal de Capacidades",
    skill: "Centro de Skills",
    mcp: "Centro de MCP",
    workspace: "Mi Espacio",
    developer: "Centro de Desarrollador",
    audit: "Centro de Auditoría",
    monitor: "Monitoreo",
    settings: "Gestión del Sistema",
    secCore: "Núcleo de Trabajo",
    secSupport: "Servicios y Soporte",
    devGuide: "Guía de Desarrolladores",
    sysSettings: "Ajustes del Sistema",
    getHelp: "Obtener Ayuda",
    search: "Buscar",
    searchPlaceholder: "Buscar Skill, MCP, Tool",
    searchClear: "Limpiar",
    notifCenter: "Centro de Notificaciones",
    markAllRead: "Marcar todo como leído",
    docs: "Manual de Ayuda",
    personalCenter: "Centro Personal",
    devGuideDdown: "Guía de Desarrollo",
    logout: "Cerrar sesión",
    hazeAiHub: "Centro de IA Empresarial"
  }
};

type MenuKey =
  | "workbench"
  | "market"
  | "developer"
  | "mcpRuntime"
  | "audit"
  | "settings"
  | "profile"
  | "guide";

interface SkillItem {
  id: string;
  name: string;
  type: "Skill" | "MCP" | "Tool";
  description: string;
  calls: string;
  status: "active" | "warning" | "maintenance";
  author: string;
  time: string;
}

export function Dashboard({ user, onLogout, currentLang }: DashboardProps) {
  const langCode = (currentLang?.code || "ZH") as keyof typeof i18n;
  const t = i18n[langCode] || i18n.ZH;
  const [sessionUser, setSessionUser] = useState<AuthUser>(user);

  useEffect(() => {
    setSessionUser(user);
  }, [user]);

  // Sidebar folded/expanded state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Selected Sidebar Tab
  const [activeMenu, setActiveMenu] = useState<MenuKey>("workbench");
  
  
  // Global Search Term
  const searchQuery = "";
  
  // Custom states initialized from migrated mock data
  const [notifications, setNotifications] = useState(MOCK_DASHBOARD_NOTIFICATIONS);
  const [skillsList, setSkillsList] = useState<SkillItem[]>(MOCK_DASHBOARD_SKILLS);
  const [recentLogs] = useState(MOCK_DASHBOARD_LOGS);
  const [metrics, setMetrics] = useState(MOCK_DASHBOARD_METRICS);
  const [todos] = useState(MOCK_DASHBOARD_TODOS);
  
  // Dialog & Sheet States
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDocDrawer, setShowDocDrawer] = useState(false);
  const [prefilledPublishType, setPrefilledPublishType] = useState<"Skill" | "MCP" | "Tool">("Skill");

  // Form state for publishing new capability
  const [newCapName, setNewCapName] = useState("");
  const [newCapDesc, setNewCapDesc] = useState("");
  const [newCapType, setNewCapType] = useState<"Skill" | "MCP" | "Tool">("Skill");
  const [newCapAuthor, setNewCapAuthor] = useState("我");

  // Synchronize newCapType with prefilledPublishType when the prefilled type changes
  useEffect(() => {
    setNewCapType(prefilledPublishType);
  }, [prefilledPublishType]);

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCapName.trim() || !newCapDesc.trim()) return;

    const newItem: SkillItem = {
      id: String(Date.now()),
      name: newCapName,
      type: newCapType,
      description: newCapDesc,
      calls: "0",
      status: "active",
      author: newCapAuthor,
      time: "鍒氬垰"
    };

    const updatedList = [newItem, ...skillsList];
    setSkillsList(updatedList);
    
    // Simulate updating call stats
    setMetrics(prev => ({
      ...prev,
      skillsCount: prev.skillsCount + (newCapType === "Skill" ? 1 : 0),
      mcpCount: prev.mcpCount + (newCapType === "MCP" ? 1 : 0),
      toolsCount: prev.toolsCount + (newCapType === "Tool" ? 1 : 0),
    }));

    setNewCapName("");
    setNewCapDesc("");
    setShowPublishModal(false);
  };

  const menuItemsGroup1 = useMemo(() => {
    const permissionMap: Partial<Record<MenuKey, string>> = {
      workbench: "page.home", market: "page.marketplace", developer: "page.developer",
      mcpRuntime: "page.developer", guide: "page.guide",
    };
    return [
      { key: "workbench" as const, label: t.workbench, icon: LayoutDashboard },
      { key: "market" as const, label: t.market, icon: ShoppingBag },
      { key: "developer" as const, label: t.developer, icon: Code },
      { key: "mcpRuntime" as const, label: langCode === "ZH" ? "MCP 运行监控" : langCode === "JA" ? "MCP 運用監視" : langCode === "ES" ? "Monitor de Ejecución MCP" : "MCP Runtime", icon: Activity },
      { key: "guide" as const, label: langCode === "ZH" ? "开发者指南" : langCode === "JA" ? "開発者ガイド" : langCode === "ES" ? "Guía de Desarrolladores" : "Developer Guide", icon: BookOpen }
    ].filter(item => sessionUser.permissions.includes(permissionMap[item.key]!));
  }, [t, langCode, sessionUser.permissions]);

  const menuItemsGroup2 = useMemo(() => {
    const permissionMap: Partial<Record<MenuKey, string>> = { audit: "page.audit", settings: "page.members" };
    return [
      { key: "audit" as const, label: langCode === "ZH" ? "发布审核" : langCode === "JA" ? "リリース監査" : langCode === "ES" ? "Control de Auditoría" : "Audit Center", icon: ShieldCheck },
      { key: "settings" as const, label: langCode === "ZH" ? "成员管理" : langCode === "JA" ? "メンバー管理" : langCode === "ES" ? "Gestión de Miembros" : "Member Management", icon: Settings }
    ].filter(item => sessionUser.permissions.includes(permissionMap[item.key]!));
  }, [langCode, sessionUser.permissions]);

  const menuItems = useMemo(() => {
    return [...menuItemsGroup1, ...menuItemsGroup2];
  }, [menuItemsGroup1, menuItemsGroup2]);

  useEffect(() => {
    if (activeMenu !== "profile" && !menuItems.some(item => item.key === activeMenu)) {
      setActiveMenu("workbench");
    }
  }, [activeMenu, menuItems]);

  const currentMenuLabel = activeMenu === "profile" ? t.personalCenter : menuItems.find(item => item.key === activeMenu)?.label || t.workbench;
  const userName = sessionUser.name || "Enterprise Member";

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Filter skills based on search
  const filteredSkills = skillsList.filter(sk => 
    sk.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sk.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sk.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMenuItem = (item: { key: MenuKey; label: string; icon: any }) => {
    const IconComp = item.icon;
    const isActive = activeMenu === item.key;
    const btnContent = (
      <button
        key={item.key}
        onClick={() => setActiveMenu(item.key)}
        className={`w-full h-10 flex items-center gap-2.5 px-3 rounded-lg text-sm font-semibold transition-colors group relative cursor-pointer ${
          isActive 
            ? "bg-sidebar-accent text-sidebar-accent-foreground" 
            : "text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
        }`}
      >
        <IconComp size={16} className={`flex-shrink-0 transition-colors duration-150 ${isActive ? "text-sidebar-accent-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"}`} />
        {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
      </button>
    );

    return isSidebarCollapsed ? (
      <Tooltip key={item.key}>
        <TooltipTrigger asChild>
          {btnContent}
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-neutral-900 text-white border-0 text-xs">
          {item.label}
        </TooltipContent>
      </Tooltip>
    ) : (
      btnContent
    );
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="dashboard-shell-background h-[100dvh] w-screen overflow-hidden text-zinc-900 font-sans p-3 flex gap-3 select-none relative" id="haze-dashboard-container">
        
        {/* 1. Desktop Sidebar Collapsible Panel - Rebuilt in Haze Gallery style */}
        <motion.aside
          animate={{ width: isSidebarCollapsed ? "64px" : "244px" }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          className="h-full flex flex-col justify-between select-none relative z-20 hidden lg:flex rounded-2xl border border-black/[0.06] bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.055)] backdrop-blur-xl overflow-hidden"
        >
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Logo Group */}
            <div className="h-[72px] px-[18px] flex items-center border-b border-black/[0.04]">
              {isSidebarCollapsed ? (
                <span className="font-sans text-xl font-bold tracking-[-0.03em] text-foreground select-none mx-auto">
                  H.
                </span>
              ) : (
                <div className="flex flex-col truncate leading-tight">
                  <span className="font-sans text-xl font-bold tracking-[-0.03em] text-foreground select-none">
                    {t.brandName}
                  </span>
                  <span className="text-xs text-muted-foreground font-sans mt-0.5 whitespace-nowrap">
                    {t.brandSubtitle}
                  </span>
                </div>
              )}
            </div>

            {/* Segmented Navigation Menu with ScrollArea */}
            <ScrollArea className="flex-1 px-3 py-3">
              <nav className="space-y-4">
                <div className="space-y-1">
                  {menuItemsGroup1.map(renderMenuItem)}
                </div>

                {menuItemsGroup2.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="border-t border-black/[0.04] mx-1 my-2" />
                    {!isSidebarCollapsed && (
                      <div className="px-3 py-1 text-xs font-bold text-muted-foreground/50 tracking-wider uppercase text-left">
                        {langCode === "ZH" ? "安全与管理" : langCode === "JA" ? "セキュリティと管理" : langCode === "ES" ? "Seguridad y Gestión" : "Security & Admin"}
                      </div>
                    )}
                    <div className="space-y-1">
                      {menuItemsGroup2.map(renderMenuItem)}
                    </div>
                  </div>
                )}
              </nav>
            </ScrollArea>
          </div>

          {/* Sidebar Footer User Card inside a beautiful Dropdown Menu */}
          <div className="border-t border-black/[0.04] h-[68px] px-3.5 flex items-center bg-transparent">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`w-full flex items-center justify-between py-1 px-1 rounded-xl hover:bg-sidebar-accent transition-colors duration-150 cursor-pointer text-left focus:outline-hidden ${isSidebarCollapsed ? "justify-center" : ""}`}>
                  <div className="flex items-center gap-2.5 truncate">
                    <Avatar className="h-8 w-8 border border-neutral-200/80">
                      {sessionUser.avatar_url && <AvatarImage src={sessionUser.avatar_url} alt={userName} />}
                      <AvatarFallback className="bg-neutral-900 text-white text-xs font-bold">
                        {userName.substring(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {!isSidebarCollapsed && (
                      <div className="truncate flex-1 leading-tight">
                        <p className="text-sm font-medium text-foreground truncate" title={userName}>
                          {userName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate" title={sessionUser.email}>
                          {sessionUser.email}
                        </p>
                      </div>
                    )}
                  </div>
                  {!isSidebarCollapsed && (
                    <MoreHorizontal size={14} className="text-muted-foreground ml-1 flex-shrink-0" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right" className="w-56 border border-border bg-popover text-popover-foreground shadow-md p-1 rounded-xl">
                {/* User Info Header Block inside the Dropdown */}
                <div className="flex items-center gap-2.5 p-2.5 border-b border-black/[0.04] mb-1 leading-normal">
                  <Avatar className="h-8 w-8 border border-neutral-200/80">
                    {sessionUser.avatar_url && <AvatarImage src={sessionUser.avatar_url} alt={userName} />}
                    <AvatarFallback className="bg-neutral-900 text-white text-xs font-bold">
                      {userName.substring(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="truncate flex-1 leading-tight">
                    <p className="text-sm font-medium text-foreground truncate" title={userName}>
                      {userName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate" title={sessionUser.email}>
                      {sessionUser.email}
                    </p>
                  </div>
                </div>

                <DropdownMenuItem onClick={() => { setActiveMenu("profile"); }} className="text-xs text-foreground flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-sidebar-accent font-medium">
                  <User size={14} className="text-muted-foreground" />
                  <span>{t.personalCenter}</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => { setShowDocDrawer(true); }} className="text-xs text-foreground flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-sidebar-accent font-medium">
                  <BookOpen size={14} className="text-muted-foreground" />
                  <span>{t.devGuideDdown}</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onLogout} className="text-xs text-destructive flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-destructive/10 font-medium">
                  <LogOut size={14} className="text-destructive" />
                  <span>{t.logout}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.aside>

        {/* 2. Main Work Area Wrapper Column */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 h-full">

          {/* Top Header Bar */}
          <header className="h-16 shrink-0 rounded-2xl border border-black/[0.06] bg-white/85 px-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl flex items-center justify-between relative z-10">
            
            {/* Left Header Area: Collapsible Mobile burger menu + breadcrumb */}
            <div className="flex items-center gap-3">
              {/* Desktop Sidebar Toggle Trigger */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted hidden lg:flex rounded-xl cursor-pointer justify-center items-center focus:outline-hidden"
                  >
                    <PanelLeft size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-neutral-900 text-white border-0 text-xs">
                  {isSidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
                </TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-4 hidden lg:block bg-black/[0.08]" />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 text-muted-foreground lg:hidden rounded-xl border-black/[0.06] hover:bg-muted bg-white/80">
                    <Menu size={16} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-60 p-0 bg-white flex flex-col justify-between border-r border-border">
                  <div>
                    <div className="h-16 border-b border-black/[0.04] px-5 flex items-center gap-2">
                      <span className="font-sans font-bold text-sm tracking-tight text-foreground">
                        {t.hazeAiHub}
                      </span>
                    </div>
                    <ScrollArea className="h-[calc(100vh-140px)] p-3">
                      <nav className="space-y-4">
                        <div className="space-y-1">
                          {menuItemsGroup1.map((item) => {
                            const IconComp = item.icon;
                            const isActive = activeMenu === item.key;
                            return (
                              <SheetClose asChild key={item.key}>
                                <button
                                  onClick={() => setActiveMenu(item.key)}
                                  className={`w-full flex items-center gap-3 py-2 px-2.5 rounded-lg text-xs font-medium transition-all group relative cursor-pointer ${
                                    isActive 
                                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" 
                                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                                  }`}
                                >
                                  <IconComp size={15} className={`flex-shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                                  <span className="truncate">{item.label}</span>
                                </button>
                              </SheetClose>
                            );
                          })}
                        </div>

                        {menuItemsGroup2.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <div className="border-t border-black/[0.04] mx-1 my-2" />
                            <div className="px-2.5 py-1 text-xs font-bold text-muted-foreground/50 tracking-wider uppercase text-left">
                        {langCode === "ZH" ? "安全与管理" : langCode === "JA" ? "セキュリティと管理" : langCode === "ES" ? "Seguridad y Gestión" : "Security & Admin"}
                            </div>
                            <div className="space-y-1">
                              {menuItemsGroup2.map((item) => {
                                const IconComp = item.icon;
                                const isActive = activeMenu === item.key;
                                return (
                                  <SheetClose asChild key={item.key}>
                                    <button
                                      onClick={() => setActiveMenu(item.key)}
                                      className={`w-full flex items-center gap-3 py-2 px-2.5 rounded-lg text-xs font-medium transition-all group relative cursor-pointer ${
                                        isActive 
                                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold" 
                                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                                      }`}
                                    >
                                      <IconComp size={15} className={`flex-shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                                      <span className="truncate">{item.label}</span>
                                    </button>
                                  </SheetClose>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </nav>
                    </ScrollArea>
                  </div>
                  <div className="border-t border-black/[0.04] p-3 bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <Avatar className="h-8 w-8 border border-neutral-200">
                        {sessionUser.avatar_url && <AvatarImage src={sessionUser.avatar_url} alt={userName} />}
                        <AvatarFallback className="bg-neutral-900 text-white text-xs font-bold">
                          {userName.substring(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="truncate leading-tight">
                        <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{sessionUser.email}</p>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" onClick={onLogout} className="text-muted-foreground hover:text-rose-600 rounded-lg h-8 w-8">
                        <LogOut size={14} />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
 
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-sans">
                <span className="hover:text-foreground transition-colors cursor-pointer hidden sm:inline">
                  {t.hazeAiHub}
                </span>
                <span className="text-black/[0.15] hidden sm:inline">/</span>
                <span className="text-foreground font-medium">{currentMenuLabel}</span>
              </div>
            </div>

            {/* Search Box & Floating Tools Area */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Notification Button backed by DropdownMenu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-muted rounded-xl relative">
                    <Bell size={16} />
                    {notifications.some(n => n.unread) && (
                      <span className="absolute top-2.5 right-2 a-1.5 h-1.5 rounded-full bg-rose-500" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden border border-border shadow-md rounded-xl">
                  <div className="p-3 border-b border-black/[0.04] flex items-center justify-between bg-muted/40 animate-none">
                    <span className="font-semibold text-xs text-foreground">{t.notifCenter}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleMarkAllRead} 
                      className="text-xs text-foreground p-0 h-6 hover:bg-transparent"
                    >
                      {t.markAllRead}
                    </Button>
                  </div>
                  <ScrollArea className="h-60">
                    <div className="py-1">
                      {notifications.map(n => (
                        <div key={n.id} className="p-3 border-b border-black/[0.04] text-left items-start gap-2 block hover:bg-muted/30 transition-colors cursor-default">
                          <div className="flex gap-2">
                            {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                            <div className="flex-1 leading-tight">
                              <p className="text-foreground leading-normal text-xs">{n.text}</p>
                              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </header>

          {/* 3. Workbench Main Scroller Component with Floating Glass Architecture */}
          <main className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-black/[0.06] bg-white/80 shadow-[0_12px_40px_rgba(15,23,42,0.055)] backdrop-blur-xl relative flex flex-col">
            <div className="dashboard-page-content">
              {activeMenu === "workbench" && (
                <Home
                  userName={userName}
                  metrics={metrics}
                  filteredSkills={filteredSkills}
                  recentLogs={recentLogs}
                  todos={todos}
                  setPrefilledPublishType={setPrefilledPublishType}
                  setNewCapType={setNewCapType}
                  setShowPublishModal={setShowPublishModal}
                  setShowDocDrawer={setShowDocDrawer}
                  setActiveMenu={setActiveMenu}
                  searchQuery={searchQuery}
                  langCode={langCode}
                />
              )}
              {activeMenu === "market" && <Market onBackToHome={() => setActiveMenu("workbench")} langCode={langCode} setActiveMenu={(menu) => setActiveMenu(menu as MenuKey)} />}
              {activeMenu === "developer" && <DeveloperCenter onBackToHome={() => setActiveMenu("workbench")} langCode={langCode} />}
              {activeMenu === "mcpRuntime" && <McpRuntime langCode={langCode} />}
              {activeMenu === "audit" && <AuditCenter onBackToHome={() => setActiveMenu("workbench")} langCode={langCode} />}
              {activeMenu === "settings" && <SettingsPage onBackToHome={() => setActiveMenu("workbench")} langCode={langCode} />}
              {activeMenu === "profile" && <PersonalCenter user={sessionUser} onLogout={onLogout} onUserChange={setSessionUser} />}
              {activeMenu === "guide" && <Guide onBackToHome={() => setActiveMenu("workbench")} setActiveMenu={(menu) => setActiveMenu(menu as MenuKey)} />}
            </div>
          </main>

          {/* Custom Sheet: Helper Developer Guidelines Drawer mapping to shadcn Sheet */}
          <GuidelineSheet open={showDocDrawer} onOpenChange={setShowDocDrawer} />

          {/* Custom Dialog: Publish New Capability mapping to shadcn Dialog */}
          <PublishCapabilityDialog
            open={showPublishModal}
            onOpenChange={setShowPublishModal}
            newCapName={newCapName}
            setNewCapName={setNewCapName}
            newCapType={newCapType}
            setNewCapType={setNewCapType}
            newCapDesc={newCapDesc}
            setNewCapDesc={setNewCapDesc}
            newCapAuthor={newCapAuthor}
            setNewCapAuthor={setNewCapAuthor}
            onSubmit={handlePublishSubmit}
          />

        </div>

      </div>
    </TooltipProvider>
  );
}
