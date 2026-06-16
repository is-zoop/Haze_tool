import { 
  WorkspaceCapabilityItem, 
  RecentUseLog, 
  PermissionLog, 
  WorkspaceTodoItem, 
  UpdateReminder 
} from "../types/workspace";

// 1. Workspace Capabilities (4 Skills, 2 MCP Servers, 4 MCP Tools)
export const INITIAL_WORKSPACE_CAPABILITIES: WorkspaceCapabilityItem[] = [
  // --- 4 Skills ---
  {
    id: "cap-1",
    name: "销售日报自动分析",
    type: "Skill",
    description: "汇聚并自动分析前一日全渠道销售数据，自动产出包含异动归因、趋势预测、高潜货品及爆款建议的结构化日报。",
    calls: 1248,
    status: "active",
    author: "数据科学部",
    version: "v2.1.0",
    updateTime: "2026-06-12",
    permissionsStatus: "granted",
    riskLevel: "low",
    department: "数据科学部",
    tags: ["数据分析", "电商运营", "自动化"],
    isFavorite: true,
    isPinned: true,
    addedTime: "2026-05-10",
    lastUsedTime: "2026-06-15 08:30"
  },
  {
    id: "cap-2",
    name: "企业知识检索助手",
    type: "Skill",
    description: "一站式极速检索、提炼企业所有历史规章制度、福利标准、技术红皮书，安全防泄露，带有极佳的溯源引用机制。",
    calls: 5410,
    status: "active",
    author: "信息安全部",
    version: "v4.0.2",
    updateTime: "2026-06-14",
    permissionsStatus: "granted",
    riskLevel: "low",
    department: "行政与安全部",
    tags: ["知识检索", "企业办公", "行政制度"],
    isFavorite: true,
    isPinned: false,
    addedTime: "2026-05-12",
    lastUsedTime: "2026-06-14 16:45",
    updateAvailable: "v4.1.0",
    updateLog: "新增支持多文档检索与实时飞书消息订阅通知"
  },
  {
    id: "cap-3",
    name: "行业研报深度分析",
    type: "Skill",
    description: "自动剖析超长研究规程、技术文献，汇总前沿赛道PE模型特征，并自动生成SWOT与波特五利模型结构分析段落。",
    calls: 890,
    status: "active",
    author: "战略规划部",
    version: "v1.2.0",
    updateTime: "2026-06-11",
    permissionsStatus: "granted",
    riskLevel: "medium",
    department: "战略规划部",
    tags: ["数据分析", "财务", "决策辅助"],
    isFavorite: false,
    isPinned: false,
    addedTime: "2026-05-15",
    lastUsedTime: "2026-06-13 11:20"
  },
  {
    id: "cap-4",
    name: "财务凭证智能校验",
    type: "Skill",
    description: "配合OCR接口，高精识别各类发票、报销单据防重防伪，智能校验抬头、税号及合规政策，自动预警高风险入账条目。",
    calls: 156,
    status: "active",
    author: "技术委员会",
    version: "v1.0.5",
    updateTime: "2026-06-08",
    permissionsStatus: "granted",
    riskLevel: "medium",
    department: "财务共享部",
    tags: ["财务", "OCR", "流程审计"],
    isFavorite: true,
    isPinned: false,
    addedTime: "2026-06-01",
    lastUsedTime: "2026-06-15 09:12"
  },

  // --- 2 MCP Servers ---
  {
    id: "cap-5",
    name: "企业数据中心 MCP",
    type: "MCP",
    description: "提供标准化内联网安全连接，打通全仓库 ERP、CRM 业务数据底座。提供标准执行权限，保障不泄露数据泄源。",
    calls: 18920,
    status: "active",
    author: "基础软件部",
    version: "v3.0.0",
    updateTime: "2026-06-15",
    permissionsStatus: "granted",
    riskLevel: "high",
    department: "技术委员会",
    systemName: "企业数仓总线",
    toolsCount: 12,
    resourcesCount: 5,
    promptsCount: 4,
    connectType: "Secure Broker",
    addedTime: "2026-04-20",
    lastUsedTime: "2026-06-15 10:15"
  },
  {
    id: "cap-6",
    name: "DevOps 指标监控 MCP",
    type: "MCP",
    description: "暴露集群资源状况、物理机器温度、部署流水线实时告警、容器存活日志并对接看板模块，支撑自动化弹性伸缩。",
    calls: 3105,
    status: "warning", // warning showing maintenance/issues
    author: "安全与运维组",
    version: "v1.4.2",
    updateTime: "2026-06-13",
    permissionsStatus: "granted",
    riskLevel: "high",
    department: "IT技术共享部",
    systemName: "全链路监控系统",
    toolsCount: 8,
    resourcesCount: 2,
    promptsCount: 2,
    connectType: "JSON-RPC over SSH",
    isFavorite: false,
    addedTime: "2026-05-02",
    lastUsedTime: "2026-06-12 18:30",
    updateAvailable: "v1.5.0",
    updateLog: "优化 K8s 集成，重构指标导出工具包"
  },

  // --- 4 MCP Tools ---
  {
    id: "cap-7",
    name: "query_sql_db",
    type: "Tool",
    description: "在授权沙箱数据库中，极速执行经过语法分析及风险边界管控的安全只读 SQL 语句并直接导出结构化表单。",
    calls: 7850,
    status: "active",
    author: "基础软件部",
    version: "v2.0.1",
    updateTime: "2026-06-10",
    permissionsStatus: "granted",
    riskLevel: "medium",
    department: "技术委员会",
    mcpServerName: "企业数据中心 MCP",
    isReadonly: true,
    paramsCount: 2,
    addedTime: "2026-04-22",
    lastUsedTime: "2026-06-15 10:05"
  },
  {
    id: "cap-8",
    name: "push_ldap_user",
    type: "Tool",
    description: "向企业主域管理服务器（AD/LDAP）推送写入并同步新入职员工账号，自动配置层级 OU。建议谨慎触发执行。",
    calls: 112,
    status: "active",
    author: "安全与运维组",
    version: "v1.2.0",
    updateTime: "2026-06-05",
    permissionsStatus: "granted",
    riskLevel: "high",
    department: "行政与安全部",
    mcpServerName: "企业数据中心 MCP",
    isReadonly: false,
    paramsCount: 4,
    addedTime: "2026-05-01",
    lastUsedTime: "2026-06-11 14:22"
  },
  {
    id: "cap-9",
    name: "fetch_container_metrics",
    type: "Tool",
    description: "免签直接监控指定命名空间内微服务容器宿主的 CPU、内存绝对利用率、磁盘I/O 及线程状态句柄数量元数据。",
    calls: 1450,
    status: "active",
    author: "安全与运维组",
    version: "v1.1.0",
    updateTime: "2026-06-13",
    permissionsStatus: "granted",
    riskLevel: "low",
    department: "IT技术共享部",
    mcpServerName: "DevOps 指标监控 MCP",
    isReadonly: true,
    paramsCount: 3,
    addedTime: "2026-05-03",
    lastUsedTime: "2026-06-15 10:11"
  },
  {
    id: "cap-10",
    name: "update_task_backlog",
    type: "Tool",
    description: "向公司内部敏捷协作项目平台写入更改，快捷修改用户故事、技术 backlog 指数及故障处理归档状态。",
    calls: 420,
    status: "active",
    author: "战略规划部",
    version: "v2.0.0",
    updateTime: "2026-06-14",
    permissionsStatus: "granted",
    riskLevel: "low",
    department: "战略规划部",
    mcpServerName: "DevOps 指标监控 MCP",
    isReadonly: false,
    paramsCount: 3,
    addedTime: "2026-05-18",
    lastUsedTime: "2026-06-14 09:50"
  }
];

