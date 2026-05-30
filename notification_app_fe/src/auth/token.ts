import { appEnv } from "@/config/env";

export function getBearerToken(): string {
  return appEnv.logBearerToken;
}