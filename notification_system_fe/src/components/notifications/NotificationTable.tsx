import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Link as RouterLink } from "react-router-dom";
import type { NotificationItem } from "@/types/notification";
import { formatNotificationDate, getTypeTone } from "@/utils/notificationHelpers";

interface NotificationTableProps {
  notifications: NotificationItem[];
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (_: unknown, nextPage: number) => void;
  onRowsPerPageChange: (value: number) => void;
  onMarkRead: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
}

export function NotificationTable({
  notifications,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onMarkRead,
  onDelete,
}: NotificationTableProps): JSX.Element {
  return (
    <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
      <Box sx={{ overflowX: "auto" }}>
        <Table size="small" aria-label="notifications table">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow hover key={notification.id}>
                <TableCell>
                  <Chip label={notification.type} color={getTypeTone(notification.type)} size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">{notification.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.id}
                  </Typography>
                </TableCell>
                <TableCell>{formatNotificationDate(notification.createdAt)}</TableCell>
                <TableCell>
                  <Chip label={notification.status} variant="outlined" size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton component={RouterLink} to={`/notifications/${notification.id}`}>
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                  {notification.status === "unread" ? (
                    <IconButton onClick={() => onMarkRead(notification.id)}>
                      <CheckCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  ) : null}
                  <IconButton onClick={() => onDelete(notification.id)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
        onPageChange={onPageChange}
        onRowsPerPageChange={(event) => onRowsPerPageChange(Number(event.target.value))}
      />
    </Paper>
  );
}