import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { appEnv } from "@/config/env";
import { appLog } from "@/middleware/logging";

export interface ApiErrorShape {
  message: string;
  status?: number;
}

export const httpClient: AxiosInstance = axios.create({
  baseURL: appEnv.apiBaseUrl || undefined,
  timeout: 12000,
});

httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    await appLog("frontend", "debug", "api", `Request: ${config.method?.toUpperCase() ?? "GET"} ${config.url ?? ""}`);
    return config;
  },
  async (error) => {
    await appLog("frontend", "error", "api", "Request interceptor failed");
    return Promise.reject(error);
  },
);

httpClient.interceptors.response.use(
  async (response) => {
    await appLog("frontend", "debug", "api", `Response: ${response.status} ${response.config.url ?? ""}`);
    return response;
  },
  async (error: AxiosError<unknown>) => {
    const status = error.response?.status;
    await appLog("frontend", "error", "api", `API error${status ? ` ${status}` : ""}: ${error.message}`);
    const normalizedError: ApiErrorShape = {
      message: typeof error.response?.data === "object" && error.response?.data && "message" in error.response.data
        ? String((error.response.data as { message?: unknown }).message ?? error.message ?? "Unexpected API error")
        : error.message ?? "Unexpected API error",
      status,
    };
    return Promise.reject(normalizedError);
  },
);