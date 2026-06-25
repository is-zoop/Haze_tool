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

export const STDIO_TEST_STEPS = [
  { name: "1. 识别运行时", desc: "检测 Node.js / Python 环境" },
  { name: "2. 拉起容器", desc: "Docker 隔离容器启动" },
  { name: "3. 安装依赖", desc: "npm install / pip install" },
  { name: "4. 进程存活", desc: "进程启动后持续运行" },
  { name: "5. stdout 格式", desc: "首条输出为合法 JSON-RPC" },
  { name: "6. stderr 检测", desc: "无 ERROR 级别日志输出" },
  { name: "7. initialize", desc: "MCP 协议初始化成功" },
  { name: "8. tools/list", desc: "获取工具列表成功" },
  { name: "9. tools/call", desc: "工具调用测试（有用例时）" },
];