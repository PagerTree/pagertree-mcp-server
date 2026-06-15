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

function paginationQuery(params?: { limit?: number; offset?: number; page?: number; sort?: string; direction?: "asc" | "desc" }): URLSearchParams {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.offset) query.set("offset", String(params.offset));
  if (params?.page) query.set("page", String(params.page));
  if (params?.sort) query.set("sort", params.sort);
  if (params?.direction) query.set("direction", params.direction);
  return query;
}

type PaginationParams = { limit?: number; offset?: number; page?: number; sort?: string; direction?: "asc" | "desc" };
type PaginatedResponse = { data: unknown[]; has_more: boolean; total_count: number };

export const pagertree = {

  // ============================================================
  // Account Users
  // ============================================================

  listAccountUsers: (params?: PaginationParams) =>
    request<PaginatedResponse>(`/account_users?${paginationQuery(params)}`),

  getAccountUser: (id: string) =>
    request<{ data: unknown }>(`/account_users/${id}`),

  createAccountUser: (params: {
    notification_rule_id?: string;
    roles?: { admin?: boolean; billing?: boolean; broadcaster?: boolean; communicator?: boolean };
    member_team_ids?: string[];
    user_attributes: {
      id?: string;
      name: string;
      notify_push?: boolean;
      notify_email?: boolean;
      notify_sms?: boolean;
      notify_voice?: boolean;
      emails_attributes: {
        id?: string;
        email: string;
        primary?: boolean;
        _destroy?: boolean;
      }[];
      phones_attributes?: {
        id?: string;
        phone: string;
        primary?: boolean;
        _destroy?: boolean;
      }[];
    };
  }) =>
    request<{ data: unknown }>(`/account_users`, {
      method: "POST",
      body: JSON.stringify(params),
    }),

  updateAccountUser: (id: string, params: {
    notification_rule_id?: string;
    roles?: { admin?: boolean; billing?: boolean; broadcaster?: boolean; communicator?: boolean };
    member_team_ids?: string[];
    user_attributes?: {
      id?: string;
      name?: string;
      notify_push?: boolean;
      notify_email?: boolean;
      notify_sms?: boolean;
      notify_voice?: boolean;
      emails_attributes?: {
        id?: string;
        email?: string;
        primary?: boolean;
        _destroy?: boolean;
      }[];
      phones_attributes?: {
        id?: string;
        phone?: string;
        primary?: boolean;
        _destroy?: boolean;
      }[];
    };
  }) =>
    request<{ data: unknown }>(`/account_users/${id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    }),

  deleteAccountUser: (id: string) =>
    request<{ data: unknown }>(`/account_users/${id}`, { method: "DELETE" }),

  // ============================================================
  // Alerts
  // ============================================================

  listAlerts: (params?: PaginationParams & { status?: string }) => {
    const query = paginationQuery(params);
    if (params?.status) query.set("status", params.status);
    return request<PaginatedResponse>(`/alerts?${query}`);
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

  updateAlert: (id: string, params: {
    title?: string;
    description?: string;
    urgency?: "low" | "medium" | "high" | "critical";
    meta?: {
      incident?: boolean;
      incident_severity?: "SEV-1" | "SEV-2" | "SEV-3" | "SEV-4" | "SEV-5" | "SEV-UNKNOWN";
      incident_message?: string;
    };
  }) =>
    request<{ data: unknown }>(`/alerts/${id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    }),

  deleteAlert: (id: string) =>
    request<{ data: unknown }>(`/alerts/${id}`, { method: "DELETE" }),

  acknowledgeAlert: (id: string) =>
    request<{ data: unknown }>(`/alerts/${id}/acknowledge`, { method: "POST" }),

  rejectAlert: (id: string) =>
    request<{ data: unknown }>(`/alerts/${id}/reject`, { method: "POST" }),

  resolveAlert: (id: string) =>
    request<{ data: unknown }>(`/alerts/${id}/resolve`, { method: "POST" }),

  listAlertComments: (id: string) =>
    request<{ data: unknown[] }>(`/alerts/${id}/comments`),

  createAlertComment: (id: string, body: string) =>
    request<{ data: unknown }>(`/alerts/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  // ============================================================
  // Broadcasts
  // ============================================================

  listBroadcasts: (params?: PaginationParams) =>
    request<PaginatedResponse>(`/broadcasts?${paginationQuery(params)}`),

  getBroadcast: (id: string) =>
    request<{ data: unknown }>(`/broadcasts/${id}`),

  createBroadcast: (params: {
    title: string;
    destination_team_ids?: string[];
    destination_account_user_ids?: string[];
    description?: string;
    tag_list?: string[];
    response_requested?: boolean;
    response_requested_by?: string;
    select_specific_channels?: boolean;
    notify_push?: boolean;
    notify_email?: boolean;
    notify_sms?: boolean;
    notify_slack?: boolean;
    notify_whatsapp?: boolean;
    broadcast_response_options_attributes?: { value: string }[];
  }) =>
    request<{ data: unknown }>(`/broadcasts`, {
      method: "POST",
      body: JSON.stringify(params),
    }),

  updateBroadcast: (id: string, params: {
    title?: string;
    description?: string;
    tag_list?: string[];
  }) =>
    request<{ data: unknown }>(`/broadcasts/${id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    }),

  deleteBroadcast: (id: string) =>
    request<{ data: unknown }>(`/broadcasts/${id}`, { method: "DELETE" }),

  listBroadcastComments: (id: string) =>
    request<{ data: unknown[] }>(`/broadcasts/${id}/comments`),

  createBroadcastComment: (id: string, body: string) =>
    request<{ data: unknown }>(`/broadcasts/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ body }),
    }),

  // ============================================================
  // Escalation Policies
  // ============================================================

  listEscalationPolicies: (params?: PaginationParams) =>
    request<PaginatedResponse>(`/escalation_policies?${paginationQuery(params)}`),

  getEscalationPolicy: (id: string) =>
    request<{ data: unknown }>(`/escalation_policies/${id}`),

  createEscalationPolicy: (params: {
    name: string;
    repeat?: number;
    reassign_team_ids?: string[];
    reassign_account_user_ids?: string[];
    escalation_layers_attributes?: {
      layer: number;
      timeout: number;
      timeout_unit: "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
      color_hex?: string;
    }[];
  }) =>
    request<{ data: unknown }>(`/escalation_policies`, {
      method: "POST",
      body: JSON.stringify(params),
    }),

  updateEscalationPolicy: (id: string, params: {
    name?: string;
    repeat?: number;
    reassign_team_ids?: string[];
    reassign_account_user_ids?: string[];
    escalation_layers_attributes?: {
      id?: string;
      layer?: number;
      timeout?: number;
      timeout_unit?: "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
      color_hex?: string;
      _destroy?: boolean;
    }[];
  }) =>
    request<{ data: unknown }>(`/escalation_policies/${id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    }),

  deleteEscalationPolicy: (id: string) =>
    request<{ data: unknown }>(`/escalation_policies/${id}`, { method: "DELETE" }),

  // ============================================================
  // Events
  // ============================================================

  listEvents: (params?: PaginationParams) =>
    request<PaginatedResponse>(`/events?${paginationQuery(params)}`),

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

  terminateEvent: (id: string, params: { action_time: string }) =>
    request<{ data: unknown }>(`/events/${id}/terminate_on`, {
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

  // ============================================================
  // Integrations
  // ============================================================

  listIntegrations: (params?: PaginationParams) =>
    request<PaginatedResponse>(`/integrations?${paginationQuery(params)}`),

  getIntegration: (id: string) =>
    request<{ data: unknown }>(`/integrations/${id}`),

  createIntegration: (params: {
    name: string;
    urgency: "low" | "medium" | "high" | "critical";
    integration_type_id: string;
    enabled?: boolean;
    account_user_ids?: string[];
    router_ids?: string[];
    team_ids?: string[];
    [key: string]: unknown; // option_ prefixed fields
  }) =>
    request<{ data: unknown }>(`/integrations`, {
      method: "POST",
      body: JSON.stringify(params),
    }),

  updateIntegration: (id: string, params: {
    name?: string;
    urgency?: "low" | "medium" | "high" | "critical";
    enabled?: boolean;
    account_user_ids?: string[];
    router_ids?: string[];
    team_ids?: string[];
    [key: string]: unknown; // option_ prefixed fields
  }) =>
    request<{ data: unknown }>(`/integrations/${id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    }),

  deleteIntegration: (id: string) =>
    request<{ data: unknown }>(`/integrations/${id}`, { method: "DELETE" }),

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

  listIntegrationTypes: (params?: PaginationParams) =>
    request<PaginatedResponse>(`/integration_types?${paginationQuery(params)}`),

  getIntegrationType: (id: string) =>
    request<{ data: unknown }>(`/integration_types/${id}`),

  // ============================================================
  // Logs
  // ============================================================

  listLogs: (params?: PaginationParams & { owner_id?: string; owner_type?: string }) => {
    const query = paginationQuery(params);
    if (params?.owner_id) query.set("owner_id", params.owner_id);
    if (params?.owner_type) query.set("owner_type", params.owner_type);
    return request<PaginatedResponse>(`/logs?${query}`);
  },

  getLog: (id: string) =>
    request<{ data: unknown }>(`/logs/${id}`),

  // ============================================================
  // Maintenance Windows
  // ============================================================

  listMaintenanceWindows: (params?: PaginationParams) =>
    request<PaginatedResponse>(`/maintenance_windows?${paginationQuery(params)}`),

  getMaintenanceWindow: (id: string) =>
    request<{ data: unknown }>(`/maintenance_windows/${id}`),

  createMaintenanceWindow: (params: {
    name: string;
    start_datetime: string;
    end_datetime: string;
    time_zone: string;
    integration_ids: string[];
    description?: string;
  }) =>
    request<{ data: unknown }>(`/maintenance_windows`, {
      method: "POST",
      body: JSON.stringify(params),
    }),

  updateMaintenanceWindow: (id: string, params: {
    name?: string;
    start_datetime?: string;
    end_datetime?: string;
    time_zone?: string;
    integration_ids?: string[];
    description?: string;
  }) =>
    request<{ data: unknown }>(`/maintenance_windows/${id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    }),

  deleteMaintenanceWindow: (id: string) =>
    request<{ data: unknown }>(`/maintenance_windows/${id}`, { method: "DELETE" }),

  // ============================================================
  // Notification Rules
  // ============================================================

  listNotificationRules: (params?: PaginationParams) =>
    request<PaginatedResponse>(`/notification_rules?${paginationQuery(params)}`),

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

  // ============================================================
  // Routers
  // ============================================================

  listRouters: (params?: PaginationParams) =>
    request<PaginatedResponse>(`/routers?${paginationQuery(params)}`),

  getRouter: (id: string) =>
    request<{ data: unknown }>(`/routers/${id}`),

  createRouter: (params: {
    name: string;
    enabled?: boolean;
    rules?: string;
    default_receiver_team_id?: string;
    default_receiver_account_user_id?: string;
    default_receiver_router_id?: string;
  }) =>
    request<{ data: unknown }>(`/routers`, {
      method: "POST",
      body: JSON.stringify(params),
    }),

  updateRouter: (id: string, params: {
    name?: string;
    enabled?: boolean;
    rules?: string;
    default_receiver_team_id?: string;
    default_receiver_account_user_id?: string;
    default_receiver_router_id?: string;
  }) =>
    request<{ data: unknown }>(`/routers/${id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    }),

  deleteRouter: (id: string) =>
    request<{ data: unknown }>(`/routers/${id}`, { method: "DELETE" }),

  // ============================================================
  // Schedules
  // ============================================================

  listSchedules: (params?: PaginationParams) =>
    request<PaginatedResponse>(`/schedules?${paginationQuery(params)}`),

  getSchedule: (id: string) =>
    request<{ data: unknown }>(`/schedules/${id}`),

  createSchedule: (params: { name: string }) =>
    request<{ data: unknown }>(`/schedules`, {
      method: "POST",
      body: JSON.stringify(params),
    }),

  updateSchedule: (id: string, params: { name: string }) =>
    request<{ data: unknown }>(`/schedules/${id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    }),

  deleteSchedule: (id: string) =>
    request<{ data: unknown }>(`/schedules/${id}`, { method: "DELETE" }),

  flushSchedule: (id: string) =>
    request<{ data: unknown }>(`/schedules/${id}/flush`, { method: "DELETE" }),

  getScheduleCurrentOncall: (id: string) =>
    request<{ data: unknown[] }>(`/schedules/${id}/current_oncall`),

  getScheduleWindowEvents: (id: string, params: { start: string; end: string }) => {
    const query = new URLSearchParams({ start: params.start, end: params.end });
    return request<{ data: unknown[] }>(`/schedules/${id}/window_events?${query}`);
  },

  getScheduleEvents: (id: string) =>
    request<{ data: unknown[] }>(`/schedules/${id}/events`),

  // ============================================================
  // Teams
  // ============================================================

  listTeams: (params?: PaginationParams) =>
    request<PaginatedResponse>(`/teams?${paginationQuery(params)}`),

  getTeam: (id: string) =>
    request<{ data: unknown }>(`/teams/${id}`),

  createTeam: (params: {
    name: string;
    member_account_user_ids: string[];
    admin_account_user_ids: string[];
    notes?: string;
    drop_notifications?: "none" | "team_all" | "team_admins" | "oncall_rotation" | "specific_users";
    handoff_notifications?: "none" | "team_all" | "team_admins" | "oncall_rotation" | "specific_users";
    drop_notification_account_user_ids?: string[];
    handoff_notification_account_user_ids?: string[];
  }) =>
    request<{ data: unknown }>(`/teams`, {
      method: "POST",
      body: JSON.stringify(params),
    }),

  updateTeam: (id: string, params: {
    name?: string;
    notes?: string;
    escalation_policy_id?: string;
    schedule_id?: string;
    member_account_user_ids?: string[];
    admin_account_user_ids?: string[];
    drop_notifications?: "none" | "team_all" | "team_admins" | "oncall_rotation" | "specific_users";
    handoff_notifications?: "none" | "team_all" | "team_admins" | "oncall_rotation" | "specific_users";
    drop_notification_account_user_ids?: string[];
    handoff_notification_account_user_ids?: string[];
  }) =>
    request<{ data: unknown }>(`/teams/${id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    }),

  deleteTeam: (id: string) =>
    request<{ data: unknown }>(`/teams/${id}`, { method: "DELETE" }),

  getCurrentOncallForTeam: (teamId: string) =>
    request<{ data: unknown[] }>(`/teams/${teamId}/current_oncall`),

  listTeamAlerts: (id: string, params?: PaginationParams) =>
    request<PaginatedResponse>(`/teams/${id}/alerts?${paginationQuery(params)}`),

  // ============================================================
  // Users
  // ============================================================

  listUsers: (params?: PaginationParams) =>
    request<PaginatedResponse>(`/users?${paginationQuery(params)}`),

  getUser: (id: string) =>
    request<{ data: unknown }>(`/users/${id}`),

};