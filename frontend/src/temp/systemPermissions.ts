/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */
import { ModulePermission } from "../types/system-management";

export const systemPermissions: ModulePermission[] = [
  {
    id: "M100",
    name: "能力市场",
    code: "CAPABILITY_MARKET",
    functions: [
      {
        id: "F101",
        name: "浏览浏览与搜索",
        code: "MARKET_VIEW",
        actions: [
          { id: "A1011", name: "查看能力详情与列表", code: "VIEW_DETAILS", enabled: true },
          { id: "A1012", name: "查看开发文档与架构图", code: "VIEW_DOCS", enabled: true }
        ]
      },
      {
        id: "F102",
        name: "能力使用与执行",
        code: "MARKET_USE",
        actions: [
          { id: "A1021", name: "直接运行/调用 Skill", code: "RUN_SKILL", enabled: true },
          { id: "A1022", name: "测试 MCP 连接与调试", code: "TEST_CONNS", enabled: true },
          { id: "A1023", name: "调用高风险写入 Tool", code: "RUN_DANGER_TOOLS", enabled: false }
        ]
      },
      {
        id: "F103",
        name: "权限申请",
        code: "MARKET_APPLY",
        actions: [
          { id: "A1031", name: "提交能力可见性申请", code: "SUBMIT_APPLY", enabled: true },
          { id: "A1032", name: "续期/注销权限申诉", code: "EXTEND_APPLY", enabled: true }
        ]
      }
    ]
  },
  {
    id: "M200",
    name: "开发者中心",
    code: "DEVELOPER_CENTER",
    functions: [
      {
        id: "F201",
        name: "Skill 开发与管理",
        code: "DEV_SKILL",
        actions: [
          { id: "A2011", name: "新建/克隆 Skill", code: "CREATE_SKILL", enabled: true },
          { id: "A2012", name: "修改 Skill 描述/Prompt", code: "EDIT_SKILL", enabled: true },
          { id: "A2013", name: "删除/下线 Skill 资源", code: "DELETE_SKILL", enabled: false }
        ]
      },
      {
        id: "F202",
        name: "MCP Server 配置",
        code: "DEV_MCP",
        actions: [
          { id: "A2021", name: "配置与注册新 MCP 实例", code: "REGISTER_MCP", enabled: true },
          { id: "A2022", name: "编辑 MCP 密钥与代理链路", code: "EDIT_MCP", enabled: true },
          { id: "A2023", name: "一键升级 MCP 协议版本", code: "UPGRADE_MCP", enabled: false }
        ]
      },
      {
        id: "F203",
        name: "在线发布与调试",
        code: "DEV_PUBLISH",
        actions: [
          { id: "A2031", name: "沙箱运行调试 Tool 接口", code: "SANDBOX_DEBUG", enabled: true },
          { id: "A2032", name: "发布版本并提交发布审核", code: "SUBMIT_AUDIT", enabled: true },
          { id: "A2033", name: "灰度发布及比例切流", code: "GRAY_RELEASE", enabled: false }
        ]
      }
    ]
  },
  {
    id: "M300",
    name: "审核中心",
    code: "AUDIT_CENTER",
    functions: [
      {
        id: "F301",
        name: "能力发布审批",
        code: "AUDIT_PUBLISH",
        actions: [
          { id: "A3011", name: "查看发布申请单详情", code: "VIEW_PUBLISH_RECORD", enabled: true },
          { id: "A3012", name: "通过审核并推送线上", code: "APPROVE_PUBLISH", enabled: false },
          { id: "A3013", name: "驳回/拒绝发布单", code: "REJECT_PUBLISH", enabled: false }
        ]
      },
      {
        id: "F302",
        name: "申请分配审批",
        code: "AUDIT_GRANT",
        actions: [
          { id: "A3021", name: "审批员工的调用权限", code: "APPROVE_USER_GRANT", enabled: false },
          { id: "A3022", name: "转交/委托他人处理", code: "TRANSFER_GRANT", enabled: false }
        ]
      }
    ]
  },
  {
    id: "M400",
    name: "系统管理",
    code: "SYSTEM_MANAGEMENT",
    functions: [
      {
        id: "F401",
        name: "组织与用户管理",
        code: "SYS_USERS",
        actions: [
          { id: "A4011", name: "新建/编辑用户档案", code: "WRITE_USERS", enabled: false },
          { id: "A4012", name: "重置密码/解锁/移交资源", code: "ADMIN_USERS_OPS", enabled: false },
          { id: "A4013", name: "禁用/删除账号（危）", code: "DANGER_USERS_OPS", enabled: false }
        ]
      },
      {
        id: "F402",
        name: "角色与权限分配",
        code: "SYS_ROLES",
        actions: [
          { id: "A4021", name: "创建与修改自定义角色", code: "WRITE_ROLES", enabled: false },
          { id: "A4022", name: "配置权限矩阵和可见策略", code: "WRITE_PERMS", enabled: false }
        ]
      },
      {
        id: "F403",
        name: "登录认证配置",
        code: "SYS_AUTH",
        actions: [
          { id: "A4031", name: "配置企业 OIDC / SAML SSO", code: "WRITE_SSO", enabled: false },
          { id: "A4032", name: "调整密码策略、强锁规则", code: "WRITE_PASS_POLICY", enabled: false }
        ]
      },
      {
        id: "F404",
        name: "平台核心设置 & 通知",
        code: "SYS_CONFIG",
        actions: [
          { id: "A4041", name: "修改平台别名及文档资源地址", code: "WRITE_PLATFORM", enabled: false },
          { id: "A4042", name: "配置 Webhook 及消息推送组", code: "WRITE_NOTIFICATIONS", enabled: false }
        ]
      },
      {
        id: "F405",
        name: "审计与日志追溯",
        code: "SYS_AUDIT_LOGS",
        actions: [
          { id: "A4051", name: "查看平台完整审计日志与数据对照", code: "VIEW_AUDIT", enabled: true },
          { id: "A4052", name: "导出完整审计表单为 CSV", code: "EXPORT_AUDIT", enabled: false }
        ]
      }
    ]
  }
];
