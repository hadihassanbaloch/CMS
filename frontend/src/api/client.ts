// frontend/src/api/client.ts

export const API_BASE =
  import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api/v1";

/** Optional: shape we throw on failures */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** Internal request helper */
async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  // Fast path: success
  if (res.ok) {
    // No content
    if (res.status === 204) return undefined as unknown as T;
    return (await res.json()) as T;
  }

  // Error path: try to extract FastAPI's error shape
  let message = `HTTP ${res.status}`;
  try {
    const body = await res.json();
    // Common FastAPI formats:
    // { detail: "message" }  OR  { detail: [{ msg: "...", ...}, ...] }
    if (typeof body?.detail === "string") message = body.detail;
    else if (Array.isArray(body?.detail) && body.detail[0]?.msg)
      message = body.detail[0].msg;
  } catch {
    /* non-JSON error */
  }
  throw new ApiError(message, res.status);
}

/** Public helpers */
export function get<T>(path: string, token?: string) {
  return request<T>(path, { method: "GET" }, token);
}

export function post<T>(path: string, body: unknown, token?: string) {
  return request<T>(
    path,
    { method: "POST", body: JSON.stringify(body) },
    token
  );
}

export function del<T>(path: string, token?: string) {
  return request<T>(path, { method: "DELETE" }, token);
}

export function put<T>(path: string, body: unknown, token?: string) {
  return request<T>(
    path,
    { method: "PUT", body: JSON.stringify(body) },
    token
  );
}
