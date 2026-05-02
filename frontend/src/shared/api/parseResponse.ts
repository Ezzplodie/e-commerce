export class UnauthorizedError extends Error {
  readonly status = 401;

  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

function safeRedirectToLogin() {
  if (typeof window === "undefined") return;
  if (window.location.pathname === "/login") return;

  const next =
    window.location.pathname + window.location.search + window.location.hash;
  const target = `/login?next=${encodeURIComponent(next)}`;
  window.location.assign(target);
}

function extractErrorMessage(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "Request failed";

  // Backend sometimes returns `{"error":"Unauthorized"}` as text.
  try {
    const parsed = JSON.parse(trimmed) as {
      error?: unknown;
      message?: unknown;
    };
    const msg =
      typeof parsed?.error === "string"
        ? parsed.error
        : typeof parsed?.message === "string"
          ? parsed.message
          : undefined;
    return msg || trimmed;
  } catch {
    return trimmed;
  }
}

export async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }

  if (response.status === 401) {
    safeRedirectToLogin();
    throw new UnauthorizedError();
  }

  const text = await response.text();
  throw new Error(extractErrorMessage(text));
}
