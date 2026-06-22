import { Fragment, useMemo, useState, useEffect } from "react";
import {
  BookOpen,
  Check,
  Clock3,
  Copy,
  Cpu,
  Database,
  Eye,
  FileText,
  Lock,
  Rocket,
  Search,
  Sparkles,
  Star,
  Terminal,
  X,
  LayoutGrid,
  List,
  MoreVertical,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UnifiedTabs, TabItem } from "@/components/UnifiedTabs";
import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getI18n } from "../../i18n";
import { CUSTOM_CATEGORIES } from "../../temp/sharedOptions";
import { MOCK_MARKETPLACE_SKILLS } from "../../temp/marketplaceSkills";
import { MOCK_MARKETPLACE_MCP_SERVERS } from "../../temp/marketplaceMcpServers";
import {
  DEFAULT_MARKETPLACE_README,
  MARKETPLACE_README_BY_ID,
} from "../../temp/marketplaceReadmeData";
import { CapabilityItem } from "../../types/capability";
import { PageHeader } from "../../components/common/PageHeader";
import { DataTableFooter } from "../../components/common/DataTableFooter";
import { EmptyState } from "../../components/common/EmptyState";

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

const getCopy = (item: MarketItem | CapabilityItem) => {
  return DISPLAY_COPY[item.id] || {
    name: item.name,
    description: item.description,
    author: item.author,
    department: item.department,
    tags: item.tags || [],
  };
};

const textContains = (text?: string, query?: string) => {
  if (!text || !query) return false;
  return text.toLowerCase().includes(query.toLowerCase());
};

const formatCalls = (calls: number) => {
  if (calls >= 1000) {
    return `${(calls / 1000).toFixed(1)}k`;
  }
  return String(calls);
};

const getCategoryLabel = (categoryId: string, langCode: string) => {
  const translations: Record<string, Record<string, string>> = {
    all: { ZH: "全部能力", JA: "すべての能力", ES: "Todas", EN: "All Capabilities" },
    analytics: { ZH: "数据分析", JA: "データ分析", ES: "Análisis de datos", EN: "Data Analytics" },
    dev: { ZH: "软件开发", JA: "ソフトウェア開発", ES: "Desarrollo de Software", EN: "Software Development" },
    office: { ZH: "企业办公", JA: "ビジネスオフィス", ES: "Oficina empresarial", EN: "Enterprise Office" },
    sales: { ZH: "电商运营", JA: "EC運営", ES: "Operaciones de comercio", EN: "E-Commerce" },
  };
  return translations[categoryId]?.[langCode] || CATEGORY_LABELS[categoryId] || categoryId;
};

type SheetMode = "details" | "quickStart" | "readme";

