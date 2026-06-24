import { apiBlobRequest, apiRequest } from "./api";
import { DeveloperAsset } from "../types/developer-center";

export type CapabilityApiType = "skill" | "mcp";
export type CapabilityApiStatus = "draft" | "reviewing" | "published" | "offline";

interface ApiPackageFile {
  name: string;
  size: number;
}

interface ApiPackage {
  path?: string;
  name?: string;
  size?: number;
  files?: ApiPackageFile[];
  manifest?: Record<string, unknown> | null;
}

interface ApiCapability {
  id: number;
  code: string;
  name: string;
  type: CapabilityApiType;
  description?: string | null;
  category?: string | null;
  icon?: string | null;
  version: string;
  status: CapabilityApiStatus;
  visibility: "internal";
  owner?: string | null;
  department?: string | null;
  tags: string[];
  config: Record<string, unknown>;
  calls: number;
  recent_test_status: "none" | "testing" | "pass" | "fail";
  package?: ApiPackage | null;
  updated_at: string;
}

interface ApiCapabilityList {
  items: ApiCapability[];
  page: number;
  page_size: number;
  total: number;
  counts: Record<string, number>;
}

export interface CapabilityListResult {
  items: DeveloperAsset[];
  page: number;
  pageSize: number;
  total: number;
  counts: Record<string, number>;
}

export interface UploadResult {
  uploadToken: string;
  fileName: string;
  size: number;
  files: { name: string; size: number }[];
  manifest?: Record<string, unknown> | null;
}

function formatVersion(version: string): string {
  return version.startsWith("v") ? version : `v${version}`;
}

function mapCapability(item: ApiCapability): DeveloperAsset {
  const config = item.config ?? {};
  const packageInfo = item.package ?? undefined;
  return {
    id: String(item.id),
    name: item.name,
    code: item.code,
    type: item.type === "skill" ? "Skill" : "MCP Server",
    description: item.description ?? "",
    version: formatVersion(item.version),
    project: item.category ?? "",
    owner: item.owner ?? "",
    status: item.status,
    recentTestStatus: item.recent_test_status,
    updatedAt: item.updated_at,
    calls: item.calls,
    tags: item.tags ?? [],
    visibility: item.visibility,
    icon: item.icon ?? undefined,
    zipName: packageInfo?.name,
    zipSize: packageInfo?.size !== undefined ? formatFileSize(packageInfo.size) : undefined,
    zipFiles: packageInfo?.files?.map((file) => ({ name: file.name, size: formatFileSize(file.size) })),
    skillMd: typeof config.skillMd === "string" ? config.skillMd : undefined,
    dependentTools: Array.isArray(config.dependentTools) ? config.dependentTools as string[] : undefined,
    testCases: Array.isArray(config.testCases) ? config.testCases as DeveloperAsset["testCases"] : undefined,
    transport: config.transport === "STDIO" ? "STDIO" : "HTTP",
    serverUrl: typeof config.serverUrl === "string" ? config.serverUrl : undefined,
    startCommand: typeof config.startCommand === "string" ? config.startCommand : undefined,
    startArgs: typeof config.startArgs === "string" ? config.startArgs : undefined,
    healthCheckUrl: typeof config.healthCheckUrl === "string" ? config.healthCheckUrl : undefined,
    credentialRef: typeof config.credentialRef === "string" ? config.credentialRef : undefined,
    averageResponseTime: typeof config.averageResponseTime === "number" ? config.averageResponseTime : undefined,
    capabilities: typeof config.capabilities === "object" ? config.capabilities as DeveloperAsset["capabilities"] : undefined,
    tools: Array.isArray(config.tools) ? config.tools as string[] : undefined,
    resources: Array.isArray(config.resources) ? config.resources as string[] : undefined,
    prompts: Array.isArray(config.prompts) ? config.prompts as string[] : undefined,
  };
}

