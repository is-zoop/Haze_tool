import { Badge } from "@/components/ui/badge";

export type StatusType =
  | "published"
  | "draft"
  | "reviewing"
  | "rejected"
  | "offline"
  | "pending"
  | "approved"
  | "processing"
  | "pass"
  | "fail"
  | "testing"
  | "active"
  | "warning"
  | "maintenance";

interface StatusBadgeProps {
  status: StatusType | string;
  labels?: Record<string, string>; // Optional custom label mapping
}

const statusConfig: Record<string, { label: string; className: string }> = {
  published: {
    label: "已发布",
    className: "border-none bg-emerald-50 text-emerald-600 hover:bg-emerald-50 shadow-3xs",
  },
  approved: {
    label: "已通过",
    className: "border-none bg-emerald-50 text-emerald-600 hover:bg-emerald-50 shadow-3xs",
  },
  draft: {
    label: "草稿",
    className: "border-none bg-amber-50 text-amber-600 hover:bg-amber-50 shadow-3xs",
  },
  reviewing: {
    label: "审核中",
    className: "border-none bg-blue-50 text-blue-650 hover:bg-blue-50 shadow-3xs",
  },
  pending: {
    label: "待审核",
    className: "border-none bg-blue-50 text-blue-650 hover:bg-blue-50 shadow-3xs",
  },
  processing: {
    label: "处理中",
    className: "border-none bg-indigo-50 text-indigo-600 hover:bg-indigo-50 shadow-3xs",
  },
  rejected: {
    label: "已驳回",
    className: "border-none bg-red-50 text-red-600 hover:bg-red-50 shadow-3xs",
  },
  offline: {
    label: "已下线",
    className: "border-none bg-slate-100 text-slate-500 hover:bg-slate-100 shadow-3xs",
  },
  active: {
    label: "运行中",
    className: "border-none bg-emerald-50 text-emerald-600 hover:bg-emerald-50 shadow-3xs",
  },
  warning: {
    label: "告警",
    className: "border-none bg-yellow-50 text-yellow-600 hover:bg-yellow-50 shadow-3xs",
  },
  maintenance: {
    label: "维护中",
    className: "border-none bg-slate-100 text-slate-500 hover:bg-slate-100 shadow-3xs",
  },
  pass: {
    label: "测试通过",
    className: "border-none bg-emerald-50 text-emerald-650 hover:bg-emerald-50 shadow-3xs",
  },
  fail: {
    label: "测试失败",
    className: "border-none bg-red-50 text-red-600 hover:bg-red-55 shadow-3xs",
  },
  testing: {
    label: "测试中",
    className: "border-none bg-blue-50 text-blue-650 hover:bg-blue-50 shadow-3xs animate-pulse",
  },
};

export function StatusBadge({ status, labels }: StatusBadgeProps) {
  const normStatus = (status || "").toLowerCase();
  const config = statusConfig[normStatus] || {
    label: status,
    className: "border-none bg-slate-100 text-slate-600 hover:bg-slate-100",
  };

  const finalLabel = labels?.[status] || labels?.[normStatus] || config.label;

  return (
    <Badge variant="outline" className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
      {finalLabel}
    </Badge>
  );
}
