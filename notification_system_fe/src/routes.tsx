import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/pages/DashboardPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { PriorityNotificationsPage } from "@/pages/PriorityNotificationsPage";
import { NotificationDetailsPage } from "@/pages/NotificationDetailsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/priority-notifications" element={<PriorityNotificationsPage />} />
        <Route path="/notifications/:notificationId" element={<NotificationDetailsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}