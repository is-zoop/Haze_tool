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
  { name: "1. 服务连接测试", desc: "HTTP / STDIO 服务可访问" },
  { name: "2. 认证测试", desc: "端点验证通过" },
  { name: "3. 协议初始化", desc: "MCP 初始化成功" },
  { name: "4. 工具列表获取", desc: "获取工具列表" },
  { name: "5. 工具调用测试", desc: "只读工具调用成功" },
  { name: "6. 完成", desc: "测试完成" },
];