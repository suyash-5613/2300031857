import { Component, type ErrorInfo, type ReactNode } from "react";
import { Alert, Button, Stack } from "@mui/material";
import { appLog } from "@/middleware/logging";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: "",
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    void appLog("frontend", "error", "component", `Error boundary caught: ${error.message} | ${errorInfo.componentStack}`);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Stack spacing={2} sx={{ p: 4 }}>
          <Alert severity="error">{this.state.errorMessage || "Something went wrong while rendering the page."}</Alert>
          <Button variant="contained" onClick={this.handleReset}>
            Try again
          </Button>
        </Stack>
      );
    }

    return this.props.children;
  }
}