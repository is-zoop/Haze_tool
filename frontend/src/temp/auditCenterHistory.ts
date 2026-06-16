/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */

import { AuditHistoryItem } from "../types/audit-center";

export const auditHistory: AuditHistoryItem[] = [
  {
    id: "AUDIT-2026-0013",
    title: "智能公文起草助手 发布审核",
    type: "capability_publish",
    capabilityName: "行政公文规整小助手",
    capabilityType: "Skill",
    applicant: "孙强 (Sunny)",
    department: "行政办公室",
    status: "approved",
    decisionComment: "安全沙箱扫描全部正常，指令设计符合行政写作合规。同意并发布入库。",
    processedTime: "2026-06-12 14:15",
    processor: "王主管 (Head)"
  },
  {
    id: "AUDIT-2026-0014",
    title: "数据库自动化分析 MCP Server 接入权限申请",
    type: "permission_request",
    capabilityName: "关系型数据库运维中枢",
    capabilityType: "MCP Server",
    applicant: "高阳 (Gary)",
    department: "系统运维部",
    status: "rejected",
    decisionComment: "权限请求范围过于宽泛。未绑定具体操作名，且未绑定特定只读角色。已被退回修改。",
    processedTime: "2026-06-11 16:30",
    processor: "系统管理员 (Admin)"
  },
  {
    id: "AUDIT-2026-0015",
    title: "企业微信群发 API 即时执行申请",
    type: "high_risk_tool",
    capabilityName: "企业核心通知群派发",
    capabilityType: "MCP Tool",
    applicant: "陈静 (Jane)",
    department: "市场营销部",
    status: "withdrawn",
    decisionComment: "申请人因微信群推文案需临时更改，在审核前已在工作区主动撤回此单。",
    processedTime: "2026-06-10 12:44",
    processor: "系统自动"
  },
  {
    id: "AUDIT-2026-0016",
    title: "过期用户数据擦除 Tool 即时执行申请",
    type: "high_risk_tool",
    capabilityName: "死账户全生命清理",
    capabilityType: "MCP Tool",
    applicant: "杨波 (Bob)",
    department: "安全审计组",
    status: "expired",
    decisionComment: "系统在规定的处理时效(72小时)内未收到多级合规负责人的最终结论，判定为自动超时失败。",
    processedTime: "2026-06-08 09:00",
    processor: "系统自动"
  },
  {
    id: "AUDIT-2026-0017",
    title: "招聘模板多格式生成 Skill 发布审核",
    type: "capability_publish",
    capabilityName: "岗位JD一键生成工具",
    capabilityType: "Skill",
    applicant: "李娜 (Lina)",
    department: "人力资源部",
    status: "approved",
    decisionComment: "测试用例100%通过，满足企业薪酬及福利合规限制，已准予立即上线能力市场。",
    processedTime: "2026-06-07 15:20",
    processor: "陈经理 (R&D)"
  },
  {
    id: "AUDIT-2026-0018",
    title: "客服数据仓库 MCP Server 访问授权",
    type: "permission_request",
    capabilityName: "客服工单多维度仓",
    capabilityType: "MCP Server",
    applicant: "王磊 (Leo)",
    department: "客户服务部",
    status: "approved",
    decisionComment: "由于季度工单二次分流重构需求，同意授予其为期半年的生产库只读调用配额域。",
    processedTime: "2026-06-06 10:10",
    processor: "安全管理员 (Security)"
  },
  {
    id: "AUDIT-2026-0019",
    title: "一键清除服务器废弃临时日志 Tool 运行申请",
    type: "high_risk_tool",
    capabilityName: "Staging物理碎屑清理器",
    capabilityType: "MCP Tool",
    applicant: "高阳 (Gary)",
    department: "系统运维部",
    status: "approved",
    decisionComment: "在安全隔离的网络环境下，通过沙箱清理1.2TB缓存正常。通过建议操作。",
    processedTime: "2026-06-05 18:30",
    processor: "王主管 (Head)"
  },
  {
    id: "AUDIT-2026-0020",
    title: "用户信用画像 Skill 下线申请",
    type: "capability_offline",
    capabilityName: "旧版多指标风控打分盘",
    capabilityType: "Skill",
    applicant: "张杰 (Jack)",
    department: "财务管理部",
    status: "approved",
    decisionComment: "新版多维度智能风控大盘已无感平替，旧能力下线合规，未影响现有工作区挂载依赖。",
    processedTime: "2026-06-04 11:40",
    processor: "安全管理员 (Security)"
  },
  {
    id: "AUDIT-2026-0021",
    title: "多式联运运费算费 Tool 发布审核",
    type: "capability_publish",
    capabilityName: "多路径智算比价运费器",
    capabilityType: "MCP Tool",
    applicant: "邓超 (Dawn)",
    department: "供应链管理中心",
    status: "approved",
    decisionComment: "定价策略与算费模型已和总线系统完全隔离校验，计算准确率100%。通过发布。",
    processedTime: "2026-06-03 14:02",
    processor: "王主管 (Head)"
  },
  {
    id: "AUDIT-2026-0022",
    title: "产品创意脑暴 Skill v1.2.0 版本迭代发布",
    type: "version_publish",
    capabilityName: "多角色思维导图生成器",
    capabilityType: "Skill",
    applicant: "陈静 (Jane)",
    department: "市场营销部",
    status: "approved",
    decisionComment: "变更项为补充部分结构化 Prompt，并删除了失效的依赖 API 链接。安全通过。",
    processedTime: "2026-06-02 16:55",
    processor: "陈经理 (R&D)"
  },
  {
    id: "AUDIT-2026-0023",
    title: "竞品价格舆情抓取 Tool 权限申请",
    type: "permission_request",
    capabilityName: "主流电商比价网页提取",
    capabilityType: "MCP Tool",
    applicant: "孙强 (Sunny)",
    department: "市场营销部",
    status: "rejected",
    decisionComment: "该抓取接口可能触发境外 IP 关联反爬预警，且该部门已有更专业的官方代理，退回合并。",
    processedTime: "2026-06-01 10:50",
    processor: "安全管理员 (Security)"
  },
  {
    id: "AUDIT-2026-0024",
    title: "高并发测试集群一键重启 Tool 即时调阅执行",
    type: "high_risk_tool",
    capabilityName: "集群物理隔离断电开关",
    capabilityType: "MCP Tool",
    applicant: "高阳 (Gary)",
    department: "系统运维部",
    status: "approved",
    decisionComment: "经线上确认，重启处于测试子网络。同意执行，且已安排运维值班跟进。",
    processedTime: "2026-05-31 23:15",
    processor: "系统管理员 (Admin)"
  },
  {
    id: "AUDIT-2026-0025",
    title: "招聘系统简历自动匿名化处理 Tool 发布审核",
    type: "capability_publish",
    capabilityName: "简历隐私清洗脱敏扣字器",
    capabilityType: "MCP Tool",
    applicant: "王磊 (Leo)",
    department: "人力资源部",
    status: "approved",
    decisionComment: "完全满足集团内部数据脱敏高合规要求，且支持了国标安全码匹配。同意发布。",
    processedTime: "2026-05-30 11:15",
    processor: "安全管理员 (Security)"
  },
  {
    id: "AUDIT-2026-0026",
    title: "海外推广预算配置看板权限申请",
    type: "permission_request",
    capabilityName: "全球大促营销脑洞池",
    capabilityType: "Skill",
    applicant: "陈静 (Jane)",
    department: "市场营销部",
    status: "approved",
    decisionComment: "业务线直批。授权只读访问期 30 天，到期自动收回该权限域。",
    processedTime: "2026-05-29 17:10",
    processor: "部门负责人 (Head)"
  },
  {
    id: "AUDIT-2026-0027",
    title: "未脱敏客服通话音轨临时导出 Tool 即刻调用执行",
    type: "high_risk_tool",
    capabilityName: "原声客服通话提取打包装箱",
    capabilityType: "MCP Tool",
    applicant: "李娜 (Lina)",
    department: "客户服务部",
    status: "rejected",
    decisionComment: "包含敏感录音极易泄露银行口头密码。该环境尚未搭建加密防火墙落地域。拒绝执行。",
    processedTime: "2026-05-28 14:02",
    processor: "安全管理员 (Security)"
  }
];
