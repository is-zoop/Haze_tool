/**
 * @file homeData.ts
 * @description 临时原型业务测试数据 - 首页及系统看板通用基础数据
 */

export interface HomeMetrics {
  skillsCount: number;
  mcpCount: number;
  recentPublishCount: number;
  myPublishCount: number;
}

export interface HomeNotification {
  id: string;
  text: string;
  time: string;
  unread: boolean;
}

export interface HomeRecentPublish {
  id: string;
  name: string;
  type: "Skill" | "MCP Server";
  description: string;
  author: string;
  time: string;
  status: "published" | "reviewing" | "draft" | "rejected" | "offline";
}

export interface SkillItem {
  id: string;
  name: string;
  type: "Skill" | "MCP" | "Tool";
  description: string;
  calls: string;
  status: "active" | "warning" | "maintenance";
  author: string;
  time: string;
}

export interface DashboardLog {
  id: string;
  name: string;
  type: string;
  user: string;
  status: "success" | "warning" | "error";
  duration: string;
  time: string;
}

export interface DashboardMetrics {
  skillsCount: number;
  skillsDiff: string;
  mcpCount: number;
  mcpDiff: string;
  toolsCount: number;
  toolsDiff: string;
  callsCount: string;
  callsDiff: string;
  serviceNormal: number;
  serviceWarning: number;
  serviceMaintenance: number;
  connectivity: string;
}

export interface DashboardTodo {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  level: "info" | "danger" | "warning";
}

export const MOCK_HOME_METRICS: HomeMetrics = {
  skillsCount: 12,
  mcpCount: 5,
  recentPublishCount: 8,
  myPublishCount: 3,
};

export const MOCK_HOME_NOTIFICATIONS: HomeNotification[] = [
  { id: "1", text: "您提交的 [财务报表摘要智能生成器] Skill 已通过审核并发布", time: "10分钟前", unread: true },
  { id: "2", text: "管理员王磊下线了过期的旧版 MCP Server", time: "1小时前", unread: true },
  { id: "3", text: "系统已升级到 V1 正式版本", time: "1天前", unread: false }
];

export const MOCK_RECENT_PUBLISHES: HomeRecentPublish[] = [
  {
    id: "pub-1",
    name: "财务报表摘要智能生成器",
    type: "Skill",
    description: "通过读取 PDF 或 Excel 报表，对企业的季度、年度财报进行核心指标提取与分析并生成文档。",
    author: "李娜 (Lina)",
    time: "30分钟前",
    status: "published"
  },
  {
    id: "pub-2",
    name: "企业内部数据库安全连接服务",
    type: "MCP Server",
    description: "提供安全只读 SQL 执行、高频数据实体视图导出、模式元数据检索的 MCP 服务。",
    author: "王磊 (Leo)",
    time: "2小时前",
    status: "published"
  },
  {
    id: "pub-3",
    name: "合同法律条款风险审核",
    type: "Skill",
    description: "快速审查电子合同文本中的排他性、赔偿限额以及争议管辖权等条款风险并提示提示。",
    author: "陈晓磊",
    time: "1天前",
    status: "reviewing"
  }
];

export const MOCK_MY_RECENT_PUBLISHES: HomeRecentPublish[] = [
  {
    id: "my-1",
    name: "财务报表摘要智能生成器",
    type: "Skill",
    description: "通过读取 PDF 或 Excel 报表，对企业的季度、年度财报进行核心指标提取与分析并生成文档。",
    author: "李娜 (Lina)",
    time: "30分钟前",
    status: "published"
  },
  {
    id: "my-2",
    name: "合同法律条款风险审核",
    type: "Skill",
    description: "快速审查电子合同文本中的排他性、赔偿限额以及争议管辖权等条款风险并提示提示。",
    author: "李娜 (Lina)",
    time: "1天前",
    status: "reviewing"
  },
  {
    id: "my-3",
    name: "旧版 Redmine 缺陷管理同步后端",
    type: "MCP Server",
    description: "对接陈旧 Redmine 服务器进行 Issues 信息获取与状态跟进。",
    author: "李娜 (Lina)",
    time: "3天前",
    status: "draft"
  }
];

// 以下为从原有 temp.json 迁移的系统仪表盘测试数据

