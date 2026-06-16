/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */
import { NotificationChannelConfig, NotificationEventConfig } from "../types/system-management";

export const systemNotificationChannels: NotificationChannelConfig[] = [
  {
    id: "CH_INBOX",
    name: "站内消息中心",
    enabled: true,
    configured: true,
    lastTestTime: "2026-06-15 11:00:00",
    configSummary: "内置持久化收件箱群落"
  },
  {
    id: "CH_EMAIL",
    name: "SMTP 邮件网关",
    enabled: true,
    configured: true,
    lastTestTime: "2026-06-15 15:30:10",
    configSummary: "smtp.haze-corp.com:587 (TLS)"
  },
  {
    id: "CH_WECOM",
    name: "企业微信群机器人",
    enabled: false,
    configured: true,
    lastTestTime: "2026-06-12 10:00:00",
    configSummary: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=8eef4***"
  },
  {
    id: "CH_DING",
    name: "钉钉开放平台群机器人",
    enabled: false,
    configured: false,
    lastTestTime: "未配置",
    configSummary: "未配置"
  },
  {
    id: "CH_SLACK",
    name: "Slack Incoming Webhook",
    enabled: false,
    configured: false,
    lastTestTime: "未配置",
    configSummary: "未配置"
  },
  {
    id: "CH_WEBHOOK",
    name: "平台自定义总线 Webhook",
    enabled: true,
    configured: true,
    lastTestTime: "2026-06-14 18:22:15",
    configSummary: "https://api.haze-internal.co/v1/events/receiver (Active)"
  }
];

export const systemNotificationEvents: NotificationEventConfig[] = [
  {
    id: "EV001",
    name: "权限申请提交",
    code: "EV_GRANT_SUBMIT",
    category: "permission",
    channels: { inbox: true, email: true, wecom: false, dingtalk: false, slack: false, webhook: true }
  },
  {
    id: "EV002",
    name: "权限审核结果通知",
    code: "EV_GRANT_RESULT",
    category: "permission",
    channels: { inbox: true, email: true, wecom: true, dingtalk: false, slack: false, webhook: true }
  },
  {
    id: "EV003",
    name: "能力提交发布审核",
    code: "EV_PUB_SUBMIT",
    category: "audit",
    channels: { inbox: true, email: true, wecom: false, dingtalk: false, slack: false, webhook: false }
  },
  {
    id: "EV004",
    name: "能力审核结果通知",
    code: "EV_PUB_RESULT",
    category: "audit",
    channels: { inbox: true, email: true, wecom: true, dingtalk: false, slack: false, webhook: true }
  },
  {
    id: "EV005",
    name: "能力发布上线成功",
    code: "EV_PUB_SUCCESS",
    category: "audit",
    channels: { inbox: true, email: false, wecom: true, dingtalk: false, slack: false, webhook: true }
  },
  {
    id: "EV006",
    name: "能力发布流程失败",
    code: "EV_PUB_FAILURE",
    category: "audit",
    channels: { inbox: true, email: true, wecom: true, dingtalk: false, slack: false, webhook: true }
  },
  {
    id: "EV007",
    name: "MCP Server 在线状态异常",
    code: "EV_MCP_OFFLINE",
    category: "monitor",
    channels: { inbox: true, email: true, wecom: true, dingtalk: false, slack: false, webhook: true }
  },
  {
    id: "EV008",
    name: "高危 Tool 过滤触发/调用失败",
    code: "EV_TOOL_BLOCK_OR_FAIL",
    category: "monitor",
    channels: { inbox: true, email: true, wecom: true, dingtalk: false, slack: false, webhook: true }
  },
  {
    id: "EV009",
    name: "敏感参数溢出/安全告警升级",
    code: "EV_SECURITY_ALERT",
    category: "system",
    channels: { inbox: true, email: true, wecom: true, dingtalk: false, slack: false, webhook: true }
  },
  {
    id: "EV010",
    name: "用户权限即将到期前瞻",
    code: "EV_GRANT_EXPIRING",
    category: "permission",
    channels: { inbox: true, email: true, wecom: false, dingtalk: false, slack: false, webhook: false }
  },
  {
    id: "EV011",
    name: "基础能力版本自动更新",
    code: "EV_CAP_UPDATED",
    category: "system",
    channels: { inbox: true, email: false, wecom: false, dingtalk: false, slack: false, webhook: false }
  },
  {
    id: "EV012",
    name: "系统运行周期高负载告警",
    code: "EV_MONITOR_LOAD_EXCEED",
    category: "monitor",
    channels: { inbox: true, email: true, wecom: true, dingtalk: false, slack: false, webhook: true }
  }
];
