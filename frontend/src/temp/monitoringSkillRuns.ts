/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */
import { SkillRun } from "../types/monitoring";

export const monitoringSkillRuns: SkillRun[] = [
  {
    id: "sk-run-01",
    name: "Customer Sentiment Reporter",
    version: "v1.2.0",
    department: "Customer Success",
    todayRuns: 850,
    successRate: 99.2,
    avgLatency: 1450,
    avgToolCalls: 2.4,
    failuresCount: 6,
    lastRunTime: "2026-06-15T20:42:15Z",
    status: "normal"
  },
  {
    id: "sk-run-02",
    name: "Financial Invoice Generator",
    version: "v2.0.1",
    department: "Financial Accounting",
    todayRuns: 450,
    successRate: 88.4,
    avgLatency: 3500,
    avgToolCalls: 3.8,
    failuresCount: 52,
    lastRunTime: "2026-06-15T20:39:12Z",
    status: "error"
  },
  {
    id: "sk-run-03",
    name: "Jira Sprint Progress Sync",
    version: "v1.0.0",
    department: "R&D PMO Office",
    todayRuns: 120,
    successRate: 100.0,
    avgLatency: 1800,
    avgToolCalls: 5.1,
    failuresCount: 0,
    lastRunTime: "2026-06-15T18:25:00Z",
    status: "normal"
  },
  {
    id: "sk-run-04",
    name: "Corporate HR Assistant",
    version: "v3.1.2",
    department: "Human Resources",
    todayRuns: 0,
    successRate: 0.0,
    avgLatency: 0,
    avgToolCalls: 0.0,
    failuresCount: 0,
    lastRunTime: "2026-06-14T09:20:00Z",
    status: "disabled"
  },
  {
    id: "sk-run-05",
    name: "Enterprise Knowledge Navigator",
    version: "v1.5.0",
    department: "Information Security",
    todayRuns: 1950,
    successRate: 99.6,
    avgLatency: 2200,
    avgToolCalls: 4.2,
    failuresCount: 7,
    lastRunTime: "2026-06-15T20:42:58Z",
    status: "normal"
  },
  {
    id: "sk-run-06",
    name: "Lead Qualification Agent",
    version: "v1.1.0",
    department: "Global Sales & Marketing",
    todayRuns: 1420,
    successRate: 96.8,
    avgLatency: 2100,
    avgToolCalls: 2.9,
    failuresCount: 45,
    lastRunTime: "2026-06-15T20:41:30Z",
    status: "warning"
  },
  {
    id: "sk-run-07",
    name: "Weekly Schedule Planner",
    version: "v1.0.1",
    department: "Executive Office",
    todayRuns: 650,
    successRate: 99.5,
    avgLatency: 1200,
    avgToolCalls: 2.1,
    failuresCount: 3,
    lastRunTime: "2026-06-15T20:41:44Z",
    status: "normal"
  },
  {
    id: "sk-run-08",
    name: "IT Infrastructure Allocator",
    version: "v2.2.0",
    department: "Cloud Operations",
    todayRuns: 280,
    successRate: 98.9,
    avgLatency: 4200,
    avgToolCalls: 6.5,
    failuresCount: 3,
    lastRunTime: "2026-06-15T20:35:10Z",
    status: "normal"
  },
  {
    id: "sk-run-09",
    name: "Automatic Email Dispatcher",
    version: "v0.9.5",
    department: "Public Communications",
    todayRuns: 15,
    successRate: 100.0,
    avgLatency: 950,
    avgToolCalls: 1.0,
    failuresCount: 0,
    lastRunTime: "2026-06-15T20:10:00Z",
    status: "unused"
  },
  {
    id: "sk-run-10",
    name: "Audit Center Action Reporter",
    version: "v1.1.4",
    department: "Compliance Audit",
    todayRuns: 510,
    successRate: 99.4,
    avgLatency: 1600,
    avgToolCalls: 3.1,
    failuresCount: 3,
    lastRunTime: "2026-06-15T20:30:15Z",
    status: "normal"
  }
];
