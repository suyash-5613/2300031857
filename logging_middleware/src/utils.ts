import { LOG_ALL_PACKAGES, LOG_LEVELS, LOG_STACKS } from "./constants";
import type { LogLevel, LogPackageName, LogStack } from "./types";

export function isValidStack(value: unknown): value is LogStack {
  return typeof value === "string" && LOG_STACKS.includes(value as LogStack);
}

export function isValidLevel(value: unknown): value is LogLevel {
  return typeof value === "string" && LOG_LEVELS.includes(value as LogLevel);
}

export function isValidPackageName(value: unknown): value is LogPackageName {
  return typeof value === "string" && LOG_ALL_PACKAGES.includes(value as LogPackageName);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function getSafeErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown logging error";
}

export function buildLogTimestamp(): string {
  return new Date().toISOString();
}