// 2. Favorite Capabilities (8 items)
// Reused from initial capabilities or market database, but placed separately for strict data rendering.
export const INITIAL_FAVORITE_CAPABILITIES: WorkspaceCapabilityItem[] = [
  ...INITIAL_WORKSPACE_CAPABILITIES.filter(item => item.isFavorite),
  {
    id: "fav-1",
    name: "客户舆情分析模型",
    type: "Skill",
    description: "全网精准抓取提及本商业品牌的资讯、贴吧、社交网络语料，基于情感打分器评判正负面态度并绘制舆情拐点曲线。",
    calls: 310,
    status: "active",
    author: "基础软件部",
    version: "v1.4.0",
    updateTime: "2026-06-11",
    permissionsStatus: "need_apply", // Favorite but not added to Workspace (needs application)
    riskLevel: "medium",
    department: "客户服务部",
    tags: ["数据分析", "客户服务", "语义计算"],
    isFavorite: true,
    addedTime: "2026-06-12"
  },
  {
    id: "fav-2",
    name: "电商产品文案大师",
    type: "Skill",
    description: "输入商品尺寸及独特爆款要素，毫秒级自选风格生成吸睛的亚马逊、淘宝及抖音首图转化卖点，大大降低营销文案开销。",
    calls: 9150,
    status: "active",
    author: "数据科学部",
    version: "v3.2.1",
    updateTime: "2026-06-15",
    permissionsStatus: "direct", // Direct access (can be added anytime or used instantly)
    riskLevel: "low",
    department: "数据科学部",
    tags: ["电商运营", "内容创作", "推荐"],
    isFavorite: true,
    addedTime: "2026-06-15"
  },
  {
    id: "fav-3",
    name: "GitLab 代码审查 Server",
    type: "MCP",
    description: "与内网镜像代码服务器直通。包含核心语法漏洞审计、注释率监控与自动开通预警性 Merge Request 的整套 RPC 工具。",
    calls: 405,
    status: "active",
    author: "技术委员会",
    version: "v2.0.0",
    updateTime: "2026-06-10",
    permissionsStatus: "need_apply",
    riskLevel: "high",
    department: "基础软件部",
    systemName: "研发效能中枢",
    toolsCount: 6,
    resourcesCount: 1,
    promptsCount: 2,
    connectType: "TLS Secure Tunnel",
    isFavorite: true,
    addedTime: "2026-06-13"
  },
  {
    id: "fav-4",
    name: "lint_code_changes",
    type: "Tool",
    description: "接入 CI/CD 流水线，针对提交的变更增量文件自动审查格式合规、反模式、类型未定义等缺陷，打分给出改法建议。",
    calls: 1320,
    status: "active",
    author: "技术委员会",
    version: "v1.1.2",
    updateTime: "2026-06-08",
    permissionsStatus: "direct",
    riskLevel: "low",
    department: "基础软件部",
    mcpServerName: "GitLab 代码审查 Server",
    isFavorite: true,
    isReadonly: true,
    paramsCount: 2,
    addedTime: "2026-06-14"
  }
];

