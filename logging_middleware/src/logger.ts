import { LOG_API_PATH } from "./constants";
import { buildAuthHeaders, getLoggerConfig } from "./auth";
import type { LogLevel, LogPackageName, LogResult, LogStack, LogPayload } from "./types";
import { buildLogTimestamp, getSafeErrorMessage, isNonEmptyString, isValidLevel, isValidPackageName, isValidStack } from "./utils";

export async function Log(
  stack: LogStack,
  level: LogLevel,
  packageName: LogPackageName,
  message: string,
): Promise<LogResult> {
  try {
    if (!isValidStack(stack) || !isValidLevel(level) || !isValidPackageName(packageName) || !isNonEmptyString(message)) {
      return { success: false, message: "Invalid log payload" };
    }

    const config = getLoggerConfig();

    if (!config || !isNonEmptyString(config.baseUrl) || !isNonEmptyString(config.token)) {
      return { success: false, message: "Logger not configured" };
    }

    const payload: LogPayload = {
      stack,
      level,
      package: packageName,
      message: message.trim(),
      timestamp: buildLogTimestamp(),
    };

    const controller = new AbortController();
    const timeoutId = globalThis.setTimeout(() => controller.abort(), config.timeoutMs ?? 5000);

    const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}${LOG_API_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...buildAuthHeaders(),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    globalThis.clearTimeout(timeoutId);

    if (!response.ok) {
      return { success: false, message: `Logging API returned ${response.status}` };
    }

    const data = (await response.json().catch(() => ({}))) as Partial<{ logId: string; message: string }>;

    return {
      success: true,
      logId: data.logId,
      message: data.message ?? "Log sent successfully",
    };
  } catch (error) {
    return { success: false, message: getSafeErrorMessage(error) };
  }
}