import type { NotificationItem, NotificationPriority, NotificationStatus, NotificationType } from "@/types/notification";

export function formatNotificationDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getUnreadCount(notifications: NotificationItem[]): number {
  return notifications.filter((notification) => notification.status === "unread").length;
}

export function getFilteredNotifications(
  notifications: NotificationItem[],
  query: string,
  status: NotificationStatus | "all",
  priority: NotificationPriority | "all",
): NotificationItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  return notifications.filter((notification) => {
    const matchesQuery =
      !normalizedQuery ||
      [notification.title, notification.message, notification.category, notification.source, notification.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    const matchesStatus = status === "all" || notification.status === status;
    const matchesPriority = priority === "all" || notification.priority === priority;

    return matchesQuery && matchesStatus && matchesPriority;
  });
}

export function sortNotifications(notifications: NotificationItem[]): NotificationItem[] {
  return [...notifications].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
}

export function getPriorityTone(priority: NotificationPriority): "default" | "warning" | "error" | "info" {
  if (priority === "high") {
    return "error";
  }

  if (priority === "medium") {
    return "warning";
  }

  return "info";
}

export function getStatusTone(status: NotificationStatus): "success" | "default" {
  return status === "read" ? "success" : "default";
}

export function getTypeTone(notificationType: NotificationType): "primary" | "secondary" | "success" {
  if (notificationType === "Placement") {
    return "primary";
  }

  if (notificationType === "Result") {
    return "secondary";
  }

  return "success";
}