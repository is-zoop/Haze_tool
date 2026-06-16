/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */

export const userStatusOptions = [
  { value: "all", label: { ZH: "全部状态", EN: "All Statuses", JA: "すべてのステータス", ES: "Todos" } },
  { value: "active", label: { ZH: "正常运行", EN: "Active", JA: "アクティブ", ES: "Activo" } },
  { value: "disabled", label: { ZH: "已禁用", EN: "Disabled", JA: "無効", ES: "Deshabilitado" } },
  { value: "pending", label: { ZH: "待激活", EN: "Pending Activation", JA: "有効化待ち", ES: "Pendiente" } },
  { value: "locked", label: { ZH: "安全锁定", EN: "Locked", JA: "ロック中", ES: "Bloqueado" } },
  { value: "terminated", label: { ZH: "已离职", EN: "Terminated", JA: "退職済", ES: "Retirado" } }
];

export const userTypeOptions = [
  { value: "all", label: { ZH: "全部类型", EN: "All Types", JA: "すべてのタイプ", ES: "Todos" } },
  { value: "employee", label: { ZH: "企业内部员工", EN: "Regular Employee", JA: "正社員", ES: "Empleado Interno" } },
  { value: "collaborator", label: { ZH: "外部协作人员", EN: "External Contributor", JA: "外部協業者", ES: "Colaborador Externo" } },
  { value: "service_account", label: { ZH: "系统服务账号", EN: "Service Account", JA: "サービスアカウント", ES: "Cuenta de Servicio" } },
  { value: "admin", label: { ZH: "系统管理员", EN: "System Administrator", JA: "管理者", ES: "Administrador" } }
];

export const loginMethodOptions = [
  { value: "password", label: { ZH: "本地密码验证", EN: "Password Only", JA: "パスワード認証", ES: "Contraseña" } },
  { value: "sso", label: { ZH: "企业单点登录 (SSO)", EN: "Enterprise SSO", JA: "企業SSO", ES: "SSO Empresarial" } },
  { value: "service_only", label: { ZH: "专享服务 Token", EN: "Service Token Only", JA: "サービスToken専用", ES: "Token de Servicio" } },
  { value: "disabled", label: { ZH: "禁止接入平台", EN: "Login Disabled", JA: "ログイン不可", ES: "Deshabilitado" } }
];

export const timezonePresets = [
  { value: "Asia/Shanghai", label: "Asia/Shanghai (UTC+8)" },
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "America/New_York (UTC-5)" },
  { value: "Europe/London", label: "Europe/London (UTC+0)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (UTC+9)" }
];

export const localeLanguages = [
  { value: "ZH", label: "简体中文" },
  { value: "EN", label: "English" },
  { value: "JA", label: "日本語" },
  { value: "ES", label: "Español" }
];

export const dateFormatOptions = [
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD-MM-YYYY", label: "DD-MM-YYYY" }
];

export const timeFormatOptions = [
  { value: "24h", label: "24 小时制 / 24-Hour" },
  { value: "12h", label: "12 小时制 / 12-Hour" }
];

export const pageSizeOptions = [
  { value: "10", label: "10 条/页" },
  { value: "20", label: "20 条/页" },
  { value: "50", label: "50 条/页" },
  { value: "100", label: "100 条/页" }
];

export const toolSelectionConfirmPolicies = [
  { value: "auto", label: { ZH: "符合只读条件的 Tool 自动执行", EN: "Read-only Auto Execute", JA: "読取専用自動実行", ES: "Auto Ejecutar Solo Lectura" } },
  { value: "first_confirm", label: { ZH: "写入型 Tool 仅首次执行询问确认", EN: "First-time Write Confirm", JA: "書込み初回のみ確認", ES: "Confirmar Primera Escritura" } },
  { value: "always_confirm", label: { ZH: "写入型 / 高危动作均每次强制弹窗确认", EN: "Always Ask on Write/Danger", JA: "書込み/危険都度確認", ES: "Siempre Confirmar Escritura" } },
  { value: "block_dangerous", label: { ZH: "完全禁止特高风险 Tool 自动启动", EN: "Block High Risk Run", JA: "高リスク遮断", ES: "Bloquear Alto Riesgo" } }
];
