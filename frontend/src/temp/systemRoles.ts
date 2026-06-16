/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */
import { SystemRole } from "../types/system-management";

export const systemRoles: SystemRole[] = [
  // 6 System built-in roles
  {
    id: "R101",
    name: "超级管理员",
    code: "SUPER_ADMIN",
    type: "system",
    description: "拥有平台所有底层架构、安全机制、审计权限及最高级的全局规则管理权限。",
    userCount: 2,
    permissionCount: 42,
    creator: "System Init",
    updatedAt: "2025-01-01 09:00:00",
    status: "active"
  },
  {
    id: "R102",
    name: "平台管理员",
    code: "PLATFORM_ADMIN",
    type: "system",
    description: "负责业务流程、团队组织、各级 MCP 服务以及 Skill 技能包的生命周期治理。",
    userCount: 4,
    permissionCount: 35,
    creator: "System Init",
    updatedAt: "2025-01-01 09:00:00",
    status: "active"
  },
  {
    id: "R103",
    name: "安全管理员",
    code: "SECURITY_ADMIN",
    type: "system",
    description: "专职安全策略设计、高风险 Tool 权限评定、认证源 OIDC 接驳和全局阻断配置。",
    userCount: 3,
    permissionCount: 28,
    creator: "System Init",
    updatedAt: "2025-01-01 09:00:00",
    status: "active"
  },
  {
    id: "R104",
    name: "审核人员",
    code: "AUDITOR",
    type: "system",
    description: "负责对开发者中心提交的发布申请、版本变更及高频业务权限做多方线上会签与流转。",
    userCount: 6,
    permissionCount: 15,
    creator: "System Init",
    updatedAt: "2025-01-01 09:00:00",
    status: "active"
  },
  {
    id: "R105",
    name: "能力开发者",
    code: "CAPABILITY_DEVELOPER",
    type: "system",
    description: "支持在开发者中心上传或连接私有 MCP Server，编写智能 Agent Skill 技能包并自测。",
    userCount: 8,
    permissionCount: 20,
    creator: "System Init",
    updatedAt: "2025-01-01 09:00:00",
    status: "active"
  },
  {
    id: "R106",
    name: "普通用户",
    code: "NORMAL_USER",
    type: "system",
    description: "企业最终业务人员。默认可浏览已授权的能力市场、常用工作区，支持在额定流控内调用工具。",
    userCount: 120,
    permissionCount: 6,
    creator: "System Init",
    updatedAt: "2025-01-01 09:00:00",
    status: "active"
  },

  // 4 Custom roles
  {
    id: "R201",
    name: "部门审批师",
    code: "DEPT_APPROVER",
    type: "custom",
    description: "自定义业务层角色。具备跨科室资源审核与部门组员发布前核实签认的有限权限。",
    userCount: 3,
    permissionCount: 12,
    creator: "章建华",
    updatedAt: "2025-10-12 11:00:00",
    status: "active"
  },
  {
    id: "R202",
    name: "外部专家顾问",
    code: "EXTERNAL_CONSULTANT",
    type: "custom",
    description: "第三方机构代表。在特定 IP 沙箱内对特定 MCP Tool 提供技术评审及风险论证入账。",
    userCount: 5,
    permissionCount: 4,
    creator: "陈晓磊",
    updatedAt: "2026-02-18 16:30:11",
    status: "active"
  },
  {
    id: "R203",
    name: "测试审计专员",
    code: "TEST_AUDIT_SPECIALIST",
    type: "custom",
    description: "负责发布流水线中的灰度、集成测试日志巡检与平台行为回放安全审查。",
    userCount: 2,
    permissionCount: 10,
    creator: "吴海涛",
    updatedAt: "2026-04-05 14:22:15",
    status: "active"
  },
  {
    id: "R204",
    name: "只读运营观察员",
    code: "READONLY_OBSERVER",
    type: "custom",
    description: "辅助管理层。只读查看监控大盘、日志流和账号激活漏斗，禁止进行任何实质性交互动作。",
    userCount: 4,
    permissionCount: 5,
    creator: "何美玲",
    updatedAt: "2026-05-30 09:15:00",
    status: "active"
  }
];
