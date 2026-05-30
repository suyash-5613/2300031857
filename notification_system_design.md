Notification System Design

Introduction

This project is developed to display campus notifications in a simple and organized way. The notifications are fetched from the provided API and shown to users through a React application.

The project contains:

- Logging Middleware
- Frontend Application

Stage 1

In the first stage, the main task is to find the most important unread notifications.

The priority order used is:

1. Placement
2. Result
3. Event

If two notifications belong to the same category, the latest one is given higher priority.

The notifications are filtered, sorted according to priority, and the top notifications are displayed.

Stage 2

In the second stage, a React frontend application is created.

The application allows users to:

- View notifications
- Search notifications
- Filter notifications by type
- Navigate through pages using pagination
- View important notifications separately

The interface is responsive and works on mobile and desktop devices.

Logging

A reusable logging middleware is used in different parts of the application.

Logs are generated for:

- API calls
- Page loading
- User actions
- Error handling

This helps in tracking application activities and debugging issues.

Conclusion

The project provides a simple way to manage and view campus notifications. Important notifications are prioritized, and the frontend offers an easy-to-use interface for users.
