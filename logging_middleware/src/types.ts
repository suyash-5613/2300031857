export type LogStack = "frontend";

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export type LogPackageName =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils";

export interface LogPayload {
  stack: LogStack;
  level: LogLevel;
  package: LogPackageName;
  message: string;
  timestamp: string;
}

export interface LoggerConfig {
  baseUrl: string;
  token: string;
  timeoutMs?: number;
}

export interface LogResult {
  success: boolean;
  logId?: string;
  message?: string;
}