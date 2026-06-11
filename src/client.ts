const BASE_URL = process.env.PAGERTREE_API_URL ?? "https://api.pagertree.com/api/v4";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const API_TOKEN = process.env.PAGERTREE_API_TOKEN;

  if (!API_TOKEN) {
    throw new Error("PAGERTREE_API_TOKEN environment variable is required");
  }

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

  createAlert: (params: {
    title: string;
    urgency: "low" | "medium" | "high" | "critical";
    description?: string;
    destination_team_ids?: string[];
    destination_router_ids?: string[];
    destination_account_user_ids?: string[];
    tags?: string[];
    meta?: {
      incident?: boolean;
      incident_severity?: "SEV-1" | "SEV-2" | "SEV-3" | "SEV-4" | "SEV-5" | "SEV-UNKNOWN";
      incident_message?: string;
    };
  }) =>
    request<{ data: unknown }>(`/alerts`, {
      method: "POST",
      body: JSON.stringify(params),
    }),

  acknowledgeAlert: (id: string) =>
    request<{ data: unknown }>(`/alerts/${id}/acknowledge`, { method: "POST" }),

  rejectAlert: (id: string) =>
    request<{ data: unknown }>(`/alerts/${id}/reject`, { method: "POST" }),

  resolveAlert: (id: string) =>
    request<{ data: unknown }>(`/alerts/${id}/resolve`, { method: "POST" }),

  // Events
  listEvents: (params?: { limit?: number; offset?: number; page?: number; sort?: string; direction?: "asc" | "desc" }) => {
    const query = new URLSearchParams();
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));
    if (params?.page) query.set("page", String(params.page));
    if (params?.sort) query.set("sort", params.sort);
    if (params?.direction) query.set("direction", params.direction);
    return request<{ data: unknown[]; has_more: boolean; total_count: number }>(`/events?${query}`);
  },

  getEvent: (id: string) =>
    request<{ data: unknown }>(`/events/${id}`),

  createEvent: (params: {
    start_time: string;
    end_time: string;
    layer: number;
    time_zone: string;
    account_user_ids: string[];
    schedule_ids?: string[];
    repeat?: boolean;
    frequency?: number;
    frequency_unit?: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
    days_of_week?: number[];
    repeat_end_datetime?: string;
    rotation?: boolean;
    parent_id?: string;
  }) =>
    request<{ data: unknown }>(`/events`, {
      method: "POST",
      body: JSON.stringify(params),
    }),

  updateEvent: (id: string, params: {
    start_time?: string;
    end_time?: string;
    layer?: number;
    time_zone?: string;
    account_user_ids?: string[];
    schedule_ids?: string[];
    repeat?: boolean;
    frequency?: number;
    frequency_unit?: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
    days_of_week?: number[];
    repeat_end_datetime?: string;
    rotation?: boolean;
  }) =>
    request<{ data: unknown }>(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    }),

  deleteEvent: (id: string) =>
    request<{ data: unknown }>(`/events/${id}`, { method: "DELETE" }),

  overrideEvent: (id: string, params: {
    start_time: string;
    end_time: string;
    layer: number;
    time_zone: string;
    account_user_ids: string[];
    action_time: string;
  }) =>
    request<{ data: unknown }>(`/events/${id}/override`, {
      method: "POST",
      body: JSON.stringify(params),
    }),

  addEventException: (id: string, params: { action_time: string }) =>
    request<{ data: unknown }>(`/events/${id}/add_exception`, {
      method: "POST",
      body: JSON.stringify(params),
    }),

  listEventTimeZones: () =>
    request<{ data: string[] }>(`/events/time_zones`),

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

  // Notification Rules
  listNotificationRules: (params?: { limit?: number; offset?: number; page?: number; sort?: string; direction?: "asc" | "desc" }) => {
    const query = new URLSearchParams();
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));
    if (params?.page) query.set("page", String(params.page));
    if (params?.sort) query.set("sort", params.sort);
    if (params?.direction) query.set("direction", params.direction);
    return request<{ data: unknown[]; has_more: boolean; total_count: number }>(`/notification_rules?${query}`);
  },

  getNotificationRule: (id: string) =>
    request<{ data: unknown }>(`/notification_rules/${id}`),

  createNotificationRule: (params: { name: string; enabled?: boolean; rules?: string }) =>
    request<{ data: unknown }>(`/notification_rules`, {
      method: "POST",
      body: JSON.stringify(params),
    }),

  updateNotificationRule: (id: string, params: { name?: string; enabled?: boolean; rules?: string }) =>
    request<{ data: unknown }>(`/notification_rules/${id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    }),

  deleteNotificationRule: (id: string) =>
    request<{ data: unknown }>(`/notification_rules/${id}`, { method: "DELETE" }),

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