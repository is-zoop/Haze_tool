import { DeveloperAsset } from "../types/developer-center";

export const MOCK_DEVELOPER_MCP_SERVERS: DeveloperAsset[] = [
  {
    id: "asset-8",
    name: "工作区受控文件系统沙箱服务",
    code: "filesystem_guard",
    type: "MCP Server",
    description: "用于隔离的本地文件夹结构发现、受控文件读写、全文检索、大文件断点阅读，内置多级安全防护机制。",
    version: "v1.0.0",
    project: "运营 Copilot (Operation Copilot)",
    owner: "刘洋 (Alex)",
    status: "draft",
    recentTestStatus: "pass",
    updatedAt: "2026-06-15 11:40:02",
    calls: 432,
    tags: ["Filesystem", "Sandbox", "Index"],
    visibility: "private",
    transport: "STDIO",
    startCommand: "npx",
    startArgs: "@haze/mcp-fs-server --secure-dir ./sandbox",
    healthCheckUrl: "",
    credentialRef: "SEC_SANDBOX_OWNERSHIP",
    averageResponseTime: 45,
    capabilities: {
      tools: true,
      resources: true,
      prompts: true
    },
    tools: ["read_sandbox_file", "search_sandbox_index"],
    resources: ["file://current_sandbox_tree"],
    prompts: ["read_file_summarize_prompt", "audit_code_prompt"]
  }
];