export const MOCK_DASHBOARD_NOTIFICATIONS: HomeNotification[] = [
  { id: "1", text: "您提交的 [行业研报分析] Skill 已通过审核并发布", time: "10分钟前", unread: true },
  { id: "2", text: "警告: [数据计算工具] MCP 服务发生连接中断", time: "1.5小时前", unread: true },
  { id: "3", text: "系统将于今晚24:00进行网关性能优化升级", time: "5小时前", unread: false }
];

export const MOCK_DASHBOARD_SKILLS: SkillItem[] = [
  { 
    id: "1", 
    name: "销售日报分析", 
    type: "Skill", 
    description: "一键汇总跨区域每日交易指标，自动提取增长趋势及异常表现并输出长文本摘要日报。", 
    calls: "2,840", 
    status: "active",
    author: "林智杰",
    time: "10分前"
  },
  { 
    id: "2", 
    name: "数据表查询", 
    type: "Tool", 
    description: "连接生产数据库只读副本，支持自然语言转安全SQL并反馈多维度可视化数据图表。", 
    calls: "1,250", 
    status: "active",
    author: "张雨晴",
    time: "24分前"
  },
  { 
    id: "3", 
    name: "企业知识检索", 
    type: "Skill", 
    description: "基于RAG检索技术，秒级解析企业内部规章、财务报表、标准流程等多元异构文档。", 
    calls: "4,620", 
    status: "active",
    author: "系统管理员",
    time: "32分前"
  },
  { 
    id: "4", 
    name: "API 文档生成", 
    type: "MCP", 
    description: "标准化对接 Model Context Protocol (MCP) 命令流，支持逆向解析后端代码生成标准 Swagger UI 结构。", 
    calls: "980", 
    status: "warning",
    author: "王博远",
    time: "55分前"
  },
  {
    id: "5",
    name: "行业研报深度分析",
    type: "Skill",
    description: "深度提取多PDF行研报告，识别并归纳核心财务预测、估值乘数及行业壁垒，自动比对竞品指标。",
    calls: "3,110",
    status: "active",
    author: "林智杰",
    time: "1小时前"
  },
  {
    id: "6",
    name: "智能话术生成器",
    type: "Skill",
    description: "基于真实成交客群和产品特征，实时生成高转化的特定营销话术 and 破冰文案，内置多模套件。",
    calls: "1,750",
    status: "active",
    author: "李晓雅",
    time: "2小时前"
  },
  {
    id: "7",
    name: "GitHub 仓库连接器",
    type: "MCP",
    description: "将指定代码库的 Issues、PR 和 Commits 转化为大模型安全工具，实现代码仓库级实时检索和自动审核。",
    calls: "620",
    status: "active",
    author: "王博远",
    time: "3-31"
  },
  {
    id: "8",
    name: "本地 SQLite 驱动",
    type: "MCP",
    description: "将本地 SQLite 数据库架构及安全脱敏数据集以只读事务形式通过 MCP 挂载大模型会话中，进行自然语言查询。",
    calls: "440",
    status: "active",
    author: "数据分析部",
    time: "4-15"
  },
  {
    id: "9",
    name: "PDF 格式智能提取",
    type: "Tool",
    description: "一键识别混合排版 PDF 中的矢量表格、复杂嵌套表并解析为标准扁平化 JSON 格式数据输出。",
    calls: "2,190",
    status: "active",
    author: "张雨晴",
    time: "4-20"
  },
  {
    id: "10",
    name: "实时汇率及财务核算",
    type: "Tool",
    description: "调用网关实时汇率和财务税率，支持大规模多国进出口应收账款在线智能汇缴计算与财务轧差。",
    calls: "830",
    status: "active",
    author: "财务部",
    time: "5-02"
  }
];

export const MOCK_DASHBOARD_LOGS: DashboardLog[] = [
  { id: "log1", name: "销售日报分析", type: "Skill", user: "林智杰", status: "success", duration: "1.25s", time: "10秒前" },
  { id: "log2", name: "数据表查询", type: "Tool", user: "张雨晴", status: "success", duration: "620ms", time: "2分钟前" },
  { id: "log3", name: "企业知识检索", type: "Skill", user: "系统管理员", status: "success", duration: "2.44s", time: "5分钟前" },
  { id: "log4", name: "API 文档生成", type: "MCP", user: "王博远", status: "warning", duration: "8.12s", time: "15分钟前" },
  { id: "log5", name: "行业研报深度分析", type: "Skill", user: "周海燕", status: "success", duration: "3.10s", time: "22分钟前" },
  { id: "log6", name: "PDF 格式智能提取", type: "Tool", user: "张雨晴", status: "success", duration: "1.45s", time: "40分钟前" },
  { id: "log7", name: "GitHub 仓库连接器", type: "MCP", user: "王博远", status: "success", duration: "4.82s", time: "1小时前" },
  { id: "log8", name: "实时汇率及财务核算", type: "Tool", user: "财务助理", status: "success", duration: "510ms", time: "2小时前" }
];

