/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */
import { TraceItem } from "../types/monitoring";

export const monitoringTraces: TraceItem[] = [
  {
    id: "tr-90801",
    user: "张伟 (Customer Success)",
    client: "CS Helpdesk Web",
    entryCap: "Customer Sentiment Reporter",
    version: "v1.2.0",
    mcpServer: "Enterprise Data Searcher",
    toolCallsCount: 2,
    status: "success",
    latency: 1450,
    startTime: "2026-06-15T20:41:00Z",
    nodes: [
      {
        id: "tr-90801-n1",
        name: "User Inquiry Input",
        type: "Client",
        startTime: "2026-06-15T20:41:00.000Z",
        endTime: "2026-06-15T20:41:00.050Z",
        latency: 50,
        status: "success",
        inputBrief: "分析用户 #CS8891 提交的心态并输出对应简报",
        outputBrief: "Parsed parameters: customer_id=#CS8891"
      },
      {
        id: "tr-90801-n2",
        name: "Customer Sentiment Reporter Skill",
        type: "Skill",
        startTime: "2026-06-15T20:41:00.050Z",
        endTime: "2026-06-15T20:41:01.450Z",
        latency: 1400,
        status: "success",
        inputBrief: "customer_id=#CS8891",
        outputBrief: "Sentiment: Highly positive. Actions completed successfully."
      },
      {
        id: "tr-90801-n3",
        name: "query_kb_articles Tool",
        type: "MCP Tool",
        startTime: "2026-06-15T20:41:00.100Z",
        endTime: "2026-06-15T20:41:00.380Z",
        latency: 280,
        status: "success",
        inputBrief: "{ query: 'customer satisfaction CS8891' }",
        outputBrief: "{ result: 'No previous grievance registered. Active contract premium tier.' }"
      },
      {
        id: "tr-90801-n4",
        name: "Enterprise Data Searcher Node",
        type: "MCP Server",
        startTime: "2026-06-15T20:41:00.080Z",
        endTime: "2026-06-15T20:41:00.400Z",
        latency: 320,
        status: "success",
        inputBrief: "Forwarded tool invocation: query_kb_articles",
        outputBrief: "Resolved content with SSE tunnel"
      }
    ]
  },
  {
    id: "tr-90802",
    user: "李芳 (Accountant)",
    client: "ERP Billing Client",
    entryCap: "Financial Invoice Generator",
    version: "v2.0.1",
    mcpServer: "Financial ERP Billing API",
    toolCallsCount: 1,
    status: "failed",
    latency: 2800,
    startTime: "2026-06-15T20:39:00Z",
    nodes: [
      {
        id: "tr-90802-n1",
        name: "ERP Request Handshake",
        type: "Client",
        startTime: "2026-06-15T20:39:00.000Z",
        endTime: "2026-06-15T20:39:00.100Z",
        latency: 100,
        status: "success",
        inputBrief: "Create Invoice ERP-2026-88901",
        outputBrief: "Forwarded to Skill Layer"
      },
      {
        id: "tr-90802-n2",
        name: "Financial Invoice Generator Skill",
        type: "Skill",
        startTime: "2026-06-15T20:39:00.120Z",
        endTime: "2026-06-15T20:39:02.920Z",
        latency: 2800,
        status: "failed",
        inputBrief: "ERP-2026-88901, amount: ¥12,500",
        outputBrief: "Operation aborted midway",
        errorMsg: "Backend exception: SQL ledger connection failed"
      },
      {
        id: "tr-90802-n3",
        name: "create_financial_invoice Tool",
        type: "MCP Tool",
        startTime: "2026-06-15T20:39:00.200Z",
        endTime: "2026-06-15T20:39:02.600Z",
        latency: 2400,
        status: "failed",
        inputBrief: "{ invoiceNo: 'ERP-2026-88901', item: 'Cloud Services Q2' }",
        outputBrief: "Null response from peer",
        errorMsg: "HTTP 504 Gateway Timeout: Oracle backend unreachable"
      }
    ]
  },
  {
    id: "tr-90803",
    user: "System Trigger",
    client: "Cron Scheduler",
    entryCap: "Jira Sprint Progress Sync",
    version: "v1.0.0",
    mcpServer: "Jira Task Automation",
    toolCallsCount: 2,
    status: "success",
    latency: 1800,
    startTime: "2026-06-15T18:24:00Z",
    nodes: [
      {
        id: "tr-90803-n1",
        name: "Daily Progress Trigger",
        type: "Client",
        startTime: "2026-06-15T18:24:00.000Z",
        endTime: "2026-06-15T18:24:00.030Z",
        latency: 30,
        status: "success",
        inputBrief: "Daily sprint reconciliation trigger",
        outputBrief: "Task initialized"
      },
      {
        id: "tr-90803-n2",
        name: "jira_get_assigned_issues Tool",
        type: "MCP Tool",
        startTime: "2026-06-15T18:24:00.100Z",
        endTime: "2026-06-15T18:24:00.490Z",
        latency: 390,
        status: "success",
        inputBrief: "{ assignee: 'pmo-crew' }",
        outputBrief: "{ count: 18, list: ['PM-01', 'PM-02'] }"
      }
    ]
  },
  {
    id: "tr-90804",
    user: "王雷 (Marketing)",
    client: "Enterprise Portal App",
    entryCap: "Enterprise Knowledge Navigator",
    version: "v1.5.0",
    mcpServer: "Enterprise Data Searcher",
    toolCallsCount: 3,
    status: "success",
    latency: 2200,
    startTime: "2026-06-15T20:30:00Z",
    nodes: [
      {
        id: "tr-90804-n1",
        name: "FAQ Lookup request",
        type: "Client",
        startTime: "2026-06-15T20:30:00.000Z",
        endTime: "2026-06-15T20:30:00.050Z",
        latency: 50,
        status: "success",
        inputBrief: "How to apply for Q3 project funds",
        outputBrief: "Query string extracted"
      },
      {
        id: "tr-90804-n2",
        name: "query_kb_articles Tool",
        type: "MCP Tool",
        startTime: "2026-06-15T20:30:00.100Z",
        endTime: "2026-06-15T20:30:00.380Z",
        latency: 280,
        status: "success",
        inputBrief: "{ query: 'Q3 project funding guidelines' }",
        outputBrief: "{ result: 'Form code F-882 is requested to be submitted' }"
      }
    ]
  },
  {
    id: "tr-90805",
    user: "张经理 (Sales Team)",
    client: "CRM Mobile Web",
    entryCap: "Lead Qualification Agent",
    version: "v1.1.0",
    mcpServer: "Salesforce CRM Connector",
    toolCallsCount: 2,
    status: "running",
    latency: 3100,
    startTime: "2026-06-15T20:42:00Z",
    nodes: [
      {
        id: "tr-90805-n1",
        name: "Evaluate Lead",
        type: "Client",
        startTime: "2026-06-15T20:42:00.000Z",
        endTime: "2026-06-15T20:42:00.050Z",
        latency: 50,
        status: "success",
        inputBrief: "Evaluate Tencent Q3 pipeline lead potential",
        outputBrief: "CRM lead check active"
      },
      {
        id: "tr-90805-n2",
        name: "crm_list_accounts Tool",
        type: "MCP Tool",
        startTime: "2026-06-15T20:42:00.100Z",
        endTime: "2026-06-15T20:42:03.150Z",
        latency: 3050,
        status: "success",
        inputBrief: "{ filter: 'Tencent Holdings' }",
        outputBrief: "Active account confirmed matches: ['Tencent Cloud System']"
      }
    ]
  },
  {
    id: "tr-90806",
    user: "陈红 (Executive Secretary)",
    client: "Calendar Work Suite",
    entryCap: "Weekly Schedule Planner",
    version: "v1.0.1",
    mcpServer: "Google Calendar Workspace",
    toolCallsCount: 2,
    status: "success",
    latency: 1200,
    startTime: "2026-06-15T20:41:30Z",
    nodes: [
      {
        id: "tr-90806-n1",
        name: "Create Slot Request",
        type: "Client",
        startTime: "2026-06-15T20:41:30.000Z",
        endTime: "2026-06-15T20:41:30.040Z",
        latency: 40,
        status: "success",
        inputBrief: "Create board meeting slot tomorrow 2 PM",
        outputBrief: "Parameters extracted: board_session, 14:00"
      },
      {
        id: "tr-90806-n2",
        name: "google_calendar_insert_event Tool",
        type: "MCP Tool",
        startTime: "2026-06-15T20:41:30.100Z",
        endTime: "2026-06-15T20:41:30.450Z",
        latency: 350,
        status: "success",
        inputBrief: "{ title: 'Board Session Q3 Sync', startTime: '14:00' }",
        outputBrief: "{ status: 'Event created. calendar_uid: cal-9801' }"
      }
    ]
  },
  {
    id: "tr-90807",
    user: "System Monitor",
    client: "AWS Notification Gateway",
    entryCap: "IT Infrastructure Allocator",
    version: "v2.2.0",
    mcpServer: "Cloud Internal Allocation Engine",
    toolCallsCount: 1,
    status: "timeout",
    latency: 5500,
    startTime: "2026-06-15T20:30:00Z",
    nodes: [
      {
        id: "tr-90807-n1",
        name: "Node Provision request",
        type: "Client",
        startTime: "2026-06-15T20:30:00.000Z",
        endTime: "2026-06-15T20:30:00.100Z",
        latency: 100,
        status: "success",
        inputBrief: "Provision ECS task node test-env-12",
        outputBrief: "AWS request posted"
      },
      {
        id: "tr-90807-n2",
        name: "it_infra_ecs_provision Tool",
        type: "MCP Tool",
        startTime: "2026-06-15T20:30:00.120Z",
        endTime: "2026-06-15T20:30:05.620Z",
        latency: 5500,
        status: "failed",
        inputBrief: "{ name: 'test-env-12', memory: '4G' }",
        outputBrief: "Connection closed by socket boundary, execution timed out",
        errorMsg: "Execution Timeout: Server didn't respond inside 5000ms"
      }
    ]
  },
  {
    id: "tr-90808",
    user: "刘宇 (HR Partner)",
    client: "HR Workspace Portal",
    entryCap: "Corporate HR Assistant",
    version: "v3.1.2",
    mcpServer: "Staff Profile Database",
    toolCallsCount: 0,
    status: "cancelled",
    latency: 150,
    startTime: "2026-06-15T09:19:00Z",
    nodes: [
      {
        id: "tr-90808-n1",
        name: "User aborted interaction",
        type: "Client",
        startTime: "2026-06-15T09:19:00.000Z",
        endTime: "2026-06-15T09:19:00.150Z",
        latency: 150,
        status: "failed",
        inputBrief: "Search employee payroll for code #4491",
        outputBrief: "Aborted by client",
        errorMsg: "User cancelled the ongoing request stream"
      }
    ]
  },
  {
    id: "tr-90809",
    user: "朱工 (DevOps Engineer)",
    client: "Infrastructure Watchdog",
    entryCap: "Automatic Email Dispatcher",
    version: "v0.9.5",
    mcpServer: "Email Delivery Agent",
    toolCallsCount: 1,
    status: "success",
    latency: 950,
    startTime: "2026-06-15T20:09:00Z",
    nodes: [
      {
        id: "tr-90809-n1",
        name: "Alert Email Broadcast",
        type: "Client",
        startTime: "2026-06-15T20:09:00.000Z",
        endTime: "2026-06-15T20:09:00.050Z",
        latency: 50,
        status: "success",
        inputBrief: "Send warning broadcast to devops@corp.com",
        outputBrief: "Payload configured"
      },
      {
        id: "tr-90809-n2",
        name: "send_corporate_email Tool",
        type: "MCP Tool",
        startTime: "2026-06-15T20:09:00.080Z",
        endTime: "2026-06-15T20:09:01.010Z",
        latency: 930,
        status: "success",
        inputBrief: "{ email: 'devops@corp.com', subject: 'Server Load high Warning' }",
        outputBrief: "{ status: 'Queued to server successfully! ID: msg-88901' }"
      }
    ]
  },
  {
    id: "tr-90810",
    user: "Compliance Auditor",
    client: "Audit Portal Workspace",
    entryCap: "Audit Center Action Reporter",
    version: "v1.1.4",
    mcpServer: "Compliance Database",
    toolCallsCount: 1,
    status: "success",
    latency: 1600,
    startTime: "2026-06-15T20:29:00Z",
    nodes: [
      {
        id: "tr-90810-n1",
        name: "Compile compliance parameters",
        type: "Client",
        startTime: "2026-06-15T20:29:00.000Z",
        endTime: "2026-06-15T20:29:00.060Z",
        latency: 60,
        status: "success",
        inputBrief: "Summarize pending items audit history",
        outputBrief: "Audit analysis parameter configured"
      }
    ]
  },
  {
    id: "tr-90811",
    user: "叶红 (System Architect)",
    client: "Vite Admin Suite",
    entryCap: "Enterprise Knowledge Navigator",
    version: "v1.5.0",
    mcpServer: "Enterprise Data Searcher",
    toolCallsCount: 2,
    status: "success",
    latency: 1800,
    startTime: "2026-06-15T20:10:00Z",
    nodes: [
      {
        id: "tr-90811-n1",
        name: "Security documentation digest",
        type: "Client",
        startTime: "2026-06-15T20:10:00.000Z",
        endTime: "2026-06-15T20:10:00.050Z",
        latency: 50,
        status: "success",
        inputBrief: "Fetch security policy",
        outputBrief: "Security digest compiled"
      }
    ]
  },
  {
    id: "tr-90812",
    user: "周明 (Customer Success Manager)",
    client: "CS Management Client",
    entryCap: "Customer Sentiment Reporter",
    version: "v1.2.0",
    mcpServer: "Enterprise Data Searcher",
    toolCallsCount: 1,
    status: "success",
    latency: 1100,
    startTime: "2026-06-15T20:05:00Z",
    nodes: []
  },
  {
    id: "tr-90813",
    user: "李华 (Finance Team Leader)",
    client: "Enterprise Ledger Client",
    entryCap: "Financial Invoice Generator",
    version: "v2.0.1",
    mcpServer: "Financial ERP Billing API",
    toolCallsCount: 2,
    status: "failed",
    latency: 4200,
    startTime: "2026-06-15T19:55:00Z",
    nodes: [
      {
        id: "tr-90813-n1-err",
        name: "Database initialization fails",
        type: "Enterprise System",
        startTime: "2026-06-15T19:55:00.100Z",
        endTime: "2026-06-15T19:55:04.300Z",
        latency: 4200,
        status: "failed",
        inputBrief: "Write to ERP relational tables",
        outputBrief: "None",
        errorMsg: "FATAL: Connection pool depleted. Server state: ERROR"
      }
    ]
  },
  {
    id: "tr-90814",
    user: "赵敏 (Devops Manager)",
    client: "Infrastructure Command Desk",
    entryCap: "IT Infrastructure Allocator",
    version: "v2.2.0",
    mcpServer: "Cloud Internal Allocation Engine",
    toolCallsCount: 3,
    status: "success",
    latency: 3900,
    startTime: "2026-06-15T19:40:00Z",
    nodes: []
  },
  {
    id: "tr-90815",
    user: "Sysop Daemon",
    client: "Enterprise Monitor Dashboard",
    entryCap: "Lead Qualification Agent",
    version: "v1.1.0",
    mcpServer: "Salesforce CRM Connector",
    toolCallsCount: 1,
    status: "success",
    latency: 1500,
    startTime: "2026-06-15T19:30:00Z",
    nodes: []
  }
];
