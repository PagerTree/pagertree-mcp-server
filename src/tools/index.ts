import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAcknowledgeAlert } from "./acknowledge-alert.js";
import { registerAddEventException } from "./add-event-exception.js";
import { registerCreateAlert } from "./create-alert.js";
import { registerCreateEvent } from "./create-event.js";
import { registerCreateNotificationRule } from "./create-notification-rule.js";
import { registerDeleteEvent } from "./delete-event.js";
import { registerDeleteNotificationRule } from "./delete-notification-rule.js";
import { registerDisableIntegration } from "./disable-integration.js";
import { registerEnableIntegration } from "./enable-integration.js";
import { registerGetAccountUser } from "./get-account-user.js";
import { registerGetAlert } from "./get-alert.js";
import { registerGetCurrentOncall } from "./get-current-oncall.js";
import { registerGetEvent } from "./get-event.js";
import { registerGetIntegration } from "./get-integration.js";
import { registerGetLog } from "./get-log.js";
import { registerGetNotificationRule } from "./get-notification-rule.js";
import { registerGetUser } from "./get-user.js";
import { registerListAccountUsers } from "./list-account-users.js";
import { registerListAlerts } from "./list-alerts.js";
import { registerListEvents } from "./list-events.js";
import { registerListEventTimeZones } from "./list-event-time-zones.js";
import { registerListIntegrations } from "./list-integrations.js";
import { registerListLogs } from "./list-logs.js";
import { registerListNotificationRules } from "./list-notification-rules.js";
import { registerListSchedules } from "./list-schedules.js";
import { registerListTeams } from "./list-teams.js";
import { registerListUsers } from "./list-users.js";
import { registerOverrideEvent } from "./override-event.js";
import { registerRejectAlert } from "./reject-alert.js";
import { registerResolveAlert } from "./resolve-alert.js";
import { registerUpdateEvent } from "./update-event.js";
import { registerUpdateNotificationRule } from "./update-notification-rule.js";

const tools = [
  registerAcknowledgeAlert,
  registerAddEventException,
  registerCreateAlert,
  registerCreateEvent,
  registerCreateNotificationRule,
  registerDeleteEvent,
  registerDeleteNotificationRule,
  registerDisableIntegration,
  registerEnableIntegration,
  registerGetAccountUser,
  registerGetAlert,
  registerGetCurrentOncall,
  registerGetEvent,
  registerGetIntegration,
  registerGetLog,
  registerGetNotificationRule,
  registerGetUser,
  registerListAccountUsers,
  registerListAlerts,
  registerListEvents,
  registerListEventTimeZones,
  registerListIntegrations,
  registerListLogs,
  registerListNotificationRules,
  registerListSchedules,
  registerListTeams,
  registerListUsers,
  registerOverrideEvent,
  registerRejectAlert,
  registerResolveAlert,
  registerUpdateEvent,
  registerUpdateNotificationRule,
];

export function registerAllTools(server: McpServer) {
  tools.forEach(register => register(server));
}