export const MOCK_DASHBOARD_METRICS: DashboardMetrics = {
  skillsCount: 128,
  skillsDiff: "+12.4%",
  mcpCount: 36,
  mcpDiff: "+5.8%",
  toolsCount: 284,
  toolsDiff: "持平",
  callsCount: "12,580",
  callsDiff: "+18.2%",
  serviceNormal: 32,
  serviceWarning: 2,
  serviceMaintenance: 2,
  connectivity: "94.4%"
};

export const MOCK_DASHBOARD_TODOS: DashboardTodo[] = [
  { id: "t1", title: "待审核 Skill 预发", subtitle: "提交人: 王博远 (智能合约开发)", count: 3, level: "info" },
  { id: "t2", title: "待审批数据库权限", subtitle: "提交人: 张雨晴 (数据分析部)", count: 5, level: "info" },
  { id: "t3", title: "异常服务人工确认", subtitle: "[API Gateway Node 04] 断线中", count: 2, level: "danger" },
  { id: "t4", title: "即将过期 API 授权", subtitle: "外部厂商大模型调用 Token 续约", count: 4, level: "info" }
];

export const MOCK_HOME_RECOMMEND = [
  {
    id: "sk_1",
    name: "销售日报自动分析",
    type: "Skill",
    description: "汇聚并自动分析前一日全渠道销售数据，自动产出包含异动归因、趋势预测、高潜货品及爆款建议的结构化日报。",
    author: "数据科学部",
    time: "3小时前",
    calls: "1.2k",
    status: "published",
    iconColor: "bg-blue-50 text-blue-600 border-blue-100",
    iconName: "Sparkles"
  },
  {
    id: "pub-3",
    name: "合同法律条款风险审核",
    type: "Skill",
    description: "快速审查电子合同文本中的排他性、赔偿限额以及争议管辖权等条款风险并提示提示。",
    author: "陈晓磊",
    time: "1天前",
    calls: "862",
    status: "reviewing",
    iconColor: "bg-purple-50 text-purple-600 border-purple-100",
    iconName: "Sparkles"
  },
  {
    id: "pub-2",
    name: "企业内部数据库安全连接服务",
    type: "MCP Server",
    description: "提供安全只读 SQL 执行、高频数据实体视图导出、模式元数据检索的 MCP 服务。",
    author: "王磊 (Leo)",
    time: "2天前",
    calls: "2.1k",
    status: "published",
    iconColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
    iconName: "Cpu"
  }
];

export const MOCK_HOME_POPULAR = [
  {
    id: "sk_2",
    name: "企业知识检索助手",
    type: "Skill",
    description: "一站式极速检索、提炼企业所有历史规章制度、福利标准、技术红皮书，安全防泄露，带有溯源引用。",
    author: "信息安全部",
    time: "2026-06-14",
    calls: "5.4k",
    status: "published",
    iconColor: "bg-blue-50 text-blue-600 border-blue-100",
    iconName: "Sparkles"
  },
  {
    id: "sk_5",
    name: "Excel 数据智能化加工",
    type: "Skill",
    description: "高级复杂多表 VLOOKUP 替换、乱码清理、格式对齐以及透视表自动设计。用自然语言解决千奇百怪的复杂统计整理诉求。",
    author: "财务共享部",
    time: "2026-06-13",
    calls: "1.5k",
    status: "published",
    iconColor: "bg-purple-50 text-purple-600 border-purple-100",
    iconName: "Sparkles"
  },
  {
    id: "sk_1",
    name: "销售日报自动分析",
    type: "Skill",
    description: "汇聚并自动分析前一日全渠道销售数据，自动产出包含异动归因、趋势预测、高潜货品及爆款建议的结构化日报。",
    author: "数据科学部",
    time: "2026-06-12",
    calls: "1.2k",
    status: "published",
    iconColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
    iconName: "Sparkles"
  }
];

