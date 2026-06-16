import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Check, 
  X, 
  Eye, 
  Sparkles, 
  Cpu, 
  Clock, 
  FileText, 
  Terminal, 
  AlertCircle,
  ThumbsUp,
  ThumbsDown
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
import { MOCK_PUBLISH_REVIEWS } from "../../temp/publishReviews";
import { AuditRequest } from "../../types/audit-center";

interface PageProps {
  onBackToHome: () => void;
  langCode?: "ZH" | "EN" | "JA" | "ES";
}

export function AuditCenter({ onBackToHome: _onBackToHome, langCode: _langCode = "ZH" }: PageProps) {
  const [reviews, setReviews] = useState<AuditRequest[]>(MOCK_PUBLISH_REVIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "Skill" | "MCP Server">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "processing" | "approved" | "rejected">("all");

  // Editorial Sheet drawer states
  const [selectedReview, setSelectedReview] = useState<AuditRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Compute Metrics Summary for Header widgets
  const stats = useMemo(() => {
    return {
      total: reviews.length,
      pending: reviews.filter(r => r.status === "pending" || r.status === "processing").length,
      approved: reviews.filter(r => r.status === "approved").length,
      rejected: reviews.filter(r => r.status === "rejected").length
    };
  }, [reviews]);

  // Execute Search & Filters
  const filteredReviews = useMemo(() => {
    return reviews.filter(item => {
      const matchesSearch = 
        item.capabilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = typeFilter === "all" || item.capabilityType === typeFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reviews, searchQuery, typeFilter, statusFilter]);

  // Handle Approve Action
  const handleApproveAction = (rev: AuditRequest) => {
    setReviews(prev => prev.map(item => {
      if (item.id === rev.id) {
        return { ...item, status: "approved" as any };
      }
      return item;
    }));
    
    // Sync current opened sheet
    setSelectedReview(prev => prev && prev.id === rev.id ? { ...prev, status: "approved" as any } : prev);
    triggerAlert(`已通过能力发布申请 [${rev.capabilityName}]，该能力将在全组织市场中展示生态！`);
  };

  // Handle Reject Action
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
    triggerAlert(`审批结果已拒绝：[${selectedReview.capabilityName}]，拒绝说明已发送至提交人。`);
  };

  const triggerAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const renderStatusBadge = (status: AuditRequest["status"]) => {
    switch (status) {
      case "pending":
      case "processing":
        return <Badge className="bg-amber-50 text-amber-700 border-0 text-[10.5px] font-semibold px-2 py-0">待审核</Badge>;
      case "approved":
        return <Badge className="bg-emerald-50 text-emerald-700 border-0 text-[10.5px] font-semibold px-2 py-0">已通过</Badge>;
      case "rejected":
        return <Badge className="bg-rose-50 text-rose-700 border-0 text-[10.5px] font-semibold px-2 py-0">已拒绝</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-page-stack h-full flex flex-col overflow-hidden text-left" id="haze-publish-review-container">
      {/* 2. Tiny count overview widgets under Section 8 */}
      <div className="shrink-0 p-4 bg-muted/25 border-b border-border grid grid-cols-3 gap-3">
        <div className="p-2.5 bg-card border border-border rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-normal">待审核提报</p>
            <p className="text-base font-bold text-amber-600 mt-0.5">{stats.pending} 笔</p>
          </div>
          <Clock size={16} className="text-amber-500/70" />
        </div>
        <div className="p-2.5 bg-card border border-border rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-normal">已审核发布</p>
            <p className="text-base font-bold text-emerald-600 mt-0.5">{stats.approved} 项</p>
          </div>
          <ThumbsUp size={16} className="text-emerald-500/70" />
        </div>
        <div className="p-2.5 bg-card border border-border rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-normal">已作废/驳回</p>
            <p className="text-base font-bold text-muted-foreground mt-0.5">{stats.rejected} 项</p>
          </div>
          <ThumbsDown size={16} className="text-muted-foreground/50" />
        </div>
      </div>

      {/* Alert toast notifications */}
      {alertMsg && (
        <div className="m-3 p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs rounded-xl flex items-center gap-1.5 shadow-xs font-semibold shrink-0">
          <Check size={13} />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* 3. Toolbar controllers */}
      <div className="shrink-0 px-4 py-3 bg-card border-b border-border flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Searching filter */}
          <div className="relative w-full sm:w-56 md:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={13} />
            <input
              type="text"
              placeholder="搜索提报能力、申请人或部门..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 px-8.5 pr-3 text-xs bg-muted/60 border border-input rounded-lg focus:outline-hidden focus:border-ring transition-colors font-medium text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="h-8 px-2.5 text-xs bg-muted border border-input rounded-lg focus:outline-hidden font-semibold text-foreground cursor-pointer"
          >
            <option value="all">所有提报类型</option>
            <option value="Skill">Skill 技能袋</option>
            <option value="MCP Server">MCP Server</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-8 px-2.5 text-xs bg-muted border border-input rounded-lg focus:outline-hidden font-semibold text-foreground cursor-pointer"
          >
            <option value="all">所有审批形态</option>
            <option value="pending">待审核</option>
            <option value="approved">已通过</option>
            <option value="rejected">已拒绝</option>
          </select>
        </div>
      </div>

      {/* 4. Main grid table */}
      <div className="flex-1 min-h-0 bg-muted/5">
        <ScrollArea className="h-full w-full">
          <div className="p-4">
            <Card className="border border-border rounded-xl spill-hidden bg-card text-left">
              <Table>
                <TableHeader className="bg-muted/40 border-b">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5">提报流水号</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5">提报能力名称</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5 w-[110px]">类别</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5 w-[80px]">申请版本</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5">申请人 (部门)</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5 w-[140px]">提审时间</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5 w-[100px]">审查状态</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5 text-right pr-6 w-[130px]">细节与审查</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs divide-y divide-border">
                  {filteredReviews.map((rev) => (
                    <TableRow key={rev.id} className="hover:bg-accent/40 text-muted-foreground transition-colors">
                      <TableCell className="font-mono text-muted-foreground/85 font-semibold px-4 py-3">{rev.id}</TableCell>
                      <TableCell className="font-bold text-foreground px-4 py-3">{rev.capabilityName}</TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 font-semibold text-foreground/80">
                          {rev.capabilityType === "Skill" ? <Sparkles size={11} className="text-primary" /> : <Cpu size={11} className="text-indigo-500" />}
                          {rev.capabilityType}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-muted-foreground font-semibold">{rev.version}</TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="space-y-0.5">
                          <p className="font-medium text-foreground">{rev.applicant}</p>
                          <p className="text-xs text-muted-foreground">{rev.department}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-muted-foreground">{rev.submitTime}</TableCell>
                      <TableCell className="px-4 py-3">{renderStatusBadge(rev.status)}</TableCell>
                      <TableCell className="px-4 py-3 text-right pr-4">
                        <Button 
                          variant="ghost"
                          onClick={() => {
                            setSelectedReview(rev);
                            setShowRejectForm(false);
                            setRejectReason("");
                          }}
                          className="h-7 px-2 text-foreground hover:bg-zinc-100 rounded-md font-semibold cursor-pointer flex items-center justify-end gap-1 ml-auto"
                        >
                          <Eye size={12} />
                          <span>审查此表</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredReviews.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-muted-foreground font-normal">
                        暂无提送审查的信息
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </ScrollArea>
      </div>

      {/* 5. Detailed Drawer Sheet overlay - zero external dependency */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs select-none">
          <div className="absolute inset-0" onClick={() => setSelectedReview(null)} />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.2 }}
            className="relative w-full max-w-lg h-full bg-card border-l border-border flex flex-col shadow-2xl text-left"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 p-4 border-b border-border bg-card flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-muted text-muted-foreground">
                  {selectedReview.capabilityType === "Skill" ? <Sparkles size={14} /> : <Cpu size={14} />}
                </span>
                <div>
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    {selectedReview.capabilityName} 申请发布
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 font-normal">申请版本: {selectedReview.version} | 流水: {selectedReview.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {renderStatusBadge(selectedReview.status)}
                <button 
                  onClick={() => setSelectedReview(null)}
                  className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Scrollable specs */}
            <ScrollArea className="flex-1 min-h-0 bg-muted/5">
              <div className="p-5 space-y-4">
                {/* Intro Card */}
                <Card className="border border-border rounded-xl bg-card p-4">
                  <span className="text-xs font-bold text-muted-foreground block mb-1">提报简介说明</span>
                  <p className="text-xs text-foreground font-normal leading-relaxed">{selectedReview.description}</p>
                  
                  {/* Basic Metadata Info */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5 border-t border-border text-xs text-muted-foreground">
                    <div>
                      <p className="font-normal text-muted-foreground/80">申请人 / 开发者</p>
                      <p className="font-bold text-foreground mt-1">{selectedReview.applicant}</p>
                    </div>
                    <div>
                      <p className="font-normal text-muted-foreground/80">申请人邮箱</p>
                      <p className="font-bold text-foreground mt-1 font-mono">{selectedReview.applicantEmail}</p>
                    </div>
                    <div>
                      <p className="font-normal text-muted-foreground/80">所属组织部门</p>
                      <p className="font-bold text-foreground mt-1">{selectedReview.department}</p>
                    </div>
                    <div>
                      <p className="font-normal text-muted-foreground/80">提审时间</p>
                      <p className="font-bold mt-1 text-foreground font-mono">{selectedReview.submitTime}</p>
                    </div>
                  </div>
                </Card>

                {/* If Skill type document specification */}
                {selectedReview.capabilityType === "Skill" && (
                  <Card className="border border-border p-4 bg-card text-xs font-normal">
                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 mb-2">
                      <FileText size={11} />
                      提报附带的 SKILL.md 文档文件内容
                    </span>
                    <div className="p-3 bg-muted rounded-lg border border-border font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground">
                      {`# ${selectedReview.capabilityName}\n\n该 Skill 已在测试集与 Prompt 安全对齐中通过。适用于日常对话中的极简提取操作。\n\n## 适用场合范围\n- 仅面向内部企业受控环境`}
                    </div>
                  </Card>
                )}

                {/* If MCP Server Type: Connection protocols */}
                {selectedReview.capabilityType === "MCP Server" && (
                  <div className="space-y-4">
                    <Card className="border border-border p-4 bg-card text-xs font-normal">
                      <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 mb-2">
                        <Terminal size={11} />
                        连接网关及媒介连接设置
                      </span>
                      <div className="space-y-2 text-xs text-foreground/85 font-normal">
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-muted-foreground">运输通信协议 Media</span>
                          <span className="font-mono font-semibold">HTTP/SSE 独立桥接</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-muted-foreground">网关 EndPoint URL</span>
                          <span className="font-mono text-primary font-semibold">https://mcp-db.internal.haze.com</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Automated verification testing result */}
                <Card className="border border-border p-4 bg-card text-xs font-normal">
                  <span className="text-xs font-bold text-muted-foreground block mb-2">自动测试 system 排查结果</span>
                  <div className="flex items-center gap-1.5 p-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg font-semibold">
                    <Check size={14} />
                    <span>自动安全与 schema 规格测试：通过 (Pass)</span>
                  </div>
                </Card>

                {/* If rejected previously, render reject notes */}
                {selectedReview.status === "rejected" && selectedReview.blockReason && (
                  <Card className="border border-destructive/20 p-4 bg-destructive/5 text-xs font-normal text-destructive">
                    <span className="text-xs font-bold text-destructive flex items-center gap-1 mb-1.5">
                      <AlertCircle size={12} />
                      审批驳回说明 (Reject Reason)
                    </span>
                    <p className="leading-relaxed font-semibold">{selectedReview.blockReason}</p>
                  </Card>
                )}
              </div>
            </ScrollArea>

            {/* ACTION FOOTER */}
            <div className="sticky bottom-0 z-10 p-4 border-t border-border bg-card shrink-0">
              {selectedReview.status === "pending" || selectedReview.status === "processing" ? (
                <div className="space-y-3 font-normal">
                  {showRejectForm ? (
                    <form onSubmit={handleRejectAction} className="space-y-2.5">
                      <label className="block text-xs font-bold text-muted-foreground">请输入拒绝提报的具体原因：</label>
                      <textarea
                        required
                        rows={2.5}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="例如: 探测到的 Tools 存在高危的只写操作，暂禁止部署至常规用户端..."
                        className="w-full p-2 text-xs bg-muted border border-input rounded-lg focus:outline-hidden text-foreground leading-normal"
                      />
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowRejectForm(false)}
                          className="h-8 cursor-pointer text-xs text-foreground"
                        >
                          取消
                        </Button>
                        <Button
                          type="submit"
                          variant="destructive"
                          className="h-8 cursor-pointer text-xs font-bold"
                        >
                          确认拒绝
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => setShowRejectForm(true)}
                        className="h-9 px-4 text-xs font-bold bg-card text-destructive border border-destructive/20 hover:bg-destructive/10 cursor-pointer"
                      >
                        <ThumbsDown size={13} className="mr-1" />
                        <span>驳回/拒绝</span>
                      </Button>
                      <Button
                        onClick={() => handleApproveAction(selectedReview)}
                        className="h-9 px-4 text-xs font-bold cursor-pointer"
                      >
                        <ThumbsUp size={13} className="mr-1" />
                        <span>同意并通过发布</span>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-end">
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedReview(null)}
                    className="h-8.5 px-4 text-xs font-semibold rounded-lg cursor-pointer text-foreground"
                  >
                    完成并关闭列表
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
