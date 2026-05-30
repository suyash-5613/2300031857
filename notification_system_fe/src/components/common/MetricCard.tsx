import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  tone?: "primary" | "secondary" | "warning" | "error";
}

export function MetricCard({ label, value, icon, tone = "primary" }: MetricCardProps): JSX.Element {
  return (
    <Card elevation={0} sx={{ height: "100%", border: "1px solid", borderColor: "divider" }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: `${tone}.main`, color: "white" }}
          >
            {icon}
          </Stack>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h5">{value}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}