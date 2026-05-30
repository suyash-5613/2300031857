import { Button, Card, CardContent, Checkbox, FormControlLabel, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatePanel } from "@/components/common/StatePanel";
import { useNotifications } from "@/hooks/useNotifications";
import { appLog } from "@/middleware/logging";
import { validateEmail, validateFrequency } from "@/utils/validation";
import type { NotificationSettings } from "@/types/notification";

export function SettingsPage(): JSX.Element {
  const { settings, updateSettings } = useNotifications();
  const [formValues, setFormValues] = useState<NotificationSettings>(settings);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [frequencyError, setFrequencyError] = useState<string | null>(null);

  useEffect(() => {
    void appLog("frontend", "info", "page", "Settings page loaded");
  }, []);

  useEffect(() => {
    setFormValues(settings);
  }, [settings]);

  const handleSave = async () => {
    const nextEmailError = validateEmail(formValues.reminderEmail);
    const nextFrequencyError = validateFrequency(formValues.digestFrequencyHours);
    setEmailError(nextEmailError);
    setFrequencyError(nextFrequencyError);

    if (nextEmailError || nextFrequencyError) {
      return;
    }

    await updateSettings(formValues);
  };

  return (
    <Stack spacing={3}>
      <PageHeader title="Settings" subtitle="Tune delivery preferences and page behavior." />

      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", maxWidth: 720 }}>
        <CardContent>
          <Stack spacing={3}>
            <TextField
              label="Reminder email"
              value={formValues.reminderEmail}
              onChange={(event) => setFormValues((current) => ({ ...current, reminderEmail: event.target.value }))}
              error={Boolean(emailError)}
              helperText={emailError ?? "Used for notification digests."}
              fullWidth
            />
            <TextField
              label="Digest frequency (hours)"
              type="number"
              inputProps={{ min: 1, max: 24 }}
              value={formValues.digestFrequencyHours}
              onChange={(event) => setFormValues((current) => ({ ...current, digestFrequencyHours: Number(event.target.value) }))}
              error={Boolean(frequencyError)}
              helperText={frequencyError ?? "Choose a value between 1 and 24 hours."}
              fullWidth
            />
            <TextField
              label="Page size"
              type="number"
              inputProps={{ min: 1, max: 20 }}
              value={formValues.pageSize}
              onChange={(event) => setFormValues((current) => ({ ...current, pageSize: Number(event.target.value) }))}
              helperText="Controls how many notifications appear per page."
              fullWidth
            />
            <FormControlLabel
              control={<Checkbox checked={formValues.desktopNotifications} onChange={(event) => setFormValues((current) => ({ ...current, desktopNotifications: event.target.checked }))} />}
              label="Enable desktop notifications"
            />
            <Button variant="contained" onClick={() => void handleSave()}>
              Save settings
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <StatePanel title="Validation guidance" description="The form validates email format and digest interval before saving." severity="info" />
    </Stack>
  );
}