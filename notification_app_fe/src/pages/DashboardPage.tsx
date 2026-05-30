import { Grid, Stack } from "@mui/material";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import { useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { StatePanel } from "@/components/common/StatePanel";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { useNotifications } from "@/hooks/useNotifications";
import { appLog } from "@/middleware/logging";

export function DashboardPage(): JSX.Element {
  const { notifications, summary, isLoading, error, refreshNotifications, markRead, removeNotification } = useNotifications();
  const recentNotifications = notifications.slice(0, 3);

  useEffect(() => {
    void appLog("frontend", "info", "page", "Dashboard page loaded");
  }, []);

  return (
    <Stack spacing={3}>
      <PageHeader title="Dashboard" subtitle="A quick view of your notification volume and recent activity." actionLabel="Refresh" onAction={() => void refreshNotifications()} />

      {error ? <StatePanel title="Unable to load data" description={error} actionLabel="Try again" onAction={() => void refreshNotifications()} severity="error" /> : null}

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <MetricCard label="Total notifications" value={summary.total} icon={<NotificationsActiveOutlinedIcon />} />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard label="Placement notifications" value={summary.placement} icon={<WorkOutlineOutlinedIcon />} />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard label="Result notifications" value={summary.result} icon={<FactCheckOutlinedIcon />} tone="secondary" />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard label="Event notifications" value={summary.event} icon={<EventOutlinedIcon />} tone="warning" />
        </Grid>
      </Grid>

      {isLoading ? <StatePanel title="Loading dashboard" description="Fetching notification data, please wait." severity="info" /> : null}

      {recentNotifications.length > 0 ? (
        <Stack spacing={2}>
          {recentNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} onMarkRead={(notificationId) => void markRead(notificationId)} onDelete={(notificationId) => void removeNotification(notificationId)} />
          ))}
        </Stack>
      ) : isLoading ? null : (
        <StatePanel title="No recent notifications" description="There are no notifications available yet." severity="info" />
      )}
    </Stack>
  );
}