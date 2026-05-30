import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { appLog, initLogging } from "@/middleware/logging";
import { defaultSettings } from "@/data/mockNotifications";
import type { NotificationItem, NotificationSettings, ToastState } from "@/types/notification";
import {
  deleteNotification,
  fetchNotificationById,
  fetchNotifications,
  loadNotificationSettings,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  saveNotificationSettings,
} from "@/api/notificationsApi";

interface NotificationContextValue {
  notifications: NotificationItem[];
  settings: NotificationSettings;
  isLoading: boolean;
  error: string | null;
  toast: ToastState;
  refreshNotifications: () => Promise<void>;
  markRead: (notificationId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  removeNotification: (notificationId: string) => Promise<void>;
  updateSettings: (settings: NotificationSettings) => Promise<void>;
  getNotification: (notificationId: string) => NotificationItem | null;
  showToast: (message: string, severity?: ToastState["severity"]) => void;
  hideToast: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const initialToast: ToastState = {
  open: false,
  message: "",
  severity: "info",
};

export function NotificationProvider({ children }: { children: ReactNode }): JSX.Element {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(initialToast);

  const showToast = useCallback((message: string, severity: ToastState["severity"] = "info") => {
    setToast({ open: true, message, severity });
  }, []);

  const hideToast = useCallback(() => {
    setToast((currentToast) => ({ ...currentToast, open: false }));
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      initLogging();
      const [notificationData, settingsData] = await Promise.all([fetchNotifications(), loadNotificationSettings()]);
      setNotifications(notificationData);
      setSettings(settingsData);
      await appLog("frontend", "info", "page", "Notifications loaded");
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Failed to load notifications.";
      setError(message);
      showToast(message, "error");
      await appLog("frontend", "error", "api", "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const markRead = useCallback(async (notificationId: string) => {
    try {
      const updated = await markNotificationAsRead(notificationId);
      setNotifications(updated);
      showToast("Notification marked as read.", "success");
      await appLog("frontend", "info", "state", `Notification marked as read: ${notificationId}`);
    } catch (markError) {
      const message = markError instanceof Error ? markError.message : "Unable to update notification.";
      showToast(message, "error");
      setError(message);
    }
  }, [showToast]);

  const markAllRead = useCallback(async () => {
    try {
      const updated = await markAllNotificationsAsRead();
      setNotifications(updated);
      showToast("All notifications marked as read.", "success");
      await appLog("frontend", "info", "state", "All notifications marked as read");
    } catch (markError) {
      const message = markError instanceof Error ? markError.message : "Unable to mark all notifications as read.";
      showToast(message, "error");
      setError(message);
    }
  }, [showToast]);

  const removeNotification = useCallback(async (notificationId: string) => {
    try {
      const updated = await deleteNotification(notificationId);
      setNotifications(updated);
      showToast("Notification deleted.", "success");
      await appLog("frontend", "warn", "state", `Notification deleted: ${notificationId}`);
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "Unable to delete notification.";
      showToast(message, "error");
      setError(message);
    }
  }, [showToast]);

  const updateSettings = useCallback(async (nextSettings: NotificationSettings) => {
    try {
      const savedSettings = await saveNotificationSettings(nextSettings);
      setSettings(savedSettings);
      showToast("Settings saved.", "success");
      await appLog("frontend", "info", "state", "Notification settings updated");
    } catch (settingsError) {
      const message = settingsError instanceof Error ? settingsError.message : "Unable to save settings.";
      showToast(message, "error");
      setError(message);
    }
  }, [showToast]);

  const getNotification = useCallback((notificationId: string) => {
    return notifications.find((notification) => notification.id === notificationId) ?? null;
  }, [notifications]);

  useEffect(() => {
    void refreshNotifications();
  }, [refreshNotifications]);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      settings,
      isLoading,
      error,
      toast,
      refreshNotifications,
      markRead,
      markAllRead,
      removeNotification,
      updateSettings,
      getNotification,
      showToast,
      hideToast,
    }),
    [
      notifications,
      settings,
      isLoading,
      error,
      toast,
      refreshNotifications,
      markRead,
      markAllRead,
      removeNotification,
      updateSettings,
      getNotification,
      showToast,
      hideToast,
    ],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotificationContext(): NotificationContextValue {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotificationContext must be used within NotificationProvider");
  }

  return context;
}