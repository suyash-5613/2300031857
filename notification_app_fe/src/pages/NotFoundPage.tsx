import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { StatePanel } from "@/components/common/StatePanel";

export function NotFoundPage(): JSX.Element {
  return (
    <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
      <StatePanel title="Page not found" description="The page you requested does not exist." severity="warning" />
      <Button component={RouterLink} to="/" variant="contained">
        Go to dashboard
      </Button>
    </Stack>
  );
}