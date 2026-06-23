import React, { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Edit3, 
  X, 
  UserPlus, 
  Shield, 
  Power,
  MoreHorizontal,
  Eye,
  Key,
  Trash2,
  Check,
  RotateCcw,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { MOCK_SYSTEM_MEMBERS, SystemMember, LOCALIZED_DEPARTMENTS, LOCALIZED_NAMES } from "../../temp/systemMembers";
import { PageHeader } from "../../components/common/PageHeader";
import { DataTableFooter } from "../../components/common/DataTableFooter";
import { getI18n } from "../../i18n";

interface PageProps {
  onBackToHome: () => void;
  langCode?: "ZH" | "EN" | "JA" | "ES";
}

export function Settings({ onBackToHome: _onBackToHome, langCode: _langCode = "ZH" }: PageProps) {
  const t = getI18n(_langCode);
  const [members, setMembers] = useState<SystemMember[]>(MOCK_SYSTEM_MEMBERS);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "Admin" | "Member">("All");
  const [statusTab, setStatusTab] = useState<"All" | "active" | "disabled">("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Add/Edit Dialog states
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<SystemMember>>({
    name: "",
    email: "",
    department: "",
    phone: "",
    role: "Member",
    status: "active"
  });
  const [formError, setFormError] = useState("");

  // Change Role Dialog states
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [targetMemberForRole, setTargetMemberForRole] = useState<SystemMember | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<"Admin" | "Member">("Member");

  // Details Dialog states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsMember, setDetailsMember] = useState<SystemMember | null>(null);

  // Confirmation AlertDialog states (for delete or toggle status)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"disable" | "enable" | "remove" | null>(null);
  const [confirmMember, setConfirmMember] = useState<SystemMember | null>(null);

  // Toast / Flash Message
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const showFlash = (msg: string) => {
    setFlashMessage(msg);
    setTimeout(() => {
      setFlashMessage(prev => prev === msg ? null : prev);
    }, 4000);
  };

  // Dynamic login time mapper based on user data/ID
  const getRecentLogin = (id: string) => {
    const member = members.find(m => m.id === id);
    if (!member || !member.lastLoginAt) return `4${t.memberMgmt_daysAgo}`;
    const date = new Date(member.lastLoginAt);
    const now = new Date("2026-06-17T12:00:00");
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const days = Math.floor(diffHours / 24);

    const pad = (n: number) => n.toString().padStart(2, "0");
    if (days === 0) {
      return `${t.memberMgmt_today} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
    if (days === 1) {
      return `${t.memberMgmt_yesterday} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
    return `${days}${t.memberMgmt_daysAgo}`;
  };

  // Generate clean dynamic pastel backgrounds for user avatars
  const getAvatarBgClass = (id: string) => {
    const num = parseInt(id.replace(/\D/g, "")) || 0;
    const bgs = [
      "bg-blue-50 text-blue-600 border border-blue-100/50",
      "bg-indigo-50 text-indigo-600 border border-indigo-100/50",
      "bg-purple-50 text-purple-600 border border-purple-100/50",
      "bg-emerald-50 text-emerald-600 border border-emerald-100/50",
      "bg-amber-50 text-amber-600 border border-amber-100/50",
      "bg-rose-50 text-rose-600 border border-rose-100/50"
    ];
    return bgs[num % bgs.length];
  };

  // Counts for tabs
  const allCount = members.length;
  const activeCount = members.filter(m => m.status === "active").length;
  const disabledCount = members.filter(m => m.status === "disabled").length;

  // Sync / Reset filters and search
  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("All");
    setStatusTab("All");
    setCurrentPage(1);
    showFlash(t.memberMgmt_msgResetFilters);
  };

  // Filtering Logic
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const query = searchQuery.trim().toLowerCase();
      // Match ID, name or email
      const matchesSearch = !query || 
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.id.toLowerCase().includes(query);
      
      const matchesRole = roleFilter === "All" || m.role === roleFilter;
      const matchesStatus = statusTab === "All" || m.status === statusTab;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, searchQuery, roleFilter, statusTab]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredMembers.length / pageSize) || 1;
  
  // Safe page guard
  const validatedPage = Math.min(currentPage, totalPages);
  
  const paginatedMembers = useMemo(() => {
    const startIndex = (validatedPage - 1) * pageSize;
    return filteredMembers.slice(startIndex, startIndex + pageSize);
  }, [filteredMembers, validatedPage, pageSize]);

  // Open Add Dialog
  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentMember({
      name: "",
      email: "",
      department: "",
      phone: "",
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

  // Save Dialog Form for Add & Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember.name?.trim()) {
      setFormError(t.memberMgmt_errName);
      return;
    }
    if (!currentMember.email?.trim()) {
      setFormError(t.memberMgmt_errEmail);
      return;
    }
    if (!currentMember.department?.trim()) {
      setFormError(t.memberMgmt_errDept);
      return;
    }
    if (!currentMember.phone?.trim()) {
      setFormError(t.memberMgmt_errPhone);
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
      showFlash(`${t.memberMgmt_msgSaveSuccess}: ${currentMember.name}`);
    } else {
      // Add new
      const nextIdNum = members.reduce((max, curr) => {
        const val = parseInt(curr.id.replace(/\D/g, "")) || 0;
        return val > max ? val : max;
      }, 1000) + 1;
      const nextId = "M" + nextIdNum;
      
      const newMember: SystemMember = {
        id: nextId,
        name: currentMember.name.trim(),
        email: currentMember.email.trim(),
        department: currentMember.department.trim(),
        phone: currentMember.phone.trim(),
        role: (currentMember.role || "Member") as "Admin" | "Member",
        status: (currentMember.status || "active") as "active" | "disabled"
      };
      setMembers(prev => [...prev, newMember]);
      showFlash(`${t.memberMgmt_msgAddSuccess}: ${newMember.name}`);
    }

    setShowEditModal(false);
  };

  // Open Confirm Dialog for status and removal
  const triggerConfirmAction = (action: "disable" | "enable" | "remove", member: SystemMember) => {
    setConfirmAction(action);
    setConfirmMember(member);
    setShowConfirmDialog(true);
  };

  // Execute Action from AlertDialog
  const executeConfirmAction = () => {
    if (!confirmMember || !confirmAction) return;

    if (confirmAction === "disable") {
      setMembers(prev => prev.map(m => m.id === confirmMember.id ? { ...m, status: "disabled" } : m));
      showFlash(`${t.memberMgmt_msgDisableSuccess}: ${confirmMember.name}`);
    } else if (confirmAction === "enable") {
      setMembers(prev => prev.map(m => m.id === confirmMember.id ? { ...m, status: "active" } : m));
      showFlash(`${t.memberMgmt_msgEnableSuccess}: ${confirmMember.name}`);
    } else if (confirmAction === "remove") {
      setMembers(prev => prev.filter(m => m.id !== confirmMember.id));
      showFlash(`${t.memberMgmt_msgRemoveSuccess}: ${confirmMember.name}`);
    }

    setShowConfirmDialog(false);
    setConfirmAction(null);
    setConfirmMember(null);
  };

  // Open Change Role Modal
  const handleOpenChangeRole = (member: SystemMember) => {
    setTargetMemberForRole(member);
    setSelectedNewRole(member.role);
    setShowRoleModal(true);
  };

  // Save Role Change
  const saveRoleChange = () => {
    if (!targetMemberForRole) return;
    setMembers(prev => prev.map(m => {
      if (m.id === targetMemberForRole.id) {
        return { ...m, role: selectedNewRole };
      }
      return m;
    }));
    setShowRoleModal(false);
    showFlash(`${t.memberMgmt_msgRoleSuccess}: ${targetMemberForRole.name} -> ${selectedNewRole === "Admin" ? t.memberMgmt_roleAdmin : t.memberMgmt_roleMember}`);
  };

  // Reset Password action
  const handleResetPassword = (member: SystemMember) => {
    showFlash(`${t.memberMgmt_msgPasswordSuccess} (${member.email})`);
  };

  // View Details action
  const handleViewDetails = (member: SystemMember) => {
    setDetailsMember(member);
    setShowDetailsModal(true);
  };

  return (
    <div className="dashboard-page-stack h-full overflow-hidden text-left font-sans flex flex-col gap-3 animate-in fade-in duration-300" id="haze-settings-page-container">
      <PageHeader
        title={t.memberMgmt_title}
        description={t.memberMgmt_desc}
        actions={(
          <Button
            onClick={handleOpenAdd}
            size="sm"
            className="w-full sm:w-auto font-bold bg-slate-900 hover:bg-slate-800 text-white h-10 px-4 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus size={16} />
            <span>{t.memberMgmt_addBtn}</span>
          </Button>
        )}
      />

      {/* Container Wrapper */}
      <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-border/70 bg-white shadow-xs p-4 pt-2.5 pb-2.5 gap-3 overflow-hidden" id="haze-settings-page-overhaul">

        {/* 2. Status Tabs */}
        <div className="flex border-b border-border/70 text-sm font-medium shrink-0" id="haze-member-tabs">
          <button 
            onClick={() => { setStatusTab("All"); setCurrentPage(1); }}
            className={`pb-3 px-4 font-bold border-b-2 transition-all duration-200 cursor-pointer text-xs ${
              statusTab === "All" 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.memberMgmt_tabAll} <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold">{allCount}</span>
          </button>
          <button 
            onClick={() => { setStatusTab("active"); setCurrentPage(1); }}
            className={`pb-3 px-4 font-bold border-b-2 transition-all duration-200 cursor-pointer text-xs ${
              statusTab === "active" 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.memberMgmt_tabActive} <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold">{activeCount}</span>
          </button>
          <button 
            onClick={() => { setStatusTab("disabled"); setCurrentPage(1); }}
            className={`pb-3 px-4 font-bold border-b-2 transition-all duration-200 cursor-pointer text-xs ${
              statusTab === "disabled" 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.memberMgmt_tabDisabled} <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-rose-600 font-bold">{disabledCount}</span>
          </button>
        </div>

        {/* 3. Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 shrink-0" id="haze-member-filter-toolbar">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box - Width 320px, Height 40px */}
            <div className="relative w-full sm:w-[320px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 w-4 h-4" />
              <Input
                type="text"
                placeholder={t.memberMgmt_searchPlaceholder}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full h-10 pl-10 pr-4 text-xs bg-background border border-input rounded-lg focus-visible:ring-blue-500 text-foreground placeholder:text-muted-foreground font-semibold"
              />
            </div>

            {/* Role select - Width 140px, Height 40px */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-10 w-[140px] px-3.5 text-xs bg-background border border-input rounded-lg flex items-center justify-between font-semibold text-foreground cursor-pointer shadow-none hover:bg-slate-50 transition-colors"
                >
                  <span>
                    {roleFilter === "All" 
                      ? t.memberMgmt_filterRoleAll 
                      : roleFilter === "Admin" 
                      ? t.memberMgmt_roleAdmin 
                      : t.memberMgmt_roleMember}
                  </span>
                  <ChevronDown size={14} className="opacity-60 ml-1 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[140px] text-xs bg-white text-slate-700 border border-slate-200 shadow-md rounded-xl p-1 z-50 animate-fade-in" align="start">
                <DropdownMenuItem 
                  onClick={() => { setRoleFilter("All"); setCurrentPage(1); }} 
                  className={`cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center justify-between ${roleFilter === "All" ? "text-blue-600 bg-blue-50/50" : ""}`}
                >
                  <span>{t.memberMgmt_filterRoleAll}</span>
                  {roleFilter === "All" && <Check size={12} className="text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => { setRoleFilter("Admin"); setCurrentPage(1); }} 
                  className={`cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center justify-between ${roleFilter === "Admin" ? "text-blue-600 bg-blue-50/50" : ""}`}
                >
                  <span>{t.memberMgmt_roleAdmin}</span>
                  {roleFilter === "Admin" && <Check size={12} className="text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => { setRoleFilter("Member"); setCurrentPage(1); }} 
                  className={`cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center justify-between ${roleFilter === "Member" ? "text-blue-600 bg-blue-50/50" : ""}`}
                >
                  <span>{t.memberMgmt_roleMember}</span>
                  {roleFilter === "Member" && <Check size={12} className="text-blue-600" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reset Button - Height 40px */}
            {(searchQuery !== "" || roleFilter !== "All" || statusTab !== "All") && (
              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="h-10 px-4 text-xs font-semibold flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <RotateCcw size={13} />
                <span>{t.memberMgmt_reset}</span>
              </Button>
            )}
          </div>
        </div>

        {/* 4. Main Data Table */}
        <div className="flex-grow flex-1 min-h-0 flex flex-col justify-between gap-2" id="haze-member-table-container">
          <div className="flex-grow flex-1 min-h-0 overflow-auto rounded-xl border border-border/70 bg-white">
            <table className="w-full min-w-[1100px] table-fixed text-xs caption-bottom border-collapse">
              <thead className="bg-slate-50 border-b border-border/50 sticky top-0 z-30 shadow-[0_1px_0_0_rgba(0,0,0,0.05)] animate-none">
                <TableRow className="h-12 hover:bg-transparent">
                  <TableHead className="w-[16%] px-4 py-3 text-xs font-bold text-muted-foreground bg-slate-50 sticky top-0 z-30 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    {t.memberMgmt_colMember}
                  </TableHead>
                  <TableHead className="w-[18%] px-4 py-3 text-xs font-bold text-muted-foreground bg-slate-50 sticky top-0 z-30 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    {t.memberMgmt_colEmail}
                  </TableHead>
                  <TableHead className="w-[12%] px-4 py-3 text-xs font-bold text-muted-foreground bg-slate-50 sticky top-0 z-30 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    {t.memberMgmt_colPhone}
                  </TableHead>
                  <TableHead className="w-[14%] px-4 py-3 text-xs font-bold text-muted-foreground bg-slate-50 sticky top-0 z-30 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    {t.memberMgmt_colDept}
                  </TableHead>
                  <TableHead className="w-[10%] px-4 py-3 text-xs font-bold text-muted-foreground bg-slate-50 sticky top-0 z-30 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    {t.memberMgmt_colRole}
                  </TableHead>
                  <TableHead className="w-[10%] px-4 py-3 text-xs font-bold text-muted-foreground bg-slate-50 sticky top-0 z-30 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    {t.memberMgmt_colStatus}
                  </TableHead>
                  <TableHead className="w-[12%] px-4 py-3 text-xs font-bold text-muted-foreground bg-slate-50 sticky top-0 z-30 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    {t.memberMgmt_colLogin}
                  </TableHead>
                  <TableHead className="w-[8%] px-4 py-3 text-xs font-bold text-muted-foreground text-right bg-slate-50 sticky top-0 z-30 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    {t.memberMgmt_colAction}
                  </TableHead>
                </TableRow>
              </thead>
              <TableBody className="divide-y divide-border/40">
                {paginatedMembers.map((member) => (
                  <TableRow key={member.id} className="h-[68px] hover:bg-slate-50/40 text-muted-foreground transition-colors">
                    {/* Member (16%) */}
                    <TableCell className="w-[16%] px-4 py-3 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 shrink-0 font-bold text-xs rounded-full flex items-center justify-center ${getAvatarBgClass(member.id)}`}>
                          {(LOCALIZED_NAMES[member.name]?.[_langCode] || member.name).charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-sm text-foreground truncate">
                            {LOCALIZED_NAMES[member.name]?.[_langCode] || member.name}
                          </span>
                          <span className="text-xs text-muted-foreground/80 font-medium truncate mt-0.5 animate-none">
                            {member.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Email (18%) */}
                    <TableCell className="w-[18%] px-4 py-3 text-xs font-medium text-foreground/85 truncate">
                      {member.email}
                    </TableCell>

                    {/* Phone (12%) */}
                    <TableCell className="w-[12%] px-4 py-3 text-xs font-medium text-foreground/85 truncate">
                      {member.phone || "-"}
                    </TableCell>

                    {/* Department (14%) */}
                    <TableCell className="w-[14%] px-4 py-3 text-sm font-semibold text-foreground/80 truncate">
                      {LOCALIZED_DEPARTMENTS[member.department]?.[_langCode] || member.department}
                    </TableCell>

                    {/* Role (10%) */}
                    <TableCell className="w-[10%] px-4 py-3">
                      {member.role === "Admin" ? (
                        <Badge variant="outline" className="border-none bg-blue-50 text-blue-600 hover:bg-blue-50/80 font-bold text-xs py-0.5 px-2.5 rounded-md">
                          {t.memberMgmt_roleAdmin}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-none bg-slate-100 text-slate-500 hover:bg-slate-100 font-bold text-xs py-0.5 px-2.5 rounded-md">
                          {t.memberMgmt_roleMember}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Status (10%) */}
                    <TableCell className="w-[10%] px-4 py-3">
                      {member.status === "active" ? (
                        <Badge variant="outline" className="border-none bg-emerald-50 text-emerald-600 hover:bg-emerald-50 font-black text-xs py-0.5 px-2.5 rounded-md">
                          {t.memberMgmt_tabActive}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-none bg-rose-50 text-rose-600 hover:bg-rose-50 font-black text-xs py-0.5 px-2.5 rounded-md">
                          {t.memberMgmt_tabDisabled}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Recent login (12%) */}
                    <TableCell className="w-[12%] px-4 py-3 text-sm font-medium text-muted-foreground">
                      {getRecentLogin(member.id)}
                    </TableCell>

                    {/* Actions (8% - 右对齐) */}
                    <TableCell className="w-[8%] px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          onClick={() => handleOpenEdit(member)}
                          className="h-8 px-2.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg flex items-center gap-1 cursor-pointer font-bold transition-all"
                        >
                          <Edit3 size={12} />
                          <span>{t.memberMgmt_edit}</span>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              <MoreHorizontal size={15} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs bg-white text-slate-700 border border-slate-100 shadow-md rounded-xl p-1 w-[140px] z-50">
                            <DropdownMenuItem 
                              onClick={() => handleViewDetails(member)}
                              className="cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center gap-1.5"
                            >
                              <Eye size={12} className="text-slate-400" />
                              <span>{t.memberMgmt_viewDetails}</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem 
                              onClick={() => handleOpenChangeRole(member)}
                              className="cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center gap-1.5"
                            >
                              <Shield size={12} className="text-slate-400" />
                              <span>{t.memberMgmt_changeRole}</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              onClick={() => handleResetPassword(member)}
                              className="cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center gap-1.5"
                            >
                              <Key size={12} className="text-slate-400" />
                              <span>{t.memberMgmt_resetPassword}</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {member.status === "active" ? (
                              <DropdownMenuItem 
                                onClick={() => triggerConfirmAction("disable", member)}
                                className="cursor-pointer font-bold p-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus:bg-rose-50 rounded-lg flex items-center gap-1.5"
                              >
                                <Power size={12} />
                                <span>{t.memberMgmt_disableAccount}</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => triggerConfirmAction("enable", member)}
                                className="cursor-pointer font-bold p-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 focus:bg-emerald-50 rounded-lg flex items-center gap-1.5"
                              >
                                <Power size={12} />
                                <span>{t.memberMgmt_enableAccount}</span>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem 
                              onClick={() => triggerConfirmAction("remove", member)}
                              className="cursor-pointer font-bold p-2 text-destructive hover:bg-destructive/10 focus:bg-destructive/10 rounded-lg flex items-center gap-1.5"
                            >
                              <Trash2 size={12} />
                              <span>{t.memberMgmt_removeMember}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedMembers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground font-semibold">
                      {t.memberMgmt_noMatches}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </table>
          </div>

          {/* 5. Pagination controls */}
          <DataTableFooter
            totalItems={filteredMembers.length}
            currentPage={validatedPage}
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

      {/* 6. Edit/Create Modal (AnimatePresence Overlay) */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[420px] p-6 bg-card border border-border rounded-xl shadow-lg text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-foreground font-bold">
                  <UserPlus size={16} className="text-blue-600" />
                  <span>
                    {isEditing ? t.memberMgmt_editDetails : t.memberMgmt_addNew}
                  </span>
                </div>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg p-0.5 hover:bg-slate-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {formError && (
                <div className="mt-3 p-2.5 bg-destructive/10 border border-destructive/20 text-xs rounded-lg text-destructive font-bold">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSaveForm} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground pb-1.5">
                    {t.memberMgmt_formName}
                  </label>
                  <Input
                    type="text"
                    required
                    value={currentMember.name || ""}
                    onChange={(e) => setCurrentMember(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full h-10 px-3 text-xs bg-background border border-input rounded-lg focus:outline-hidden focus:border-blue-500 font-medium text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground pb-1.5">
                    {t.memberMgmt_formEmail}
                  </label>
                  <Input
                    type="email"
                    required
                    value={currentMember.email || ""}
                    onChange={(e) => setCurrentMember(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full h-10 px-3 text-xs bg-background border border-input rounded-lg focus:outline-hidden focus:border-blue-500 font-medium text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground pb-1.5">
                    {t.memberMgmt_formPhone}
                  </label>
                  <Input
                    type="text"
                    required
                    value={currentMember.phone || ""}
                    onChange={(e) => setCurrentMember(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full h-10 px-3 text-xs bg-background border border-input rounded-lg focus:outline-hidden focus:border-blue-500 font-medium text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground pb-1.5">
                    {t.memberMgmt_formDept}
                  </label>
                  <div className="relative flex items-center">
                    <Input
                      type="text"
                      required
                      value={currentMember.department || ""}
                      onChange={(e) => setCurrentMember(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full h-10 pl-3 pr-10 text-xs bg-background border border-input rounded-lg focus:outline-hidden focus:border-blue-500 font-medium text-foreground"
                    />
                    <div className="absolute right-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-slate-100 rounded-md cursor-pointer"
                          >
                            <ChevronDown size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px] text-xs bg-white text-slate-700 border border-slate-200 shadow-md rounded-xl p-1 z-[100]" align="end">
                          {Object.keys(LOCALIZED_DEPARTMENTS[_langCode] || LOCALIZED_DEPARTMENTS.ZH).map((dept) => (
                            <DropdownMenuItem
                              key={dept}
                              onClick={() => setCurrentMember(prev => ({ ...prev, department: dept }))}
                              className="cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center justify-between"
                            >
                              <span>{dept}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground pb-1.5">
                      {t.memberMgmt_formRole}
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          type="button"
                          variant="outline" 
                          className="w-full h-10 px-3 text-xs bg-background border border-input rounded-lg flex items-center justify-between font-semibold text-foreground cursor-pointer shadow-none hover:bg-slate-50 transition-colors"
                        >
                          <span>
                            {currentMember.role === "Admin" ? t.memberMgmt_roleAdmin : t.memberMgmt_roleMember}
                          </span>
                          <ChevronDown size={14} className="opacity-60 shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[180px] text-xs bg-white text-slate-700 border border-slate-200 shadow-md rounded-xl p-1 z-[100]" align="start">
                        <DropdownMenuItem 
                          onClick={() => setCurrentMember(prev => ({ ...prev, role: "Member" }))}
                          className={`cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center justify-between ${currentMember.role !== "Admin" ? "text-blue-600 bg-blue-50/50" : ""}`}
                        >
                          <span>{t.memberMgmt_roleMember}</span>
                          {currentMember.role !== "Admin" && <Check size={12} className="text-blue-600" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setCurrentMember(prev => ({ ...prev, role: "Admin" }))}
                          className={`cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center justify-between ${currentMember.role === "Admin" ? "text-blue-600 bg-blue-50/50" : ""}`}
                        >
                          <span>{t.memberMgmt_roleAdmin}</span>
                          {currentMember.role === "Admin" && <Check size={12} className="text-blue-600" />}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted-foreground pb-1.5">
                      {t.memberMgmt_formStatus}
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          type="button"
                          variant="outline" 
                          className="w-full h-10 px-3 text-xs bg-background border border-input rounded-lg flex items-center justify-between font-semibold text-foreground cursor-pointer shadow-none hover:bg-slate-50 transition-colors"
                        >
                          <span>
                            {currentMember.status === "disabled" ? t.memberMgmt_tabDisabled : t.memberMgmt_tabActive}
                          </span>
                          <ChevronDown size={14} className="opacity-60 shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[180px] text-xs bg-white text-slate-700 border border-slate-200 shadow-md rounded-xl p-1 z-[100]" align="start">
                        <DropdownMenuItem 
                          onClick={() => setCurrentMember(prev => ({ ...prev, status: "active" }))}
                          className={`cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center justify-between ${currentMember.status !== "disabled" ? "text-blue-600 bg-blue-50/50" : ""}`}
                        >
                          <span>{t.memberMgmt_tabActive}</span>
                          {currentMember.status !== "disabled" && <Check size={12} className="text-blue-600" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setCurrentMember(prev => ({ ...prev, status: "disabled" }))}
                          className={`cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center justify-between ${currentMember.status === "disabled" ? "text-blue-600 bg-blue-50/50" : ""}`}
                        >
                          <span>{t.memberMgmt_tabDisabled}</span>
                          {currentMember.status === "disabled" && <Check size={12} className="text-blue-600" />}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-end gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="h-9 text-xs font-bold px-4 cursor-pointer text-foreground"
                  >
                    {t.cancel}
                  </Button>
                  <Button
                    type="submit"
                    className="h-9 text-xs font-bold px-5 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    {t.memberMgmt_saveBtn}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Change Role Modal */}
      <AnimatePresence>
        {showRoleModal && targetMemberForRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[360px] p-6 bg-card border border-border rounded-xl shadow-lg text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-foreground font-bold">
                  <Shield size={16} className="text-blue-600" />
                  <span>{t.memberMgmt_changeRole}</span>
                </div>
                <button 
                  onClick={() => setShowRoleModal(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg p-0.5 hover:bg-slate-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="my-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  {_langCode === "ZH" ? <>请为成员 <strong className="text-foreground">{LOCALIZED_NAMES[targetMemberForRole.name]?.[_langCode] || targetMemberForRole.name}</strong> 选择新的企业控制台角色。</> 
                   : _langCode === "JA" ? <>メンバー <strong className="text-foreground">{LOCALIZED_NAMES[targetMemberForRole.name]?.[_langCode] || targetMemberForRole.name}</strong> の新しいロールを選択してください。</> 
                   : _langCode === "ES" ? <>Seleccione el rol de consola para <strong className="text-foreground">{LOCALIZED_NAMES[targetMemberForRole.name]?.[_langCode] || targetMemberForRole.name}</strong>.</> 
                   : <>Select console role for <strong className="text-foreground">{LOCALIZED_NAMES[targetMemberForRole.name]?.[_langCode] || targetMemberForRole.name}</strong>.</>}
                </p>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground pb-1.5">
                    {t.memberMgmt_formRole}
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full h-10 px-3 text-xs bg-background border border-input rounded-lg flex items-center justify-between font-semibold text-foreground cursor-pointer shadow-none hover:bg-slate-50 transition-colors"
                      >
                        <span>
                          {selectedNewRole === "Admin" ? t.memberMgmt_roleAdmin : t.memberMgmt_roleMember}
                        </span>
                        <ChevronDown size={14} className="opacity-60 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[220px] text-xs bg-white text-slate-700 border border-slate-200 shadow-md rounded-xl p-1 z-[100]" align="start">
                      <DropdownMenuItem 
                        onClick={() => setSelectedNewRole("Admin")}
                        className={`cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center justify-between ${selectedNewRole === "Admin" ? "text-blue-600 bg-blue-50/50" : ""}`}
                      >
                        <span>{t.memberMgmt_roleAdmin}</span>
                        {selectedNewRole === "Admin" && <Check size={12} className="text-blue-600" />}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSelectedNewRole("Member")}
                        className={`cursor-pointer font-bold p-2 hover:bg-slate-50 focus:bg-slate-50 rounded-lg flex items-center justify-between ${selectedNewRole === "Member" ? "text-blue-600 bg-blue-50/50" : ""}`}
                      >
                        <span>{t.memberMgmt_roleMember}</span>
                        {selectedNewRole === "Member" && <Check size={12} className="text-blue-600" />}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRoleModal(false)}
                  className="h-8 text-xs font-bold px-3.5 cursor-pointer text-foreground"
                >
                  {t.cancel}
                </Button>
                <Button
                  onClick={saveRoleChange}
                  className="h-8 text-xs font-bold px-4 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white"
                >
                  {t.memberMgmt_saveBtn}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. View Details Modal */}
      <AnimatePresence>
        {showDetailsModal && detailsMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[400px] p-6 bg-card border border-border rounded-xl shadow-lg text-left"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-foreground font-bold">
                  <Eye size={16} className="text-blue-600" />
                  <span>{t.memberMgmt_viewDetails}</span>
                </div>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg p-0.5 hover:bg-slate-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {/* Header Avatar and Name info */}
                <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  <div className={`h-12 w-12 shrink-0 font-bold text-base rounded-full flex items-center justify-center ${getAvatarBgClass(detailsMember.id)}`}>
                    {(LOCALIZED_NAMES[detailsMember.name]?.[_langCode] || detailsMember.name).charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-foreground">{LOCALIZED_NAMES[detailsMember.name]?.[_langCode] || detailsMember.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {_langCode === "ZH" ? `工号: ${detailsMember.id}` : _langCode === "JA" ? `社員番号: ${detailsMember.id}` : _langCode === "ES" ? `ID: ${detailsMember.id}` : `ID: ${detailsMember.id}`}
                    </p>
                  </div>
                </div>

                {/* Detail list elements */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50 border-border/40">
                    <span className="text-muted-foreground font-semibold">
                      {t.memberMgmt_colEmail}
                    </span>
                    <span className="text-foreground font-bold">{detailsMember.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 border-border/40">
                    <span className="text-muted-foreground font-semibold">
                      {t.memberMgmt_colDept}
                    </span>
                    <span className="text-foreground font-bold">{LOCALIZED_DEPARTMENTS[detailsMember.department]?.[_langCode] || detailsMember.department}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 border-border/40">
                    <span className="text-muted-foreground font-semibold">
                      {t.memberMgmt_colPhone}
                    </span>
                    <span className="text-foreground font-bold">{detailsMember.phone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 border-border/40">
                    <span className="text-muted-foreground font-semibold">
                      {t.memberMgmt_colRole}
                    </span>
                    <span>
                      {detailsMember.role === "Admin" ? (
                        <Badge variant="outline" className="border-none bg-blue-50 text-blue-600 font-bold text-xs py-0 px-1.5 rounded-sm">
                          {t.memberMgmt_roleAdmin}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-none bg-slate-100 text-slate-500 font-bold text-xs py-0 px-1.5 rounded-sm">
                          {t.memberMgmt_roleMember}
                        </Badge>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50 border-border/40">
                    <span className="text-muted-foreground font-semibold">
                      {t.memberMgmt_colStatus}
                    </span>
                    <span>
                      {detailsMember.status === "active" ? (
                        <Badge variant="outline" className="border-none bg-emerald-50 text-emerald-600 font-bold text-xs py-0 px-1.5 rounded-sm">
                          {t.memberMgmt_tabActive}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-none bg-rose-50 text-rose-600 font-bold text-xs py-0 px-1.5 rounded-sm">
                          {t.memberMgmt_tabDisabled}
                        </Badge>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground font-semibold">
                      {t.memberMgmt_colLogin}
                    </span>
                    <span className="text-foreground font-bold">{getRecentLogin(detailsMember.id)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border flex justify-end">
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  className="h-8.5 text-xs font-bold px-4 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
                >
                  {_langCode === "ZH" ? "关闭" : _langCode === "JA" ? "閉じる" : _langCode === "ES" ? "Cerrar" : "Close"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. AlertDialog for Danger actions (Disabling / Enabling / Removing) */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-white border rounded-xl shadow-lg w-full max-w-sm p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900 text-left flex items-center gap-2">
              <span>{t.memberMgmt_confirmTitle}</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground text-left mt-2 leading-relaxed">
              {confirmAction === "remove" && (
                <>
                  {_langCode === "ZH" ? <>您正在执行危险操作：将成员 <strong className="text-red-600">{LOCALIZED_NAMES[confirmMember?.name]?.[_langCode] || confirmMember?.name}</strong> 从企业管理控制台中彻底移除。此操作不可逆，移除后其将无法再次登录。是否确认继续？</>
                   : _langCode === "JA" ? <>危険：メンバー <strong className="text-red-600">{LOCALIZED_NAMES[confirmMember?.name]?.[_langCode] || confirmMember?.name}</strong> を企業リストから完全に削除します。この操作は元に戻せません。続行しますか？</>
                   : _langCode === "ES" ? <>Acción peligrosa: eliminar permanentemente al miembro <strong className="text-red-600">{LOCALIZED_NAMES[confirmMember?.name]?.[_langCode] || confirmMember?.name}</strong> de la consola. Esta acción es irreversible. ¿Desea continuar?</>
                   : <>Dangerous action: permanently remove member <strong className="text-red-600">{LOCALIZED_NAMES[confirmMember?.name]?.[_langCode] || confirmMember?.name}</strong> from the roster. This action is irreversible. Do you wish to continue?</>}
                </>
              )}
              {confirmAction === "disable" && (
                <>
                  {_langCode === "ZH" ? <>您正在执行禁用操作：挂起成员 <strong className="text-slate-900">{LOCALIZED_NAMES[confirmMember?.name]?.[_langCode] || confirmMember?.name}</strong> 的账号凭证。禁用后，该成员将暂时无法进入工作台或使用任何 Skill，但其历史数据和发布信息将被保留。是否继续？</>
                   : _langCode === "JA" ? <>アカウント無効化：メンバー <strong className="text-slate-900">{LOCALIZED_NAMES[confirmMember?.name]?.[_langCode] || confirmMember?.name}</strong> を一时的に無効にします。これにより、一部機能へのアクセスが一時停止されますが、データは維持されます。続行しますか？</>
                   : _langCode === "ES" ? <>Deshabilitar: suspender temporalmente la cuenta del miembro <strong className="text-slate-900">{LOCALIZED_NAMES[confirmMember?.name]?.[_langCode] || confirmMember?.name}</strong>. Se conservarán los datos históricos. ¿Desea continuar?</>
                   : <>Disable: temporarily suspend member <strong className="text-slate-900">{LOCALIZED_NAMES[confirmMember?.name]?.[_langCode] || confirmMember?.name}</strong>. Historical data and records will be retained. Do you wish to continue?</>}
                </>
              )}
              {confirmAction === "enable" && (
                <>
                  {_langCode === "ZH" ? <>您正准备重新启用成员 <strong className="text-slate-900">{LOCALIZED_NAMES[confirmMember?.name]?.[_langCode] || confirmMember?.name}</strong> 的账号访问权限。启用后，该成员可立即登录使用平台。是否继续？</>
                   : _langCode === "JA" ? <>アカウント再有効化：メンバー <strong className="text-slate-900">{LOCALIZED_NAMES[confirmMember?.name]?.[_langCode] || confirmMember?.name}</strong> のアカウントを有効に戻します。ログインを直ちに許可します。続行しますか？</>
                   : _langCode === "ES" ? <>Habilitar: restaurar permisos de acceso para <strong className="text-slate-900">{LOCALIZED_NAMES[confirmMember?.name]?.[_langCode] || confirmMember?.name}</strong>. ¿Desea continuar?</>
                   : <>Enable: restore login and workspace permissions for <strong className="text-slate-900">{LOCALIZED_NAMES[confirmMember?.name]?.[_langCode] || confirmMember?.name}</strong>. Do you wish to continue?</>}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex flex-row justify-end gap-2 text-xs">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="h-8 px-3 text-xs font-bold text-slate-600 cursor-pointer">
                {t.cancel}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={executeConfirmAction}
                className={`h-8 px-4 text-xs font-bold text-white cursor-pointer transition-colors ${
                  confirmAction === "remove"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : confirmAction === "disable"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {t.memberMgmt_confirmBtn}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 10. Dynamic Floating Interactive Success Toast notifications */}
      <AnimatePresence>
        {flashMessage && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-blue-105 bg-blue-900 px-4 py-3 text-xs font-bold text-white shadow-xl/90"
          >
            <Check size={14} className="text-emerald-400 shrink-0" />
            <span>{flashMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
