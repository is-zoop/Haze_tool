/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */
import { AlertItem } from "../types/monitoring";

export const monitoringAlerts: AlertItem[] = [
  {
    id: "alt-001",
    title: "Financial ERP Billing API Error Rate Exceeded Target Threshold (85% < 95%)",
    target: "Financial ERP Billing API",
    targetType: "MCP Server",
    severity: "emergency",
    status: "unhandled",
    firstSeen: "2026-06-15T19:30:00Z",
    lastSeen: "2026-06-15T20:41:00Z",
    duration: "1h 11m",
    owner: "王总监 (ERP Financial)",
    rule: "System Error Rate > 5.0% for 5 minutes",
    currentValue: "14.8%",
    threshold: "5.0%",
    impact: "Impacts all corporate automatic billing workflows, invoicing, and purchase-order sync.",
    errorSummary: "Connection errors to internal Oracle SQL ledger: Reset by peer. Multiple socket leaks detected.",
    suggestion: "Check network connectivity to DB cluster, inspect process handle counts, and perform JVM pool recycle.",
    timeline: [
      { time: "19:30:00", event: "Alert condition triggered. Current value is 14.8%", type: "trigger" },
      { time: "19:31:00", event: "Automated retry policy started on server node ERP-01", type: "retry" },
      { time: "19:35:00", event: "Attempted automated server hot restart, error rate still exceeded threshold", type: "retry" },
      { time: "19:37:00", event: "Alert upgraded to Emergency level, SMS sent to team", type: "upgrade" }
    ]
  },
  {
    id: "alt-002",
    title: "Salesforce CRM Connector Latency P95 spiked (> 3.2s)",
    target: "Salesforce CRM Connector",
    targetType: "MCP Server",
    severity: "critical",
    status: "processing",
    firstSeen: "2026-06-15T20:15:00Z",
    lastSeen: "2026-06-15T20:42:00Z",
    duration: "27m",
    owner: "李总 (CRM Architecture)",
    rule: "P95 response latency > 3.0s",
    currentValue: "3.2s",
    threshold: "3.0s",
    impact: "Affects the lead evaluation processing time. Interactive clients experiencing visible lag.",
    errorSummary: "Timeout from remote Salesforce REST endpoint. Connection pooling saturated with 150 requests queued.",
    suggestion: "Increase pooling parameters, decrease client-side request timeout, and review concurrent queue bounds.",
    timeline: [
      { time: "20:15:00", event: "Alert condition triggered. P95 latency is 3.2s", type: "trigger" },
      { time: "20:20:00", event: "Ticket assigned to 李总 (CRM Architecture)", type: "assign" },
      { time: "20:25:00", event: "Status changed to PROCESSING by agent, reviewing connection pooling configurations", type: "status_change" }
    ]
  },
  {
    id: "alt-003",
    title: "Enterprise Knowledge Navigator Call Failures Spiking",
    target: "Enterprise Knowledge Navigator",
    targetType: "Skill",
    severity: "warning",
    status: "recovered",
    firstSeen: "2026-06-15T15:00:00Z",
    lastSeen: "2026-06-15T15:20:00Z",
    duration: "20m",
    owner: "张经理 (Data Team)",
    rule: "Skill failure rate > 2.0%",
    currentValue: "3.5%",
    threshold: "2.0%",
    impact: "A few documentation searches internally returned mock data fallback or empty grids.",
    errorSummary: "Transient network division between Skill API router and backend Elasticsearch hosts.",
    suggestion: "None. System recovered automatically as networks rebalanced.",
    timeline: [
      { time: "15:00:00", event: "Success rate dropped to 96.5% (failure rate 3.5%)", type: "trigger" },
      { time: "15:15:00", event: "Traffic re-routing resolved underlying Elasticsearch connection drop", type: "retry" },
      { time: "15:20:00", event: "All test inquiries succeeded. Status changed to RECOVERED", type: "recovered" }
    ]
  },
  {
    id: "alt-004",
    title: "Staff Profile Database Service Heartbeat Missing",
    target: "Staff Profile Database",
    targetType: "MCP Server",
    severity: "emergency",
    status: "unhandled",
    firstSeen: "2026-06-15T09:20:00Z",
    lastSeen: "2026-06-15T20:41:00Z",
    duration: "11h 21m",
    owner: "刘经理 (HR Operations)",
    rule: "Heartbeat missed count > 3 (30s interval)",
    currentValue: "Offline",
    threshold: "Online",
    impact: "Critical. HR query tools completely unavailable. User directory lookup failing.",
    errorSummary: "Server completely unreachable. Root domain DNS lookup returns NXDOMAIN.",
    suggestion: "Check HR container instance state in Kubernetes. Coordinate with Domain Registrar/Core Networking.",
    timeline: [
      { time: "09:20:00", event: "Server missed 3 consecutive keep-alive signals", type: "trigger" },
      { time: "09:21:00", event: "Ping failed: Host Unreachable", type: "retry" }
    ]
  },
  {
    id: "alt-005",
    title: "Jira Task Automation CPU Usage High Warning",
    target: "Jira Task Automation",
    targetType: "MCP Server",
    severity: "warning",
    status: "closed",
    firstSeen: "2026-06-15T17:00:00Z",
    lastSeen: "2026-06-15T18:00:00Z",
    duration: "1h",
    owner: "赵工 (Prod Automation)",
    rule: "CPU Usage > 85%",
    currentValue: "88.2%",
    threshold: "85%",
    impact: "None. Slight delay to asynchronous automation triggers of Jira tickets.",
    errorSummary: "Heavy concurrent batch processing of Q3 Planning Jira sync tasks.",
    suggestion: "Stagger the batch sync schedules to run in off-peak periods.",
    timeline: [
      { time: "17:00:00", event: "CPU Usage spiked to 88.2% on node JIRA-SRV-B", type: "trigger" },
      { time: "18:00:00", event: "Batch finish. CPU usage returned to 15.4%", type: "recovered" },
      { time: "18:15:00", event: "Ticket closed by operator", type: "closed" }
    ]
  },
  {
    id: "alt-006",
    title: "patch_crm_lead Tool Timeout Count",
    target: "patch_crm_lead",
    targetType: "MCP Tool",
    severity: "warning",
    status: "unhandled",
    firstSeen: "2026-06-15T20:01:00Z",
    lastSeen: "2026-06-15T20:41:00Z",
    duration: "40m",
    owner: "李总 (CRM Architecture)",
    rule: "Tool execution timeout count > 5 per min",
    currentValue: "8 timeouts",
    threshold: "5 timeouts",
    impact: "CRM leads modification tasks occasionally timeout and prompt frontend retry.",
    errorSummary: "Underlying record locking conflict inside Salesforce DB for specific lead records.",
    suggestion: "Analyze application query patterns to ensure transactional scopes are tightly minimized.",
    timeline: [
      { time: "20:01:00", event: "8 timeouts recorded in single interval window", type: "trigger" }
    ]
  },
  {
    id: "alt-007",
    title: "IT Infrastructure Allocator Allocation Delay",
    target: "IT Infrastructure Allocator",
    targetType: "Skill",
    severity: "warning",
    status: "processing",
    firstSeen: "2026-06-15T19:50:00Z",
    lastSeen: "2026-06-15T20:41:00Z",
    duration: "51m",
    owner: "赵工 (Prod Automation)",
    rule: "Skill avg response > 4s",
    currentValue: "4.2s",
    threshold: "4.0s",
    impact: "Delayed provisioning of sandbox environments for testing teams.",
    errorSummary: "API responses from AWS CloudFormation stack initiation are running slower than normal.",
    suggestion: "Verify if CloudFormation quota has been reached or if AWS infrastructure is loaded.",
    timeline: [
      { time: "19:50:00", event: "Average latency exceeds 4.0s limit", type: "trigger" },
      { time: "20:05:00", event: "Status changed to PROCESSING. Assigned to CloudOps queue", type: "assign" }
    ]
  },
  {
    id: "alt-008",
    title: "Corporate HR Assistant Skill Disabled Unexpectedly",
    target: "Corporate HR Assistant",
    targetType: "Skill",
    severity: "info",
    status: "unhandled",
    firstSeen: "2026-06-15T09:22:00Z",
    lastSeen: "2026-06-15T09:22:00Z",
    duration: "11h 19m",
    owner: "刘经理 (HR Operations)",
    rule: "Service operational status changed",
    currentValue: "DISABLED",
    threshold: "ACTIVE",
    impact: "HR helper bot is unavailable. Handled gracefully by fallback page.",
    errorSummary: "Platform administrator manually disabled the skill due to underlying database offline state.",
    suggestion: "Re-enable after Staff Profile Database service comes back online.",
    timeline: [
      { time: "09:22:00", event: "Skill status changed to disabled state by Admin", type: "trigger" }
    ]
  },
  {
    id: "alt-009",
    title: "Confluence Knowledge Retriever Service High Latency Warning",
    target: "Confluence Knowledge Retriever",
    targetType: "MCP Server",
    severity: "warning",
    status: "recovered",
    firstSeen: "2026-06-15T14:10:00Z",
    lastSeen: "2026-06-15T14:45:00Z",
    duration: "35m",
    owner: "周工 (Quality & Docs)",
    rule: "Average latency > 400ms for 10 minutes",
    currentValue: "450ms",
    threshold: "400ms",
    impact: "Users experience incremental latency when loading documentation nodes.",
    errorSummary: "Internal Wiki index rebuilding job running concurrently on database.",
    suggestion: "None. Job finished on time.",
    timeline: [
      { time: "14:10:00", event: "Average latency spiked to 450ms", type: "trigger" },
      { time: "14:45:00", event: "Index build complete, latency back to 180ms", type: "recovered" }
    ]
  },
  {
    id: "alt-010",
    title: "Enterprise Data Searcher SSL Certificate Expiring",
    target: "Enterprise Data Searcher",
    targetType: "MCP Server",
    severity: "info",
    status: "processing",
    firstSeen: "2026-06-15T01:00:00Z",
    lastSeen: "2026-06-15T20:41:00Z",
    duration: "19h 41m",
    owner: "张经理 (Data Team)",
    rule: "SSL Certificate Validity < 15 days",
    currentValue: "13 days",
    threshold: "15 days",
    impact: "None currently. Major browser/platform handshake blocks if certificate expires.",
    errorSummary: "Let's Encrypt renewal script did not complete because of port 80 challenge obstruction.",
    suggestion: "Update DNS TXT record or adjust standalone challenge server on endpoint.",
    timeline: [
      { time: "01:00:00", event: "System detected SSL expiry date is less than 15 days", type: "trigger" },
      { time: "08:30:00", event: "Assigned to Security Operations, status marked as PROCESSING", type: "assign" }
    ]
  },
  {
    id: "alt-011",
    title: "Financial Invoice Generator Failure Rate High",
    target: "Financial Invoice Generator",
    targetType: "Skill",
    severity: "critical",
    status: "unhandled",
    firstSeen: "2026-06-15T19:35:00Z",
    lastSeen: "2026-06-15T20:41:00Z",
    duration: "1h 6m",
    owner: "王总监 (ERP Financial)",
    rule: "Skill success rate < 92.0%",
    currentValue: "88.4%",
    threshold: "92.0%",
    impact: "Customer bills generation failing. Customers unable to check out invoice records.",
    errorSummary: "Indirect consequence of ERP Billing API failures and database locks.",
    suggestion: "Resolve the underlying ERP Billing API network issues first.",
    timeline: [
      { time: "19:35:00", event: "Success rate dropped to 88.4%", type: "trigger" }
    ]
  },
  {
    id: "alt-012",
    title: "query_fiscal_ledger Tool High Error Count Alert",
    target: "query_fiscal_ledger",
    targetType: "MCP Tool",
    severity: "critical",
    status: "unhandled",
    firstSeen: "2026-06-15T19:38:00Z",
    lastSeen: "2026-06-15T20:41:00Z",
    duration: "1h 3m",
    owner: "王总监 (ERP Financial)",
    rule: "Tool call error count > 10 in 5 minutes",
    currentValue: "73 errors",
    threshold: "10 errors",
    impact: "Inability to query the fiscal ledger during invoice creation workflows.",
    errorSummary: "Database host connection pool depletion. Dynamic queries queue timed out.",
    suggestion: "Recycle db connection hooks and ensure transactions are closed.",
    timeline: [
      { time: "19:38:00", event: "Errors count exceeded 10 in small interval window", type: "trigger" }
    ]
  }
];
