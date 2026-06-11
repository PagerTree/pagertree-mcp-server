// src/client.ts
const BASE_URL = process.env.PAGERTREE_API_URL ?? "https://api.pagertree.com/api/v4";
const API_TOKEN = process.env.PAGERTREE_API_TOKEN;

if (!API_TOKEN) {
  throw new Error("PAGERTREE_API_TOKEN environment variable is required");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_TOKEN}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`PagerTree API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export const pagertree = {
  // Account Users
  listAccountUsers: (params?: { limit?: number; offset?: number; page?: number; sort?: string; direction?: "asc" | "desc" }) => {
    const query = new URLSearchParams();
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));
    if (params?.page) query.set("page", String(params.page));
    if (params?.sort) query.set("sort", params.sort);
    if (params?.direction) query.set("direction", params.direction);
    return request<{ data: unknown[]; has_more: boolean; total_count: number }>(`/account_users?${query}`);
  },

  getAccountUser: (id: string) =>
    request<{ data: unknown }>(`/account_users/${id}`),

  // Alerts
  listAlerts: (params?: {
    status?: string;
    limit?: number;
    offset?: number;
    page?: number;
    sort?: string;
    direction?: "asc" | "desc";
  }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));
    if (params?.page) query.set("page", String(params.page));
    if (params?.sort) query.set("sort", params.sort);
    if (params?.direction) query.set("direction", params.direction);
    return request<{ data: unknown[]; has_more: boolean; total_count: number }>(`/alerts?${query}`);
  },

  getAlert: (id: string) =>
    request<{ data: unknown }>(`/alerts/${id}`),

  acknowledgeAlert: (id: string) =>
    request<{ data: unknown }>(`/alerts/${id}/acknowledge`, { method: "POST" }),

  resolveAlert: (id: string) =>
    request<{ data: unknown }>(`/alerts/${id}/resolve`, { method: "POST" }),

  // Integrations
  listIntegrations: (params?: { limit?: number; offset?: number; page?: number; sort?: string; direction?: "asc" | "desc" }) => {
    const query = new URLSearchParams();
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));
    if (params?.page) query.set("page", String(params.page));
    if (params?.sort) query.set("sort", params.sort);
    if (params?.direction) query.set("direction", params.direction);
    return request<{ data: unknown[]; has_more: boolean; total_count: number }>(`/integrations?${query}`);
  },

  getIntegration: (id: string) =>
    request<{ data: unknown }>(`/integrations/${id}`),

  enableIntegration: (id: string) =>
    request<{ data: unknown }>(`/integrations/${id}`, {
      method: "PUT",
      body: JSON.stringify({ enabled: true }),
    }),

  disableIntegration: (id: string) =>
    request<{ data: unknown }>(`/integrations/${id}`, {
      method: "PUT",
      body: JSON.stringify({ enabled: false }),
    }),

  // Logs
  getLog: (id: string) =>
    request<{ data: unknown }>(`/logs/${id}`),

  listLogs: (params?: {
    owner_id?: string;
    owner_type?: string;
    limit?: number;
    offset?: number;
    page?: number;
    sort?: string;
    direction?: "asc" | "desc";
  }) => {
    const query = new URLSearchParams();
    if (params?.owner_id) query.set("owner_id", params.owner_id);
    if (params?.owner_type) query.set("owner_type", params.owner_type);
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));
    if (params?.page) query.set("page", String(params.page));
    if (params?.sort) query.set("sort", params.sort);
    if (params?.direction) query.set("direction", params.direction);
    return request<{ data: unknown[]; has_more: boolean; total_count: number }>(`/logs?${query}`);
  },

  // Schedules
  listSchedules: () =>
    request<{ data: unknown[] }>(`/schedules`),

  // Teams
  listTeams: () =>
    request<{ data: unknown[] }>(`/teams`),

  getCurrentOncallForTeam: (teamId: string) =>
    request<{ data: unknown[] }>(`/teams/${teamId}/current_oncall`),

  // Users
  listUsers: (params?: { limit?: number; offset?: number; page?: number; sort?: string; direction?: "asc" | "desc" }) => {
    const query = new URLSearchParams();
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));
    if (params?.page) query.set("page", String(params.page));
    if (params?.sort) query.set("sort", params.sort);
    if (params?.direction) query.set("direction", params.direction);
    return request<{ data: unknown[]; has_more: boolean; total_count: number }>(`/users?${query}`);
  },

  getUser: (id: string) =>
    request<{ data: unknown }>(`/users/${id}`),
};