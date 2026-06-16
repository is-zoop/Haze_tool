/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */
import { LogItem } from "../types/monitoring";

export const monitoringLogs: LogItem[] = [
  {
    id: "log-101",
    time: "2026-06-15T20:42:58Z",
    level: "INFO",
    source: "Skill",
    componentName: "Enterprise Knowledge Navigator",
    traceId: "tr-90801",
    summary: "Successfully initialized context retrieval request for CS8891.",
    detail: "Constructed search payload: { query: 'customer satisfaction CS8891', boost_factors: { title: 1.5, tags: 2.0 } }. Invoking local search resolver tool."
  },
  {
    id: "log-102",
    time: "2026-06-15T20:42:58Z",
    level: "DEBUG",
    source: "MCP Tool",
    componentName: "query_kb_articles",
    traceId: "tr-90801",
    summary: "Executing full-text search index matching.",
    detail: "Term lookup: 'satisfaction' -> 24 matches. 'CS8891' -> 1 exact match in Customer Premium Index. Merged results, score = 4.881."
  },
  {
    id: "log-103",
    time: "2026-06-15T20:42:50Z",
    level: "INFO",
    source: "Platform",
    componentName: "MCP Host Gateway",
    traceId: "tr-90801",
    summary: "Streaming chunk of size 245B via Server-Sent Events tunnel.",
    detail: "Active client endpoint: CS Helpdesk Web. Connection keep-alive: ok. Bytes sent: 245. Event Type: chunk_update."
  },
  {
    id: "log-104",
    time: "2026-06-15T20:42:01Z",
    level: "INFO",
    source: "MCP Tool",
    componentName: "send_corporate_email",
    traceId: "tr-90809",
    summary: "SMTP connection established. Relaying message.",
    detail: "Recipient: devops@corp.com, Host: mail-relay.corp.com:25. Secure TLS v1.3. Bytes relayed: 1042."
  },
  {
    id: "log-105",
    time: "2026-06-15T20:41:44Z",
    level: "DEBUG",
    source: "MCP Server",
    componentName: "Google Calendar Workspace",
    traceId: "tr-90806",
    summary: "OAuth scope verification succeeded.",
    detail: "Client: Weekly Schedule Planner. Checked scope list: [ 'https://www.googleapis.com/auth/calendar.events' ]. Bearer TTL remaining: 2350 seconds."
  },
  {
    id: "log-106",
    time: "2026-06-15T20:41:02Z",
    level: "WARN",
    source: "MCP Server",
    componentName: "Salesforce CRM Connector",
    traceId: "tr-90805",
    summary: "Slow database query detected. Execution exceeding 800ms threshold.",
    detail: "Query: SELECT Id, Name, (SELECT Id FROM OpportunityRelations) FROM Lead WHERE Segment='Enterprise' MATCHES 'Tencent'. Execution took 950ms."
  },
  {
    id: "log-107",
    time: "2026-06-15T20:41:00Z",
    level: "INFO",
    source: "Skill",
    componentName: "Customer Sentiment Reporter",
    traceId: "tr-90801",
    summary: "Sentiment analysis completion for CS8891.",
    detail: "Assigned sentiment classification: POSITIVE (Confidence: 94.2%). Dynamic summary created."
  },
  {
    id: "log-108",
    time: "2026-06-15T20:39:12Z",
    level: "ERROR",
    source: "Skill",
    componentName: "Financial Invoice Generator",
    traceId: "tr-90802",
    summary: "Terminated execution due to underlying tool failure.",
    detail: "Error stack: Error: create_financial_invoice tool failed: HTTP 504 Gateway Timeout. Stopping pipeline at node #3: GenerateInvoiceRecord."
  },
  {
    id: "log-109",
    time: "2026-06-15T20:38:40Z",
    level: "ERROR",
    source: "MCP Tool",
    componentName: "create_financial_invoice",
    traceId: "tr-90802",
    summary: "HTTP connection timeout during upstream call.",
    detail: "Incurred timeout after 2000ms waiting for remote server: https://erp-billing-api.internal/v3/invoice. Retrying 0/3. Dropping request."
  },
  {
    id: "log-110",
    time: "2026-06-15T20:37:15Z",
    level: "WARN",
    source: "MCP Server",
    componentName: "Financial ERP Billing API",
    traceId: "tr-90813",
    summary: "High socket count alert in connection pool.",
    detail: "Pool 'RelationalBillingDb': active_connections = 98, total_capacity = 100. Connection requests are queued for longer than 850ms."
  },
  {
    id: "log-111",
    time: "2026-06-15T20:35:10Z",
    level: "INFO",
    source: "Skill",
    componentName: "IT Infrastructure Allocator",
    traceId: "tr-90814",
    summary: "Docker task allocation validated.",
    detail: "Memory limits: 4096MB, CPU reservations: 2.0 vCPUs. Container template matched: k8s-test-node-standard."
  },
  {
    id: "log-112",
    time: "2026-06-15T20:30:15Z",
    level: "INFO",
    source: "Skill",
    componentName: "Audit Center Action Reporter",
    traceId: "tr-90810",
    summary: "Constructed summary of last 24h compliance applications.",
    detail: "Fetched 32 pending lists, 18 rejected. Compiled stats, returned array of length 50."
  },
  {
    id: "log-113",
    time: "2026-06-15T20:29:00Z",
    level: "DEBUG",
    source: "Platform",
    componentName: "Compliance Database",
    traceId: "tr-90810",
    summary: "Executing transaction query.",
    detail: "Query: SELECT * FROM audit_applications WHERE created_at > NOW() - INTERVAL '1 day'; Execution took 12ms."
  },
  {
    id: "log-114",
    time: "2026-06-15T20:25:30Z",
    level: "INFO",
    source: "Platform",
    componentName: "Cron Scheduler",
    traceId: "tr-90803",
    summary: "Synchronizing daily tickets list.",
    detail: "Loaded PMO-crew dashboard queue list, fetching Jira parameters."
  },
  {
    id: "log-115",
    time: "2026-06-15T20:15:00Z",
    level: "WARN",
    source: "Platform",
    componentName: "Alert Manager Controller",
    traceId: "tr-90802",
    summary: "Filing high latency warning to slack channel.",
    detail: "Rules filter matched: P95 response latency exceeded maximum tolerance of 3000ms. Dispatched incident."
  },
  {
    id: "log-116",
    time: "2026-06-15T20:10:00Z",
    level: "INFO",
    source: "Skill",
    componentName: "Automatic Email Dispatcher",
    traceId: "tr-90809",
    summary: "Broadcasting triggered successfully.",
    detail: "Dispatched system warning payload. SMTP socket cleared."
  },
  {
    id: "log-117",
    time: "2026-06-15T20:05:00Z",
    level: "INFO",
    source: "MCP Server",
    componentName: "Enterprise Data Searcher",
    traceId: "tr-90812",
    summary: "Periodic validation of knowledge index.",
    detail: "Index check: OK. Found 1,245 document fragments. Average match index latency: 8ms."
  },
  {
    id: "log-118",
    time: "2026-06-15T20:01:00Z",
    level: "WARN",
    source: "MCP Tool",
    componentName: "patch_crm_lead",
    traceId: "tr-90805",
    summary: "Row lock collision inside CRM database.",
    detail: "Lock failed on row ID: ld-55891. Process was forced to sleep for 200ms before retrying. Conflict: Lead Update Worker #3."
  },
  {
    id: "log-119",
    time: "2026-06-15T20:00:00Z",
    level: "ERROR",
    source: "Platform",
    componentName: "Health Monitor",
    traceId: "tr-90808",
    summary: "Staff Profile Database is unreachable.",
    detail: "DNS Resolution fails for staff-profile.corp.com. All subsequent HR tasks are suspended due to downstream server blackhole."
  },
  {
    id: "log-120",
    time: "2026-06-15T19:55:00Z",
    level: "ERROR",
    source: "Platform",
    componentName: "MCP Host Gateway",
    traceId: "tr-90813",
    summary: "Websocket connection rejected.",
    detail: "Host: erp-billing-api.internal closed connection frame with code: 1011 (Internal Error)."
  },
  {
    id: "log-121",
    time: "2026-06-15T19:50:00Z",
    level: "WARN",
    source: "Skill",
    componentName: "IT Infrastructure Allocator",
    traceId: "tr-90807",
    summary: "AWS CloudFormation deployment delayed.",
    detail: "AWS Stack id 'arn:aws:cloudformation:us-east-1:stack/test-cluster': State is CREATE_IN_PROGRESS. Current execution is exceeding typical limit (4m > 3m)."
  },
  {
    id: "log-122",
    time: "2026-06-15T19:40:00Z",
    level: "DEBUG",
    source: "Platform",
    componentName: "MCP Host Gateway",
    traceId: "tr-90814",
    summary: "Resource allocated message broadcast to active clients.",
    detail: "Dispatched package size: 120 bytes. Recipient count: 3."
  },
  {
    id: "log-123",
    time: "2026-06-15T19:38:00Z",
    level: "ERROR",
    source: "MCP Tool",
    componentName: "query_fiscal_ledger",
    traceId: "tr-90813",
    summary: "Failed execution of transaction query.",
    detail: "Error code DB_SOCKET_EXHAUSION. ThreadPool locked waiting for Oracle schema locks."
  },
  {
    id: "log-124",
    time: "2026-06-15T19:35:00Z",
    level: "WARN",
    source: "Skill",
    componentName: "Financial Invoice Generator",
    traceId: "tr-90813",
    summary: "Increasing error buffer counts.",
    detail: "Detected 4 failed runs in last 5 minutes. Raising internal compliance alarm."
  },
  {
    id: "log-125",
    time: "2026-06-15T19:30:00Z",
    level: "INFO",
    source: "Skill",
    componentName: "Lead Qualification Agent",
    traceId: "tr-90815",
    summary: "Qualifying lead batch complete.",
    detail: "Qualified 18 leads. Rejected 3. Pushed status values to CRM lead index."
  },
  {
    id: "log-126",
    time: "2026-06-15T18:30:00Z",
    level: "INFO",
    source: "Platform",
    componentName: "Keepalive Service",
    traceId: "",
    summary: "Missed ping recovery on node JIRA-SRV-B.",
    detail: "Node JIRA-SRV-B successfully connected. Syncing local state buffers."
  },
  {
    id: "log-127",
    time: "2026-06-15T18:25:30Z",
    level: "DEBUG",
    source: "MCP Tool",
    componentName: "jira_get_assigned_issues",
    traceId: "tr-90803",
    summary: "API Call query successfully executed against Jira rest endpoint.",
    detail: "API: /rest/api/2/search?jql=assignee='pmo-crew'. HTTP 200 OK after 320ms."
  },
  {
    id: "log-128",
    time: "2026-06-15T18:24:12Z",
    level: "INFO",
    source: "MCP Tool",
    componentName: "jira_update_ticket_status",
    traceId: "tr-90803",
    summary: "Jira status updated successfully.",
    detail: "Ticket PM-125 transition state updated to 'DONE'. Response: HTTP 204 No Content."
  },
  {
    id: "log-129",
    time: "2026-06-15T17:00:00Z",
    level: "WARN",
    source: "MCP Server",
    componentName: "Jira Task Automation",
    traceId: "",
    summary: "CPU execution warning high.",
    detail: "Container cpu threshold over limit: 88.2% utilized. Initiating thread consolidation."
  },
  {
    id: "log-130",
    time: "2026-06-15T14:45:00Z",
    level: "INFO",
    source: "MCP Server",
    componentName: "Confluence Knowledge Retriever",
    traceId: "",
    summary: "Index build job complete on local node.",
    detail: "Reindexed 4,890 spaces. Free heap memory after garbage collection: 1.4GB."
  }
];
