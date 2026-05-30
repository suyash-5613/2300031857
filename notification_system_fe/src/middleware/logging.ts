import { configureLogger, Log } from "@notification-logger";
import { appEnv } from "@/config/env";

let isConfigured = false;

export function initLogging(): void {
  if (isConfigured || !appEnv.logApiBaseUrl || !appEnv.logBearerToken) {
    return;
  }

  configureLogger({
    baseUrl: appEnv.logApiBaseUrl,
    token: appEnv.logBearerToken,
    timeoutMs: 5000,
  });

  isConfigured = true;
}

export async function appLog(
  stack: "frontend",
  level: "debug" | "info" | "warn" | "error" | "fatal",
  packageName: "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils",
  message: string,
): Promise<void> {
  await Log(stack, level, packageName, message);
}