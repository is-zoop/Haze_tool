/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */
import { OverallMetrics, TrendPoint } from "../types/monitoring";

export const monitoringMetrics: OverallMetrics = {
  todayCalls: 12580,
  todayCallsDelta: 14.2,
  successRate: 98.7,
  successRateDelta: 0.15,
  avgLatency: 620,
  avgLatencyDelta: -4.8,
  p95Latency: 1820,
  p95LatencyDelta: -2.3,
  activeMcpServices: 32,
  totalMcpServices: 36,
  activeAlertsCount: 6,
  alertsDelta: 2
};

export const monitoringTrendData: TrendPoint[] = [
  { time: "08:00", totalCalls: 420, successCalls: 412, failedCalls: 8, avgLatency: 520, p95Latency: 1450, successRate: 98.1 },
  { time: "09:00", totalCalls: 850, successCalls: 835, failedCalls: 15, avgLatency: 580, p95Latency: 1600, successRate: 98.2 },
  { time: "10:00", totalCalls: 1200, successCalls: 1180, failedCalls: 20, avgLatency: 640, p95Latency: 1800, successRate: 98.3 },
  { time: "11:00", totalCalls: 1450, successCalls: 1435, failedCalls: 15, avgLatency: 690, p95Latency: 1950, successRate: 98.9 },
  { time: "12:00", totalCalls: 980, successCalls: 970, failedCalls: 10, avgLatency: 590, p95Latency: 1700, successRate: 99.0 },
  { time: "13:00", totalCalls: 1100, successCalls: 1075, failedCalls: 25, avgLatency: 610, p95Latency: 1750, successRate: 97.7 },
  { time: "14:00", totalCalls: 1350, successCalls: 1330, failedCalls: 20, avgLatency: 650, p95Latency: 1850, successRate: 98.5 },
  { time: "15:00", totalCalls: 1600, successCalls: 1584, failedCalls: 16, avgLatency: 680, p95Latency: 1980, successRate: 99.0 },
  { time: "16:00", totalCalls: 1520, successCalls: 1495, failedCalls: 25, avgLatency: 630, p95Latency: 1820, successRate: 98.3 },
  { time: "17:00", totalCalls: 1280, successCalls: 1262, failedCalls: 18, avgLatency: 600, p95Latency: 1720, successRate: 98.6 },
  { time: "18:00", totalCalls: 830, successCalls: 822, failedCalls: 8, avgLatency: 550, p95Latency: 1580, successRate: 99.0 & 100 ? 99.0 : 99.0 }
];
