import React, { useState, useMemo } from "react";
import { 
  Search, 
  Check, 
  X, 
  Sparkles, 
  Database, 
  Clock, 
  FileText, 
  Terminal, 
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  History,
  MoreHorizontal,
  Calendar,
  Percent,
  Timer,
  CheckCheck,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { getI18n } from "../../i18n";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { UnifiedTabs, TabItem } from "@/components/UnifiedTabs";
import { MOCK_PUBLISH_REVIEWS } from "../../temp/publishReviews";
import { AuditRequest } from "../../types/audit-center";
import { PageHeader } from "../../components/common/PageHeader";
import { DataTableFooter } from "../../components/common/DataTableFooter";
import { StatusBadge } from "../../components/common/StatusBadge";

interface PageProps {
  onBackToHome?: () => void;
  langCode?: "ZH" | "EN" | "JA" | "ES";
}

const AUDIT_LOCALIZED_DEPARTS: Record<string, Record<string, string>> = {
  ZH: {
    "企业架构部": "企业架构部",
    "客户服务部": "客户服务部",
    "市场活动部": "市场活动部",
    "运营中台": "运营中台"
  },
  JA: {
    "企业架构部": "エンタープライズアーキテクチャ部門",
    "客户服务部": "カスタマーサービス部門",
    "市场活动部": "市場イベント運営チーム",
    "运营中台": "運営インフラセンター"
  },
  ES: {
    "企业架构部": "Arquitectura de Empresa",
    "客户服务部": "Servicio de Atención",
    "市场活动部": "Operaciones de Marketing",
    "运营中台": "Plataforma de Operaciones"
  },
  EN: {
    "企业架构部": "Enterprise Architecture",
    "客户服务部": "Customer Service",
    "市场活动部": "Marketing Events",
    "运营中台": "Operations Hub"
  }
};

export function AuditCenter({ onBackToHome: _onBackToHome, langCode: _langCode = "ZH" }: PageProps) {
  const t = getI18n(_langCode);
  const statusLabels = {
    pending: t.statusPending,
    processing: t.statusProcessing,
    approved: t.statusApproved,
    rejected: t.statusRejected,
    withdrawn: t.statusWithdrawn,
  };
  const [reviews, setReviews] = useState<AuditRequest[]>(MOCK_PUBLISH_REVIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "Skill" | "MCP Server">("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [submitTimeOrder, setSubmitTimeOrder] = useState("newest");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  
  // Tab states
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail Sheet / Overlay Drawer state
  const [selectedReview, setSelectedReview] = useState<AuditRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Toast notifier
  const triggerAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 3000);
  };

  // Tab counts
  const countPending = useMemo(() => {
    return reviews.filter(r => r.status === "pending" || r.status === "processing").length;
  }, [reviews]);

  const countApproved = useMemo(() => {
    return reviews.filter(r => r.status === "approved").length;
  }, [reviews]);

  const countRejected = useMemo(() => {
    return reviews.filter(r => r.status === "rejected").length;
  }, [reviews]);

  const countAll = reviews.length;

  // Refresh trigger action
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerAlert(t.auditRefreshSuccess);
    }, 700);
  };

  const handleApproveAction = (rev: AuditRequest) => {
    setReviews(prev => prev.map(item => {
      if (item.id === rev.id) {
        return { ...item, status: "approved" as any };
      }
      return item;
    }));
    
    // Sync current drawer detail
    setSelectedReview(prev => prev && prev.id === rev.id ? { ...prev, status: "approved" as any } : prev);
    triggerAlert(`已通过能力发布申请 [${rev.capabilityName}]`);
  };

  const handleRejectAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview) return;
    if (!rejectReason.trim()) {
      triggerAlert("必须提供拒绝原因说明");
      return;
    }

    setReviews(prev => prev.map(item => {
      if (item.id === selectedReview.id) {
        return { 
          ...item, 
          status: "rejected" as any,
          hasBlocker: true,
          blockReason: rejectReason.trim()
        };
      }
      return item;
    }));

    // Sync sheet
    setSelectedReview(prev => prev ? { 
      ...prev, 
      status: "rejected" as any, 
      hasBlocker: true, 
      blockReason: rejectReason.trim() 
    } : null);

    setShowRejectForm(false);
    setRejectReason("");
    triggerAlert(`已驳回 [${selectedReview.capabilityName}] 的发布提报`);
  };

  // 1. Matches tab layout group
  const matchesTabList = useMemo(() => {
    return reviews.filter(item => {
      if (activeTab === "pending") return item.status === "pending" || item.status === "processing";
      if (activeTab === "approved") return item.status === "approved";
      if (activeTab === "rejected") return item.status === "rejected";
      return true; // "all"
    });
  }, [reviews, activeTab]);

  // 2. Perform filtering & search queries
  const filteredReviews = useMemo(() => {
    return matchesTabList.filter(item => {
      const matchesSearch = 
        item.capabilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === "all" || item.capabilityType === typeFilter;
      const matchesDept = deptFilter === "all" || item.department === deptFilter;

      let matchesDate = true;
      if (dateRangeFilter === "today") {
        matchesDate = item.submitTime.startsWith("2026-06-15");
      } else if (dateRangeFilter === "recent_3") {
        matchesDate = 
          item.submitTime.startsWith("2026-06-15") || 
          item.submitTime.startsWith("2026-06-14") || 
          item.submitTime.startsWith("2026-06-13");
      } else if (dateRangeFilter === "recent_7") {
        matchesDate = 
          item.submitTime.startsWith("2026-06-15") || 
          item.submitTime.startsWith("2026-06-14") || 
          item.submitTime.startsWith("2026-06-13") ||
          item.submitTime.startsWith("2026-06-12") ||
          item.submitTime.startsWith("2026-06-11");
      }

      return matchesSearch && matchesType && matchesDept && matchesDate;
    });
  }, [matchesTabList, searchQuery, typeFilter, deptFilter, dateRangeFilter]);

  // 3. Sorting timeline direction
  const sortedReviews = useMemo(() => {
    const list = [...filteredReviews];
    if (submitTimeOrder === "newest") {
      list.sort((a, b) => b.submitTime.localeCompare(a.submitTime));
    } else if (submitTimeOrder === "oldest") {
      list.sort((a, b) => a.submitTime.localeCompare(b.submitTime));
    }
    return list;
  }, [filteredReviews, submitTimeOrder]);

  // 4. Slice to paginate items block
  const paginatedReviews = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return sortedReviews.slice(startIdx, startIdx + pageSize);
  }, [sortedReviews, currentPage, pageSize]);

  const totalItems = sortedReviews.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Determine elapsed delay duration labels
  const getWaitTimeText = (item: AuditRequest) => {
    const startStr = item.submittedAt || (item.submitTime ? item.submitTime.replace(" ", "T") : "");
    if (!startStr) {
      if (_langCode === "ZH") return "12分钟";
      if (_langCode === "JA") return "12分";
      if (_langCode === "ES") return "12 min";
      return "12 mins";
    }
    const start = new Date(startStr);
    const end = item.reviewedAt ? new Date(item.reviewedAt) : new Date("2026-06-15T12:42:00");
    const diffMs = Math.max(0, end.getTime() - start.getTime());
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      if (_langCode === "ZH") return `${diffDays}天${diffHours % 24}小时`;
      if (_langCode === "JA") return `${diffDays}日${diffHours % 24}時間`;
      return `${diffDays}d ${diffHours % 24}h`;
    }
    if (diffHours > 0) {
      const mins = diffMins % 60;
      const minsStr = mins < 10 ? "0" + mins : mins;
      if (_langCode === "ZH") return `${diffHours}小时${minsStr}分`;
      if (_langCode === "JA") return `${diffHours}時間${minsStr}分`;
      return `${diffHours}h ${minsStr}m`;
    }
    if (_langCode === "ZH") return `${diffMins || 12}分钟`;
    if (_langCode === "JA") return `${diffMins || 12}分`;
    return `${diffMins || 12} mins`;
  };

  const getWaitTimeBadge = (item: AuditRequest) => {
    const text = getWaitTimeText(item);
    if (item.status === "pending" || item.status === "processing") {
      if (item.urgency === "urgent" || item.urgency === "critical") {
        return (
          <span className="text-red-500 font-semibold text-sm">
            {text}
          </span>
        );
      }
      return (
        <span className="text-amber-500 font-semibold text-sm">
          {text}
        </span>
      );
    }
    return (
      <span className="text-slate-400 font-medium text-sm">
        {text}
      </span>
    );
  };

  const auditCenterTabs: TabItem[] = [
    {
      value: "pending",
      label: `${_langCode === "ZH" ? "待审核" : _langCode === "JA" ? "審査待ち" : _langCode === "ES" ? "Pendientes" : "Pending"} (${countPending})`,
    },
    {
      value: "approved",
      label: `${_langCode === "ZH" ? "已通过" : _langCode === "JA" ? "承認済" : _langCode === "ES" ? "Aprobados" : "Approved"} (${countApproved})`,
    },
    {
      value: "rejected",
      label: `${_langCode === "ZH" ? "已拒绝" : _langCode === "JA" ? "却下済" : _langCode === "ES" ? "Rechazados" : "Rejected"} (${countRejected})`,
    },
    {
      value: "all",
      label: `${_langCode === "ZH" ? "全部" : _langCode === "JA" ? "すべて" : _langCode === "ES" ? "Todos" : "All"} (${countAll})`,
    },
  ];


  return (
    <div className="dashboard-page-stack h-full overflow-hidden text-left font-sans flex flex-col gap-3 animate-in fade-in duration-300" id="haze-publish-review-container">
      <PageHeader
        title={t.auditTitle}
        description={t.auditDesc}
        breadcrumbs={[_langCode === "ZH" ? "首页" : _langCode === "JA" ? "ホーム" : _langCode === "ES" ? "Inicio" : "Home", t.auditTitle]}
        actions={(
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-9 px-4 text-xs font-semibold border-border/70 bg-white hover:bg-slate-50 flex items-center gap-1.5 shadow-sm text-slate-700 cursor-pointer rounded-lg">
                  <ShieldCheck size={14} className="text-blue-500" />
                  <span>{_langCode === "ZH" ? "审核规则" : _langCode === "JA" ? "審査規約" : _langCode === "ES" ? "Reglas de auditoría" : "Audit Rules"}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md p-6 bg-white border border-zinc-200 rounded-xl shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-3 border-zinc-100">
                    <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
                    <h3 className="text-base font-bold text-slate-900">HAZE 平台发布合规守则</h3>
                  </div>
                  <div className="text-sm text-slate-600 space-y-3.5 pr-1 leading-relaxed">
                    <p>所有内部开发者提交的 <strong>Skill</strong> 与 <strong>MCP Server</strong> 均须遵守 HAZE 系统安全性及通信高可用指标：</p>
                    
                    <div className="bg-zinc-50 p-3 rounded-lg space-y-1 border border-zinc-150/60">
                      <p className="font-bold text-slate-800">1. 指令安全与数据隔离</p>
                      <p className="text-slate-500 text-xs">Skill 中的 System Prompt 须进行严格过滤，禁止搭载、泄露生产环境数据库明细，且必须防范 Prompt 越权注入风险。</p>
                    </div>

                    <div className="bg-zinc-50 p-3 rounded-lg space-y-1 border border-zinc-150/60">
                      <p className="font-bold text-slate-800">2. 协议与高可用延迟</p>
                      <p className="text-slate-500 text-xs">提报 of MCP Server 强制适配 standard SSE 通信协议骨干，API 远程执行耗时须稳定保持在 400ms 以内。</p>
                    </div>

                    <div className="bg-zinc-50 p-3 rounded-lg space-y-1 border border-zinc-150/60">
                      <p className="font-bold text-slate-800">3. 异常监控与操作合规度</p>
                      <p className="text-slate-500 text-xs">若检测到工具指令含有高危只写数据库操作（Write Only），项目须提交安全部门主管双签审批认证。</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-zinc-100 flex justify-end">
                    <DialogTrigger asChild>
                      <Button variant="default" size="sm" className="h-9 px-4 font-semibold cursor-pointer bg-slate-900 text-white hover:bg-slate-800 rounded-lg">
                        了解合规
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 px-4 text-xs font-semibold border-border/70 bg-white hover:bg-slate-50 flex items-center gap-1.5 shadow-sm text-slate-700 cursor-pointer rounded-lg"
            >
              <RotateCw size={12} className={`text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{t.refresh}</span>
            </Button>
          </div>
        )}
      />

      <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-border/70 bg-white shadow-2xs p-4 pt-2.5 pb-2.5 gap-3 overflow-hidden" id="haze-publish-review-overhaul">

        {/* 2. Top Metrics Grid Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          
          {/* Card 1 */}
          <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm h-[112px] flex items-center gap-4">
            <div className="size-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <Clock size={20} className="stroke-[2.2]" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-500 leading-none">
                {_langCode === "ZH" ? "待我审核" : _langCode === "JA" ? "審査待ち" : _langCode === "ES" ? "Mis revisiones" : "Pending Reviews"}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold text-slate-900 leading-none font-sans">
                  {countPending}
                </span>
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                  {_langCode === "ZH" ? "较昨日 +1" : _langCode === "JA" ? "前日比 +1" : _langCode === "ES" ? "+1 vs ayer" : "+1 vs yesterday"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm h-[112px] flex items-center gap-4">
            <div className="size-11 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCheck size={20} className="stroke-[2.2]" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-500 leading-none">
                {_langCode === "ZH" ? "今日已审核" : _langCode === "JA" ? "本日審査済" : _langCode === "ES" ? "Revisados hoy" : "Reviewed Today"}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold text-slate-900 leading-none font-sans">
                  1
                </span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                  {_langCode === "ZH" ? "较昨日 +1" : _langCode === "JA" ? "前日比 +1" : _langCode === "ES" ? "+1 vs ayer" : "+1 vs yesterday"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm h-[112px] flex items-center gap-4">
            <div className="size-11 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <Percent size={20} className="stroke-[2.2]" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-500 leading-none">
                {_langCode === "ZH" ? "本周通过率" : _langCode === "JA" ? "今週の承認率" : _langCode === "ES" ? "Tasa de aprobación" : "Weekly Approval Rate"}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold text-slate-900 leading-none font-sans">
                  75%
                </span>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-sm">
                  {_langCode === "ZH" ? "较上周 +12%" : _langCode === "JA" ? "前週比 +12%" : _langCode === "ES" ? "+12% vs sem. ant." : "+12% vs last week"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm h-[112px] flex items-center gap-4">
            <div className="size-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Timer size={20} className="stroke-[2.2]" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-sm font-medium text-slate-500 leading-none">
                {_langCode === "ZH" ? "平均审核时长" : _langCode === "JA" ? "平均審査時間" : _langCode === "ES" ? "Tiempo promedio" : "Avg Review Duration"}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold text-slate-900 leading-none font-sans">
                  3.2h
                </span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                  {_langCode === "ZH" ? "较上周 -0.6h" : _langCode === "JA" ? "前週比 -0.6h" : _langCode === "ES" ? "-0.6h vs sem. ant." : "-0.6h vs last week"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Status Tabs Selection Segment */}
        <div className="border-none p-0 bg-transparent shrink-0">
          <UnifiedTabs 
            value={activeTab} 
            onValueChange={(val) => { setActiveTab(val as any); setCurrentPage(1); }} 
            className="shrink-0"
            listClassName="h-9 rounded-lg bg-slate-100/80 p-1 border-none"
            triggerClassName="h-7 text-xs px-4 font-semibold"
            tabs={auditCenterTabs}
          />
        </div>

        {/* 4. Single-line Horizontal Combined Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3 bg-transparent shrink-0">
          
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} strokeWidth={2} />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder={
                _langCode === "ZH" ? "搜索能力、申请人或流水号..." 
                : _langCode === "JA" ? "機能、申請者、またはIDで検索..." 
                : _langCode === "ES" ? "Buscar por capacidad, solicitante o ID..." 
                : "Search by capability, requester, or ID..."
              }
              className="pl-9 h-10 w-full text-sm bg-white border-slate-200 rounded-lg shadow-none focus-visible:ring-1 focus-visible:ring-blue-600 placeholder:text-slate-400"
            />
          </div>

          <Combobox
            value={typeFilter}
            onValueChange={(val) => { setTypeFilter(val as any); setCurrentPage(1); }}
            items={[
              { value: "all", label: _langCode === "ZH" ? "全部类型" : _langCode === "JA" ? "全タイプ" : _langCode === "ES" ? "Todos tipos" : "All Types" },
              { value: "Skill", label: "Skill" },
              { value: "MCP Server", label: "MCP Server" }
            ]}
            className="w-[130px]"
          >
            <ComboboxInput className="h-10 w-[130px] text-sm bg-white border-slate-200 text-slate-700 rounded-lg shrink-0 justify-between" placeholder={_langCode === "ZH" ? "全部类型" : _langCode === "JA" ? "全タイプ" : _langCode === "ES" ? "Todos tipos" : "All Types"} />
            <ComboboxContent className="w-[130px]">
              <ComboboxList>
                <ComboboxItem value="all">{_langCode === "ZH" ? "全部类型" : _langCode === "JA" ? "全タイプ" : _langCode === "ES" ? "Todos tipos" : "All Types"}</ComboboxItem>
                <ComboboxItem value="Skill">Skill</ComboboxItem>
                <ComboboxItem value="MCP Server">MCP Server</ComboboxItem>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <Combobox
            value={deptFilter}
            onValueChange={(val) => { setDeptFilter(val); setCurrentPage(1); }}
            items={[
              { value: "all", label: _langCode === "ZH" ? "全部部门" : _langCode === "JA" ? "全部門" : _langCode === "ES" ? "Todos depto" : "All Depts" },
              { value: "客户服务部", label: AUDIT_LOCALIZED_DEPARTS[_langCode]["客户服务部"] },
              { value: "企业架构部", label: AUDIT_LOCALIZED_DEPARTS[_langCode]["企业架构部"] },
              { value: "市场活动部", label: AUDIT_LOCALIZED_DEPARTS[_langCode]["市场活动部"] },
              { value: "运营中台", label: AUDIT_LOCALIZED_DEPARTS[_langCode]["运营中台"] }
            ]}
            className="w-[130px]"
          >
            <ComboboxInput className="h-10 w-[130px] text-sm bg-white border-slate-200 text-slate-700 rounded-lg shrink-0 justify-between" placeholder={_langCode === "ZH" ? "全部部门" : _langCode === "JA" ? "全部門" : _langCode === "ES" ? "Todos depto" : "All Depts"} />
            <ComboboxContent className="w-[130px]">
              <ComboboxList>
                <ComboboxItem value="all">{_langCode === "ZH" ? "全部部门" : _langCode === "JA" ? "全部門" : _langCode === "ES" ? "Todos depto" : "All Depts"}</ComboboxItem>
                <ComboboxItem value="客户服务部">{AUDIT_LOCALIZED_DEPARTS[_langCode]["客户服务部"]}</ComboboxItem>
                <ComboboxItem value="企业架构部">{AUDIT_LOCALIZED_DEPARTS[_langCode]["企业架构部"]}</ComboboxItem>
                <ComboboxItem value="市场活动部">{AUDIT_LOCALIZED_DEPARTS[_langCode]["市场活动部"]}</ComboboxItem>
                <ComboboxItem value="运营中台">{AUDIT_LOCALIZED_DEPARTS[_langCode]["运营中台"]}</ComboboxItem>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <Combobox
            value={submitTimeOrder}
            onValueChange={(val) => { setSubmitTimeOrder(val); setCurrentPage(1); }}
            items={[
              { value: "newest", label: _langCode === "ZH" ? "最新提交" : _langCode === "JA" ? "最新の送信" : _langCode === "ES" ? "Más reciente" : "Newest submit" },
              { value: "oldest", label: _langCode === "ZH" ? "最早提交" : _langCode === "JA" ? "最古の送信" : _langCode === "ES" ? "Más antiguo" : "Oldest submit" }
            ]}
            className="w-[130px]"
          >
            <ComboboxInput className="h-10 w-[130px] text-sm bg-white border-slate-200 text-slate-700 rounded-lg shrink-0 justify-between" placeholder={_langCode === "ZH" ? "提交时间" : _langCode === "JA" ? "送信時間" : _langCode === "ES" ? "Hora de envío" : "Submit Time"} />
            <ComboboxContent className="w-[130px]">
              <ComboboxList>
                <ComboboxItem value="newest">{_langCode === "ZH" ? "最新提交" : _langCode === "JA" ? "最新の送信" : _langCode === "ES" ? "Más reciente" : "Newest submit"}</ComboboxItem>
                <ComboboxItem value="oldest">{_langCode === "ZH" ? "最早提交" : _langCode === "JA" ? "最古の送信" : _langCode === "ES" ? "Más antiguo" : "Oldest submit"}</ComboboxItem>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <Combobox
            value={dateRangeFilter}
            onValueChange={(val) => { setDateRangeFilter(val); setCurrentPage(1); }}
            items={[
              { value: "all", label: _langCode === "ZH" ? "选择日期范围" : _langCode === "JA" ? "期間選択" : _langCode === "ES" ? "Rango fecha" : "Date Range" },
              { value: "today", label: _langCode === "ZH" ? "今天" : _langCode === "JA" ? "今日" : _langCode === "ES" ? "Hoy" : "Today" },
              { value: "recent_3", label: _langCode === "ZH" ? "最近 3 天" : _langCode === "JA" ? "直近3日" : _langCode === "ES" ? "Últimos 3 días" : "Last 3 Days" },
              { value: "recent_7", label: _langCode === "ZH" ? "最近 7 天" : _langCode === "JA" ? "直近7日" : _langCode === "ES" ? "Últimos 7 días" : "Last 7 Days" }
            ]}
            className="w-[180px]"
          >
            <ComboboxInput className="h-10 w-[180px] text-sm bg-white border-slate-200 text-slate-700 rounded-lg shrink-0 justify-between" placeholder={_langCode === "ZH" ? "选择日期范围" : _langCode === "JA" ? "期間選択" : _langCode === "ES" ? "Rango fecha" : "Date Range"}>
              <Calendar className="mr-1.5 h-4 w-4 text-slate-400 shrink-0" />
            </ComboboxInput>
            <ComboboxContent className="w-[180px]">
              <ComboboxList>
                <ComboboxItem value="all">{_langCode === "ZH" ? "选择日期范围" : _langCode === "JA" ? "期間選択" : _langCode === "ES" ? "Rango fecha" : "Date Range"}</ComboboxItem>
                <ComboboxItem value="today">{_langCode === "ZH" ? "今天" : _langCode === "JA" ? "今日" : _langCode === "ES" ? "Hoy" : "Today"}</ComboboxItem>
                <ComboboxItem value="recent_3">{_langCode === "ZH" ? "最近 3 天" : _langCode === "JA" ? "直近3日" : _langCode === "ES" ? "Últimos 3 días" : "Last 3 Days"}</ComboboxItem>
                <ComboboxItem value="recent_7">{_langCode === "ZH" ? "最近 7 天" : _langCode === "JA" ? "直近7日" : _langCode === "ES" ? "Últimos 7 días" : "Last 7 Days"}</ComboboxItem>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchQuery("");
              setTypeFilter("all");
              setDeptFilter("all");
              setSubmitTimeOrder("newest");
              setDateRangeFilter("all");
              setCurrentPage(1);
            }}
            className="h-10 text-sm font-semibold px-4 text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer rounded-lg"
          >
            <RotateCw size={12} strokeWidth={2} />
            <span>{_langCode === "ZH" ? "重置" : _langCode === "JA" ? "リセット" : _langCode === "ES" ? "Reiniciar" : "Reset"}</span>
          </Button>
        </div>

        {/* Floating alerts toast */}
        {alertMsg && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg font-bold border border-slate-800/50 animate-bounce">
            <Check size={14} className="text-emerald-400 stroke-[2.5]" />
            <span>{alertMsg}</span>
          </div>
        )}

        {/* 5. Clean Grid Table and Pagination wrapper */}
        <div className="flex-grow flex-1 min-h-0 flex flex-col gap-2" id="haze-publish-review-table-container">
          <div className="flex-grow flex-1 min-h-0 overflow-x-auto overflow-y-auto bg-white rounded-xl border border-border/70 shadow-2xs">
            <Table className="w-full min-w-[1000px] table-fixed">
              <TableHeader className="bg-muted/10">
                <TableRow className="h-12 hover:bg-transparent border-b border-border/60">
                  <TableHead className="text-xs font-semibold text-slate-500 px-4" style={{ width: "28%" }}>{_langCode === "ZH" ? "能力信息" : _langCode === "JA" ? "機能情報" : _langCode === "ES" ? "Información de capacidad" : "Capability Info"}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 px-4" style={{ width: "8%" }}>{_langCode === "ZH" ? "类型" : _langCode === "JA" ? "種類" : _langCode === "ES" ? "Tipo" : "Type"}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 px-4" style={{ width: "8%" }}>{_langCode === "ZH" ? "版本" : _langCode === "JA" ? "バージョン" : _langCode === "ES" ? "Versión" : "Version"}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 px-4" style={{ width: "16%" }}>{_langCode === "ZH" ? "申请人 / 部门" : _langCode === "JA" ? "申請者 / 部門" : _langCode === "ES" ? "Solicitante / Depto" : "Requester / Dept"}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 px-4" style={{ width: "14%" }}>{_langCode === "ZH" ? "提交时间" : _langCode === "JA" ? "送信日時" : _langCode === "ES" ? "Hora de envío" : "Submission Time"}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 px-4" style={{ width: "10%" }}>{_langCode === "ZH" ? "等待时长" : _langCode === "JA" ? "処理待ち時間" : _langCode === "ES" ? "Espera" : "Wait Duration"}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 px-4" style={{ width: "8%" }}>{_langCode === "ZH" ? "状态" : _langCode === "JA" ? "ステータス" : _langCode === "ES" ? "Estado" : "Status"}</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 px-4 text-right" style={{ width: "12%" }}>{_langCode === "ZH" ? "操作" : _langCode === "JA" ? "操作" : _langCode === "ES" ? "Acción" : "Action"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-sm divide-y divide-border/40">
                {paginatedReviews.map((rev) => (
                  <TableRow key={rev.id} className="h-[72px] hover:bg-slate-50/40 text-slate-600 transition-colors border-b border-border/40">
                    
                    {/* Name with subtitle ID */}
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`size-9 rounded-lg shrink-0 flex items-center justify-center ${
                          rev.capabilityType === "Skill" ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600"
                        }`}>
                          {rev.capabilityType === "Skill" ? <Sparkles size={16} className="stroke-[2]" /> : <Database size={16} className="stroke-[2]" />}
                        </div>
                        
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm leading-tight truncate">
                            {rev.capabilityName}
                          </p>
                          <p className="font-mono text-xs text-slate-400 font-semibold leading-none">
                            {rev.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Type badge */}
                    <TableCell className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        rev.capabilityType === "Skill" 
                          ? "bg-blue-50 text-blue-600" 
                          : "bg-purple-50 text-purple-600"
                      }`}>
                        {rev.capabilityType}
                      </span>
                    </TableCell>

                    {/* Version */}
                    <TableCell className="px-4 py-3 font-mono text-slate-500 text-sm font-medium">
                      {rev.version}
                    </TableCell>

                    {/* Merged Applicant / Department */}
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <p className="font-semibold text-slate-800 text-sm leading-tight">
                          {rev.applicant}
                        </p>
                        <p className="text-xs text-slate-400 font-medium leading-none">
                          {AUDIT_LOCALIZED_DEPARTS[_langCode]?.[rev.department] || rev.department}
                        </p>
                      </div>
                    </TableCell>

                    {/* Submit Time */}
                    <TableCell className="px-4 py-3 font-mono text-slate-500 text-xs">
                      {rev.submitTime}
                    </TableCell>
                    
                    {/* Wait state */}
                    <TableCell className="px-4 py-3">
                      {getWaitTimeBadge(rev)}
                    </TableCell>
                    
                    {/* Status inline */}
                    <TableCell className="px-4 py-3">
                      <StatusBadge status={rev.status} labels={statusLabels} className="rounded px-2 py-0.5" />
                    </TableCell>
                    
                    {/* Operations right-aligned */}
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {rev.status === "pending" || rev.status === "processing" ? (
                           <Button
                            onClick={() => {
                              setSelectedReview(rev);
                              setShowRejectForm(false);
                              setRejectReason("");
                            }}
                            size="sm"
                            className="h-9 px-4 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer rounded-lg shadow-sm shrink-0"
                          >
                            {_langCode === "ZH" ? "开始审核" : _langCode === "JA" ? "審査開始" : _langCode === "ES" ? "Iniciar revisión" : "Start Review"}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              setSelectedReview(rev);
                              setShowRejectForm(false);
                              setRejectReason("");
                            }}
                            variant="outline"
                            size="sm"
                            className="h-9 px-4 text-xs font-semibold border-border bg-white hover:bg-slate-50 cursor-pointer rounded-lg text-slate-700 shrink-0"
                          >
                            {_langCode === "ZH" ? "查看结果" : _langCode === "JA" ? "結果確認" : _langCode === "ES" ? "Ver resultado" : "View Results"}
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0">
                              <MoreHorizontal size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem onClick={() => triggerAlert(t.auditViewLogs.replace("{id}", rev.id))}>
                              <History className="mr-2 h-3.5 w-3.5 text-slate-400" />
                              <span>{_langCode === "ZH" ? "审计日志" : _langCode === "JA" ? "監査履歴" : _langCode === "ES" ? "Log de auditoría" : "Audit Log"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => triggerAlert(t.auditCopiedRequestId.replace("{id}", rev.id))}>
                              <FileText className="mr-2 h-3.5 w-3.5 text-slate-400" />
                              <span>{_langCode === "ZH" ? "复制流水号" : _langCode === "JA" ? "申請IDをコピー" : _langCode === "ES" ? "Copiar ID" : "Copy Request ID"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {rev.status === "pending" || rev.status === "processing" ? (
                              <DropdownMenuItem className="text-rose-600 font-medium" onClick={() => triggerAlert(t.auditExpediteSuccess)}>
                                <Zap className="mr-2 h-3.5 w-3.5" />
                                <span>{_langCode === "ZH" ? "加急流程" : _langCode === "JA" ? "優先処理" : _langCode === "ES" ? "Acelerar proceso" : "Expedite Flow"}</span>
                              </DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 6. Robust Pagination Controls */}
          <DataTableFooter
            totalItems={totalItems}
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
        </div>

      </div>

      {/* 7. Slide Overlay Sheet */}
      <Sheet open={Boolean(selectedReview)} onOpenChange={(open) => !open && setSelectedReview(null)}>
        {selectedReview && (
          <SheetContent
            side="right"
            showCloseButton={false}
            className="w-full max-w-lg h-full bg-white border-l border-border p-0 gap-0 flex flex-col shadow-2xl text-left sm:max-w-lg"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 p-5 border-b border-border/60 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className={`p-2 rounded-lg shrink-0 ${
                  selectedReview.capabilityType === "Skill" ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600"
                }`}>
                  {selectedReview.capabilityType === "Skill" ? <Sparkles size={16} /> : <Database size={16} />}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {_langCode === "ZH" 
                      ? `${selectedReview.capabilityName} 申请发布` 
                      : _langCode === "JA"
                      ? `${selectedReview.capabilityName} リリース申請`
                      : _langCode === "ES"
                      ? `${selectedReview.capabilityName} Solicitud de publicación`
                      : `${selectedReview.capabilityName} Release Request`}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {_langCode === "ZH" ? "申请版本" : _langCode === "JA" ? "申請バージョン" : _langCode === "ES" ? "Versión" : "Request Version"}: {selectedReview.version} | {_langCode === "ZH" ? "编号" : _langCode === "JA" ? "ID" : _langCode === "ES" ? "ID" : "ID"}: {selectedReview.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <StatusBadge status={selectedReview.status} labels={statusLabels} className="rounded px-2 py-0.5" />
                <button 
                  onClick={() => setSelectedReview(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Content Details */}
            <ScrollArea className="flex-1 min-h-0 bg-slate-50/20">
              <div className="p-5 space-y-4">
                
                <Card className="border border-border/70 rounded-xl bg-white p-4.5 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 block mb-1.5 tracking-wider">
                    {_langCode === "ZH" ? "提报说明" : _langCode === "JA" ? "説明" : _langCode === "ES" ? "Motivo/Descripción" : "Submission Details"}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{selectedReview.description}</p>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-3 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                    <div>
                      <p className="font-semibold text-slate-400">{_langCode === "ZH" ? "申请人 / 开发者" : _langCode === "JA" ? "申請者 / 開発者" : _langCode === "ES" ? "Creador / Solicitante" : "Requester / Developer"}</p>
                      <p className="font-bold text-slate-800 mt-1 text-sm">{selectedReview.applicant}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400">{_langCode === "ZH" ? "申请人邮箱" : _langCode === "JA" ? "申請者メール" : _langCode === "ES" ? "Email" : "Email"}</p>
                      <p className="font-bold text-slate-800 mt-1 font-mono text-sm">{selectedReview.applicantEmail}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400">{_langCode === "ZH" ? "所属部门" : _langCode === "JA" ? "所属部門" : _langCode === "ES" ? "Depto" : "Department"}</p>
                      <p className="font-bold text-slate-800 mt-1 text-sm">
                        {AUDIT_LOCALIZED_DEPARTS[_langCode]?.[selectedReview.department] || selectedReview.department}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400">{_langCode === "ZH" ? "提审提交时间" : _langCode === "JA" ? "送信日時" : _langCode === "ES" ? "Fecha de envío" : "Submission Time"}</p>
                      <p className="font-bold text-slate-800 mt-1 font-mono text-sm">{selectedReview.submitTime}</p>
                    </div>
                  </div>
                </Card>

                {selectedReview.capabilityType === "Skill" && (
                  <Card className="border border-border/70 p-4.5 bg-white text-sm shadow-sm">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-2 tracking-wider">
                      <FileText size={13} className="text-blue-500" />
                      {_langCode === "ZH" ? "附带的 SKILL.md 文档规范" : _langCode === "JA" ? "添付の SKILL.md ドキュメント仕様" : _langCode === "ES" ? "Documentación SKILL.md adjunta" : "Attached SKILL.md Documentation"}
                    </span>
                    <div className="p-3 bg-slate-50 rounded-lg border border-border/50 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-700">
                      {_langCode === "ZH" 
                        ? `# ${selectedReview.capabilityName}\n\n该 Skill 提报已通过静态 Prompt 安全对齐检测机制，具有高容错率及情感分析适配基础。\n\n## 运行特征\n- 类型: 自然语言对话扩展包\n- 安全审计过滤等级: Level A1`
                        : _langCode === "JA"
                        ? `# ${selectedReview.capabilityName}\n\nこのSkillは、セキュリティ・プロンプトチェックを通過済です。\n\n## 稼働スペック\n- タイプ: 自然言語対話プラグイン\n- 監査セキュリティレベル: Level A1`
                        : _langCode === "ES"
                        ? `# ${selectedReview.capabilityName}\n\nEste Skill ha superado la validación estática de seguridad del Prompt.\n\n## Características\n- Tipo: Extensión de lenguaje de diálogo\n- Nivel de auditoría: Level A1`
                        : `# ${selectedReview.capabilityName}\n\nThis Skill is verified and meets our safety standards, fully optimized with custom prompts.\n\n## Details\n- Type: Dialogue extension system\n- Audit confidence level: Level A1`}
                    </div>
                  </Card>
                )}

                {selectedReview.capabilityType === "MCP Server" && (
                  <div className="space-y-4">
                    <Card className="border border-border/70 p-4.5 bg-white text-sm shadow-sm">
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-2 tracking-wider">
                        <Terminal size={13} className="text-blue-500" />
                        {_langCode === "ZH" ? "连接网关及媒介协议通信" : _langCode === "JA" ? "接続ゲートウェイとプロトコルの通信" : _langCode === "ES" ? "Especificaciones de red y protocolo" : "Gateway Connection & Transport Protocol"}
                      </span>
                      <div className="space-y-2 text-sm text-slate-700">
                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span className="text-slate-400">{_langCode === "ZH" ? "传输类型" : _langCode === "JA" ? "プロトコル" : _langCode === "ES" ? "Transporte" : "Transport Type"}</span>
                          <span className="font-mono font-bold text-slate-800 text-xs">
                            {_langCode === "ZH" ? "HTTP/SSE 独立桥接" : _langCode === "JA" ? "HTTP/SSE ブリッジ" : _langCode === "ES" ? "HTTP/SSE Puente" : "HTTP/SSE Independent Bridge"}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span className="text-slate-400">{_langCode === "ZH" ? "内部 API 端点" : _langCode === "JA" ? "内部APIエンドポイント" : _langCode === "ES" ? "Extremo de API interna" : "Internal API Endpoints"}</span>
                          <span className="font-mono text-blue-600 font-bold text-xs">https://mcp-db.internal.haze.com</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                <Card className="border border-border/70 p-4 bg-white text-sm shadow-sm">
                  <span className="text-xs font-bold text-slate-400 block mb-2 tracking-wider">
                    {_langCode === "ZH" ? "系统自动排查测试" : _langCode === "JA" ? "システム自動診断" : _langCode === "ES" ? "Diagnóstico automático" : "Automated Testing & Checks"}
                  </span>
                  <div className="flex items-center gap-1.5 p-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg font-bold">
                    <Check size={14} className="stroke-[2.5]" />
                    <span>
                      {_langCode === "ZH" ? "自动安全与 schema 协议规格比对：正常 (Pass)" : _langCode === "JA" ? "自動セキュリティとスキーマ仕様検証：正常 (Pass)" : _langCode === "ES" ? "Diagnóstico de seguridad y esquema: Normal (Exitoso)" : "Security & schema design diagnostic checks: Passed (Pass)"}
                    </span>
                  </div>
                </Card>

                {selectedReview.status === "rejected" && selectedReview.blockReason && (
                  <Card className="border border-rose-200 p-4 bg-rose-50 text-sm text-rose-850 shadow-sm">
                    <span className="text-xs font-bold text-rose-500 flex items-center gap-1 mb-1.5 tracking-wider">
                      <AlertCircle size={13} />
                      {_langCode === "ZH" ? "审批反馈建议 (Audit Feedback)" : _langCode === "JA" ? "審査フィードバック (Audit Feedback)" : _langCode === "ES" ? "Feedback de rechazo (Audit Feedback)" : "Approval Comments (Audit Feedback)"}
                    </span>
                    <p className="leading-relaxed font-bold">{selectedReview.blockReason}</p>
                  </Card>
                )}

              </div>
            </ScrollArea>

            {/* Actions Panel */}
            <div className="sticky bottom-0 z-10 p-4 border-t border-border bg-white shrink-0">
              {selectedReview.status === "pending" || selectedReview.status === "processing" ? (
                <div className="space-y-3">
                  {showRejectForm ? (
                    <form onSubmit={handleRejectAction} className="space-y-2.5">
                      <label className="block text-xs font-bold text-slate-500">
                        {_langCode === "ZH" ? "请输入拒绝提审的最终原因及调整建议：" : _langCode === "JA" ? "却下する理由と調整案を入力してください：" : _langCode === "ES" ? "Ingrese el motivo y recomendaciones para la propuesta:" : "Please provide feedback or the reason details for the rejection:"}
                      </label>
                      <Textarea
                        required
                        rows={2.5}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder={
                          _langCode === "ZH" ? "例如: 该 Server 协议包含部分非只读写高频接口，考虑到数据敏感度，请先剔除该项高阶写入接口后重新提审..."
                          : _langCode === "JA" ? "例: このサーバーの書き込みAPIについてセキュリティ懸念があります..."
                          : _langCode === "ES" ? "Ejemplo: El servidor contiene operaciones no seguras de escritura, por favor remuévalas..."
                          : "e.g., The server protocol includes write interfaces, please make all endpoints read-only and resubmit..."
                        }
                        className="w-full p-2.5 text-sm bg-slate-50 border border-border rounded-lg outline-none text-slate-800 leading-normal focus:border-rose-500 focus:bg-white transition-all font-medium"
                      />
                      <div className="flex items-center justify-end gap-2 text-sm">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowRejectForm(false)}
                          className="h-9 cursor-pointer text-sm font-semibold border-border bg-white"
                        >
                          {_langCode === "ZH" ? "取消" : _langCode === "JA" ? "キャンセル" : _langCode === "ES" ? "Cancelar" : "Cancel"}
                        </Button>
                        <Button
                          type="submit"
                          variant="destructive"
                          className="h-9 cursor-pointer text-sm bg-red-600 text-white hover:bg-red-700"
                        >
                          {_langCode === "ZH" ? "确认驳回" : _langCode === "JA" ? "却下を確定" : _langCode === "ES" ? "Confirmar rechazo" : "Reject Submission"}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => setShowRejectForm(true)}
                        className="h-9 px-4 text-xs font-semibold bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 cursor-pointer rounded-lg shadow-sm"
                      >
                        <ThumbsDown size={13} className="mr-1" />
                        <span>{_langCode === "ZH" ? "驳回/拒绝" : _langCode === "JA" ? "審査却下" : _langCode === "ES" ? "Rechazar" : "Reject"}</span>
                      </Button>
                      <Button
                        onClick={() => handleApproveAction(selectedReview)}
                        className="h-9 px-4 text-xs font-semibold cursor-pointer rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                      >
                        <ThumbsUp size={13} className="mr-1" />
                        <span>{_langCode === "ZH" ? "通过发布" : _langCode === "JA" ? "承認リリース" : _langCode === "ES" ? "Aprobar y publicar" : "Approve & Publish"}</span>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-end">
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedReview(null)}
                    className="h-9 px-4 text-sm font-semibold rounded-lg cursor-pointer text-slate-700 border-border hover:bg-slate-50 bg-white"
                  >
                    {_langCode === "ZH" ? "关闭详情" : _langCode === "JA" ? "閉じる" : _langCode === "ES" ? "Cerrar" : "Close"}
                  </Button>
                </div>
              )}
            </div>

          </SheetContent>
        )}
      </Sheet>
    </div>
  );
}
