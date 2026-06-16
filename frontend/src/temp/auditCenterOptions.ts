/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */

export const REVIEWERS_OPTIONS = [
  { value: "wang_head", label: "王主管 (Head)", role: "部门负责人" },
  { value: "chen_rd", label: "陈经理 (R&D)", role: "技术研发组长" },
  { value: "security_admin", label: "安全管理员 (Security)", role: "合规审查专员" },
  { value: "sys_admin", label: "系统管理员 (Admin)", role: "主运行中心超级管理员" },
  { value: "data_owner", label: "数据负责人 (Data Owner)", role: "财务及商业数据保管专员" }
];

export const DEPARTMENTS_OPTIONS = [
  { value: "all", label: "全部部门" },
  { value: "cs", label: "客户服务部" },
  { value: "finance", label: "财务管理部" },
  { value: "legal", label: "法务合规部" },
  { value: "marketing", label: "市场营销部" },
  { value: "operations", label: "运营部" },
  { value: "dev", label: "系统运维部" },
  { value: "hr", label: "人力资源部" },
  { value: "rd", label: "技术研发部" }
];

export const AUDIT_TYPES_OPTIONS = [
  { value: "all", label: "全部审批" },
  { value: "capability_publish", label: "能力发布" },
  { value: "version_publish", label: "版本发布" },
  { value: "permission_request", label: "权限申请" },
  { value: "high_risk_tool", label: "高风险 Tool" },
  { value: "capability_offline", label: "能力下线" }
];

export const CAPABILITY_TYPES_OPTIONS = [
  { value: "all", label: "全部能力" },
  { value: "Skill", label: "Skill" },
  { value: "MCP Server", label: "MCP Server" },
  { value: "MCP Tool", label: "MCP Tool" }
];

export const QUICK_REJECTION_REASONS = [
  { value: "incomplete_info", label: "信息不完整", desc: "申请中所填写的申请原因、使用场景或相关架构不齐备或有漏洞" },
  { value: "test_failed", label: "测试未通过", desc: "自动化冒烟测试或回归测试中存在严重阻断项，通过率未达100%" },
  { value: "over_permission", label: "权限范围过大", desc: "申请的数据库/接口读写权限范围过高，超出了最小必要权限规范" },
  { value: "security_risk", label: "存在安全风险", desc: "安全静态扫描不合规；检测到硬编码机密私钥或敏感数据库连接凭证" },
  { value: "dep_unavailable", label: "依赖不可用", desc: "该能力引用的第三方 MCP 服务器或中转 API 网关当前不健康，延迟严重" },
  { value: "publish_spec_invalid", label: "不符合发布规范", desc: "未撰写对应能力的 SKILL.md 文档，或其命名含有非允许的过度营销词汇" },
  { value: "empty_release_note", label: "版本说明不完整", desc: "多节点升级发布未具体描述 DDL 的变更影响，有静默代码入侵隐患" },
  { value: "other", label: "其他原因", desc: "自定义其他不符合目前企业发布规定的场景" }
];

export const QUICK_INFO_REQUESTS = [
  { value: "test_report", label: "补充测试报告", defaultText: "请补充提供完整在 Staging/Sandbox 下的覆盖率与抗网络阻断防雷击压测数据记录。" },
  { value: "permission_desc", label: "补充权限说明", defaultText: "本功能涉及高等级敏感信息检索，请详述对用户隐私、库文件进行脱敏的执行准则与防脱库说明。" },
  { value: "data_scope", label: "补充数据范围", defaultText: "请补充明确本次调用的最小必要数据过滤范围，包含具体涉及的库名称、表字段细节清单。" },
  { value: "release_note", label: "补充版本说明", defaultText: "当前升级版本改动较大，请补充详细的向下兼容测试分析与历史版本依存关系评估卡片。" },
  { value: "security_assessment", label: "补充安全评估", defaultText: "请补充完成企业安全红线扫描及是否存在硬编码泄密的自检签名 pdf。" },
  { value: "owner_info", label: "补充负责人信息", defaultText: "本特定区域能力需要附加上级业务总监及数据保管负责人的联合签字批准。" }
];

export const URGENCY_LEVELS = [
  { value: "all", label: "全部级别" },
  { value: "normal", label: "普通" },
  { value: "urgent", label: "紧急" },
  { value: "critical", label: "即将超时" }
];
