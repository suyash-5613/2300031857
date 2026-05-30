export const LOG_API_PATH = "/evaluation-service/logs";

export const LOG_STACKS = ["frontend"] as const;

export const LOG_LEVELS = ["debug", "info", "warn", "error", "fatal"] as const;

export const LOG_FRONTEND_PACKAGES = ["api", "component", "hook", "page", "state", "style"] as const;

export const LOG_COMMON_PACKAGES = ["auth", "config", "middleware", "utils"] as const;

export const LOG_ALL_PACKAGES = [...LOG_FRONTEND_PACKAGES, ...LOG_COMMON_PACKAGES] as const;