import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PublishCapabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newCapName: string;
  setNewCapName: (name: string) => void;
  newCapType: "Skill" | "MCP" | "Tool";
  setNewCapType: (type: "Skill" | "MCP" | "Tool") => void;
  newCapDesc: string;
  setNewCapDesc: (desc: string) => void;
  newCapAuthor: string;
  setNewCapAuthor: (author: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PublishCapabilityDialog({
  open,
  onOpenChange,
  newCapName,
  setNewCapName,
  newCapType,
  setNewCapType,
  newCapDesc,
  setNewCapDesc,
  newCapAuthor,
  setNewCapAuthor,
  onSubmit
}: PublishCapabilityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border border-zinc-200 rounded-lg shadow-lg">
        <DialogHeader className="p-5 pb-4 border-b border-zinc-100 bg-zinc-50/50">
          <DialogTitle className="text-sm font-semibold text-zinc-900">发布企业特定 AI 基础设施能力</DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 mt-1">
            配置并发布专属企业内部 Skill 工具到当前高可用发布区。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="p-5 space-y-4 text-xs">
          {/* Name */}
          <div className="space-y-1.5 text-left">
            <label className="font-medium text-zinc-650">能力名称 (Name)</label>
            <Input
              type="text"
              required
              value={newCapName}
              onChange={(e) => setNewCapName(e.target.value)}
              placeholder="如: 网易财务报表多因子分析"
              className="w-full bg-zinc-50/50 border-zinc-200 text-xs text-zinc-800"
            />
          </div>

          {/* Type Selection Tabs */}
          <div className="space-y-1.5 text-left">
            <label className="font-medium text-zinc-650">能力类型 (Type)</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Skill", "MCP", "Tool"] as const).map(type => (
                <Button
                  key={type}
                  type="button"
                  variant={newCapType === type ? "default" : "outline"}
                  onClick={() => setNewCapType(type)}
                  className={`h-9 text-xs font-medium cursor-pointer ${newCapType !== type ? "border-zinc-200 text-zinc-500 bg-white hover:bg-zinc-50" : ""}`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Description Textarea */}
          <div className="space-y-1.5 text-left">
            <label className="font-medium text-zinc-650">能力功能描述 (Description)</label>
            <textarea
              required
              value={newCapDesc}
              onChange={(e) => setNewCapDesc(e.target.value)}
              rows={3}
              placeholder="详细描述该 AI 技能或 MCP 服务器支持的使用场景、支持的自然语言提示词描述..."
              className="w-full bg-zinc-50/50 text-xs px-3 py-2 border border-zinc-200 rounded-lg outline-hidden text-zinc-800 focus:border-zinc-300 placeholder:text-zinc-400 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Author Selection */}
          <div className="space-y-1.5 text-left">
            <label className="font-medium text-zinc-650">发布人署名 (Publisher Signature)</label>
            <Input
              type="text"
              value={newCapAuthor}
              onChange={(e) => setNewCapAuthor(e.target.value)}
              placeholder="如: 张主管 / 项目组1"
              className="w-full bg-zinc-50/50 border-zinc-200 text-xs"
            />
          </div>

          {/* Action Buttons */}
          <DialogFooter className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs border-zinc-200 font-medium bg-white cursor-pointer">
                取消
              </Button>
            </DialogClose>
            <Button type="submit" size="sm" className="h-8 text-xs font-medium cursor-pointer">
              确认发布
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
