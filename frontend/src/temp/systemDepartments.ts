/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */
import { SystemDepartment, SystemUserGroup } from "../types/system-management";

export const systemDepartments: SystemDepartment[] = [
  {
    id: "D100",
    name: "总裁办",
    code: "CORP-HQ",
    parentId: null,
    managerName: "李国强",
    memberCount: 5,
    description: "企业战略决策与核心资源调控中心",
    createdAt: "2025-01-01 09:00:00",
    status: "active"
  },
  {
    id: "D101",
    name: "企业架构部",
    code: "CORP-ARC",
    parentId: "D100",
    managerName: "章建华",
    memberCount: 12,
    description: "企业数字化转型、技术架构、标准与合规规划",
    createdAt: "2025-01-01 10:00:00",
    status: "active"
  },
  {
    id: "D102",
    name: "AI 平台研发部",
    code: "CORP-AIPD",
    parentId: "D101",
    managerName: "陈晓磊",
    memberCount: 25,
    description: "Haze AI 核心平台开发、MCP 网关整合、高可用引擎维护",
    createdAt: "2025-02-01 09:00:00",
    status: "active"
  },
  {
    id: "D103",
    name: "大模型算法团队",
    code: "CORP-AIALG",
    parentId: "D102",
    managerName: "陈晓磊",
    memberCount: 14,
    description: "NLP/RAG/多模态模型调优、特种场景推理及 Agent 策略微调",
    createdAt: "2025-02-15 10:00:00",
    status: "active"
  },
  {
    id: "D104",
    name: "信息安全部",
    code: "CORP-SEC",
    parentId: "D101",
    managerName: "吴海涛",
    memberCount: 8,
    description: "企业网络安全、数据加解密、大模型审计监控、安全白名单审核",
    createdAt: "2025-03-01 09:00:00",
    status: "active"
  },
  {
    id: "D105",
    name: "业务运营组一队",
    code: "CORP-OPS1",
    parentId: "D100",
    managerName: "何美玲",
    memberCount: 30,
    description: "负责平台通用业务流规划、Skill 可视化应用维护及内部能力交付",
    createdAt: "2025-01-10 10:00:00",
    status: "active"
  },
  {
    id: "D106",
    name: "应用开发一中心",
    code: "CORP-APP1",
    parentId: "D101",
    managerName: "宋承宪",
    memberCount: 45,
    description: "跨部门业务微调与私域插件编写、对外接口转换、业务逻辑承接",
    createdAt: "2025-04-15 09:00:00",
    status: "active"
  },
  {
    id: "D107",
    name: "销售支持组团队",
    code: "CORP-SALES",
    parentId: "D105",
    managerName: "高圆圆",
    memberCount: 18,
    description: "利用大模型分析销售线索及生成报价与售后反馈建议书",
    createdAt: "2025-06-01 10:00:00",
    status: "active"
  },
  {
    id: "D108",
    name: "客户成功华南群",
    code: "CORP-CS-SOUTH",
    parentId: "D105",
    managerName: "张三丰",
    memberCount: 11,
    description: "华南大客户接入、反馈收集与自动化知识库同步",
    createdAt: "2025-08-01 09:00:00",
    status: "active"
  },
  {
    id: "D109",
    name: "资源池研发支撑",
    code: "CORP-RES",
    parentId: "D106",
    managerName: "李四光",
    memberCount: 22,
    description: "私有云底座、容器、大模型多活算力池扩缩容保障",
    createdAt: "2025-07-15 10:00:00",
    status: "active"
  },
  {
    id: "D110",
    name: "财务审计核算",
    code: "CORP-FIN",
    parentId: "D100",
    managerName: "王建国",
    memberCount: 6,
    description: "大模型 Token 计费、部门调用额度核算、开发者分成结算",
    createdAt: "2025-01-05 09:00:00",
    status: "active"
  },
  {
    id: "D111",
    name: "API 系统网关组",
    code: "CORP-GW",
    parentId: "D101",
    managerName: "章建华",
    memberCount: 4,
    description: "负责全局开放 API 网关接入、服务发现及 Token 校验过滤",
    createdAt: "2025-01-02 10:00:00",
    status: "active"
  },
  {
    id: "D112",
    name: "人力资源综合部",
    code: "CORP-HR",
    parentId: "D100",
    managerName: "刘婷婷",
    memberCount: 9,
    description: "组织架构调整、员工绩效跟踪、离职员工数据转移审计及权限回收",
    createdAt: "2025-01-10 09:00:00",
    status: "active"
  }
];

export const systemUserGroups: SystemUserGroup[] = [
  {
    id: "G1001",
    name: "RAG 联合评估组",
    code: "UG-RAG-EVAL",
    description: "跨越算法、安全和业务的，专攻知识库智能检索效果日常测评的用户组",
    memberCount: 8,
    roles: ["能力开发者", "审核人员"],
    creator: "章建华",
    updatedAt: "2026-05-15 11:22:00",
    status: "active"
  },
  {
    id: "G1002",
    name: "华大业务骨干审批班",
    code: "UG-OPS-LEAD",
    description: "具有高价值大容量技能审批发布权能的跨业务主管联合团队",
    memberCount: 5,
    roles: ["审核人员"],
    creator: "李国强",
    updatedAt: "2026-06-10 14:00:00",
    status: "active"
  },
  {
    id: "G1003",
    name: "外部敏捷协作小组",
    code: "UG-EXT-DEV",
    description: "第三方技术专家与服务集成商的组合，赋能测试运行受限环境",
    memberCount: 12,
    roles: ["普通用户"],
    creator: "陈晓磊",
    updatedAt: "2026-06-05 18:30:00",
    status: "active"
  },
  {
    id: "G1004",
    name: "安全合规突击队",
    code: "UG-SEC-CHECK",
    description: "专司高危 MCP 注入防范、泄密扫描与紧急拦截演练的虚拟编制",
    memberCount: 4,
    roles: ["安全管理员"],
    creator: "吴海涛",
    updatedAt: "2026-06-14 09:12:00",
    status: "active"
  }
];
