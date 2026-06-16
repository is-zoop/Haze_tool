export type AssetType = "Skill" | "MCP Server" | "Tool";

export type AssetStatus =
  | "draft"       // 草稿
  | "reviewing"   // 待审核
  | "published"   // 已发布
  | "rejected"    // 已拒绝
  | "offline";    // 已下线

export type TestStatus = "none" | "testing" | "pass" | "fail";

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expected: string;
}

export interface DeveloperAsset {
  id: string;
  name: string;
  code: string;
  type: AssetType;
  description: string;
  version: string;
  project: string;
  owner: string;
  status: AssetStatus;
  recentTestStatus: TestStatus;
  updatedAt: string;
  calls: number;
  tags: string[];
  visibility: "private" | "internal" | "public";

  // Skill-specific fields
  skillMd?: string;
  dependentTools?: string[];
  testCases?: TestCase[];

  // MCP Server-specific fields
  transport?: "HTTP" | "STDIO";
  serverUrl?: string;
  startCommand?: string;
  startArgs?: string;
  healthCheckUrl?: string;
  credentialRef?: string;
  averageResponseTime?: number;
  capabilities?: {
    tools?: boolean;
    resources?: boolean;
    prompts?: boolean;
  };
  tools?: string[];
  resources?: string[];
  prompts?: string[];

  // MCP Tool-specific fields
  mcpServerId?: string;
  mcpServerName?: string;
  inputSchema?: string;
  outputSchema?: string;
  parameterNotice?: string;
  readWrite?: "readonly" | "readwrite";
  needConfirm?: boolean;
}

export interface TestRun {
  id: string;
  testName: string;
  assetId: string;
  assetName: string;
  assetType: AssetType;
  testVersion: string;
  environment: string;
  status: "unexecuted" | "executing" | "pass" | "fail" | "cancelled";
  duration: number; // in ms
  executor: string;
  executionTime: string;
  input: string;
  expectedResult: string;
  actualResult: string;
  steps: string[];
  toolCalls: { toolName: string; args: string; result: string }[];
  errorSummary?: string;
}

export interface VersionRecord {
  id: string;
  version: string;
  assetId: string;
  assetName: string;
  status: "draft" | "beta" | "release" | "deprecated"; // 草稿版, 测试版, 正式版, 已废弃
  changelog: string;
  creator: string;
  createdAt: string;
  publishedAt?: string;
}
