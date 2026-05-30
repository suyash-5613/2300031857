# Notification Console Frontend

Frontend-only project for the campus hiring assessment.

## Structure

- `src/api` - Axios services and API adapters
- `src/components` - Reusable UI building blocks
- `src/hooks` - Shared hooks
- `src/pages` - Route-level screens
- `src/state` - React Context state
- `src/styles` - Theme and global styles
- `src/auth`, `src/config`, `src/middleware`, `src/utils` - Support modules

## Setup

1. Open `notification_app_fe/`.
2. Copy `.env.example` to `.env` and set the API values.
3. Install dependencies.
4. Start the app.

```bash
npm install
npm run dev
```

## Environment

```env
VITE_API_BASE_URL=https://your-api.example.com
VITE_LOG_API_BASE_URL=https://your-log-api.example.com
VITE_LOG_BEARER_TOKEN=your-token
VITE_USE_MOCK_API=true
```

## Pages

- Dashboard
- Notifications
- Priority Notifications
- Notification Details
- Settings
- Not Found

## Logging

The app routes all important events through the reusable logging middleware, including page loads, API calls, render events, and state transitions.

## Screenshots Guide

Capture these deliverables after running the app:

1. Desktop Dashboard Screenshot
2. Mobile Dashboard Screenshot
3. Notifications Page Screenshot
4. Priority Notifications Screenshot
5. Search Result Screenshot
6. Error State Screenshot
7. Loading State Screenshot

Suggested capture flow:

1. Open the dashboard on a desktop viewport and capture the default state.
2. Resize to a mobile viewport and capture the dashboard again.
3. Open the notifications page, apply a search term, and capture the filtered list.
4. Open the priority notifications page and capture the top-ranked unread list.
5. Force an API failure or disable mock data to capture the error state.
6. Reload with network throttling or a slow mock delay to capture the loading state.

## Notes

- The app uses local mock data when `VITE_USE_MOCK_API=true`.
- Logging calls use the reusable `logging_middleware` package.