export function validateSearchQuery(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.length < 2) {
    return "Search must contain at least 2 characters.";
  }

  if (/[^a-zA-Z0-9\s_-]/.test(trimmed)) {
    return "Search contains unsupported characters.";
  }

  return null;
}

export function validateEmail(value: string): string | null {
  if (!value.trim()) {
    return "Email is required.";
  }

  if (!/^\S+@\S+\.\S+$/.test(value.trim())) {
    return "Enter a valid email address.";
  }

  return null;
}

export function validateFrequency(value: number): string | null {
  if (!Number.isFinite(value) || value < 1 || value > 24) {
    return "Frequency must be between 1 and 24 hours.";
  }

  return null;
}