// 3. Recent Use Logs (12 entries representing full audit logs)
export const INITIAL_RECENT_LOGS: RecentUseLog[] = [
  {
    id: "log-1",
    capabilityId: "cap-1",
    name: "销售日报自动分析",
    type: "Skill",
    method: "Chat 容器集成",
    status: "success",
    durationMs: 1450,
    usedTime: "2026-06-15 08:30:11"
  },
  {
    id: "log-2",
    capabilityId: "cap-5",
    name: "企业数据中心 MCP",
    type: "MCP",
    method: "API 代理请求",
    status: "success",
    durationMs: 82,
    usedTime: "2026-06-15 08:15:22"
  },
  {
    id: "log-3",
    capabilityId: "cap-7",
    name: "query_sql_db",
    type: "Tool",
    method: "Chat 容器集成",
    status: "success",
    durationMs: 145,
    usedTime: "2026-06-15 08:14:50"
  },
  {
    id: "log-4",
    capabilityId: "cap-4",
    name: "财务凭证智能校验",
    type: "Skill",
    method: "OCR 上传校验",
    status: "success",
    durationMs: 2310,
    usedTime: "2026-06-15 07:12:05"
  },
  {
    id: "log-5",
    capabilityId: "cap-9",
    name: "fetch_container_metrics",
    type: "Tool",
    method: "集群守护任务",
    status: "success",
    durationMs: 50,
    usedTime: "2026-06-15 07:11:00"
  },
  {
    id: "log-6",
    capabilityId: "cap-2",
    name: "企业知识检索助手",
    type: "Skill",
    method: "文档智能解读",
    status: "success",
    durationMs: 1890,
    usedTime: "2026-06-14 16:45:00"
  },
  {
    id: "log-7",
    capabilityId: "cap-10",
    name: "update_task_backlog",
    type: "Tool",
    method: "API 代理请求",
    status: "failed", // Failed item
    durationMs: 420,
    usedTime: "2026-06-14 09:50:33"
  },
  {
    id: "log-8",
    capabilityId: "cap-3",
    name: "行业研报深度分析",
    type: "Skill",
    method: "Chat 容器集成",
    status: "success",
    durationMs: 3450,
    usedTime: "2026-06-13 11:20:12"
  },
  {
    id: "log-9",
    capabilityId: "cap-6",
    name: "DevOps 指标监控 MCP",
    type: "MCP",
    method: "服务健康探针",
    status: "success",
    durationMs: 120,
    usedTime: "2026-06-12 18:30:15"
  },
  {
    id: "log-10",
    capabilityId: "cap-8",
    name: "push_ldap_user",
    type: "Tool",
    method: "管理员控制台",
    status: "cancelled", // Cancelled item
    durationMs: 0,
    usedTime: "2026-06-11 14:22:00"
  },
  {
    id: "log-11",
    capabilityId: "cap-1",
    name: "销售日报自动分析",
    type: "Skill",
    method: "Chat 容器集成",
    status: "running", // Running item
    durationMs: 820,
    usedTime: "2026-06-15 08:35:01"
  },
  {
    id: "log-12",
    capabilityId: "cap-2",
    name: "企业知识检索助手",
    type: "Skill",
    method: "文档智能解读",
    status: "failed",
    durationMs: 1100,
    usedTime: "2026-06-14 16:20:11"
  }
];

