import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "../../lib/api";
import {
  createCapability,
  createCapabilityVersion,
  deleteCapability,
  formatFileSize,
  listCapabilities,
  loadCapabilityIcon,
  offlineCapability,
  publishCapability,
  updateCapability,
  uploadCapabilityFile,
  uploadCapabilityIcon,
} from "../../lib/capabilities";
import { getI18n } from "../../i18n";
import { AssetStatus, DeveloperAsset } from "../../types/developer-center";
import { DEFAULT_ASSET, SIMULATION_FINISH_DELAY, SIMULATION_LOGS } from "./config";

export type AssetTypeFilter = "all" | "Skill" | "MCP Server";

function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : error instanceof Error ? error.message : "请求失败，请稍后重试";
}

export function useDeveloperCapabilities(langCode: "ZH" | "EN" | "JA" | "ES") {
  const t = getI18n(langCode);
  const [assets, setAssets] = useState<DeveloperAsset[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({ all: 0, skill: 0, mcp: 0 });
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTypeTab, setActiveTypeTab] = useState<AssetTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | AssetStatus>("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshVersion, setRefreshVersion] = useState(0);

  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Partial<DeveloperAsset>>(DEFAULT_ASSET);
  const [tagsInputText, setTagsInputText] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [showNewVersionModal, setShowNewVersionModal] = useState(false);
  const [newVersionAsset, setNewVersionAsset] = useState<DeveloperAsset | null>(null);
  const [newVersionNum, setNewVersionNum] = useState("");
  const [newVersionDesc, setNewVersionDesc] = useState("");
  const [newVersionZipName, setNewVersionZipName] = useState("");
  const [newVersionZipSize, setNewVersionZipSize] = useState("");
  const [newVersionZipFiles, setNewVersionZipFiles] = useState<{ name: string; size: string }[]>([]);
  const [newVersionPackageToken, setNewVersionPackageToken] = useState<string>();
  const [newVersionErrors, setNewVersionErrors] = useState<Record<string, string>>({});

  const [showDebugModal, setShowDebugModal] = useState(false);
  const [debugAsset, setDebugAsset] = useState<DeveloperAsset | null>(null);
  const [debugStatus, setDebugStatus] = useState<"idle" | "testing" | "pass" | "fail">("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [terminalLogs, setTerminalLogs] = useState<Array<{ time: string; type: string; text: string }>>([]);
  const [testStarted, setTestStarted] = useState(false);
  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const [deleteTarget, setDeleteTarget] = useState<DeveloperAsset | null>(null);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const iconUrlsRef = useRef<string[]>([]);
  const requestIdRef = useRef(0);

  const triggerFlashAlert = useCallback((message: string) => {
    setFlashMessage(message);
    window.setTimeout(() => setFlashMessage(null), 3000);
  }, []);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const timer = window.setTimeout(async () => {
      try {
        const type = activeTypeTab === "Skill" ? "skill" : activeTypeTab === "MCP Server" ? "mcp" : undefined;
        const reviewing = statusFilter === "reviewing";
        const result = await listCapabilities({
          page: currentPage,
          pageSize,
          search: searchQuery.trim(),
          type,
          status: statusFilter === "draft" || statusFilter === "published" || statusFilter === "offline" ? statusFilter : undefined,
        });
        const hydrated = await Promise.all(result.items.map(async (asset) => {
          if (!asset.icon) return asset;
          try {
            return { ...asset, icon: await loadCapabilityIcon(asset.icon) };
          } catch {
            return { ...asset, icon: undefined };
          }
        }));
        if (requestId !== requestIdRef.current) {
          hydrated.forEach((asset) => asset.icon?.startsWith("blob:") && URL.revokeObjectURL(asset.icon));
          return;
        }
        iconUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        iconUrlsRef.current = hydrated.flatMap((asset) => asset.icon?.startsWith("blob:") ? [asset.icon] : []);
        setAssets(reviewing ? [] : hydrated);
        setTotalItems(reviewing ? 0 : result.total);
        setCounts(result.counts);
      } catch (error) {
        if (requestId === requestIdRef.current) {
          setAssets([]);
          setTotalItems(0);
          triggerFlashAlert(errorMessage(error));
        }
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [activeTypeTab, currentPage, pageSize, refreshVersion, searchQuery, statusFilter, triggerFlashAlert]);

  useEffect(() => () => {
    iconUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    timeoutsRef.current.forEach(clearTimeout);
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const refresh = () => setRefreshVersion((value) => value + 1);
  const resetToFirstPage = () => setCurrentPage(1);
  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveTypeTab("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleOpenAddAsset = (type: "Skill" | "MCP Server" = "Skill") => {
    setIsEditing(false);
    setFormErrors({});
    setTagsInputText("");
    setCurrentAsset({ ...DEFAULT_ASSET, type, project: "企业办公", version: "v1.0.0", description: "" });
    setShowEditModal(true);
  };

  const handleOpenEditAsset = (asset: DeveloperAsset) => {
    setIsEditing(true);
    setFormErrors({});
    setTagsInputText((asset.tags || []).join("，"));
    setCurrentAsset({ ...asset, iconUploadToken: undefined, packageUploadToken: undefined });
    setShowEditModal(true);
  };

  const handleIconFileUploaded = async (file: File, previewUrl: string) => {
    setCurrentAsset((previous) => ({ ...previous, icon: previewUrl, iconUploadToken: undefined }));
    try {
      const upload = await uploadCapabilityIcon(file);
      setCurrentAsset((previous) => ({ ...previous, iconUploadToken: upload.uploadToken }));
      setFormErrors((previous) => ({ ...previous, icon: "" }));
    } catch (error) {
      setFormErrors((previous) => ({ ...previous, icon: errorMessage(error) }));
    }
  };

  const handleZipFileUploaded = async (file: File) => {
    try {
      const type = currentAsset.type === "MCP Server" ? "mcp" : "skill";
      const upload = await uploadCapabilityFile(file, type);
      setCurrentAsset((previous) => ({
        ...previous,
        packageUploadToken: upload.uploadToken,
        zipName: upload.fileName,
        zipSize: formatFileSize(upload.size),
        zipFiles: upload.files.map((item) => ({ name: item.name, size: formatFileSize(item.size) })),
      }));
      setFormErrors((previous) => ({ ...previous, zipName: "" }));
    } catch (error) {
      setFormErrors((previous) => ({ ...previous, zipName: errorMessage(error) }));
    }
  };

  const validateAsset = () => {
    const errors: Record<string, string> = {};
    if (!currentAsset.name?.trim()) errors.name = "能力名称不能为空";
    else if (currentAsset.name.length > 100) errors.name = "能力名称不能超过 100 个字符";
    if (!currentAsset.code?.trim()) errors.code = "Slug 不能为空";
    else if (!/^[a-z0-9_-]{3,50}$/.test(currentAsset.code)) errors.code = "Slug 只允许小写字母、数字、下划线和中划线，3-50 个字符";
    if (!currentAsset.project?.trim()) errors.project = "请选择业务分类";
    if (!currentAsset.description?.trim()) errors.description = "能力描述不能为空";
    else if (currentAsset.description.length > 300) errors.description = "能力描述不能超过 300 个字符";
    if (!isEditing && !currentAsset.packageUploadToken) errors.zipName = "能力 ZIP 文件必填";
    return errors;
  };

  const handleSaveAssetForm = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validateAsset();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }
    try {
      if (isEditing) await updateCapability(currentAsset);
      else await createCapability(currentAsset);
      setShowEditModal(false);
      triggerFlashAlert(isEditing ? `能力 [${currentAsset.name}] 更新成功` : `新建能力 [${currentAsset.name}] 成功并保存为草稿`);
      refresh();
    } catch (error) {
      const message = errorMessage(error);
      if (error instanceof ApiError && error.status === 409) setFormErrors((previous) => ({ ...previous, code: message }));
      triggerFlashAlert(message);
    }
  };

  const handlePublishAsset = async (asset: DeveloperAsset) => {
    try {
      await publishCapability(asset.id);
      triggerFlashAlert(`能力 [${asset.name}] 已发布到能力市场`);
      refresh();
    } catch (error) {
      triggerFlashAlert(errorMessage(error));
    }
  };

  const handleOfflineAsset = async (asset: DeveloperAsset) => {
    try {
      await offlineCapability(asset.id);
      triggerFlashAlert(`能力 [${asset.name}] 已下线`);
      refresh();
    } catch (error) {
      triggerFlashAlert(errorMessage(error));
    }
  };

  const handleIncrementVersion = (asset: DeveloperAsset) => {
    const parts = asset.version.replace(/^v/, "").split(".");
    if (parts.length === 3) parts[1] = String(Number(parts[1]) + 1);
    setNewVersionAsset(asset);
    setNewVersionNum(parts.length === 3 ? parts.join(".") : "1.1.0");
    setNewVersionDesc("");
    setNewVersionZipName("");
    setNewVersionZipSize("");
    setNewVersionZipFiles([]);
    setNewVersionPackageToken(undefined);
    setNewVersionErrors({});
    setShowNewVersionModal(true);
  };

  const handleNewVersionZipUploaded = async (file: File) => {
    if (!newVersionAsset) return;
    try {
      const type = newVersionAsset.type === "MCP Server" ? "mcp" : "skill";
      const upload = await uploadCapabilityFile(file, type);
      setNewVersionPackageToken(upload.uploadToken);
      setNewVersionZipName(upload.fileName);
      setNewVersionZipSize(formatFileSize(upload.size));
      setNewVersionZipFiles(upload.files.map((item) => ({ name: item.name, size: formatFileSize(item.size) })));
      setNewVersionErrors((previous) => ({ ...previous, zipName: "" }));
    } catch (error) {
      setNewVersionErrors((previous) => ({ ...previous, zipName: errorMessage(error) }));
    }
  };

  const handleSaveNewVersion = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newVersionAsset) return;
    const errors: Record<string, string> = {};
    if (!/^\d+\.\d+\.\d+$/.test(newVersionNum.trim())) errors.version = t.developerVersionFormat;
    if (!newVersionDesc.trim()) errors.description = t.developerDescriptionRequired;
    if (newVersionAsset.type === "Skill" && !newVersionPackageToken) errors.zipName = t.developerSkillZipRequired;
    if (Object.keys(errors).length) {
      setNewVersionErrors(errors);
      return;
    }
    try {
      await createCapabilityVersion(newVersionAsset.id, newVersionNum, newVersionDesc, newVersionPackageToken);
      setShowNewVersionModal(false);
      triggerFlashAlert(`已成功创建新版本 [${newVersionAsset.name}] v${newVersionNum}`);
      refresh();
    } catch (error) {
      triggerFlashAlert(errorMessage(error));
    }
  };

  const handleDeleteAsset = async (asset: DeveloperAsset) => {
    try {
      await deleteCapability(asset.id);
      setDeleteTarget(null);
      triggerFlashAlert(`资产能力 [${asset.name}] 已从工作区移除`);
      refresh();
    } catch (error) {
      triggerFlashAlert(errorMessage(error));
    }
  };

  const handleCopyAssetCode = (asset: DeveloperAsset) => {
    const text = asset.type === "Skill" ? `${asset.name} (Slug: ${asset.code}):\n${asset.description || ""}` : asset.code;
    navigator.clipboard.writeText(text);
    triggerFlashAlert("已复制 Prompt 到剪贴板");
  };

  const handleOpenDebug = (asset: DeveloperAsset) => {
    setDebugAsset({ ...asset });
    setDebugStatus("idle");
    setCurrentStepIndex(-1);
    setTerminalLogs([]);
    setTestStarted(false);
    setShowDebugModal(true);
  };

  const formatTerminalTime = () => {
    const date = new Date();
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}.${String(date.getMilliseconds()).padStart(3, "0")}`;
  };

  const runSimulation = (asset?: DeveloperAsset) => {
    const target = asset || debugAsset;
    if (!target) return;
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setTerminalLogs([]);
    setCurrentStepIndex(0);
    setDebugStatus("testing");
    const pushLog = (type: string, text: string) => setTerminalLogs((previous) => [
      ...previous,
      { time: formatTerminalTime(), type, text },
    ]);
    pushLog("START", `开始测试 MCP 服务: ${target.serverUrl || `http://127.0.0.1:3000/api/mcp/${target.code}`}`);
    SIMULATION_LOGS.forEach((log) => {
      timeoutsRef.current.push(setTimeout(() => {
        if (log.type === "SYSTEM_STEP") setCurrentStepIndex(log.nextStepIdx);
        else pushLog(log.type, log.text);
      }, log.delay));
    });
    timeoutsRef.current.push(setTimeout(() => {
      setDebugStatus("pass");
      triggerFlashAlert("模拟测试已完成，正式测试状态需管理员确认");
    }, SIMULATION_FINISH_DELAY));
  };

  const tabCounts = useMemo(() => ({
    all: counts.all ?? 0,
    skill: counts.skill ?? 0,
    mcp: counts.mcp ?? 0,
  }), [counts]);

  return {
    assets, tabCounts, totalItems, totalPages, safeCurrentPage,
    searchQuery, setSearchQuery, activeTypeTab, setActiveTypeTab, statusFilter, setStatusFilter,
    pageSize, setPageSize, currentPage, setCurrentPage, resetToFirstPage, handleResetFilters,
    showEditModal, setShowEditModal, isEditing, currentAsset, setCurrentAsset,
    tagsInputText, setTagsInputText, formErrors, setFormErrors,
    handleOpenAddAsset, handleOpenEditAsset, handleIconFileUploaded, handleZipFileUploaded, handleSaveAssetForm,
    showNewVersionModal, setShowNewVersionModal, newVersionAsset, newVersionNum, setNewVersionNum,
    newVersionDesc, setNewVersionDesc, newVersionZipName, setNewVersionZipName,
    newVersionZipSize, setNewVersionZipSize, newVersionZipFiles, setNewVersionZipFiles, setNewVersionPackageToken,
    newVersionErrors, handleIncrementVersion, handleNewVersionZipUploaded, handleSaveNewVersion,
    handlePublishAsset, handleOfflineAsset, handleDeleteAsset, deleteTarget, setDeleteTarget,
    handleCopyAssetCode, handleOpenDebug, showDebugModal, setShowDebugModal, debugAsset,
    debugStatus, currentStepIndex, terminalLogs, setTerminalLogs, testStarted, setTestStarted, runSimulation,
    flashMessage, triggerFlashAlert,
  };
}