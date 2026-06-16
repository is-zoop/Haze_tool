import React, { useMemo } from "react";
import { 
  Sparkles, 
  Cpu, 
  BookOpen, 
  Plus, 
  User,
  ExternalLink,
  History,
  LayoutGrid
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MOCK_HOME_METRICS, 
  MOCK_RECENT_PUBLISHES, 
  MOCK_MY_RECENT_PUBLISHES,
  HomeRecentPublish
} from "../../temp/homeData";
// No i18n imports needed here

interface HomeProps {
  userName: string;
  setPrefilledPublishType: (type: "Skill" | "MCP" | "Tool") => void;
  setNewCapType: (type: "Skill" | "MCP" | "Tool") => void;
  setShowPublishModal: (show: boolean) => void;
  setShowDocDrawer: (show: boolean) => void;
  setActiveMenu: (menu: string) => void;
  searchQuery?: string;
  metrics?: any;
  filteredSkills?: any;
  recentLogs?: any;
  todos?: any;
}

export function Home({
  userName,
  setPrefilledPublishType,
  setNewCapType,
  setShowPublishModal,
  setShowDocDrawer: _setShowDocDrawer,
  setActiveMenu,
  searchQuery = ""
}: HomeProps) {
  // Clean translation of statuses
  const getStatusBadge = (status: HomeRecentPublish["status"]) => {
    switch (status) {
      case "published":
        return <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 bg-emerald-500/10 text-xs py-0 px-2 font-medium">已发布</Badge>;
      case "reviewing":
        return <Badge variant="outline" className="border-amber-500/20 text-amber-600 bg-amber-500/10 text-xs py-0 px-2 font-medium">待审核</Badge>;
      case "draft":
        return <Badge variant="secondary" className="text-xs py-0 px-2 font-medium">草稿</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="text-xs py-0 px-2 font-medium">已拒绝</Badge>;
      case "offline":
        return <Badge variant="outline" className="text-muted-foreground text-xs py-0 px-2 font-medium">已下线</Badge>;
      default:
        return null;
    }
  };

  // Safe search filtering for homepage dashboard view
  const filteredRecentPublishes = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_RECENT_PUBLISHES;
    const query = searchQuery.toLowerCase().trim();
    return MOCK_RECENT_PUBLISHES.filter(
      p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredMyPublishes = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_MY_RECENT_PUBLISHES;
    const query = searchQuery.toLowerCase().trim();
    return MOCK_MY_RECENT_PUBLISHES.filter(
      p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="dashboard-page-stack" id="haze-home-page-container">
      <motion.div
        key="workbench-content-v1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        className="grid h-full min-h-0 grid-rows-[auto_auto_auto_minmax(0,1fr)] gap-4"
      >
        {/* 1. Welcome Header Jumbotron with soft corporate styling */}
        <Card className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between relative shrink-0">
          <div className="space-y-1 text-left w-full sm:max-w-2xl">
            <h2 className="text-sm sm:text-base font-bold tracking-tight text-foreground leading-normal">
              欢迎回来，<span className="text-primary">{userName}</span>
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
              企业内部 Skill 与 MCP 自动发现、发布、分享平台。企业成员可在能力市场发现高价值 Skill 与 MCP 节点，并在开发者中心轻松上传或连接。
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
            <Button 
              onClick={() => {
                setPrefilledPublishType("Skill");
                setNewCapType("Skill");
                setShowPublishModal(true);
              }}
              size="sm"
              className="font-medium flex-1 sm:flex-initial h-8.5 cursor-pointer"
            >
              <Plus size={13} className="mr-1" />
              <span>上传 Skill / 注册 MCP</span>
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setActiveMenu("guide")}
              className="font-medium h-8.5 cursor-pointer"
            >
              <BookOpen size={13} className="mr-1" />
              <span>开发指南</span>
            </Button>
          </div>
        </Card>

        {/* 2. Grid Dashboard Metrics - Clean & Concise V1 metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          {/* Skill Count */}
          <Card className="p-3.5 flex flex-col justify-between h-[96px] text-left">
            <div className="flex items-center justify-between space-y-0 text-muted-foreground">
              <span className="text-xs font-medium">Skill 总数</span>
              <Sparkles size={14} className="text-muted-foreground/60" />
            </div>
            <div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {MOCK_HOME_METRICS.skillsCount}
                </span>
                <span className="text-xs text-muted-foreground font-medium ml-1">个可用</span>
              </div>
              <p className="text-xs text-muted-foreground/85 leading-none mt-1">智能分析与自动成稿模块已就绪</p>
            </div>
          </Card>

          {/* MCP Server Count */}
          <Card className="p-3.5 flex flex-col justify-between h-[96px] text-left">
            <div className="flex items-center justify-between space-y-0 text-muted-foreground">
              <span className="text-xs font-medium">MCP Server</span>
              <Cpu size={14} className="text-muted-foreground/60" />
            </div>
            <div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {MOCK_HOME_METRICS.mcpCount}
                </span>
                <span className="text-xs text-muted-foreground font-medium ml-1">个节点</span>
              </div>
              <p className="text-xs text-muted-foreground/85 leading-none mt-1">覆盖数据库、沙箱文件等上下文</p>
            </div>
          </Card>

          {/* Recent Publish Count */}
          <Card className="p-3.5 flex flex-col justify-between h-[96px] text-left">
            <div className="flex items-center justify-between space-y-0 text-muted-foreground">
              <span className="text-xs font-medium">最近发布数量</span>
              <History size={14} className="text-muted-foreground/60" />
            </div>
            <div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {MOCK_HOME_METRICS.recentPublishCount}
                </span>
                <span className="text-xs text-muted-foreground font-medium ml-1">项新增</span>
              </div>
              <p className="text-xs text-muted-foreground/85 leading-none mt-1">本月新增上线的 AI 生成能力</p>
            </div>
          </Card>

          {/* My Publish Count */}
          <Card className="p-3.5 flex flex-col justify-between h-[96px] text-left">
            <div className="flex items-center justify-between space-y-0 text-muted-foreground">
              <span className="text-xs font-medium">我的发布数量</span>
              <User size={14} className="text-muted-foreground/60" />
            </div>
            <div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {MOCK_HOME_METRICS.myPublishCount}
                </span>
                <span className="text-xs text-muted-foreground font-medium ml-1">项提交</span>
              </div>
              <p className="text-xs text-muted-foreground/85 leading-none mt-1">我创建的能力已成功部署生效</p>
            </div>
          </Card>
        </div>

        {/* 3. Quick Entrances Row */}
        <div className="flex flex-col gap-2 shrink-0">
          <h3 className="text-xs font-semibold text-muted-foreground pl-1 flex items-center gap-1.5 text-left">
            <LayoutGrid size={13} className="text-muted-foreground/60" />
            <span>快捷入口</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Card 
              className="flex items-center gap-4 p-3.5 hover:bg-accent/50 text-left cursor-pointer group transition-all h-[76px]"
              onClick={() => {
                setPrefilledPublishType("Skill");
                setNewCapType("Skill");
                setShowPublishModal(true);
              }}
            >
              <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-150">
                <Sparkles size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground">快捷上传 Skill</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-normal truncate font-normal">编写精美描述及 SKILL.md 发布使用协议</p>
              </div>
            </Card>

            <Card 
              className="flex items-center gap-4 p-3.5 hover:bg-accent/50 text-left cursor-pointer group transition-all h-[76px]"
              onClick={() => {
                setPrefilledPublishType("MCP");
                setNewCapType("MCP");
                setShowPublishModal(true);
              }}
            >
              <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-150">
                <Cpu size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground">快捷注册 MCP Server</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-normal truncate font-normal">指定 STDIO/HTTP 命令与自动探测 Tools 节点</p>
              </div>
            </Card>
          </div>
        </div>

        {/* 4. Split panel list view: Recent publishes & My recent publishes */}
        <div className="grid min-h-0 grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Left: Recent Publishes List */}
          <Card className="flex h-full min-h-0 flex-col overflow-hidden shadow-xs border-border bg-card">
            <CardHeader className="shrink-0 p-4 pb-3 flex flex-row items-center justify-between border-b">
              <CardTitle className="text-xs font-bold text-foreground tracking-tight flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary animate-pulse" />
                <span>最近发布的能力</span>
              </CardTitle>
              <Badge variant="outline" className="text-xs font-medium border-border text-muted-foreground bg-muted">全平台动态</Badge>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-hidden p-0 relative">
              <ScrollArea className="h-full w-full">
                <div className="p-4 space-y-3">
                  {filteredRecentPublishes.map((pub) => (
                    <div 
                      key={pub.id} 
                      onClick={() => setActiveMenu("market")}
                      className="group flex flex-col justify-between p-3.5 bg-muted/40 border border-border/60 hover:bg-muted/85 hover:border-border hover:shadow-2xs transition-all duration-150 rounded-xl text-left cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{pub.name}</span>
                            <Badge className={`text-xs px-1.5 py-0 font-medium ${pub.type === "Skill" ? "bg-primary/10 text-primary border-0" : "bg-indigo-550/10 text-indigo-600 border-0"}`}>
                              {pub.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-normal leading-normal">{pub.description}</p>
                        </div>
                        {getStatusBadge(pub.status)}
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-normal">上传者: <b className="text-foreground font-semibold">{pub.author}</b></span>
                        <div className="flex items-center gap-1.5 text-primary font-semibold group-hover:underline">
                          <span>去市场查看</span>
                          <ExternalLink size={10} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredRecentPublishes.length === 0 && (
                    <div className="text-center py-12 text-xs text-muted-foreground font-normal">暂无满足筛选的能力</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right: My Recent Publishes List */}
          <Card className="flex h-full min-h-0 flex-col overflow-hidden shadow-xs border-border bg-card">
            <CardHeader className="shrink-0 p-4 pb-3 flex flex-row items-center justify-between border-b">
              <CardTitle className="text-xs font-bold text-foreground tracking-tight flex items-center gap-1.5">
                <User size={14} className="text-primary" />
                <span>我的最近发布</span>
              </CardTitle>
              <Button 
                variant="ghost" 
                onClick={() => setActiveMenu("developer")} 
                className="h-6 p-0 px-2 text-xs text-muted-foreground font-medium hover:bg-accent rounded-md cursor-pointer"
              >
                进入管理中心
              </Button>
            </CardHeader>
            <CardContent className="min-h-0 flex-1 overflow-hidden p-0 relative">
              <ScrollArea className="h-full w-full">
                <div className="p-4 space-y-3">
                  {filteredMyPublishes.map((pub) => (
                    <div 
                      key={pub.id} 
                      onClick={() => setActiveMenu("developer")}
                      className="group flex flex-col justify-between p-3.5 bg-muted/40 border border-border/60 hover:bg-muted/85 hover:border-border hover:shadow-2xs transition-all duration-150 rounded-xl text-left cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{pub.name}</span>
                            <Badge className={`text-xs px-1.5 py-0 font-medium ${pub.type === "Skill" ? "bg-primary/10 text-primary border-0" : "bg-indigo-550/10 text-indigo-600 border-0"}`}>
                              {pub.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-normal leading-normal">{pub.description}</p>
                        </div>
                        {getStatusBadge(pub.status)}
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-normal">{pub.time}</span>
                        <div className="flex items-center gap-1 text-primary font-semibold group-hover:underline">
                          <span>编辑/测试</span>
                          <ExternalLink size={10} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredMyPublishes.length === 0 && (
                    <div className="text-center py-12 text-xs text-muted-foreground font-normal">尚未发布个人能力</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
