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
  icon?: string;
  zipName?: string;
  zipSize?: string;
  zipFiles?: { name: string; size: string }[];
  iconUploadToken?: string;
  packageUploadToken?: string;

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
