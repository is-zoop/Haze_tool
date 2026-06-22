import {
  ArrowUpCircle,
  Code,
  Copy,
  Cpu,
  Database,
  Edit3,
  Folder,
  MinusCircle,
  MoreHorizontal,
  Play,
  Send,
  Shield,
  Sparkles,
  Trash2,
  X,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeveloperAsset, TestStatus } from "../../types/developer-center";
import { StatusBadge } from "../common/StatusBadge";
import { getI18n } from "../../i18n";

function renderTestStatusBadge(status: TestStatus, lang: string = "ZH", type?: string) {
  const t = getI18n(lang);
  if (type === "Skill" && (status === "none" || !status)) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
        <span className="h-2 w-2 rounded-full bg-slate-200 shrink-0" />
        <span>{t.statusNoTestRequired}</span>
      </div>
    );
  }
  if (status === "pass") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
        <span>{t.statusPass}</span>
      </div>
    );
  } else if (status === "fail") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        <X className="h-4 w-4 bg-rose-500 text-white rounded-full p-0.5 shrink-0" />
        <span>{t.statusFail}</span>
      </div>
    );
  } else if (status === "testing") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
        <span>{t.statusTesting}</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        <span className="h-2 w-2 rounded-full bg-slate-300 shrink-0" />
        <span>{t.statusNotTested}</span>
      </div>
    );
  }
}

interface DeveloperAssetTableProps {
  paginatedAssets: DeveloperAsset[];
  langCode: string;
  onOpenDebug: (asset: DeveloperAsset) => void;
  onOpenEditAsset: (asset: DeveloperAsset) => void;
  onIncrementVersion: (asset: DeveloperAsset) => void;
  onCopyAssetCode: (asset: DeveloperAsset) => void;
  onPublishAsset: (asset: DeveloperAsset) => void;
  onOfflineAsset: (asset: DeveloperAsset) => void;
  onSetDeleteTarget: (asset: DeveloperAsset) => void;
}

