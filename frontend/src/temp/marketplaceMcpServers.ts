import { CapabilityItem } from "../types/capability";

export const MOCK_MARKETPLACE_MCP_SERVERS: CapabilityItem[] = [
  {
    id: "mcp_1",
    name: "企业数据中心 MCP",
    type: "MCP",
    description: "提供企业内部受控的安全 SQL 运行、高频数据实体视图导出、模式元数据检索的 SSE/HTTP 模型上下文协议集成服务。",
    calls: 4120,
    status: "active",
    author: "王磊 (Leo)",
    version: "v2.1.2",
    updateTime: "2026-06-15",
    permissionsStatus: "granted",
    riskLevel: "medium",
    department: "企业架构部",
    tags: ["数据中心", "SQL", "安全连接"],
    systemName: "内部生产数仓集群",
    toolsCount: 3,
    resourcesCount: 2,
    promptsCount: 0,
    connectType: "HTTP/SSE",
    avgResponseTime: "125ms",
    accessInstruction: "将 serverUrl 复制配置进 Cursor 或 Tabby/WebUI 端配置中。依赖 HazeGateway 安全验证。",
    toolsList: [
      {
        name: "query_db_schema",
        description: "从关系型数据库中探测表和字段元数据列表",
        isReadonly: true,
        riskLevel: "low",
        permissionsStatus: "direct",
        status: "active"
      },
      {
        name: "exec_safe_select",
        description: "在指定的企业级数据库实例上执行只读 SELECT 查询（限100行）",
        isReadonly: true,
        riskLevel: "medium",
        permissionsStatus: "granted",
        status: "active"
      },
      {
        name: "export_financial_metrics",
        description: "接收财务分析比率要求并导出为标准模型",
        isReadonly: true,
        riskLevel: "low",
        permissionsStatus: "direct",
        status: "active"
      }
    ],
    resourcesList: [
      "db://finance_schemas - 财务账目模型通用清单",
      "db://standardized_reports_view - 集团年报季度汇总视图"
    ],
    promptsList: []
  },
  {
    id: "mcp_2",
    name: "受控文件系统沙箱 MCP",
    type: "MCP",
    description: "隔离本地指定文件夹结构并向模型提供精美的受控文件读写、全文本矢量索引检索能力的本地 STDIO 连接驱动。",
    calls: 432,
    status: "active",
    author: "刘洋 (Alex)",
    version: "v1.0.0",
    updateTime: "2026-06-15",
    permissionsStatus: "direct",
    riskLevel: "low",
    department: "安全实验室",
    tags: ["文件系统", "沙箱", "本地驱动"],
    systemName: "本地沙盒隔离器",
    toolsCount: 2,
    resourcesCount: 1,
    promptsCount: 2,
    connectType: "STDIO/Process",
    avgResponseTime: "45ms",
    accessInstruction: "下载本地代理工具运行并配合命令 `npx @haze/mcp-fs-server --secure-dir ./sandbox` 挂载本地实例。",
    toolsList: [
      {
        name: "read_sandbox_file",
        description: "读取指定的本地文本内容（最大限制 50KB）",
        isReadonly: true,
        riskLevel: "low",
        permissionsStatus: "direct",
        status: "active"
      },
      {
        name: "search_sandbox_index",
        description: "在隔离的沙盒文件仓库中运行高级词频逆反和语义索引搜索",
        isReadonly: true,
        riskLevel: "low",
        permissionsStatus: "direct",
        status: "active"
      }
    ],
    resourcesList: [
      "file://current_sandbox_tree - 沙盒目录相对实时文件树"
    ],
    promptsList: [
      "read_file_summarize_prompt - 文章核心意旨极速成稿提示词模版",
      "audit_code_prompt - 研发代码缺陷与代码异味诊断模版"
    ]
  }
];