export function Market({
  onBackToHome: _onBackToHome,
  langCode: _langCode = "ZH",
  setActiveMenu: _setActiveMenu,
}: MarketPageProps) {
  const t = getI18n(_langCode);
  const [skills, setSkills] = useState<CapabilityItem[]>(MOCK_MARKETPLACE_SKILLS);
  const [mcps, setMcps] = useState<CapabilityItem[]>(MOCK_MARKETPLACE_MCP_SERVERS);
  const [activeTypeTab, setActiveTypeTab] = useState<TypeTab>("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showRecentlyUsedOnly, setShowRecentlyUsedOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [sheetMode, setSheetMode] = useState<SheetMode>("details");
  const [copiedText, setCopiedText] = useState(false);

  // Read preferred view mode from localStorage
  const [viewMode, setViewMode] = useState<"card" | "table">(() => {
    const saved = localStorage.getItem("haze_market_view_mode");
    return saved === "table" ? "table" : "card";
  });

  // Sort parameter state
  const [sortBy, setSortBy] = useState<string>("recommend");

  const marketTabs: TabItem[] = [
    {
      value: "all",
      label: t.all,
    },
    {
      value: "Skill",
      label: "Skill",
    },
    {
      value: "MCP",
      label: "MCP",
    },
  ];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

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
      || (DISPLAY_COPY[item.id]?.tags?.includes(categoryLabel) ?? false)
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

  // Sort logic applied on filtered items
  const sortedAndFilteredItems = useMemo(() => {
    const items = [...filteredItems];
    if (sortBy === "calls") {
      items.sort((a, b) => b.calls - a.calls);
    } else if (sortBy === "updated") {
      items.sort((a, b) => b.updateTime.localeCompare(a.updateTime));
    } else if (sortBy === "newest") {
      items.sort((a, b) => b.id.localeCompare(a.id));
    }
    return items;
  }, [filteredItems, sortBy]);

  // Handle current page items mapping
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedAndFilteredItems.slice(start, start + pageSize);
  }, [sortedAndFilteredItems, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(sortedAndFilteredItems.length / pageSize));
  }, [sortedAndFilteredItems, pageSize]);

  // Resets the current page back to 1 if filter arguments change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, activeTypeTab, showFavoritesOnly, showRecentlyUsedOnly, sortBy]);

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

  const openCapabilitySheet = (item: MarketItem, mode: SheetMode) => {
    setCopiedText(false);
    setSheetMode(mode);
    setSelectedItem(item);
  };

  const handleViewModeChange = (mode: "card" | "table") => {
    setViewMode(mode);
    localStorage.setItem("haze_market_view_mode", mode);
  };

  return (
    <div className="dashboard-page-stack h-full overflow-hidden animate-in fade-in duration-300 flex flex-col gap-3" id="haze-market-page-container">
      <PageHeader 
        title={t.marketTitle} 
        description={t.marketDesc} 
        breadcrumbs={[_langCode === "ZH" ? "首页" : _langCode === "JA" ? "ホーム" : _langCode === "ES" ? "Inicio" : "Home", t.marketTitle]}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-slate-55">
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[240px_1fr]">
          <aside className="hidden min-h-0 border-r border-slate-100 bg-white p-4 lg:flex lg:flex-col w-[240px] shrink-0">
            <div className="mb-4 flex items-center justify-between px-1 shrink-0">
              <div>
                <p className="text-sm font-black text-slate-900" style={{ fontWeight: "900", fontFamily: '"Noto Sans SC", sans-serif' }}>
                  {_langCode === "ZH" ? "快速定位" : _langCode === "JA" ? "クイック移動" : _langCode === "ES" ? "Navegación" : "Quick Navigator"}
                </p>
              </div>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] text-slate-500 font-extrabold hover:text-slate-800 hover:bg-slate-100" style={{ fontWeight: "900" }} onClick={clearFilters}>
                  {t.reset}
                </Button>
              )}
            </div>

            <div className="space-y-1 shrink-0">
              <button
                onClick={() => {
                  setShowFavoritesOnly((prev) => !prev);
                  setShowRecentlyUsedOnly(false);
                  setSelectedCategory("all");
                }}
                className={cn(
                  "flex h-9 w-full items-center justify-between rounded-lg px-2.5 text-left text-xs transition-colors cursor-pointer",
                  showFavoritesOnly
                    ? "bg-blue-50 text-blue-600 font-black"
                    : "text-slate-600 hover:bg-slate-50 font-semibold"
                )}
                style={showFavoritesOnly ? { fontWeight: "900" } : undefined}
              >
                <span className="flex items-center gap-2">
                  <Star className={cn("h-3.5 w-3.5", showFavoritesOnly && "fill-blue-500 text-blue-500")} />
                  {_langCode === "ZH" ? "我的收藏" : _langCode === "JA" ? "お気に入り" : _langCode === "ES" ? "Mis favoritos" : "My Favorites"}
                </span>
                <span className={cn(
                  "rounded-full px-1.5 py-0 text-[10px]",
                  showFavoritesOnly ? "bg-blue-100 text-blue-600 font-black" : "bg-slate-100/60 text-slate-500"
                )}>
                  {marketStats.favoriteCount}
                </span>
              </button>

              <button
                onClick={() => {
                  setShowRecentlyUsedOnly((prev) => !prev);
                  setShowFavoritesOnly(false);
                  setSelectedCategory("all");
                }}
                className={cn(
                  "flex h-9 w-full items-center justify-between rounded-lg px-2.5 text-left text-xs transition-colors cursor-pointer",
                  showRecentlyUsedOnly
                    ? "bg-blue-50 text-blue-600 font-black"
                    : "text-slate-600 hover:bg-slate-50 font-semibold"
                )}
                style={showRecentlyUsedOnly ? { fontWeight: "900" } : undefined}
              >
                <span className="flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5" />
                  {_langCode === "ZH" ? "高频使用" : _langCode === "JA" ? "高頻度使用" : _langCode === "ES" ? "Frecuentes" : "Frequently Used"}
                </span>
                <span className={cn(
                  "rounded-full px-1.5 py-0 text-[10px]",
                  showRecentlyUsedOnly ? "bg-blue-100 text-blue-600 font-black" : "bg-slate-100/60 text-slate-500"
                )}>
                  {allItems.filter((item) => item.calls >= 1000).length}
                </span>
              </button>
            </div>

            <p className="px-2.5 pt-6 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0" style={{ fontWeight: "900" }}>
              {_langCode === "ZH" ? "业务分类" : _langCode === "JA" ? "業務カテゴリ" : _langCode === "ES" ? "Categorías" : "Categories"}
            </p>


            <ScrollArea className="min-h-0 flex-1 pr-1">
              <div className="space-y-1">
                {CUSTOM_CATEGORIES.map((category) => {
                  const isSelected = selectedCategory === category.id && !showFavoritesOnly && !showRecentlyUsedOnly;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowFavoritesOnly(false);
                        setShowRecentlyUsedOnly(false);
                      }}
                      className={cn(
                        "flex h-9 w-full items-center justify-between rounded-lg px-2.5 text-left text-xs transition-colors cursor-pointer",
                        isSelected
                          ? "bg-blue-50 text-blue-600 font-black"
                          : "text-slate-600 hover:bg-slate-50 font-semibold"
                      )}
                      style={isSelected ? { fontWeight: "900" } : undefined}
                    >
                      <span className="truncate">{getCategoryLabel(category.id, _langCode)}</span>
                      <span className={cn(
                        "ml-2 rounded-full px-1.5 py-0 text-[10px]",
                        isSelected ? "bg-blue-100 text-blue-600 font-black" : "bg-slate-100/60 text-slate-400"
                      )}>
                        {categoryCounts[category.id] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </aside>

          <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
            <div className="border-b border-slate-100 bg-white p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <UnifiedTabs
                  value={activeTypeTab}
                  onValueChange={(value) => setActiveTypeTab(value as TypeTab)}
                  className="shrink-0"
                  listClassName="h-9 rounded-lg bg-slate-100/80 p-1"
                  triggerClassName="h-7 text-xs px-4"
                  tabs={marketTabs}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-1 md:justify-end xl:max-w-[640px]">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder={
                        _langCode === "ZH" ? "搜索能力、标签、作者或部门..." 
                        : _langCode === "JA" ? "能力、タグ、開発者、部門で検索..." 
                        : _langCode === "ES" ? "Buscar por capacidad, etiqueta, autor..." 
                        : "Search capabilities, tags, author, department..."
                      }
                      className="h-9 rounded-lg border-slate-200 bg-white pl-9 pr-4 text-xs focus-visible:ring-blue-500 w-full"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 shrink-0 text-xs">
                      <span className="text-slate-400">
                        {_langCode === "ZH" ? "排序:" : _langCode === "JA" ? "ソート:" : _langCode === "ES" ? "Orden:" : "Sort:"}
                      </span>
                      <Combobox
                        value={sortBy}
                        onValueChange={(val) => setSortBy(val)}
                        items={[
                          { value: "recommend", label: _langCode === "ZH" ? "综合推荐" : _langCode === "JA" ? "おすすめ順" : _langCode === "ES" ? "Recomendado" : "Recommended" },
                          { value: "calls", label: _langCode === "ZH" ? "调用最多" : _langCode === "JA" ? "呼び出し最多" : _langCode === "ES" ? "Más llamados" : "Most Calls" },
                          { value: "updated", label: _langCode === "ZH" ? "最近更新" : _langCode === "JA" ? "最新更新" : _langCode === "ES" ? "Última act." : "Last Updated" },
                          { value: "newest", label: _langCode === "ZH" ? "最新发布" : _langCode === "JA" ? "最新リリース" : _langCode === "ES" ? "Más recientes" : "Newest" }
                        ]}
                        className="w-[110px]"
                      >
                        <ComboboxInput 
                          className="h-9 w-[110px] text-xs bg-white border-slate-200" 
                          placeholder={_langCode === "ZH" ? "排序方式" : _langCode === "JA" ? "ソート" : _langCode === "ES" ? "Criterio" : "Sort By"}
                        />
                        <ComboboxContent className="w-[110px]">
                          <ComboboxList>
                            <ComboboxItem value="recommend">{_langCode === "ZH" ? "综合推荐" : _langCode === "JA" ? "おすすめ順" : _langCode === "ES" ? "Recomendado" : "Recommended"}</ComboboxItem>
                            <ComboboxItem value="calls">{_langCode === "ZH" ? "调用最多" : _langCode === "JA" ? "呼び出し最多" : _langCode === "ES" ? "Más llamados" : "Most Calls"}</ComboboxItem>
                            <ComboboxItem value="updated">{_langCode === "ZH" ? "最近更新" : _langCode === "JA" ? "最新更新" : _langCode === "ES" ? "Última act." : "Last Updated"}</ComboboxItem>
                            <ComboboxItem value="newest">{_langCode === "ZH" ? "最新发布" : _langCode === "JA" ? "最新リリース" : _langCode === "ES" ? "Más recientes" : "Newest"}</ComboboxItem>
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </div>

                    <div className="flex items-center border border-slate-200 bg-slate-100/55 rounded-lg p-0.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-7 w-7 rounded-md p-0 cursor-pointer",
                          viewMode === "card"
                            ? "bg-white text-blue-600 shadow-3xs"
                            : "text-slate-400 hover:text-slate-600"
                        )}
                        onClick={() => handleViewModeChange("card")}
                        title="卡片视图"
                      >
                        <LayoutGrid className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-7 w-7 rounded-md p-0 cursor-pointer",
                          viewMode === "table"
                            ? "bg-white text-blue-600 shadow-3xs"
                            : "text-slate-400 hover:text-slate-600"
                        )}
                        onClick={() => handleViewModeChange("table")}
                        title="表格视图"
                      >
                        <List className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 self-start">
                  <span className="text-[11px] font-black text-slate-400" style={{ fontWeight: "900" }}>
                    {_langCode === "ZH" ? "当前条件" : _langCode === "JA" ? "検索条件" : _langCode === "ES" ? "Filtros aplicados" : "Active Filters"}
                  </span>
                  {selectedCategory !== "all" && (
                    <FilterPill 
                      label={
                        _langCode === "ZH" ? `分类: ${getCategoryLabel(selectedCategory, _langCode)}` 
                        : _langCode === "JA" ? `カテゴリ: ${getCategoryLabel(selectedCategory, _langCode)}` 
                        : _langCode === "ES" ? `Categoría: ${getCategoryLabel(selectedCategory, _langCode)}` 
                        : `Category: ${getCategoryLabel(selectedCategory, _langCode)}`
                      } 
                      onClear={() => setSelectedCategory("all")} 
                    />
                  )}
                  {showFavoritesOnly && (
                    <FilterPill 
                      label={_langCode === "ZH" ? "只看收藏" : _langCode === "JA" ? "お気に入りのみ" : _langCode === "ES" ? "Favoritos" : "Favorites Only"} 
                      onClear={() => setShowFavoritesOnly(false)} 
                    />
                  )}
                  {showRecentlyUsedOnly && (
                    <FilterPill 
                      label={_langCode === "ZH" ? "高频使用" : _langCode === "JA" ? "高頻度使用" : _langCode === "ES" ? "Frecuentes" : "Frequently Used"} 
                      onClear={() => setShowRecentlyUsedOnly(false)} 
                    />
                  )}
                  {searchQuery && (
                    <FilterPill 
                      label={
                        _langCode === "ZH" ? `搜索: ${searchQuery}` 
                        : _langCode === "JA" ? `検索: ${searchQuery}` 
                        : _langCode === "ES" ? `Buscar: ${searchQuery}` 
                        : `Search: ${searchQuery}`
                      } 
                      onClear={() => setSearchQuery("")} 
                    />
                  )}
                </div>
              )}
            </div>

            <ScrollArea className="min-h-0 flex-1 bg-slate-50/50">
              {sortedAndFilteredItems.length === 0 ? (
                <EmptyState
                  title={t.noMatches}
                  description={t.noMatchesSub}
                  resetLabel={t.clearFilters}
                  onReset={clearFilters}
                />
              ) : viewMode === "card" ? (
                <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedItems.map((item) => {
                    const display = getCopy(item);

                    return (
                      <Card
                        key={item.id}
                        className="flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-3xs hover:border-slate-300 hover:shadow-2xs transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-3xs",
                              item.isMcp ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-blue-700"
                            )}>
                              {item.isMcp ? <Cpu className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-extrabold text-slate-800 text-sm truncate max-w-[130px]" style={{ fontWeight: "800", fontFamily: '"Noto Sans SC", sans-serif' }}>{display.name}</h4>
                                <button
                                  className="h-6 w-6 shrink-0 text-slate-400 hover:text-amber-500 transition-colors flex items-center justify-center cursor-pointer"
                                  onClick={() => toggleFavorite(item.id, item.isMcp)}
                                  aria-label={item.isFavorite 
                                    ? (_langCode === "ZH" ? "取消收藏" : _langCode === "JA" ? "お気に入り解除" : _langCode === "ES" ? "Quitar de favoritos" : "Remove from Favorites") 
                                    : (_langCode === "ZH" ? "收藏" : _langCode === "JA" ? "お気に入り登録" : _langCode === "ES" ? "Añadir a favoritos" : "Add to Favorites")
                                  }
                                >
                                  <Star className={cn("h-3.5 w-3.5", item.isFavorite && "fill-amber-400 text-amber-500")} />
                                </button>
                              </div>
                              <div className="mt-1">
                                <Badge variant="outline" className={cn("inline-flex h-4 items-center rounded-md px-1.5 text-[9px] font-black border-none shrink-0", 
                                  item.isMcp ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600"
                                )}>
                                  {item.isMcp ? "MCP" : "Skill"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 h-[34px] mb-3 text-left">
                          {display.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                          {display.tags.slice(0, 2).map((tag) => (
                            <Fragment key={tag}>
                              <Badge variant="secondary" className="h-5 rounded-md px-1.5 text-[10px] text-slate-500 bg-slate-50/80 font-bold border-none">
                                {tag}
                              </Badge>
                            </Fragment>
                          ))}
                          {display.tags.length > 2 && (
                            <Badge variant="secondary" className="h-5 rounded-md px-1.5 text-[10px] text-slate-500 bg-slate-50/80 font-bold border-none">
                              +{display.tags.length - 2}
                            </Badge>
                          )}
                        </div>

                        <div className="mt-auto flex shrink-0 flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="truncate text-[11px] text-slate-500">
                            {display.author} · 开发者 · {formatCalls(item.calls)} 次调用
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <Button size="sm" variant="outline" className="h-7 rounded-md border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50" onClick={() => openCapabilitySheet(item, "details")}>
                              <Eye className="h-3.5 w-3.5" />
                              查看详情
                            </Button>
                            <Button size="sm" className="h-7 rounded-md bg-slate-900 px-2.5 text-xs font-semibold text-white hover:bg-slate-800" onClick={() => openCapabilitySheet(item, "quickStart")}>
                              <Rocket className="h-3.5 w-3.5" />
                              快速开始
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border border-slate-100 rounded-xl bg-white shadow-3xs">
                      <Table>
                        <TableHeader className="bg-slate-50/70">
                          <TableRow className="border-b border-slate-100 hover:bg-transparent">
                            <TableHead className="h-9 px-4 text-xs font-semibold text-slate-600">名称</TableHead>
                            <TableHead className="h-9 px-4 text-xs font-semibold text-slate-600">类型</TableHead>
                            <TableHead className="h-9 px-4 text-xs font-semibold text-slate-600">描述</TableHead>
                            <TableHead className="h-9 px-4 text-xs font-semibold text-slate-600">标签</TableHead>
                            <TableHead className="h-9 px-4 text-xs font-semibold text-slate-600">开发者</TableHead>
                            <TableHead className="h-9 px-4 text-xs font-semibold text-slate-600">调用次数</TableHead>
                            <TableHead className="h-9 px-4 text-xs font-semibold text-slate-600">版本</TableHead>
                            <TableHead className="h-9 px-4 text-right text-xs font-semibold text-slate-600">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedItems.map((item) => {
                            const display = getCopy(item);
                            return (
                              <TableRow key={item.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50/40">
                                <TableCell className="min-w-[200px] whitespace-nowrap px-4 py-2.5 text-left">
                                  <div className="flex items-center gap-2">
                                    <button className="flex h-6 w-6 shrink-0 items-center justify-center text-slate-400 transition-colors hover:text-amber-500" onClick={() => toggleFavorite(item.id, item.isMcp)} aria-label={item.isFavorite ? "取消收藏" : "收藏"}>
                                      <Star className={cn("h-3.5 w-3.5", item.isFavorite && "fill-amber-400 text-amber-500")} />
                                    </button>
                                    <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md", item.isMcp ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-blue-700")}>
                                      {item.isMcp ? <Cpu className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                                    </span>
                                    <span className="max-w-[160px] truncate text-xs font-semibold text-slate-800" title={display.name}>{display.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap px-4 py-2.5">
                                  <Badge variant="secondary" className="h-5 rounded-md border-none px-1.5 text-[10px]">{item.isMcp ? "MCP" : "Skill"}</Badge>
                                </TableCell>
                                <TableCell className="min-w-[220px] max-w-[320px] px-4 py-2.5 text-left">
                                  <p className="line-clamp-1 text-xs text-slate-500" title={display.description}>{display.description}</p>
                                </TableCell>
                                <TableCell className="whitespace-nowrap px-4 py-2.5">
                                  <div className="flex items-center gap-1">
                                    {display.tags.slice(0, 2).map((tag) => <Badge key={tag} variant="secondary" className="h-5 rounded-md border-none bg-slate-50 px-1.5 text-[10px] text-slate-500">{tag}</Badge>)}
                                    {display.tags.length > 2 && <Badge variant="secondary" className="h-5 rounded-md border-none bg-slate-50 px-1.5 text-[10px] text-slate-500">+{display.tags.length - 2}</Badge>}
                                  </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap px-4 py-2.5 text-left text-xs text-slate-600">{display.author} · 开发者</TableCell>
                                <TableCell className="whitespace-nowrap px-4 py-2.5 font-mono text-xs font-semibold text-slate-600">{formatCalls(item.calls)}</TableCell>
                                <TableCell className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-500">{item.version}</TableCell>
                                <TableCell className="whitespace-nowrap px-4 py-2.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => openCapabilitySheet(item, "details")}><Eye className="h-3.5 w-3.5" />查看详情</Button>
                                    <Button size="sm" className="h-7 px-2 text-xs" onClick={() => openCapabilitySheet(item, "quickStart")}><Rocket className="h-3.5 w-3.5" />快速开始</Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="text-xs">
                                        <DropdownMenuItem onClick={() => handleCopyConfig(item)}>{item.isMcp ? "复制接入配置" : "复制 Skill 配置"}</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => toggleFavorite(item.id, item.isMcp)}>{item.isFavorite ? "取消收藏" : "移入收藏"}</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Pagination controls bar */}
            <DataTableFooter
              totalItems={sortedAndFilteredItems.length}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              langCode={_langCode}
            />
          </main>
        </div>
      </div>

      <Sheet open={Boolean(selectedItem)} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
          {selectedItem && (
            <CapabilitySheet
              item={selectedItem}
              mode={sheetMode}
              onModeChange={setSheetMode}
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
    <Badge variant="outline" className="gap-1 rounded-md bg-white px-2 py-1 text-[11px] font-semibold border-slate-200">
      {label}
      <button type="button" onClick={onClear} className="rounded-full text-muted-foreground hover:text-rose-600 cursor-pointer">
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

function CapabilitySheet({
  item,
  mode,
  onModeChange,
  copiedText,
  onCopy,
  onFavorite,
}: {
  item: MarketItem;
  mode: SheetMode;
  onModeChange: (mode: SheetMode) => void;
  copiedText: boolean;
  onCopy: () => void;
  onFavorite: () => void;
}) {
  const display = getCopy(item);
  const readme = MARKETPLACE_README_BY_ID[item.id] ?? DEFAULT_MARKETPLACE_README;

  return (
    <>
      <SheetHeader className="border-b border-border bg-white p-5 pr-12 text-left">
        <div className="flex items-start gap-3">
          <span className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            item.isMcp ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-blue-700",
          )}>
            {item.isMcp ? <Cpu className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <SheetTitle className="text-sm font-semibold normal-case tracking-tight text-slate-950">
                {display.name}
              </SheetTitle>
              <Badge variant="secondary" className="h-5 rounded-md border-none px-1.5 text-[10px]">
                {item.isMcp ? "MCP" : "Skill"}
              </Badge>
            </div>
            <SheetDescription className="mt-1 text-xs leading-5 text-slate-500">
              {display.description}
            </SheetDescription>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          <Button type="button" size="sm" variant={mode === "details" ? "secondary" : "ghost"} className="h-7 flex-1 text-xs" onClick={() => onModeChange("details")}>
            <Eye className="h-3.5 w-3.5" />
            查看详情
          </Button>
          <Button type="button" size="sm" variant={mode === "quickStart" ? "secondary" : "ghost"} className="h-7 flex-1 text-xs" onClick={() => onModeChange("quickStart")}>
            <Rocket className="h-3.5 w-3.5" />
            快速开始
          </Button>
          <Button type="button" size="sm" variant={mode === "readme" ? "secondary" : "ghost"} className="h-7 flex-1 text-xs" onClick={() => onModeChange("readme")}>
            <BookOpen className="h-3.5 w-3.5" />
            查看文档
          </Button>
        </div>
      </SheetHeader>

      <ScrollArea className="min-h-0 flex-1 bg-slate-50/70">
        {mode === "readme" ? (
          <ReadmeDocument content={readme} />
        ) : mode === "quickStart" ? (
          <div className="space-y-3 p-4">
            {!item.isMcp ? <SkillDetails item={item} /> : <McpDetails item={item} onCopy={onCopy} copiedText={copiedText} />}
          </div>
        ) : (
          <div className="space-y-3 p-4">
            <Card className="rounded-lg border-slate-100 bg-white shadow-none">
              <CardContent className="grid grid-cols-2 gap-3 p-4 text-xs">
                <InfoCell label="开发者" value={display.author} />
                <InfoCell label="归属部门" value={display.department} />
                <InfoCell label="版本" value={item.version} />
                <InfoCell label="更新时间" value={item.updateTime} />
                <InfoCell label="累计调用" value={`${item.calls} 次`} />
              </CardContent>
            </Card>

            <Card className="rounded-lg border-slate-100 bg-white shadow-none">
              <CardHeader className="p-4 pb-2 text-left">
                <CardTitle className="text-xs font-semibold text-slate-800">能力标签</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5 p-4 pt-0">
                {display.tags.map((tag) => <Badge key={tag} variant="secondary" className="rounded-md border-none text-[10px]">{tag}</Badge>)}
              </CardContent>
            </Card>

            <Card className="rounded-lg border-slate-100 bg-white shadow-none">
              <CardHeader className="p-4 pb-2 text-left">
                <CardTitle className="text-xs font-semibold text-slate-800">能力概览</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 pt-0 text-left">
                {(item.whatItCanDo ?? item.scenarios ?? []).slice(0, 5).map((content, index) => (
                  <div key={`${content}-${index}`} className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">{content}</div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </ScrollArea>

      <SheetFooter className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-white p-4">
        <Button variant="outline" onClick={() => onModeChange("readme")} className="w-full sm:w-auto">
          <BookOpen className="mr-1 h-3.5 w-3.5" />
          查看文档
        </Button>
        <Button variant="outline" onClick={onFavorite} className="w-full sm:w-auto">
          <Star className={cn("mr-1 h-3.5 w-3.5", item.isFavorite && "fill-amber-400 text-amber-500")} />
          <span>{item.isFavorite ? "取消收藏" : "收藏"}</span>
        </Button>
        <Button onClick={onCopy} className="w-full bg-slate-900 text-white hover:bg-slate-800 sm:w-auto">
          {copiedText ? <Check className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
          <span>{copiedText ? "已复制" : item.isMcp ? "复制接入配置" : "复制 Skill 配置"}</span>
        </Button>
      </SheetFooter>
    </>
  );
}

function ReadmeDocument({ content }: { content: string }) {
  return (
    <article className="m-4 rounded-lg border border-slate-200 bg-white px-5 py-4 text-left shadow-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="mb-4 border-b border-slate-100 pb-3 text-lg font-semibold text-slate-950">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 mt-6 text-sm font-semibold text-slate-900">{children}</h2>,
          p: ({ children }) => <p className="mb-3 text-xs leading-6 text-slate-600">{children}</p>,
          ul: ({ children }) => <ul className="mb-4 list-disc space-y-1.5 pl-5 text-xs leading-5 text-slate-600">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-xs leading-5 text-slate-600">{children}</ol>,
          code: ({ children }) => <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-800">{children}</code>,
          pre: ({ children }) => <pre className="mb-4 overflow-x-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100">{children}</pre>,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
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
    <div className="min-w-0 rounded-lg bg-slate-50 p-3 text-left">
      <p className="text-[10px] font-semibold text-slate-400">{label}</p>
      <p className={cn("mt-1 truncate font-black text-slate-900 text-xs", valueClassName)} style={{ fontWeight: "900", fontFamily: '"Noto Sans SC", sans-serif' }}>{value}</p>
    </div>
  );
}

function SkillDetails({ item }: { item: MarketItem }) {
  return (
    <div className="space-y-3">
      <Card className="rounded-lg bg-white shadow-none border-slate-100">
        <CardHeader className="p-4 pb-2 text-left">
          <CardTitle className="flex items-center gap-2 text-xs font-black text-slate-800" style={{ fontWeight: "900" }}>
            <Terminal className="h-3.5 w-3.5 text-blue-600" />
            输入示例
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-left">
          <pre className="max-h-32 overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100 font-mono">
            {item.inputExample || "暂无输入示例"}
          </pre>
        </CardContent>
      </Card>

      <Card className="rounded-lg bg-white shadow-none border-slate-100">
        <CardHeader className="p-4 pb-2 text-left">
          <CardTitle className="flex items-center gap-2 text-xs font-black text-slate-800" style={{ fontWeight: "900" }}>
            <FileText className="h-3.5 w-3.5 text-emerald-600" />
            适用场景
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-4 pt-0 text-left">
          {(item.scenarios ?? []).slice(0, 4).map((scenario, index) => (
            <div key={`${scenario}-${index}`} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600 font-semibold">
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
    <div className="space-y-3 font-sans">
      <Card className="rounded-lg bg-white shadow-none border-slate-100">
        <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-2 text-left">
          <CardTitle className="flex items-center gap-2 text-xs font-black text-slate-800" style={{ fontWeight: "900" }}>
            <Database className="h-3.5 w-3.5 text-violet-600" />
            MCP 能力概览
          </CardTitle>
          <Button variant="outline" size="sm" className="h-7 font-black cursor-pointer" style={{ fontWeight: "900" }} onClick={onCopy}>
            {copiedText ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            <span>{copiedText ? "已复制" : "复制"}</span>
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-2 p-4 pt-0">
          <InfoCell label="Tools" value={String(item.toolsCount ?? item.toolsList?.length ?? 0)} />
          <InfoCell label="Resources" value={String(item.resourcesCount ?? item.resourcesList?.length ?? 0)} />
          <InfoCell label="延迟" value={item.avgResponseTime ?? "-"} />
        </CardContent>
      </Card>

      <Card className="rounded-lg bg-white shadow-none border-slate-100">
        <CardHeader className="p-4 pb-2 text-left">
          <CardTitle className="flex items-center gap-2 text-xs font-black text-slate-800" style={{ fontWeight: "900" }}>
            <Lock className="h-3.5 w-3.5 text-slate-600" />
            已发现工具
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-4 pt-0 text-left">
          {(item.toolsList ?? []).map((tool) => (
            <div key={tool.name} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-left">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <code className="rounded bg-white px-1.5 py-0.5 text-[11px] font-bold text-slate-900 font-mono">{tool.name}</code>
                <Badge variant={tool.isReadonly ? "secondary" : "destructive"} className="text-[10px] font-bold h-5 border-none">
                  {tool.isReadonly ? "只读" : "写入"}
                </Badge>
              </div>
              <p className="text-[11px] leading-5 text-muted-foreground text-xs">{tool.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
