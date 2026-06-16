import React, { Fragment, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Clock3,
  Copy,
  Cpu,
  Database,
  FileText,
  Filter,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CUSTOM_CATEGORIES } from "../../temp/sharedOptions";
import { MOCK_MARKETPLACE_SKILLS } from "../../temp/marketplaceSkills";
import { MOCK_MARKETPLACE_MCP_SERVERS } from "../../temp/marketplaceMcpServers";
import { CapabilityItem, PermissionStatus, RiskLevel, RunningStatus } from "../../types/capability";

interface MarketPageProps {
  onBackToHome: () => void;
  langCode?: "ZH" | "EN" | "JA" | "ES";
  setActiveMenu?: (menu: string) => void;
}

type TypeTab = "all" | "Skill" | "MCP";
type MarketItem = CapabilityItem & { isMcp: boolean };

const CATEGORY_LABELS: Record<string, string> = {
  all: "全部能力",
  analytics: "数据分析",
  dev: "软件开发",
  office: "企业办公",
  sales: "电商运营",
  finance: "财务",
  hr: "人力资源",
  knowledge: "知识检索",
  workflow: "流程协作",
};

const DISPLAY_COPY: Record<string, { name: string; description: string; author: string; department: string; tags: string[] }> = {
  sk_1: {
    name: "销售日报自动分析",
    description: "汇总全渠道销售数据，自动生成异动归因、趋势预测、高潜商品与运营建议。",
    author: "数据科学部",
    department: "数据科学部",
    tags: ["数据分析", "电商运营", "自动化"],
  },
  sk_2: {
    name: "企业知识检索助手",
    description: "快速检索制度、福利标准、技术白皮书，并输出带来源引用的可信答复。",
    author: "信息安全部",
    department: "行政与安全部",
    tags: ["知识检索", "企业办公", "制度问答"],
  },
  sk_3: {
    name: "行业研报深度分析",
    description: "解析长篇研报与多格式材料，提炼估值区间、竞争格局和投资判断。",
    author: "战略规划部",
    department: "战略规划部",
    tags: ["数据分析", "财务", "决策辅助"],
  },
  mcp_1: {
    name: "企业数据中心 MCP",
    description: "提供受控 SQL 查询、数据实体导出、Schema 元数据检索等企业数据访问能力。",
    author: "王磊 (Leo)",
    department: "企业架构部",
    tags: ["数据中心", "SQL", "安全连接"],
  },
  mcp_2: {
    name: "受控文件系统沙箱 MCP",
    description: "隔离本地文件夹结构，为模型提供安全文件读取、索引和全文检索能力。",
    author: "刘洋 (Alex)",
    department: "安全实验室",
    tags: ["文件系统", "沙箱", "本地驱动"],
  },
};

