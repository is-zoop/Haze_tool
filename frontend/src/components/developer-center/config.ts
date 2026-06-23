import { DeveloperAsset } from "../../types/developer-center";

export const DEFAULT_ASSET: Partial<DeveloperAsset> = {
  name: "",
  code: "",
  type: "Skill",
  description: "",
  version: "v1.0.0",
  project: "企业办公",
  owner: "",
  status: "draft",
  tags: [],
  skillMd: "",
  transport: "HTTP",
  serverUrl: "",
  startCommand: "",
  startArgs: "",
  tools: [],
  resources: [],
  prompts: [],
  testCases: [],
};

export const MCP_TEST_STEPS = [
  { name: "1. 服务连接测试", desc: "HTTP 服务可访问", duration: "128ms" },
  { name: "2. 认证测试", desc: "JWT Token 验证通过", duration: "96ms" },
  { name: "3. 协议初始化", desc: "MCP 初始化成功", duration: "143ms" },
  { name: "4. 工具列表获取", desc: "获取到 5 个工具", duration: "210ms" },
  { name: "5. 工具调用测试", desc: "工具调用成功", duration: "1.25s" },
  { name: "6. 完成", desc: "测试完成", duration: "" },
];

export const SIMULATION_LOGS = [
  { delay: 250, nextStepIdx: 0, type: "HTTP", text: "连接服务器..." },
  { delay: 550, nextStepIdx: 0, type: "HTTP", text: "服务连接成功 (200 OK) - 128ms" },
  { delay: 650, nextStepIdx: 1, type: "SYSTEM_STEP", text: "" },
  { delay: 950, nextStepIdx: 1, type: "AUTH", text: "发送 JWT Token 进行认证..." },
  { delay: 1250, nextStepIdx: 1, type: "AUTH", text: "JWT 验证成功 - 96ms" },
  { delay: 1350, nextStepIdx: 2, type: "SYSTEM_STEP", text: "" },
  { delay: 1600, nextStepIdx: 2, type: "MCP", text: "发送 initialize 请求..." },
  { delay: 1950, nextStepIdx: 2, type: "MCP", text: "初始化成功 - 协议版本: 2024-11-05 - 143ms" },
  { delay: 2050, nextStepIdx: 3, type: "SYSTEM_STEP", text: "" },
  { delay: 2350, nextStepIdx: 3, type: "TOOLS", text: "发送 tools/list 请求..." },
  { delay: 2700, nextStepIdx: 3, type: "TOOLS", text: "获取工具列表成功 - 发现 5 个工具 - 210ms" },
  { delay: 2800, nextStepIdx: 4, type: "SYSTEM_STEP", text: "" },
  { delay: 3100, nextStepIdx: 4, type: "CALL", text: "测试工具调用: list_database_tables" },
  { delay: 4100, nextStepIdx: 4, type: "CALL", text: "工具调用成功 - 返回 8 条数据 - 1.25s" },
  { delay: 4200, nextStepIdx: 5, type: "SYSTEM_STEP", text: "" },
  { delay: 4400, nextStepIdx: 5, type: "SUCCESS", text: "所有模拟步骤已完成，正式测试状态仍需管理员确认。" },
  { delay: 4500, nextStepIdx: 6, type: "SYSTEM_STEP", text: "" },
];

export const SIMULATION_FINISH_DELAY = 4550;