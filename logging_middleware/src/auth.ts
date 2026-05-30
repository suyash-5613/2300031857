import type { LoggerConfig } from "./types";
import { isNonEmptyString } from "./utils";

let loggerConfig: LoggerConfig | null = null;
export function configureLogger(config: LoggerConfig): void {
  loggerConfig = {
    baseUrl: config.baseUrl.trim(),
    token: config.token.trim(),
    timeoutMs: config.timeoutMs ?? 5000,
  };
}

export function getLoggerConfig(): LoggerConfig | null {
  return loggerConfig;
}

export function buildAuthHeaders(): Record<string, string> {
  const config = getLoggerConfig();

  if (!config || !isNonEmptyString(config.token)) {
    return {};
  }

  return { Authorization: `Bearer ${config.token}` };
}