// 4. Permission Logs / Authorization range (6 records)
export const INITIAL_PERMISSION_LOGS: PermissionLog[] = [
  {
    id: "perm-1",
    capabilityId: "cap-1",
    name: "销售日报自动分析",
    type: "Skill",
    scope: "读写/不限时全域统计组",
    status: "granted",
    applyTime: "2026-05-10 14:00",
    expireTime: "2027-05-10 14:00",
    approver: "数据部负责人 (张晓莹)"
  },
  {
    id: "perm-2",
    capabilityId: "cap-3",
    name: "行业研报深度分析",
    type: "Skill",
    scope: "只读/高消耗多因子研报精读",
    status: "granted",
    applyTime: "2026-05-15 11:00",
    expireTime: "2026-06-22 11:00", // Expiring soon (within 7 days!)
    approver: "财务总监 (王明远)"
  },
  {
    id: "perm-3",
    capabilityId: "cap-8",
    name: "push_ldap_user",
    type: "Tool",
    scope: "主域写入权/AD主控制器目录写入",
    status: "granted",
    applyTime: "2026-05-01 10:00",
    expireTime: "2026-11-01 10:00",
    approver: "安全运维主管 (赵立群)"
  },
  {
    id: "perm-4",
    capabilityId: "sk_audit_3",
    name: "智能代码重构算法器",
    type: "Skill",
    scope: "代码库写入与分支审查权限",
    status: "pending", // Pending Review
    applyTime: "2026-06-14 10:30",
    expireTime: "-",
    approver: "技术委员会主席 (刘少华)"
  },
  {
    id: "perm-5",
    capabilityId: "sk_audit_4",
    name: "机密工资计算引擎",
    type: "Skill",
    scope: "薪资及股权机要账户直接读取",
    status: "rejected", // Rejected
    applyTime: "2026-06-10 11:20",
    expireTime: "-",
    approver: "合规安全部 (集团管理层)"
  },
  {
    id: "perm-6",
    capabilityId: "cap-4",
    name: "财务凭证智能校验-旧凭证归档端",
    type: "Skill",
    scope: "批量修改/历年凭证回删归档",
    status: "expired", // Expired
    applyTime: "2025-06-01 09:00",
    expireTime: "2026-06-01 09:00",
    approver: "财务共享总监 (李婉茹)"
  }
];

