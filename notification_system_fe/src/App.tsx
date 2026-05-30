import { Snackbar, Alert } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { NotificationProvider, useNotificationContext } from "@/state/NotificationContext";
import { appTheme } from "@/styles/theme";
import { AppRoutes } from "@/routes";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

function ToastHost(): JSX.Element | null {
  const { toast, hideToast } = useNotificationContext();

  if (!toast.open) {
    return null;
  }

  return (
    <Snackbar open={toast.open} autoHideDuration={3500} onClose={hideToast} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <Alert onClose={hideToast} severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
        {toast.message}
      </Alert>
    </Snackbar>
  );
}

export function App(): JSX.Element {
  return (
    <ThemeProvider theme={appTheme}>
      <NotificationProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <AppRoutes />
            <ToastHost />
          </ErrorBoundary>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}