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

export type ParseResponseOptions = {
  /** When false, 401 throws UnauthorizedError without redirecting to /login. */
  redirectOn401?: boolean;
};

export async function parseResponse<T>(
  response: Response,
  options: ParseResponseOptions = {},
): Promise<T> {
  const { redirectOn401 = true } = options;

  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    if (!text.trim()) {
      return undefined as T;
    }

    return JSON.parse(text) as T;
  }

  if (response.status === 401) {
    if (redirectOn401) {
      safeRedirectToLogin();
    }
    throw new UnauthorizedError();
  }

  const text = await response.text();
  throw new Error(extractErrorMessage(text));
}