export function DeveloperAssetTable({
  paginatedAssets,
  langCode,
  onOpenDebug,
  onOpenEditAsset,
  onIncrementVersion,
  onCopyAssetCode,
  onPublishAsset,
  onOfflineAsset,
  onSetDeleteTarget,
}: DeveloperAssetTableProps) {
  const t = getI18n(langCode);
  const assetStatusLabels = {
    published: t.statusPublished,
    draft: t.statusDraft,
    reviewing: t.statusReviewing,
    rejected: t.statusRejected,
    offline: t.statusOffline,
  };

  // Helper to get styled asset icon
  const getAssetIcon = (code: string, type: "Skill" | "MCP Server" | string, customIcon?: string) => {
    if (customIcon) {
      return (
        <img
          src={customIcon}
          alt="Icon"
          referrerPolicy="no-referrer"
          className="h-10 w-10 shrink-0 rounded-lg object-cover border border-slate-200 shadow-xs"
        />
      );
    }
    if (code === "fin_statement_summary") {
      return (
        <div className="h-10 w-10 shrink-0 font-bold bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100/50 shadow-xs">
          <Code size={18} />
        </div>
      );
    }
    if (code === "contract_legal_auditor") {
      return (
        <div className="h-10 w-10 shrink-0 font-bold bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center border border-amber-100/50 shadow-xs">
          <Shield size={18} />
        </div>
      );
    }
    if (code === "enterprise_db_connector") {
      return (
        <div className="h-10 w-10 shrink-0 font-bold bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center border border-indigo-105/50 shadow-xs">
          <Database size={18} />
        </div>
      );
    }
    if (code === "filesystem_guard") {
      return (
        <div className="h-10 w-10 shrink-0 font-bold bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center border border-purple-100/50 shadow-xs">
          <Folder size={18} />
        </div>
      );
    }

    if (type === "Skill") {
      return (
        <div className="h-10 w-10 shrink-0 font-bold bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-105/50 shadow-xs">
          <Sparkles size={18} />
        </div>
      );
    } else {
      return (
        <div className="h-10 w-10 shrink-0 font-bold bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center border border-indigo-105/50 shadow-xs">
          <Cpu size={18} />
        </div>
      );
    }
  };

  // Helper to format calls compactly
  const formatCalls = (calls: number) => {
    if (calls === 0) return "0";
    if (calls >= 1000) {
      return (calls / 1000).toFixed(1) + "k";
    }
    return String(calls);
  };

  return (
    <div className="flex-grow flex-1 min-h-0 overflow-hidden rounded-xl border border-border/60 bg-white" id="haze-developer-table-container">
      <ScrollArea className="h-full w-full">
        <div className="min-w-[980px]">
          <Table>
            <TableHeader className="border-b border-border bg-slate-50 sticky top-0 z-10 text-left">
              <TableRow className="h-12 hover:bg-transparent bg-slate-50 text-left">
                <TableHead className="px-4 text-xs font-bold text-muted-foreground bg-slate-50 sticky top-0 z-10 text-left">{langCode === "ZH" ? "能力名称" : langCode === "JA" ? "機能名" : langCode === "ES" ? "Nombre de Capacidad" : "Capability Name"}</TableHead>
                <TableHead className="w-[140px] px-4 text-xs font-bold text-muted-foreground bg-slate-50 sticky top-0 z-10 text-left">{langCode === "ZH" ? "业务分类" : langCode === "JA" ? "カテゴリ" : langCode === "ES" ? "Categoría" : "Category"}</TableHead>
                <TableHead className="w-[100px] px-4 text-xs font-bold text-muted-foreground bg-slate-50 sticky top-0 z-10 text-left">{langCode === "ZH" ? "类型" : langCode === "JA" ? "种类" : langCode === "ES" ? "Tipo" : "Type"}</TableHead>
                <TableHead className="w-[100px] px-4 text-xs font-bold text-muted-foreground bg-slate-50 sticky top-0 z-10 text-left">{langCode === "ZH" ? "版本" : langCode === "JA" ? "バージョン" : langCode === "ES" ? "Versión" : "Version"}</TableHead>
                <TableHead className="w-[130px] px-4 text-xs font-bold text-muted-foreground bg-slate-50 sticky top-0 z-10 text-left">{langCode === "ZH" ? "状态" : langCode === "JA" ? "ステータス" : langCode === "ES" ? "Estado" : "Status"}</TableHead>
                <TableHead className="w-[150px] px-4 text-xs font-bold text-muted-foreground bg-slate-50 sticky top-0 z-10 text-left">{langCode === "ZH" ? "测试" : langCode === "JA" ? "テスト" : langCode === "ES" ? "Pruebas" : "Test"}</TableHead>
                <TableHead className="w-[110px] px-4 text-xs font-bold text-muted-foreground text-right pr-6 bg-slate-50 sticky top-0 z-10">{langCode === "ZH" ? "调用" : langCode === "JA" ? "呼び出し" : langCode === "ES" ? "Llamadas" : "Calls"}</TableHead>
                <TableHead className="w-[200px] px-4 text-right text-xs font-bold text-muted-foreground pr-6 bg-slate-50 sticky top-0 z-10">{langCode === "ZH" ? "操作" : langCode === "JA" ? "操作" : langCode === "ES" ? "Acciones" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border text-sm text-left">
              {paginatedAssets.map((asset) => {
                const cleanProject = asset.project.split(" (")[0];
                return (
                  <TableRow key={asset.id} className="h-[72px] text-foreground transition-colors hover:bg-slate-50/35 text-left">
                    <TableCell className="px-4 py-3 text-left">
                      <div className="flex items-center gap-3 text-left">
                        {getAssetIcon(asset.code, asset.type, asset.icon)}
                        <div className="space-y-0.5 text-left">
                          <p className="font-semibold text-sm text-foreground text-left">{asset.name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground text-left">
                            <span className="font-mono text-left">{asset.code}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs font-semibold text-slate-600 text-left">
                      {cleanProject}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-left">
                      {asset.type === "Skill" ? (
                        <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 border-none text-left">
                          Skill
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border-none text-left">
                          MCP
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-mono text-xs text-muted-foreground text-left">{asset.version || "v1.0.0"}</TableCell>
                    <TableCell className="px-4 py-3 text-left"><StatusBadge status={asset.status} labels={assetStatusLabels} /></TableCell>
                    <TableCell className="px-4 py-3 text-left">{renderTestStatusBadge(asset.recentTestStatus, langCode, asset.type)}</TableCell>
                    <TableCell className="px-4 py-3 font-mono font-bold text-right text-foreground tabular-nums pr-6">
                      {formatCalls(asset.calls)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => onOpenDebug(asset)}
                          disabled={asset.type === "Skill"}
                          className={`h-8 px-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer ${
                            asset.type === "Skill"
                              ? "bg-slate-100 text-slate-400 border-none cursor-not-allowed opacity-50"
                              : "bg-slate-900 hover:bg-slate-800 text-white border-transparent"
                          }`}
                        >
                          <Play size={12} className={asset.type === "Skill" ? "fill-slate-400 text-slate-400" : "fill-white text-white"} />
                          <span>{langCode === "ZH" ? "调试" : langCode === "JA" ? "デバッグ" : langCode === "ES" ? "Depurar" : "Debug"}</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onOpenEditAsset(asset)}
                          className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-lg border border-input cursor-pointer"
                        >
                          <Edit3 size={14} />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-lg border border-input cursor-pointer"
                            >
                              <MoreHorizontal size={14} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            collisionPadding={12}
                            className="z-50 w-auto min-w-40 rounded-xl border border-slate-100 bg-white p-1 text-xs text-slate-700 shadow-md"
                          >
                            <DropdownMenuItem
                              disabled={asset.status !== "published"}
                              onClick={() => onIncrementVersion(asset)}
                              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg p-2 font-bold hover:bg-slate-50 focus:bg-slate-50"
                            >
                              <ArrowUpCircle size={12} className="text-slate-400" />
                              <span>{langCode === "ZH" ? "新建版本" : langCode === "JA" ? "新バージョン" : langCode === "ES" ? "Nueva versión" : "New Version"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onCopyAssetCode(asset)}
                              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg p-2 font-bold hover:bg-slate-50 focus:bg-slate-50"
                            >
                              <Copy size={12} className="text-slate-400" />
                              <span>{langCode === "ZH" ? "复制 Prompt" : langCode === "JA" ? "Promptをコピー" : langCode === "ES" ? "Copiar Prompt" : "Copy Prompt"}</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {asset.status === "published" ? (
                              <DropdownMenuItem
                                onClick={() => onOfflineAsset(asset)}
                                className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg p-2 font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus:bg-rose-50"
                              >
                                <MinusCircle size={12} className="text-rose-500" />
                                <span>{langCode === "ZH" ? "下线" : langCode === "JA" ? "非公開" : langCode === "ES" ? "Fuera de línea" : "Offline"}</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                disabled={asset.status === "reviewing"}
                                onClick={() => onPublishAsset(asset)}
                                className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg p-2 font-bold hover:bg-slate-50 focus:bg-slate-50"
                              >
                                <Send size={12} className="text-slate-400" />
                                <span>{langCode === "ZH" ? "发布" : langCode === "JA" ? "公開する" : langCode === "ES" ? "Publicar" : "Publish"}</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onSelect={(event) => { event.preventDefault(); onSetDeleteTarget(asset); }}
                              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg p-2 font-bold text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
                            >
                              <Trash2 size={12} />
                              <span>{langCode === "ZH" ? "删除" : langCode === "JA" ? "削除" : langCode === "ES" ? "Eliminar" : "Delete"}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedAssets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-40 text-center font-normal text-muted-foreground bg-white text-left">
                    {langCode === "ZH" ? "暂无匹配的能力注册项" 
                     : langCode === "JA" ? "該当する機能登録が見得つかりません" 
                     : langCode === "ES" ? "No se encontraron capacidades registradas coincidentes" 
                     : "No matching registered capabilities found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
