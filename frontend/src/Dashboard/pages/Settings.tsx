import React, { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Edit3, 
  X, 
  UserPlus, 
  Shield, 
  Power
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { MOCK_SYSTEM_MEMBERS, SystemMember } from "../../temp/systemMembers";

interface PageProps {
  onBackToHome: () => void;
  langCode?: "ZH" | "EN" | "JA" | "ES";
}

export function Settings({ onBackToHome: _onBackToHome, langCode: _langCode = "ZH" }: PageProps) {
  const [members, setMembers] = useState<SystemMember[]>(MOCK_SYSTEM_MEMBERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "Admin" | "Member">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "active" | "disabled">("All");

  // Editorial dialog states
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<SystemMember>>({
    name: "",
    email: "",
    department: "",
    role: "Member",
    status: "active"
  });

  const [formError, setFormError] = useState("");

  // Search and filters logic
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === "All" || m.role === roleFilter;
      const matchesStatus = statusFilter === "All" || m.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, searchQuery, roleFilter, statusFilter]);

  // Handle Enable / Disable member
  const toggleMemberStatus = (id: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: m.status === "active" ? "disabled" : "active"
        } as SystemMember;
      }
      return m;
    }));
  };

  // Open Add Dialog
  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentMember({
      name: "",
      email: "",
      department: "",
      role: "Member",
      status: "active"
    });
    setFormError("");
    setShowEditModal(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (member: SystemMember) => {
    setIsEditing(true);
    setCurrentMember({ ...member });
    setFormError("");
    setShowEditModal(true);
  };

  // Save Dialog Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember.name?.trim()) {
      setFormError("姓名必填");
      return;
    }
    if (!currentMember.email?.trim()) {
      setFormError("邮箱必填");
      return;
    }
    if (!currentMember.department?.trim()) {
      setFormError("部门必填");
      return;
    }

    if (isEditing) {
      // Edit existing
      setMembers(prev => prev.map(m => {
        if (m.id === currentMember.id) {
          return currentMember as SystemMember;
        }
        return m;
      }));
    } else {
      // Add new
      const nextId = "M" + (1001 + members.length);
      const newMember: SystemMember = {
        id: nextId,
        name: currentMember.name.trim(),
        email: currentMember.email.trim(),
        department: currentMember.department.trim(),
        role: (currentMember.role || "Member") as "Admin" | "Member",
        status: (currentMember.status || "active") as "active" | "disabled"
      };
      setMembers(prev => [...prev, newMember]);
    }

    setShowEditModal(false);
  };

  return (
    <div className="dashboard-page-stack h-full flex flex-col overflow-hidden" id="haze-settings-page-container">
      {/* 2. Top Controls Ribbon */}
      <div className="shrink-0 p-4 bg-card border-b border-border flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-60 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={13.5} />
            <input
              type="text"
              placeholder="搜索成员姓名、邮箱或部门..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 px-8 pr-3 text-xs bg-muted/60 border border-input rounded-lg focus:outline-hidden focus:border-ring transition-colors font-medium text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="h-8 px-2.5 text-xs bg-muted border border-input rounded-lg focus:outline-hidden font-medium text-foreground cursor-pointer"
          >
            <option value="All">所有角色</option>
            <option value="Admin">管理员 (Admin)</option>
            <option value="Member">普通组员 (Member)</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-8 px-2.5 text-xs bg-muted border border-input rounded-lg focus:outline-hidden font-medium text-foreground cursor-pointer"
          >
            <option value="All">有效状态</option>
            <option value="active">正常 (Active)</option>
            <option value="disabled">已禁用 (Disabled)</option>
          </select>
        </div>

        {/* Add Actions */}
        <Button
          onClick={handleOpenAdd}
          size="sm"
          className="w-full sm:w-auto font-medium h-8 px-3 text-xs rounded-lg cursor-pointer"
        >
          <Plus size={14} className="mr-1" />
          <span>添加企业成员</span>
        </Button>
      </div>

      {/* 3. Main Data Table */}
      <div className="flex-1 min-h-0 bg-muted/20 relative">
        <ScrollArea className="h-full w-full">
          <div className="p-4">
            <Card className="border border-border rounded-xl overflow-hidden bg-card text-left">
              <Table>
                <TableHeader className="bg-muted/40 py-1.5 border-b">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5 w-[100px]">工号</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5">成员姓名</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5">企业邮箱</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5">所属部门</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5 w-[120px]">平台基本角色</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5 w-[100px]">账号状态</TableHead>
                    <TableHead className="text-xs font-bold text-muted-foreground px-4 py-2.5 w-[160px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs divide-y divide-border">
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-accent/40 text-muted-foreground transition-colors">
                      <TableCell className="font-mono text-muted-foreground/75 font-semibold px-4 py-3">{member.id}</TableCell>
                      <TableCell className="font-bold text-foreground px-4 py-3">{member.name}</TableCell>
                      <TableCell className="font-mono text-muted-foreground px-4 py-3 font-normal">{member.email}</TableCell>
                      <TableCell className="px-4 py-3 font-medium text-foreground/80">{member.department}</TableCell>
                      <TableCell className="px-4 py-3">
                        {member.role === "Admin" ? (
                          <span className="inline-flex items-center gap-1 font-bold text-primary">
                            <Shield size={11} />
                            管理员
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
                            组员
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {member.status === "active" ? (
                          <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 bg-emerald-500/10 text-xs py-0 font-semibold px-1.5 leading-normal">
                            正常
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs py-0 font-semibold px-1.5 leading-normal text-muted-foreground">
                            已禁用
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            onClick={() => handleOpenEdit(member)}
                            className="h-7 px-2 text-foreground hover:bg-accent rounded-md flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            <Edit3 size={11} />
                            <span>编辑</span>
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => toggleMemberStatus(member.id)}
                            className={`h-7 px-2 rounded-md flex items-center gap-1 cursor-pointer font-semibold ${
                              member.status === "active" 
                                ? "text-amber-600 hover:bg-amber-500/10" 
                                : "text-emerald-600 hover:bg-emerald-500/10"
                            }`}
                          >
                            <Power size={11} />
                            <span>{member.status === "active" ? "禁用" : "启用"}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredMembers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-normal">
                        未匹配到符合当前过滤条件的企业成员
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </ScrollArea>
      </div>

      {/* 4. Edit/Create Modal (Zero External Dependency Alert Dialog) */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm p-5 bg-card border border-border rounded-xl shadow-lg text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-1.5 text-xs text-foreground font-bold">
                  <UserPlus size={14} className="text-primary" />
                  <span>{isEditing ? "编辑成员资料" : "添加新企业成员"}</span>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {formError && (
                <div className="mt-2.5 p-2 bg-destructive/10 border border-destructive/20 text-xs rounded-lg text-destructive font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSaveForm} className="mt-3 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">成员姓名</label>
                  <input
                    type="text"
                    required
                    value={currentMember.name || ""}
                    onChange={(e) => setCurrentMember(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="例如: 张小强"
                    className="w-full h-8 px-2.5 text-xs bg-muted border border-input rounded-lg focus:outline-hidden focus:border-ring font-medium text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">企业邮箱</label>
                  <input
                    type="email"
                    required
                    value={currentMember.email || ""}
                    onChange={(e) => setCurrentMember(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="例如: query@haze.co"
                    className="w-full h-8 px-2.5 text-xs bg-muted border border-input rounded-lg focus:outline-hidden focus:border-ring font-mono text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-1">所属部门 / 架构组</label>
                  <input
                    type="text"
                    required
                    value={currentMember.department || ""}
                    onChange={(e) => setCurrentMember(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="例如: AI平台研发部"
                    className="w-full h-8 px-2.5 text-xs bg-muted border border-input rounded-lg focus:outline-hidden focus:border-ring font-medium text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1">系统角色</label>
                    <select
                      value={currentMember.role || "Member"}
                      onChange={(e) => setCurrentMember(prev => ({ ...prev, role: e.target.value as any }))}
                      className="w-full h-8 px-2.5 text-xs bg-muted border border-input rounded-lg focus:outline-hidden font-medium text-foreground cursor-pointer"
                    >
                      <option value="Member">普通组成员</option>
                      <option value="Admin">超级管理员</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground mb-1">账号状态</label>
                    <select
                      value={currentMember.status || "active"}
                      onChange={(e) => setCurrentMember(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full h-8 px-2.5 text-xs bg-muted border border-input rounded-lg focus:outline-hidden font-medium text-foreground cursor-pointer"
                    >
                      <option value="active">正常有效</option>
                      <option value="disabled">暂时挂起</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-end gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="h-8 text-xs font-semibold px-3 cursor-pointer text-foreground"
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    className="h-8 text-xs font-semibold px-4 cursor-pointer"
                  >
                    保存成员信息
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