// 5. Update Reminders (4 records)
export const INITIAL_UPDATE_REMINDERS: UpdateReminder[] = [
  {
    id: "upd-1",
    capabilityId: "cap-1",
    name: "销售日报自动分析",
    currentVersion: "v2.1.0",
    targetVersion: "v2.2.0",
    notes: "集成电商渠道爆款推荐因子，新增直通车推广花费(ROI)多级智能归因面板，支持一键分发企业邮箱。",
    updateTime: "2026-06-15",
    isIgnored: false
  },
  {
    id: "upd-2",
    capabilityId: "cap-2",
    name: "企业知识检索助手",
    currentVersion: "v4.0.2",
    targetVersion: "v4.1.0",
    notes: "深度优化多级引用定位锚点，飞书消息长文档阅读智能摘要优化，降低 RAG 召回时延 35%。",
    updateTime: "2026-06-14",
    isIgnored: false
  },
  {
    id: "upd-3",
    capabilityId: "cap-6",
    name: "DevOps 指标监控 MCP",
    currentVersion: "v1.4.2",
    targetVersion: "v1.5.0",
    notes: "支持在 Kubernetes 容器拓扑中执行自定义多副本压力测试，提供实时宿主机网络吞吐健康因子。",
    updateTime: "2026-06-13",
    isIgnored: false
  },
  {
    id: "upd-4",
    capabilityId: "cap-7",
    name: "query_sql_db",
    currentVersion: "v2.0.1",
    targetVersion: "v2.1.0",
    notes: "全面收缩写入和跨区域大表 JOIN 操作语法，过滤明文高危审计标识，SQL 语句分析器全面升级。",
    updateTime: "2026-06-12",
    isIgnored: false
  }
];

// 6. Todo Items (4 items)
export const INITIAL_TODO_ITEMS: WorkspaceTodoItem[] = [
  {
    id: "todo-1",
    type: "permission",
    title: "2 个权限申请待审批",
    description: "您申请的「智能代码重构算法器」与「金蝶 ERP 财务中枢」审批单正等待上级领导复审批准。",
    countOrStatus: "2 待审"
  },
  {
    id: "todo-2",
    type: "expiration",
    title: "1 个权限将在 7 天内到期",
    description: "您对「行业研报深度分析」的调用期仅剩 7 天，过时将暂停，请及时联系王明远审批人续展寿命。",
    countOrStatus: "立即到期",
    targetId: "perm-2"
  },
  {
    id: "todo-3",
    type: "update",
    title: "2 个已添加能力存在新版本",
    description: "「销售日报自动分析」以及「企业知识检索助手」已上线功能增强与抗震漏洞修复，可平滑快捷更新。",
    countOrStatus: "2 升级"
  },
  {
    id: "todo-4",
    type: "maintenance",
    title: "1 个常用 MCP Server 状态异常",
    description: "您的常用「DevOps 指标监控 MCP」当前已被技术共享组调为警告状态，正执行 K8s 宿主主群例行维护。",
    countOrStatus: "正在例维"
  }
];
