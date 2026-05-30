export const appEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
  logApiBaseUrl: import.meta.env.VITE_LOG_API_BASE_URL ?? "",
  logBearerToken: import.meta.env.VITE_LOG_BEARER_TOKEN ?? "",
  useMockApi: (import.meta.env.VITE_USE_MOCK_API ?? "true") === "true",
};