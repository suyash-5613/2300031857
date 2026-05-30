import { useMemo } from "react";
import { useNotificationContext } from "@/state/NotificationContext";
import { getUnreadCount, sortNotifications } from "@/utils/notificationHelpers";

export function useNotifications() {
  const context = useNotificationContext();

  const sortedNotifications = useMemo(() => sortNotifications(context.notifications), [context.notifications]);

  const summary = useMemo(
    () => ({
      total: sortedNotifications.length,
      unread: getUnreadCount(sortedNotifications),
      read: sortedNotifications.length - getUnreadCount(sortedNotifications),
      placement: sortedNotifications.filter((notification) => notification.type === "Placement").length,
      result: sortedNotifications.filter((notification) => notification.type === "Result").length,
      event: sortedNotifications.filter((notification) => notification.type === "Event").length,
    }),
    [sortedNotifications],
  );

  return {
    ...context,
    notifications: sortedNotifications,
    summary,
  };
}