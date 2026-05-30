import { Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useEffect } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { StatePanel } from "@/components/common/StatePanel";
import { useNotifications } from "@/hooks/useNotifications";
import { appLog } from "@/middleware/logging";
import { formatNotificationDate, getPriorityTone, getStatusTone, getTypeTone } from "@/utils/notificationHelpers";

export function NotificationDetailsPage(): JSX.Element {
  const { notificationId = "" } = useParams();
  const navigate = useNavigate();
  const { getNotification, markRead, removeNotification } = useNotifications();
  const notification = getNotification(notificationId);

  useEffect(() => {
    void appLog("frontend", "info", "page", `Notification details loaded: ${notificationId}`);
  }, [notificationId]);

  if (!notification) {
    return <StatePanel title="Notification not found" description="The requested notification does not exist or was removed." actionLabel="Back to notifications" onAction={() => navigate("/notifications")} severity="warning" />;
  }

  return (
    <Stack spacing={3}>
      <PageHeader title="Notification Details" subtitle="Inspect the full notification payload and manage its status." actionLabel="Back" actionIcon={<ArrowBackOutlinedIcon />} onAction={() => navigate(-1)} />

      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={notification.type} color={getTypeTone(notification.type)} />
              <Chip label={notification.category} color="primary" variant="outlined" />
              <Chip label={notification.priority} color={getPriorityTone(notification.priority)} />
              <Chip label={notification.status} color={getStatusTone(notification.status)} variant="outlined" />
            </Stack>
            <Typography variant="h5">{notification.title}</Typography>
            <Typography variant="body1" color="text.secondary">
              {notification.message}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Source: {notification.source}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created: {formatNotificationDate(notification.createdAt)}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {notification.status === "unread" ? (
          <Button variant="contained" startIcon={<CheckCircleOutlineIcon />} onClick={() => void markRead(notification.id)}>
            Mark as read
          </Button>
        ) : null}
        <Button color="error" variant="outlined" startIcon={<DeleteOutlineIcon />} onClick={() => void removeNotification(notification.id)}>
          Delete notification
        </Button>
        <Button component={RouterLink} to="/notifications">
          Return to list
        </Button>
      </Stack>
    </Stack>
  );
}