export type NotificationType = "Placement" | "Result" | "Event";

export type NotificationStatus = "unread" | "read";

export type NotificationPriority = "low" | "medium" | "high";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  category: string;
  source: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  createdAt: string;
  tags: string[];
}

export interface NotificationSettings {
  reminderEmail: string;
  digestFrequencyHours: number;
  desktopNotifications: boolean;
  pageSize: number;
}

export interface ToastState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error";
}