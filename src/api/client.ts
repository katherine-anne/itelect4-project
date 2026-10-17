import useAuthStore from "../store/authStore";
import type {
  ApiClaim,
  ApiItem,
  ClaimDecision,
  AuthReply,
  LoginCredentials,
  NewClaim,
  RegisterCredentials,
  User,
} from "../types/index";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (!configuredApiUrl) {
  throw new Error("VITE_API_URL is missing. Set it in your local or Vercel environment.");
}

export const API_URL = configuredApiUrl.replace(/\/+$/, "");

interface RequestOptions extends RequestInit {
  authenticated?: boolean;
}

function apiErrorMessage(payload: unknown): string | undefined {
  if (typeof payload !== "object" || payload === null || !("message" in payload)) {
    return undefined;
  }

  return typeof payload.message === "string" ? payload.message : undefined;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { authenticated = false, headers: requestHeaders, ...init } = options;
  const headers = new Headers(requestHeaders);

  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error("Please log in to continue.");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  let payload: unknown;

  if (response.status !== 204) {
    try {
      payload = await response.json();
    } catch {
      payload = undefined;
    }
  }

  if (!response.ok) {
    throw new Error(
      apiErrorMessage(payload) ?? `Request failed with status ${response.status}`,
    );
  }

  return payload as T;
}

export function fetchItems(): Promise<ApiItem[]> {
  return request<ApiItem[]>("/api/items");
}

export function fetchItemById(id: string): Promise<ApiItem> {
  return request<ApiItem>(`/api/items/${encodeURIComponent(id)}`);
}

export function fetchClaims(): Promise<ApiClaim[]> {
  return request<ApiClaim[]>("/api/claims", { authenticated: true });
}

export function createClaim(newClaim: NewClaim): Promise<ApiClaim> {
  return request<ApiClaim>("/api/claims", {
    method: "POST",
    body: JSON.stringify(newClaim),
    authenticated: true,
  });
}

export function updateClaimStatus(
  id: string,
  status: ClaimDecision,
): Promise<ApiClaim> {
  return request<ApiClaim>(`/api/claims/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    authenticated: true,
  });
}

export function registerUser(credentials: RegisterCredentials): Promise<User> {
  return request<User>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function loginUser(credentials: LoginCredentials): Promise<AuthReply> {
  return request<AuthReply>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
