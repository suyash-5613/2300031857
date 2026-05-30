import { AppBar, Box, Button, Card, CardActions, CardContent, Chip, Stack, Toolbar, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import type { NotificationItem } from "@/types/notification";
import { appLog } from "@/middleware/logging";
import { formatNotificationDate, getPriorityTone, getStatusTone } from "@/utils/notificationHelpers";

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkRead: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
}

export function NotificationCard({ notification, onMarkRead, onDelete }: NotificationCardProps): JSX.Element {
  useEffect(() => {
    void appLog("frontend", "debug", "component", `Notification card rendered: ${notification.id}`);
  }, [notification.id]);

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: notification.status === "unread" ? "primary.main" : "divider" }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={notification.category} size="small" color="primary" variant="outlined" />
            <Chip label={notification.priority} size="small" color={getPriorityTone(notification.priority)} />
            <Chip label={notification.status} size="small" color={getStatusTone(notification.status)} variant="outlined" />
          </Stack>
          <Box>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {notification.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {notification.message}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Source: {notification.source} · {formatNotificationDate(notification.createdAt)}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {notification.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
          </Stack>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between", flexWrap: "wrap" }}>
        <Button component={RouterLink} to={`/notifications/${notification.id}`} startIcon={<VisibilityOutlinedIcon />}>
          Details
        </Button>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {notification.status === "unread" ? (
            <Button startIcon={<CheckCircleOutlineIcon />} onClick={() => onMarkRead(notification.id)}>
              Mark read
            </Button>
          ) : null}
          <Button color="error" startIcon={<DeleteOutlineIcon />} onClick={() => onDelete(notification.id)}>
            Delete
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}