const STATUS_META: Record<RunningStatus, { label: string; className: string }> = {
  active: { label: "运行中", className: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
  warning: { label: "告警", className: "bg-amber-500/10 text-amber-700 border-amber-200" },
  maintenance: { label: "维护中", className: "bg-sky-500/10 text-sky-700 border-sky-200" },
  inactive: { label: "已停用", className: "bg-zinc-500/10 text-zinc-600 border-zinc-200" },
};

const PERMISSION_META: Record<PermissionStatus, { label: string; className: string }> = {
  direct: { label: "可直接使用", className: "text-emerald-700 bg-emerald-50" },
  granted: { label: "已授权", className: "text-blue-700 bg-blue-50" },
  need_apply: { label: "需申请", className: "text-amber-700 bg-amber-50" },
  pending: { label: "审核中", className: "text-violet-700 bg-violet-50" },
  expired: { label: "已过期", className: "text-rose-700 bg-rose-50" },
};

const RISK_META: Record<RiskLevel, { label: string; className: string }> = {
  low: { label: "低风险", className: "text-emerald-700" },
  medium: { label: "中风险", className: "text-amber-700" },
  high: { label: "高风险", className: "text-rose-700" },
};

const formatCalls = (calls: number) => {
  if (calls >= 10000) return `${(calls / 10000).toFixed(1)}w`;
  if (calls >= 1000) return `${(calls / 1000).toFixed(1)}k`;
  return String(calls);
};

const getCopy = (item: CapabilityItem) => DISPLAY_COPY[item.id] ?? {
  name: item.name,
  description: item.description,
  author: item.author,
  department: item.department,
  tags: item.tags ?? [],
};

const getCategoryLabel = (categoryId: string) => CATEGORY_LABELS[categoryId] ?? categoryId;

const textContains = (value: string | undefined, query: string) => {
  return value?.toLowerCase().includes(query) ?? false;
};

export function Market({
  onBackToHome: _onBackToHome,
  langCode: _langCode = "ZH",
  setActiveMenu: _setActiveMenu,
}: MarketPageProps) {
  const [skills, setSkills] = useState<CapabilityItem[]>(MOCK_MARKETPLACE_SKILLS);
  const [mcps, setMcps] = useState<CapabilityItem[]>(MOCK_MARKETPLACE_MCP_SERVERS);
  const [activeTypeTab, setActiveTypeTab] = useState<TypeTab>("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showRecentlyUsedOnly, setShowRecentlyUsedOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const allItems = useMemo<MarketItem[]>(() => {
    return [
      ...skills.map((item) => ({ ...item, isMcp: false })),
      ...mcps.map((item) => ({ ...item, isMcp: true })),
    ];
  }, [skills, mcps]);

  const categoryMatches = (item: MarketItem, categoryId: string) => {
    if (categoryId === "all") return true;
    const sourceCategory = CUSTOM_CATEGORIES.find((category) => category.id === categoryId);
    const categoryLabel = CATEGORY_LABELS[categoryId];
    return item.tags?.some((tag) => (
      tag.toLowerCase() === categoryId.toLowerCase()
      || tag === sourceCategory?.zh
      || tag === sourceCategory?.en
      || tag === categoryLabel
      || DISPLAY_COPY[item.id]?.tags.includes(categoryLabel)
    )) ?? false;
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allItems.filter((item) => {
      const display = getCopy(item);

      if (activeTypeTab === "Skill" && item.isMcp) return false;
      if (activeTypeTab === "MCP" && !item.isMcp) return false;
      if (showFavoritesOnly && !item.isFavorite) return false;
      if (showRecentlyUsedOnly && item.calls < 1000) return false;
      if (!categoryMatches(item, selectedCategory)) return false;

      if (!query) return true;

      return [
        item.name,
        item.description,
        item.author,
        item.department,
        display.name,
        display.description,
        display.author,
        display.department,
        ...(item.tags ?? []),
        ...display.tags,
      ].some((value) => textContains(value, query));
    });
  }, [allItems, activeTypeTab, selectedCategory, searchQuery, showFavoritesOnly, showRecentlyUsedOnly]);

  const marketStats = useMemo(() => {
    const favoriteCount = allItems.filter((item) => item.isFavorite).length;
    return { favoriteCount };
  }, [allItems]);

  const categoryCounts = useMemo(() => {
    return CUSTOM_CATEGORIES.reduce<Record<string, number>>((acc, category) => {
      acc[category.id] = allItems.filter((item) => categoryMatches(item, category.id)).length;
      return acc;
    }, {});
  }, [allItems]);

  const activeFilterCount = [
    selectedCategory !== "all",
    showFavoritesOnly,
    showRecentlyUsedOnly,
    Boolean(searchQuery.trim()),
  ].filter(Boolean).length;

  const toggleFavorite = (itemId: string, isMcp: boolean) => {
    if (isMcp) {
      setMcps((prev) => prev.map((item) => (
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )));
    } else {
      setSkills((prev) => prev.map((item) => (
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )));
    }

    setSelectedItem((prev) => (
      prev?.id === itemId ? { ...prev, isFavorite: !prev.isFavorite } : prev
    ));
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setShowFavoritesOnly(false);
    setShowRecentlyUsedOnly(false);
  };

  const handleCopyConfig = (item: MarketItem) => {
    const configObj = item.isMcp
      ? {
          mcpServers: {
            [getCopy(item).name.replace(/\s+/g, "-").toLowerCase()]: {
              command: item.connectType === "STDIO/Process" ? "npx" : "node",
              args: ["@haze-mcp/connector", "--server-url", item.id],
              env: {
                HAZE_API_KEY: "SEC_SECRET_REF",
              },
            },
          },
        }
      : {
          skillId: item.id,
          name: getCopy(item).name,
          instructions: item.scenarios || [],
          version: item.version,
        };

    navigator.clipboard.writeText(JSON.stringify(configObj, null, 2));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 1500);
  };

  return (
    <div className="dashboard-page-stack h-full overflow-hidden" id="haze-market-page-container">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-slate-50">
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[232px_1fr]">
          <aside className="hidden min-h-0 border-r border-border/70 bg-white/90 p-3 lg:flex lg:flex-col">
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <p className="text-xs font-bold text-slate-900">筛选器</p>
                <p className="text-[10px] text-muted-foreground">{activeFilterCount ? `${activeFilterCount} 个条件已启用` : "快速定位能力"}</p>
              </div>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]" onClick={clearFilters}>
                  清空
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Button
                variant={showFavoritesOnly ? "accent" : "ghost"}
                className="h-9 w-full justify-between px-2"
                onClick={() => {
                  setShowFavoritesOnly((prev) => !prev);
                  setShowRecentlyUsedOnly(false);
                }}
              >
                <span className="flex items-center gap-2">
                  <Star className={cn("h-3.5 w-3.5", showFavoritesOnly && "fill-current")} />
                  我的收藏
                </span>
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                  {marketStats.favoriteCount}
                </Badge>
              </Button>

              <Button
                variant={showRecentlyUsedOnly ? "accent" : "ghost"}
                className="h-9 w-full justify-between px-2"
                onClick={() => {
                  setShowRecentlyUsedOnly((prev) => !prev);
                  setShowFavoritesOnly(false);
                }}
              >
                <span className="flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5" />
                  高频使用
                </span>
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                  {allItems.filter((item) => item.calls >= 1000).length}
                </Badge>
              </Button>
            </div>

            <Separator className="my-3" />

            <ScrollArea className="min-h-0 flex-1 pr-1">
              <div className="space-y-1">
                <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  业务分类
                </p>
                {CUSTOM_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex h-8 w-full items-center justify-between rounded-lg px-2 text-left text-xs font-semibold transition-colors",
                      selectedCategory === category.id
                        ? "bg-slate-950 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <span className="truncate">{getCategoryLabel(category.id)}</span>
                    <span className={cn(
                      "ml-2 rounded-full px-1.5 py-0 text-[10px]",
                      selectedCategory === category.id ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
                    )}>
                      {categoryCounts[category.id] ?? 0}
                    </span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </aside>

          <main className="flex min-h-0 flex-col overflow-hidden bg-white">
            <div className="border-b border-border/70 bg-white p-3">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <Tabs value={activeTypeTab} onValueChange={(value) => setActiveTypeTab(value as TypeTab)} className="w-full xl:w-[390px]">
                  <TabsList className="h-10 rounded-lg bg-slate-100">
                    <TabsTrigger value="all">全部</TabsTrigger>
                    <TabsTrigger value="Skill" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      Skill
                    </TabsTrigger>
                    <TabsTrigger value="MCP" className="gap-1">
                      <Cpu className="h-3 w-3" />
                      MCP
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto">
                  <div className="relative w-full sm:min-w-[340px]">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="搜索能力、标签、作者或部门"
                      className="h-10 rounded-lg bg-slate-50 pl-9 text-xs"
                    />
                  </div>
                  <Button variant="outline" className="h-10 justify-start gap-2 lg:hidden" onClick={() => setSelectedCategory("all")}>
                    <Filter className="h-3.5 w-3.5" />
                    {getCategoryLabel(selectedCategory)}
                  </Button>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-medium text-muted-foreground">当前条件</span>
                  {selectedCategory !== "all" && (
                    <FilterPill label={`分类: ${getCategoryLabel(selectedCategory)}`} onClear={() => setSelectedCategory("all")} />
                  )}
                  {showFavoritesOnly && <FilterPill label="只看收藏" onClear={() => setShowFavoritesOnly(false)} />}
                  {showRecentlyUsedOnly && <FilterPill label="高频使用" onClear={() => setShowRecentlyUsedOnly(false)} />}
                  {searchQuery && <FilterPill label={`搜索: ${searchQuery}`} onClear={() => setSearchQuery("")} />}
                </div>
              )}
            </div>

            <ScrollArea className="min-h-0 flex-1 bg-slate-50/70">
              <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2 2xl:grid-cols-3">
                {filteredItems.map((item) => {
                  const display = getCopy(item);
                  const status = STATUS_META[item.status];
                  const permission = PERMISSION_META[item.permissionsStatus];
                  const risk = RISK_META[item.riskLevel];

                  return (
                    <Card
                      key={item.id}
                      className="group flex min-h-[218px] flex-col overflow-hidden rounded-lg border-slate-200 bg-white shadow-none transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                    >
                      <CardHeader className="space-y-3 p-4 pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <span className={cn(
                              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                              item.isMcp ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-blue-700"
                            )}>
                              {item.isMcp ? <Cpu className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                            </span>
                            <div className="min-w-0">
                              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                                <CardTitle className="truncate text-sm leading-5">{display.name}</CardTitle>
                                <Badge variant="outline" className={cn("h-5 px-1.5 text-[10px]", item.isMcp ? "text-violet-700" : "text-blue-700")}>
                                  {item.isMcp ? "MCP" : "Skill"}
                                </Badge>
                              </div>
                              <CardDescription className="line-clamp-2 leading-5">
                                {display.description}
                              </CardDescription>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => toggleFavorite(item.id, item.isMcp)}
                            aria-label={item.isFavorite ? "取消收藏" : "收藏"}
                          >
                            <Star className={cn("h-4 w-4", item.isFavorite && "fill-amber-400 text-amber-500")} />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {display.tags.slice(0, 3).map((tag) => (
                            <Fragment key={tag}>
                              <Badge variant="secondary" className="h-5 rounded-md px-1.5 text-[10px] text-slate-600">
                                {tag}
                              </Badge>
                            </Fragment>
                          ))}
                        </div>
                      </CardHeader>

                      <CardContent className="mt-auto p-4 pt-0">
                        <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2">
                          <MiniMetric label="调用" value={formatCalls(item.calls)} />
                          <MiniMetric label="风险" value={risk.label} valueClassName={risk.className} />
                          <MiniMetric label="版本" value={item.version} />
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="min-w-0 text-[11px] leading-4 text-muted-foreground">
                            <p className="truncate font-semibold text-slate-700">{display.author}</p>
                            <p className="truncate">{display.department}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={cn("hidden h-6 rounded-md px-2 text-[10px] sm:inline-flex", permission.className)}>
                              {permission.label}
                            </Badge>
                            <Button
                              size="sm"
                              className="h-8 px-3"
                              onClick={() => {
                                setCopiedText(false);
                                setSelectedItem(item);
                              }}
                            >
                              查看
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <span className={cn("h-2 w-2 rounded-full", status.className.includes("emerald") ? "bg-emerald-500" : status.className.includes("amber") ? "bg-amber-500" : "bg-sky-500")} />
                          <span className="text-[10px] font-medium text-muted-foreground">{status.label}</span>
                          <span className="text-[10px] text-muted-foreground">更新于 {item.updateTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {filteredItems.length === 0 && (
                  <Card className="col-span-full rounded-lg border-dashed bg-white shadow-none">
                    <CardContent className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
                      <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <AlertCircle className="h-5 w-5" />
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">没有找到匹配的能力</h3>
                      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                        尝试减少筛选条件，或换一个更宽泛的关键词。
                      </p>
                      <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                        清空筛选
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </main>
        </div>
      </div>

      <Sheet open={Boolean(selectedItem)} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
          {selectedItem && (
            <CapabilitySheet
              item={selectedItem}
              copiedText={copiedText}
              onCopy={() => handleCopyConfig(selectedItem)}
              onFavorite={() => toggleFavorite(selectedItem.id, selectedItem.isMcp)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function FilterPill({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <Badge variant="outline" className="gap-1 rounded-md bg-white px-2 py-1 text-[11px]">
      {label}
      <button type="button" onClick={onClear} className="rounded-full text-muted-foreground hover:text-rose-600">
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

function MiniMetric({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={cn("truncate text-xs font-bold text-slate-900", valueClassName)}>{value}</p>
    </div>
  );
}

function CapabilitySheet({
  item,
  copiedText,
  onCopy,
  onFavorite,
}: {
  item: MarketItem;
  copiedText: boolean;
  onCopy: () => void;
  onFavorite: () => void;
}) {
  const display = getCopy(item);
  const permission = PERMISSION_META[item.permissionsStatus];
  const risk = RISK_META[item.riskLevel];

  return (
    <>
      <SheetHeader className="border-b border-border bg-white p-5 pr-12">
        <div className="flex items-start gap-3">
          <span className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            item.isMcp ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-blue-700"
          )}>
            {item.isMcp ? <Cpu className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <SheetTitle className="text-sm normal-case tracking-tight text-slate-950">
                {display.name}
              </SheetTitle>
              <Badge variant="outline" className={cn("h-6 px-2 text-[10px]", permission.className)}>
                {permission.label}
              </Badge>
            </div>
            <SheetDescription className="mt-1 leading-5">
              {display.description}
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <ScrollArea className="min-h-0 flex-1 bg-slate-50/70">
        <div className="space-y-3 p-4">
          <Card className="rounded-lg bg-white shadow-none">
            <CardContent className="grid grid-cols-2 gap-3 p-4 text-xs">
              <InfoCell label="负责人" value={display.author} />
              <InfoCell label="归属部门" value={display.department} />
              <InfoCell label="版本" value={item.version} />
              <InfoCell label="更新时间" value={item.updateTime} />
              <InfoCell label="累计调用" value={`${item.calls} 次`} />
              <InfoCell label="风险等级" value={risk.label} valueClassName={risk.className} />
            </CardContent>
          </Card>

          <Card className="rounded-lg bg-white shadow-none">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                能力标签
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5 p-4 pt-0">
              {display.tags.map((tag) => (
                <Fragment key={tag}>
                  <Badge variant="secondary" className="rounded-md text-[10px]">
                    {tag}
                  </Badge>
                </Fragment>
              ))}
            </CardContent>
          </Card>

          {!item.isMcp ? <SkillDetails item={item} /> : <McpDetails item={item} onCopy={onCopy} copiedText={copiedText} />}
        </div>
      </ScrollArea>

      <SheetFooter className="border-t border-border bg-white p-4">
        <Button variant="outline" onClick={onFavorite} className="w-full sm:w-auto">
          <Star className={cn("h-3.5 w-3.5", item.isFavorite && "fill-amber-400 text-amber-500")} />
          {item.isFavorite ? "取消收藏" : "收藏"}
        </Button>
        <Button onClick={onCopy} className="w-full sm:w-auto">
          {copiedText ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copiedText ? "已复制" : item.isMcp ? "复制接入配置" : "复制 Skill 配置"}
        </Button>
      </SheetFooter>
    </>
  );
}

function InfoCell({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-slate-50 p-3">
      <p className="text-[10px] font-medium text-muted-foreground">{label}</p>
      <p className={cn("mt-1 truncate font-bold text-slate-900", valueClassName)}>{value}</p>
    </div>
  );
}

function SkillDetails({ item }: { item: MarketItem }) {
  return (
    <div className="space-y-3">
      <Card className="rounded-lg bg-white shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-xs">
            <Terminal className="h-3.5 w-3.5 text-blue-600" />
            输入示例
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <pre className="max-h-32 overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100">
            {item.inputExample || "暂无输入示例"}
          </pre>
        </CardContent>
      </Card>

      <Card className="rounded-lg bg-white shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-xs">
            <FileText className="h-3.5 w-3.5 text-emerald-600" />
            适用场景
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-4 pt-0">
          {(item.scenarios ?? []).slice(0, 4).map((scenario, index) => (
            <div key={`${scenario}-${index}`} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              {scenario}
            </div>
          ))}
          {(!item.scenarios || item.scenarios.length === 0) && (
            <p className="text-xs text-muted-foreground">暂无场景说明。</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function McpDetails({
  item,
  onCopy,
  copiedText,
}: {
  item: MarketItem;
  onCopy: () => void;
  copiedText: boolean;
}) {
  return (
    <div className="space-y-3">
      <Card className="rounded-lg bg-white shadow-none">
        <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-xs">
            <Database className="h-3.5 w-3.5 text-violet-600" />
            MCP 能力概览
          </CardTitle>
          <Button variant="outline" size="sm" className="h-7" onClick={onCopy}>
            {copiedText ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copiedText ? "已复制" : "复制"}
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-2 p-4 pt-0">
          <InfoCell label="Tools" value={String(item.toolsCount ?? item.toolsList?.length ?? 0)} />
          <InfoCell label="Resources" value={String(item.resourcesCount ?? item.resourcesList?.length ?? 0)} />
          <InfoCell label="延迟" value={item.avgResponseTime ?? "-"} />
        </CardContent>
      </Card>

      <Card className="rounded-lg bg-white shadow-none">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-xs">
            <Lock className="h-3.5 w-3.5 text-slate-600" />
            已发现工具
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-4 pt-0">
          {(item.toolsList ?? []).map((tool) => (
            <div key={tool.name} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <code className="rounded bg-white px-1.5 py-0.5 text-[11px] font-bold text-slate-900">{tool.name}</code>
                <Badge variant={tool.isReadonly ? "success" : "warning"} className="text-[10px]">
                  {tool.isReadonly ? "只读" : "写入"}
                </Badge>
              </div>
              <p className="text-[11px] leading-5 text-muted-foreground">{tool.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
