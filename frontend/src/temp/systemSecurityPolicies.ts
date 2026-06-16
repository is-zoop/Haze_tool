/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */
import { SecurityPolicyConfig } from "../types/system-management";

export const systemSecurityPolicies: SecurityPolicyConfig = {
  passwordPolicy: {
    minLength: 12,
    requireNumbers: true,
    requireLetters: true,
    requireSpecial: true,
    expiryDays: 90,
    historyCount: 3,
    maxFailures: 5,
    lockDurationMinutes: 15
  },
  sessionPolicy: {
    maxAgeHours: 24,
    idleTimeoutMinutes: 30,
    allowMultiDevice: false,
    maxSessions: 3,
    forceSlo: true,
    stepUpMfa: true
  },
  riskLevels: {
    readonlyLow: {
      autoCall: true,
      userConfirm: false,
      approve: false,
      logParams: true,
      maxDaily: 2000
    },
    writeLow: {
      autoCall: true,
      userConfirm: true,
      approve: false,
      logParams: true,
      maxDaily: 500
    },
    writeHigh: {
      autoCall: false,
      userConfirm: true,
      approve: true,
      logParams: true,
      maxDaily: 100
    },
    dangerous: {
      autoCall: false,
      userConfirm: true,
      approve: true,
      logParams: true,
      maxDaily: 10
    }
  },
  mcpServerWhitelist: "localhost, 127.0.0.1, 10.0.0.0/8, *.haze.co, *.haze-corp.com",
  extDomainWhitelist: "api.openai.com, api.anthropic.com, api.google.com, *.github.com, *.supabase.co",
  ipWhitelist: "192.168.1.0/24, 10.154.0.0/16, 122.45.1.92",
  fileDirectoryLimit: "/workspace/sandbox, /tmp/haze-cache",
  maxFileUploadSizeMb: 50,
  maxToolCallsPerRun: 15,
  userRateLimitPerMin: 60,
  enableSensitiveFilter: true,
  enablePromptInjectionDefense: true,
  enableSecretScanner: true,
  enableDangerousCommandScanner: true
};
