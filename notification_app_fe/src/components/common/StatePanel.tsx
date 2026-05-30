import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface StatePanelProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  severity?: "error" | "info" | "warning";
  icon?: ReactNode;
}

export function StatePanel({
  title,
  description,
  actionLabel,
  onAction,
  severity = "info",
  icon,
}: StatePanelProps): JSX.Element {
  return (
    <Paper elevation={0} sx={{ p: 4, border: "1px solid", borderColor: "divider", textAlign: "center" }}>
      <Stack spacing={2} alignItems="center">
        {icon ? <Box>{icon}</Box> : null}
        <Alert severity={severity} sx={{ width: "100%", justifyContent: "center" }}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        </Alert>
        {actionLabel && onAction ? (
          <Button variant="contained" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Paper>
  );
}