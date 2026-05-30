import { Stack, Typography } from "@mui/material";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatePanel } from "@/components/common/StatePanel";
import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import { useNotifications } from "@/hooks/useNotifications";
import { appLog } from "@/middleware/logging";
import { getFilteredNotifications, sortNotifications } from "@/utils/notificationHelpers";
import { validateSearchQuery } from "@/utils/validation";
import type { NotificationPriority, NotificationStatus } from "@/types/notification";
import { NotificationTable } from "@/components/notifications/NotificationTable";

export function NotificationsPage(): JSX.Element {
  const { notifications, settings, isLoading, error, refreshNotifications, markRead, markAllRead, removeNotification } = useNotifications();
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [status, setStatus] = useState<NotificationStatus | "all">("all");
  const [priority, setPriority] = useState<NotificationPriority | "all">("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    void appLog("frontend", "info", "page", "Notifications page loaded");
  }, []);

  const validatedQuery = useMemo(() => validateSearchQuery(search), [search]);

  useEffect(() => {
    setSearchError(validatedQuery);
  }, [validatedQuery]);

  const filteredNotifications = useMemo(() => {
    if (validatedQuery) {
      return [];
    }

    return sortNotifications(getFilteredNotifications(notifications, search, status, priority));
  }, [notifications, search, status, priority, validatedQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / settings.pageSize));
  const paginatedNotifications = filteredNotifications.slice((page - 1) * settings.pageSize, page * settings.pageSize);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  return (
    <Stack spacing={3}>
      <PageHeader title="Notifications" subtitle="Search, filter, and manage all notifications in one place." actionLabel="Mark all as read" actionIcon={<DoneAllOutlinedIcon />} onAction={() => void markAllRead()} />

      <NotificationFilters
        query={search}
        status={status}
        priority={priority}
        queryError={searchError}
        onQueryChange={setSearch}
        onStatusChange={setStatus}
        onPriorityChange={(value) => setPriority(value)}
      />

      {error ? <StatePanel title="Data error" description={error} actionLabel="Reload" onAction={() => void refreshNotifications()} severity="error" /> : null}
      {isLoading ? <StatePanel title="Loading notifications" description="Fetching the latest items." severity="info" /> : null}

      {!isLoading && paginatedNotifications.length === 0 && !searchError ? (
        <StatePanel title="No notifications found" description="Try a different search or filter combination." severity="info" />
      ) : null}

      {filteredNotifications.length > 0 ? (
        <NotificationTable
          notifications={paginatedNotifications}
          page={page - 1}
          rowsPerPage={settings.pageSize}
          totalCount={filteredNotifications.length}
          onPageChange={(_, nextPage) => setPage(nextPage + 1)}
          onRowsPerPageChange={() => undefined}
          onMarkRead={(notificationId) => void markRead(notificationId)}
          onDelete={(notificationId) => void removeNotification(notificationId)}
        />
      ) : null}

      {filteredNotifications.length > 0 ? (
        <Typography variant="body2" color="text.secondary">
          Showing {paginatedNotifications.length} of {filteredNotifications.length} notifications
        </Typography>
      ) : null}
    </Stack>
  );
}