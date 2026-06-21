// Single source of truth for the backend API base URL.
// Override per-environment via NEXT_PUBLIC_API_URL in .env files.
// Falls back to local dev backend so the app boots without env setup.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
