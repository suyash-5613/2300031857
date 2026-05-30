import { Box, MenuItem, Paper, Stack, TextField } from "@mui/material";
import type { NotificationPriority, NotificationStatus } from "@/types/notification";

interface NotificationFiltersProps {
  query: string;
  status: NotificationStatus | "all";
  priority: NotificationPriority | "all";
  queryError: string | null;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: NotificationStatus | "all") => void;
  onPriorityChange: (value: NotificationPriority | "all") => void;
}

export function NotificationFilters({
  query,
  status,
  priority,
  queryError,
  onQueryChange,
  onStatusChange,
  onPriorityChange,
}: NotificationFiltersProps): JSX.Element {
  return (
    <Paper elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider", mb: 3 }}>
      <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
        <TextField
          label="Search notifications"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          error={Boolean(queryError)}
          helperText={queryError ?? "Search by title, message, category, source, or tag."}
          fullWidth
        />
        <Box sx={{ minWidth: { xs: "100%", md: 180 } }}>
          <TextField select label="Status" value={status} onChange={(event) => onStatusChange(event.target.value as NotificationStatus | "all")} fullWidth>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="read">Read</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ minWidth: { xs: "100%", md: 180 } }}>
          <TextField select label="Priority" value={priority} onChange={(event) => onPriorityChange(event.target.value as NotificationPriority | "all")} fullWidth>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
        </Box>
      </Stack>
    </Paper>
  );
}