export function buildCapabilityConfig(asset: Partial<DeveloperAsset>): Record<string, unknown> {
  if (asset.type === "MCP Server") {
    return {
      transport: asset.transport ?? "HTTP",
      serverUrl: asset.serverUrl ?? "",
      startCommand: asset.startCommand ?? "",
      startArgs: asset.startArgs ?? "",
      healthCheckUrl: asset.healthCheckUrl ?? "",
      credentialRef: asset.credentialRef ?? "",
      averageResponseTime: asset.averageResponseTime,
      capabilities: asset.capabilities ?? {},
      tools: asset.tools ?? [],
      resources: asset.resources ?? [],
      prompts: asset.prompts ?? [],
    };
  }
  return {
    skillMd: asset.skillMd ?? "",
    dependentTools: asset.dependentTools ?? [],
    testCases: asset.testCases ?? [],
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export async function listCapabilities(params: {
  page: number;
  pageSize: number;
  search?: string;
  type?: CapabilityApiType;
  status?: CapabilityApiStatus;
}): Promise<CapabilityListResult> {
  const query = new URLSearchParams({ page: String(params.page), page_size: String(params.pageSize) });
  if (params.search) query.set("search", params.search);
  if (params.type) query.set("type", params.type);
  if (params.status) query.set("status", params.status);
  const data = (await apiRequest<ApiCapabilityList>(`/api/developer/capabilities?${query}`)).data;
  return {
    items: data.items.map(mapCapability),
    page: data.page,
    pageSize: data.page_size,
    total: data.total,
    counts: data.counts,
  };
}

export async function uploadCapabilityFile(file: File, type: CapabilityApiType): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  const data = (await apiRequest<{
    upload_token: string;
    file_name: string;
    size: number;
    files: ApiPackageFile[];
    manifest?: Record<string, unknown> | null;
  }>(`/api/developer/uploads/package?type=${type}`, { method: "POST", body: form })).data;
  return {
    uploadToken: data.upload_token,
    fileName: data.file_name,
    size: data.size,
    files: data.files ?? [],
    manifest: data.manifest,
  };
}

export async function uploadCapabilityIcon(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  const data = (await apiRequest<{ upload_token: string; file_name: string; size: number }>(
    "/api/developer/uploads/icon",
    { method: "POST", body: form },
  )).data;
  return { uploadToken: data.upload_token, fileName: data.file_name, size: data.size, files: [] };
}

function payloadFromAsset(asset: Partial<DeveloperAsset>) {
  return {
    code: asset.code,
    name: asset.name,
    description: asset.description || null,
    category: asset.project || null,
    visibility: "internal" as const,
    tags: asset.tags ?? [],
    config: buildCapabilityConfig(asset),
  };
}

export async function createCapability(asset: Partial<DeveloperAsset>): Promise<DeveloperAsset> {
  const data = (await apiRequest<ApiCapability>("/api/developer/capabilities", {
    method: "POST",
    body: {
      ...payloadFromAsset(asset),
      type: asset.type === "MCP Server" ? "mcp" : "skill",
      version: asset.version?.replace(/^v/, "") || "1.0.0",
      icon_upload_token: asset.iconUploadToken || null,
      package_upload_token: asset.packageUploadToken,
    },
  })).data;
  return mapCapability(data);
}

export async function updateCapability(asset: Partial<DeveloperAsset>): Promise<DeveloperAsset> {
  const data = (await apiRequest<ApiCapability>(`/api/developer/capabilities/${asset.id}`, {
    method: "PATCH",
    body: {
      ...payloadFromAsset(asset),
      icon_upload_token: asset.iconUploadToken || null,
      package_upload_token: asset.packageUploadToken || null,
    },
  })).data;
  return mapCapability(data);
}

export async function createCapabilityVersion(
  id: string,
  version: string,
  changelog: string,
  packageUploadToken?: string,
): Promise<DeveloperAsset> {
  const data = (await apiRequest<ApiCapability>(`/api/developer/capabilities/${id}/versions`, {
    method: "POST",
    body: {
      version: version.replace(/^v/, ""),
      changelog,
      package_upload_token: packageUploadToken || null,
    },
  })).data;
  return mapCapability(data);
}

export async function publishCapability(id: string): Promise<void> {
  await apiRequest(`/api/developer/capabilities/${id}/publish`, { method: "POST" });
}

export async function offlineCapability(id: string): Promise<void> {
  await apiRequest(`/api/developer/capabilities/${id}/offline`, { method: "POST" });
}

export async function deleteCapability(id: string): Promise<void> {
  await apiRequest(`/api/developer/capabilities/${id}`, { method: "DELETE" });
}

export async function loadCapabilityIcon(path: string): Promise<string> {
  const blob = await apiBlobRequest(path);
  return URL.createObjectURL(blob);
}

export interface MarketCapabilityItem {
  id: string;
  name: string;
  type: string;
  description: string | null;
  version: string;
  author: string;
  department: string | null;
  category: string | null;
  tags: string[];
  calls: number;
  is_favorite: boolean;
  icon: string | null;
  updated_at: string;
}

export async function listMarketCapabilities(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: "skill" | "mcp";
  category?: string;
  favoriteOnly?: boolean;
}): Promise<{ items: MarketCapabilityItem[]; total: number }> {
  const query = new URLSearchParams({ page: String(params.page ?? 1), page_size: String(params.pageSize ?? 100) });
  if (params.search) query.set("search", params.search);
  if (params.type) query.set("type", params.type);
  if (params.category) query.set("category", params.category);
  if (params.favoriteOnly) query.set("favorite_only", "true");
  const data = (await apiRequest<{ items: MarketCapabilityItem[]; page: number; page_size: number; total: number }>(`/api/marketplace/capabilities?${query}`)).data;
  const items = await Promise.all(data.items.map(async (item) => {
    if (!item.icon) return item;
    try {
      return { ...item, icon: URL.createObjectURL(await apiBlobRequest(item.icon)) };
    } catch {
      return { ...item, icon: null };
    }
  }));
  return { items, total: data.total };
}

export async function toggleMarketFavorite(id: string): Promise<boolean> {
  const data = (await apiRequest<{ is_favorite: boolean }>(`/api/marketplace/capabilities/${id}/favorite`, { method: "POST" })).data;
  return data.is_favorite;
}