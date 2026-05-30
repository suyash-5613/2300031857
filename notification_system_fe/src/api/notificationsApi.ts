import { appEnv } from "@/config/env";
import { defaultNotifications, defaultSettings } from "@/data/mockNotifications";
import { httpClient } from "./httpClient";
import type { NotificationItem, NotificationSettings, NotificationType } from "@/types/notification";

const notificationsStorageKey = "notification-console.notifications";
const settingsStorageKey = "notification-console.settings";

function readNotificationsFromStorage(): NotificationItem[] {
  const stored = localStorage.getItem(notificationsStorageKey);

  if (!stored) {
    localStorage.setItem(notificationsStorageKey, JSON.stringify(defaultNotifications));
    return defaultNotifications;
  }

  try {
    return JSON.parse(stored) as NotificationItem[];
  } catch {
    return defaultNotifications;
  }
}

function saveNotificationsToStorage(notifications: NotificationItem[]): void {
  localStorage.setItem(notificationsStorageKey, JSON.stringify(notifications));
}

function readSettingsFromStorage(): NotificationSettings {
  const stored = localStorage.getItem(settingsStorageKey);

  if (!stored) {
    localStorage.setItem(settingsStorageKey, JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  try {
    return JSON.parse(stored) as NotificationSettings;
  } catch {
    return defaultSettings;
  }
}

function saveSettingsToStorage(settings: NotificationSettings): void {
  localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
}

function simulateLatency(delayMs = 450): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  if (!appEnv.useMockApi && appEnv.apiBaseUrl) {
    const response = await httpClient.get<NotificationItem[]>("/evaluation-service/notifications");
    return response.data;
  }

  await simulateLatency();
  return readNotificationsFromStorage();
}

export async function fetchNotificationById(notificationId: string): Promise<NotificationItem | null> {
  const notifications = await fetchNotifications();
  return notifications.find((notification) => notification.id === notificationId) ?? null;
}

export async function fetchPagedNotifications(params: {
  limit: number;
  page: number;
  notificationType?: NotificationType | "all";
}): Promise<NotificationItem[]> {
  if (!appEnv.useMockApi && appEnv.apiBaseUrl) {
    const response = await httpClient.get<NotificationItem[]>("/evaluation-service/notifications", {
      params: {
        limit: params.limit,
        page: params.page,
        notification_type: params.notificationType && params.notificationType !== "all" ? params.notificationType : undefined,
      },
    });
    return response.data;
  }

  const notifications = await fetchNotifications();
  const filtered = params.notificationType && params.notificationType !== "all"
    ? notifications.filter((notification) => notification.type === params.notificationType)
    : notifications;
  const startIndex = (params.page - 1) * params.limit;
  return filtered.slice(startIndex, startIndex + params.limit);
}

export async function markNotificationAsRead(notificationId: string): Promise<NotificationItem[]> {
  if (!appEnv.useMockApi && appEnv.apiBaseUrl) {
    const response = await httpClient.patch<NotificationItem[]>(`/notifications/${notificationId}/read`);
    return response.data;
  }

  const notifications = readNotificationsFromStorage().map((notification) =>
    notification.id === notificationId ? { ...notification, status: "read" as const } : notification,
  );
  saveNotificationsToStorage(notifications);
  await simulateLatency(250);
  return notifications;
}

export async function markAllNotificationsAsRead(): Promise<NotificationItem[]> {
  if (!appEnv.useMockApi && appEnv.apiBaseUrl) {
    const response = await httpClient.patch<NotificationItem[]>("/notifications/read-all");
    return response.data;
  }

  const notifications = readNotificationsFromStorage().map((notification) => ({ ...notification, status: "read" as const }));
  saveNotificationsToStorage(notifications);
  await simulateLatency(250);
  return notifications;
}

export async function deleteNotification(notificationId: string): Promise<NotificationItem[]> {
  if (!appEnv.useMockApi && appEnv.apiBaseUrl) {
    const response = await httpClient.delete<NotificationItem[]>(`/notifications/${notificationId}`);
    return response.data;
  }

  const notifications = readNotificationsFromStorage().filter((notification) => notification.id !== notificationId);
  saveNotificationsToStorage(notifications);
  await simulateLatency(250);
  return notifications;
}

export async function loadNotificationSettings(): Promise<NotificationSettings> {
  if (!appEnv.useMockApi && appEnv.apiBaseUrl) {
    const response = await httpClient.get<NotificationSettings>("/settings");
    return response.data;
  }

  await simulateLatency(200);
  return readSettingsFromStorage();
}

export async function saveNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
  if (!appEnv.useMockApi && appEnv.apiBaseUrl) {
    const response = await httpClient.put<NotificationSettings>("/settings", settings);
    return response.data;
  }

  saveSettingsToStorage(settings);
  await simulateLatency(200);
  return settings;
}