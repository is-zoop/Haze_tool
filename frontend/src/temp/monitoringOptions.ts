/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */

export interface FilterOption {
  value: string;
  label: Record<"ZH" | "EN" | "JA" | "ES", string>;
}

export const timeOptions: FilterOption[] = [
  { value: "15m", label: { ZH: "最近 15 分钟", EN: "Last 15 Minutes", JA: "最近 15 分", ES: "Últimos 15 minutos" } },
  { value: "1h", label: { ZH: "最近 1 小时", EN: "Last 1 Hour", JA: "最近 1 時間", ES: "Última 1 hora" } },
  { value: "6h", label: { ZH: "最近 6 小时", EN: "Last 6 Hours", JA: "最近 6 時間", ES: "Últimas 6 horas" } },
  { value: "24h", label: { ZH: "最近 24 小时", EN: "Last 24 Hours", JA: "最近 24 時間", ES: "Últimas 24 horas" } },
  { value: "7d", label: { ZH: "最近 7 天", EN: "Last 7 Days", JA: "最近 7 日間", ES: "Últimos 7 días" } }
];

export const envOptions: FilterOption[] = [
  { value: "all", label: { ZH: "全部环境", EN: "All Environments", JA: "すべての環境", ES: "Todos los entornos" } },
  { value: "prod", label: { ZH: "生产环境", EN: "Production (Prod)", JA: "本番環境 (Prod)", ES: "Producción (Prod)" } },
  { value: "test", label: { ZH: "测试环境", EN: "Testing (Test)", JA: "テスト環境 (Test)", ES: "Pruebas (Test)" } },
  { value: "dev", label: { ZH: "开发环境", EN: "Development (Dev)", JA: "開発環境 (Dev)", ES: "Desarrollo (Dev)" } }
];

export const capTypeOptions: FilterOption[] = [
  { value: "all", label: { ZH: "全部类型", EN: "All Types", JA: "すべてのタイプ", ES: "Todos los tipos" } },
  { value: "skill", label: { ZH: "Skill", EN: "Skill", JA: "スキル (Skill)", ES: "Skill" } },
  { value: "mcp_server", label: { ZH: "MCP Server", EN: "MCP Server", JA: "MCP サーバー", ES: "Servidor MCP" } },
  { value: "mcp_tool", label: { ZH: "MCP Tool", EN: "MCP Tool", JA: "MCP ツール", ES: "Herramienta MCP" } }
];

export const statusOptions: FilterOption[] = [
  { value: "all", label: { ZH: "全部状态", EN: "All Statuses", JA: "すべてのステータス", ES: "Todos los estados" } },
  { value: "normal", label: { ZH: "正常", EN: "Healthy", JA: "正常", ES: "Saludable" } },
  { value: "warning", label: { ZH: "警告", EN: "Warning", JA: "警告", ES: "Advertencia" } },
  { value: "error", label: { ZH: "异常", EN: "Error / Critical", JA: "異常", ES: "Error" } },
  { value: "maintenance", label: { ZH: "维护中", EN: "Maintenance", JA: "メンテナンス中", ES: "Mantenimiento" } },
  { value: "offline", label: { ZH: "已离线", EN: "Offline", JA: "オフライン", ES: "Fuera de línea" } }
];

export const logLevelOptions: FilterOption[] = [
  { value: "all", label: { ZH: "全部级别", EN: "All Levels", JA: "すべてのレベル", ES: "Todos los niveles" } },
  { value: "DEBUG", label: { ZH: "DEBUG", EN: "DEBUG", JA: "DEBUG", ES: "DEBUG" } },
  { value: "INFO", label: { ZH: "INFO", EN: "INFO", JA: "INFO", ES: "INFO" } },
  { value: "WARN", label: { ZH: "WARN", EN: "WARN", JA: "WARN", ES: "WARN" } },
  { value: "ERROR", label: { ZH: "ERROR", EN: "ERROR", JA: "ERROR", ES: "ERROR" } }
];

export const logSourceOptions: FilterOption[] = [
  { value: "all", label: { ZH: "全部来源", EN: "All Sources", JA: "すべてのソース", ES: "Todas las fuentes" } },
  { value: "Skill", label: { ZH: "Skill", EN: "Skill", JA: "スキル", ES: "Skill" } },
  { value: "MCP Server", label: { ZH: "MCP Server", EN: "MCP Server", JA: "MCP サーバー", ES: "Servidor MCP" } },
  { value: "MCP Tool", label: { ZH: "MCP Tool", EN: "MCP Tool", JA: "MCP ツール", ES: "Herramienta MCP" } },
  { value: "Platform", label: { ZH: "Platform", EN: "Platform", JA: "プラットフォーム", ES: "Plataforma" } }
];

export const alertSeverityOptions: FilterOption[] = [
  { value: "all", label: { ZH: "全部严重程度", EN: "All Severities", JA: "すべての深刻度", ES: "Todas las severidades" } },
  { value: "info", label: { ZH: "提示", EN: "Info", JA: "情報", ES: "Información" } },
  { value: "warning", label: { ZH: "警告", EN: "Warning", JA: "警告", ES: "Advertencia" } },
  { value: "critical", label: { ZH: "严重", EN: "Critical", JA: "重要", ES: "Crítico" } },
  { value: "emergency", label: { ZH: "紧急", EN: "Emergency", JA: "緊急", ES: "Emergencia" } }
];

export const alertStatusOptions: FilterOption[] = [
  { value: "all", label: { ZH: "全部状态", EN: "All Statuses", JA: "すべてのステータス", ES: "Todos los estados" } },
  { value: "unhandled", label: { ZH: "未处理", EN: "Unhandled", JA: "未処理", ES: "Sin procesar" } },
  { value: "processing", label: { ZH: "处理中", EN: "Processing", JA: "対応中", ES: "En proceso" } },
  { value: "recovered", label: { ZH: "已恢复", EN: "Recovered", JA: "復旧済", ES: "Recuperado" } },
  { value: "closed", label: { ZH: "已关闭", EN: "Closed", JA: "クローズ済", ES: "Cerrado" } }
];

export const maintenanceOwners = [
  "张经理 (Data Team)",
  "李总 (CRM Architecture)",
  "王总监 (ERP Financial)",
  "赵工 (Prod Automation)",
  "陈经理 (Office Tech)",
  "刘经理 (HR Operations)",
  "周工 (Quality & Docs)",
  "杨工 (DevOps Base)"
];
