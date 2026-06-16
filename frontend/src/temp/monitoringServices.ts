/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */
import { McpService } from "../types/monitoring";

export const monitoringServices: McpService[] = [
  {
    id: "mcp-srv-01",
    name: "Enterprise Data Searcher",
    system: "Knowledge Base Systems",
    env: "prod",
    status: "normal",
    toolsCount: 6,
    todayCalls: 4850,
    successRate: 99.8,
    avgLatency: 350,
    p95Latency: 820,
    lastHeartbeat: "2026-06-15T20:42:30Z",
    url: "https://mcp-gateway.corp/services/data-searcher",
    transferMethod: "SSE",
    version: "v2.1.4",
    owner: "张经理 (Data Team)",
    healthChecks: [
      { item: "DNS Resolution", status: "success", latency: 5, time: "2026-06-15T20:42:30Z" },
      { item: "Network Ingress Connection", status: "success", latency: 22, time: "2026-06-15T20:42:30Z" },
      { item: "Protocol Handshake Validation", status: "success", latency: 45, time: "2026-06-15T20:42:30Z" },
      { item: "Tools List Fetch", status: "success", latency: 153, time: "2026-06-15T20:42:30Z" },
      { item: "Resources Expose Check", status: "success", latency: 82, time: "2026-06-15T20:42:30Z" },
      { item: "Prompts Expose Check", status: "success", latency: 43, time: "2026-06-15T20:42:30Z" },
      { item: "Enterprise Authorization Bearer", status: "success", latency: 12, time: "2026-06-15T20:42:30Z" }
    ]
  },
  {
    id: "mcp-srv-02",
    name: "Salesforce CRM Connector",
    system: "Customer Relationship Management",
    env: "prod",
    status: "warning",
    toolsCount: 4,
    todayCalls: 3120,
    successRate: 96.4,
    avgLatency: 1120,
    p95Latency: 3200,
    lastHeartbeat: "2026-06-15T20:41:15Z",
    url: "https://mcp-gateway.corp/services/salesforce",
    transferMethod: "SSE",
    version: "v1.8.0",
    owner: "李总 (CRM Architecture)",
    healthChecks: [
      { item: "DNS Resolution", status: "success", latency: 12, time: "2026-06-15T20:41:15Z" },
      { item: "Network Ingress Connection", status: "success", latency: 210, time: "2026-06-15T20:41:15Z" },
      { item: "Protocol Handshake Validation", status: "success", latency: 320, time: "2026-06-15T20:41:15Z" },
      { item: "Tools List Fetch", status: "failed", latency: 500, time: "2026-06-15T20:41:15Z", error: "HTTP 504 Gateway Timeout from remote endpoint" },
      { item: "Resources Expose Check", status: "success", latency: 120, time: "2026-06-15T20:41:15Z" },
      { item: "Prompts Expose Check", status: "success", latency: 90, time: "2026-06-15T20:41:15Z" },
      { item: "Enterprise Authorization Bearer", status: "success", latency: 15, time: "2026-06-15T20:41:15Z" }
    ]
  },
  {
    id: "mcp-srv-03",
    name: "Financial ERP Billing API",
    system: "Finance Systems",
    env: "prod",
    status: "error",
    toolsCount: 8,
    todayCalls: 1040,
    successRate: 85.2,
    avgLatency: 2200,
    p95Latency: 6400,
    lastHeartbeat: "2026-06-15T20:39:00Z",
    url: "https://mcp-gateway.corp/services/erp-billing",
    transferMethod: "WebSocket",
    version: "v3.0.2",
    owner: "王总监 (ERP Financial)",
    healthChecks: [
      { item: "DNS Resolution", status: "success", latency: 8, time: "2026-06-15T20:39:00Z" },
      { item: "Network Ingress Connection", status: "failed", latency: 1500, time: "2026-06-15T20:39:00Z", error: "Connection reset by peer" },
      { item: "Protocol Handshake Validation", status: "failed", latency: 800, time: "2026-06-15T20:39:00Z", error: "Handshake rejected, OAuth mismatch" },
      { item: "Tools List Fetch", status: "failed", latency: 0, time: "2026-06-15T20:39:00Z", error: "N/A" },
      { item: "Resources Expose Check", status: "failed", latency: 0, time: "2026-06-15T20:39:00Z", error: "N/A" }
    ]
  },
  {
    id: "mcp-srv-04",
    name: "Jira Task Automation",
    system: "Management Systems",
    env: "test",
    status: "maintenance",
    toolsCount: 5,
    todayCalls: 540,
    successRate: 100.0,
    avgLatency: 480,
    p95Latency: 990,
    lastHeartbeat: "2026-06-15T18:30:00Z",
    url: "https://mcp-test.corp/services/jira-automation",
    transferMethod: "SSE",
    version: "v1.2.0",
    owner: "赵工 (Prod Automation)",
    healthChecks: [
      { item: "DNS Resolution", status: "success", latency: 4, time: "2026-06-15T18:30:00Z" },
      { item: "Network Ingress Connection", status: "success", latency: 15, time: "2026-06-15T18:30:00Z" },
      { item: "Protocol Handshake Validation", status: "success", latency: 35, time: "2026-06-15T18:30:00Z" },
      { item: "Tools List Fetch", status: "success", latency: 120, time: "2026-06-15T18:30:00Z" }
    ]
  },
  {
    id: "mcp-srv-05",
    name: "Google Calendar Workspace",
    system: "Workspace Integrations",
    env: "prod",
    status: "normal",
    toolsCount: 3,
    todayCalls: 1850,
    successRate: 99.5,
    avgLatency: 280,
    p95Latency: 610,
    lastHeartbeat: "2026-06-15T20:42:55Z",
    url: "https://mcp-gateway.corp/services/google-calendar",
    transferMethod: "SSE",
    version: "v1.11.0",
    owner: "陈经理 (Office Tech)",
    healthChecks: [
      { item: "DNS Resolution", status: "success", latency: 6, time: "2026-06-15T20:42:55Z" },
      { item: "Network Ingress Connection", status: "success", latency: 18, time: "2026-06-15T20:42:55Z" },
      { item: "Protocol Handshake Validation", status: "success", latency: 32, time: "2026-06-15T20:42:55Z" }
    ]
  },
  {
    id: "mcp-srv-06",
    name: "Staff Profile Database",
    system: "HR Systems",
    env: "prod",
    status: "offline",
    toolsCount: 2,
    todayCalls: 0,
    successRate: 0.0,
    avgLatency: 0,
    p95Latency: 0,
    lastHeartbeat: "2026-06-14T09:20:00Z",
    url: "https://mcp-gateway.corp/services/staff-profile",
    transferMethod: "SSE",
    version: "v1.0.3",
    owner: "刘经理 (HR Operations)",
    healthChecks: [
      { item: "DNS Resolution", status: "failed", latency: 5000, time: "2026-06-15T20:00:00Z", error: "Name or service not known" }
    ]
  },
  {
    id: "mcp-srv-07",
    name: "Email Delivery Agent",
    system: "Communications Systems",
    env: "dev",
    status: "normal",
    toolsCount: 2,
    todayCalls: 120,
    successRate: 98.3,
    avgLatency: 310,
    p95Latency: 750,
    lastHeartbeat: "2026-06-15T20:42:01Z",
    url: "https://mcp-dev.corp/services/email-agent",
    transferMethod: "stdio",
    version: "v0.9.0",
    owner: "杨工 (DevOps Base)",
    healthChecks: [
      { item: "Local Standard Terminal IO Handshake", status: "success", latency: 1, time: "2026-06-15T20:42:01Z" }
    ]
  },
  {
    id: "mcp-srv-08",
    name: "Confluence Knowledge Retriever",
    system: "Management Systems",
    env: "test",
    status: "normal",
    toolsCount: 4,
    todayCalls: 1080,
    successRate: 99.1,
    avgLatency: 450,
    p95Latency: 890,
    lastHeartbeat: "2026-06-15T20:41:40Z",
    url: "https://mcp-test.corp/services/confluence-retriever",
    transferMethod: "SSE",
    version: "v1.4.1",
    owner: "周工 (Quality & Docs)",
    healthChecks: [
      { item: "DNS Resolution", status: "success", latency: 5, time: "2026-06-15T20:41:40Z" },
      { item: "Network Ingress Connection", status: "success", latency: 25, time: "2026-06-15T20:41:40Z" }
    ]
  }
];
