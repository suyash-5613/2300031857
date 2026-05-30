import { MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatePanel } from "@/components/common/StatePanel";
import { NotificationTable } from "@/components/notifications/NotificationTable";
import { useNotifications } from "@/hooks/useNotifications";
import { appLog } from "@/middleware/logging";
import { getTopPriorityNotifications } from "@/utils/priorityRanking";

export function PriorityNotificationsPage(): JSX.Element {
  const { notifications, isLoading, error, refreshNotifications, markRead, removeNotification } = useNotifications();
  const [limit, setLimit] = useState(10);
  const [priorityNotifications, setPriorityNotifications] = useState(notifications.slice(0, 10));

  useEffect(() => {
    void appLog("frontend", "info", "page", "Priority notifications page loaded");
  }, []);

  useEffect(() => {
    void (async () => {
      const rankedNotifications = await getTopPriorityNotifications(notifications, limit);
      setPriorityNotifications(rankedNotifications);
    })();
  }, [notifications, limit]);

  const summaryText = useMemo(() => `Showing top ${limit} unread notifications ranked by Placement > Result > Event, newest first within each type.`, [limit]);

  return (
    <Stack spacing={3}>
      <PageHeader title="Priority Notifications" subtitle="Rank the most important unread notifications at all times." actionLabel="Refresh" onAction={() => void refreshNotifications()} />

      <TextField select label="Top N" value={limit} onChange={(event) => setLimit(Number(event.target.value))} sx={{ maxWidth: 240 }}>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={15}>15</MenuItem>
        <MenuItem value={20}>20</MenuItem>
      </TextField>

      <Typography variant="body2" color="text.secondary">
        {summaryText}
      </Typography>

      {error ? <StatePanel title="Unable to load priority notifications" description={error} actionLabel="Retry" onAction={() => void refreshNotifications()} severity="error" /> : null}
      {isLoading ? <StatePanel title="Ranking notifications" description="Evaluating the top unread notifications." severity="info" /> : null}

      {!isLoading && priorityNotifications.length === 0 ? (
        <StatePanel title="No unread notifications" description="There are no unread notifications that match the ranking rules." severity="info" />
      ) : null}

      <NotificationTable
        notifications={priorityNotifications}
        page={0}
        rowsPerPage={limit}
        totalCount={priorityNotifications.length}
        onPageChange={() => undefined}
        onRowsPerPageChange={() => undefined}
        onMarkRead={(notificationId) => void markRead(notificationId)}
        onDelete={(notificationId) => void removeNotification(notificationId)}
      />
    </Stack>
  );
}