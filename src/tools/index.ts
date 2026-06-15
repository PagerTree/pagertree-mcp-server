import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Account Users
import { registerListAccountUsers } from "./list-account-users.js";
import { registerGetAccountUser } from "./get-account-user.js";
import { registerCreateAccountUser } from "./create-account-user.js";
import { registerUpdateAccountUser } from "./update-account-user.js";
import { registerDeleteAccountUser } from "./delete-account-user.js";

// Alerts
import { registerListAlerts } from "./list-alerts.js";
import { registerGetAlert } from "./get-alert.js";
import { registerCreateAlert } from "./create-alert.js";
import { registerUpdateAlert } from "./update-alert.js";
import { registerDeleteAlert } from "./delete-alert.js";
import { registerAcknowledgeAlert } from "./acknowledge-alert.js";
import { registerRejectAlert } from "./reject-alert.js";
import { registerResolveAlert } from "./resolve-alert.js";
import { registerListAlertComments } from "./list-alert-comments.js";
import { registerCreateAlertComment } from "./create-alert-comment.js";

// Broadcasts
import { registerListBroadcasts } from "./list-broadcasts.js";
import { registerGetBroadcast } from "./get-broadcast.js";
import { registerCreateBroadcast } from "./create-broadcast.js";
import { registerUpdateBroadcast } from "./update-broadcast.js";
import { registerDeleteBroadcast } from "./delete-broadcast.js";
import { registerListBroadcastComments } from "./list-broadcast-comments.js";
import { registerCreateBroadcastComment } from "./create-broadcast-comment.js";

// Escalation Policies
import { registerListEscalationPolicies } from "./list-escalation-policies.js";
import { registerGetEscalationPolicy } from "./get-escalation-policy.js";
import { registerCreateEscalationPolicy } from "./create-escalation-policy.js";
import { registerUpdateEscalationPolicy } from "./update-escalation-policy.js";
import { registerDeleteEscalationPolicy } from "./delete-escalation-policy.js";

// Events
import { registerListEvents } from "./list-events.js";
import { registerGetEvent } from "./get-event.js";
import { registerCreateEvent } from "./create-event.js";
import { registerUpdateEvent } from "./update-event.js";
import { registerDeleteEvent } from "./delete-event.js";
import { registerOverrideEvent } from "./override-event.js";
import { registerTerminateEvent } from "./terminate-event.js";
import { registerAddEventException } from "./add-event-exception.js";
import { registerListEventTimeZones } from "./list-event-time-zones.js";

// Integrations
import { registerListIntegrations } from "./list-integrations.js";
import { registerGetIntegration } from "./get-integration.js";
import { registerCreateIntegration } from "./create-integration.js";
import { registerUpdateIntegration } from "./update-integration.js";
import { registerDeleteIntegration } from "./delete-integration.js";
import { registerEnableIntegration } from "./enable-integration.js";
import { registerDisableIntegration } from "./disable-integration.js";
import { registerListIntegrationTypes } from "./list-integration-types.js";
import { registerGetIntegrationType } from "./get-integration-type.js";

// Logs
import { registerListLogs } from "./list-logs.js";
import { registerGetLog } from "./get-log.js";

// Maintenance Windows
import { registerListMaintenanceWindows } from "./list-maintenance-windows.js";
import { registerGetMaintenanceWindow } from "./get-maintenance-window.js";
import { registerCreateMaintenanceWindow } from "./create-maintenance-window.js";
import { registerUpdateMaintenanceWindow } from "./update-maintenance-window.js";
import { registerDeleteMaintenanceWindow } from "./delete-maintenance-window.js";

// Notification Rules
import { registerListNotificationRules } from "./list-notification-rules.js";
import { registerGetNotificationRule } from "./get-notification-rule.js";
import { registerCreateNotificationRule } from "./create-notification-rule.js";
import { registerUpdateNotificationRule } from "./update-notification-rule.js";
import { registerDeleteNotificationRule } from "./delete-notification-rule.js";

// Routers
import { registerListRouters } from "./list-routers.js";
import { registerGetRouter } from "./get-router.js";
import { registerCreateRouter } from "./create-router.js";
import { registerUpdateRouter } from "./update-router.js";
import { registerDeleteRouter } from "./delete-router.js";

// Schedules
import { registerListSchedules } from "./list-schedules.js";
import { registerGetSchedule } from "./get-schedule.js";
import { registerCreateSchedule } from "./create-schedule.js";
import { registerUpdateSchedule } from "./update-schedule.js";
import { registerDeleteSchedule } from "./delete-schedule.js";
import { registerFlushSchedule } from "./flush-schedule.js";
import { registerGetScheduleCurrentOncall } from "./get-schedule-current-oncall.js";
import { registerGetScheduleWindowEvents } from "./get-schedule-window-events.js";
import { registerGetScheduleEvents } from "./get-schedule-events.js";

// Teams
import { registerListTeams } from "./list-teams.js";
import { registerGetTeam } from "./get-team.js";
import { registerCreateTeam } from "./create-team.js";
import { registerUpdateTeam } from "./update-team.js";
import { registerDeleteTeam } from "./delete-team.js";
import { registerGetCurrentOncall } from "./get-current-oncall.js";
import { registerListTeamAlerts } from "./list-team-alerts.js";

// Users
import { registerListUsers } from "./list-users.js";
import { registerGetUser } from "./get-user.js";

type ToolRegistrar = (server: McpServer) => void;
type TaggedTool = { fn: ToolRegistrar; readonly: boolean };

function parseBoolean(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined) return defaultValue;
  return ["true", "1", "yes"].includes(value.toLowerCase());
}

const tools: TaggedTool[] = [
  // Account Users
  { fn: registerListAccountUsers, readonly: true },
  { fn: registerGetAccountUser, readonly: true },
  { fn: registerCreateAccountUser, readonly: false },
  { fn: registerUpdateAccountUser, readonly: false },
  { fn: registerDeleteAccountUser, readonly: false },

  // Alerts
  { fn: registerListAlerts, readonly: true },
  { fn: registerGetAlert, readonly: true },
  { fn: registerCreateAlert, readonly: false },
  { fn: registerUpdateAlert, readonly: false },
  { fn: registerDeleteAlert, readonly: false },
  { fn: registerAcknowledgeAlert, readonly: false },
  { fn: registerRejectAlert, readonly: false },
  { fn: registerResolveAlert, readonly: false },
  { fn: registerListAlertComments, readonly: true },
  { fn: registerCreateAlertComment, readonly: false },

  // Broadcasts
  { fn: registerListBroadcasts, readonly: true },
  { fn: registerGetBroadcast, readonly: true },
  { fn: registerCreateBroadcast, readonly: false },
  { fn: registerUpdateBroadcast, readonly: false },
  { fn: registerDeleteBroadcast, readonly: false },
  { fn: registerListBroadcastComments, readonly: true },
  { fn: registerCreateBroadcastComment, readonly: false },

  // Escalation Policies
  { fn: registerListEscalationPolicies, readonly: true },
  { fn: registerGetEscalationPolicy, readonly: true },
  { fn: registerCreateEscalationPolicy, readonly: false },
  { fn: registerUpdateEscalationPolicy, readonly: false },
  { fn: registerDeleteEscalationPolicy, readonly: false },

  // Events
  { fn: registerListEvents, readonly: true },
  { fn: registerGetEvent, readonly: true },
  { fn: registerCreateEvent, readonly: false },
  { fn: registerUpdateEvent, readonly: false },
  { fn: registerDeleteEvent, readonly: false },
  { fn: registerOverrideEvent, readonly: false },
  { fn: registerTerminateEvent, readonly: false },
  { fn: registerAddEventException, readonly: false },
  { fn: registerListEventTimeZones, readonly: true },

  // Integrations
  { fn: registerListIntegrations, readonly: true },
  { fn: registerGetIntegration, readonly: true },
  { fn: registerCreateIntegration, readonly: false },
  { fn: registerUpdateIntegration, readonly: false },
  { fn: registerDeleteIntegration, readonly: false },
  { fn: registerEnableIntegration, readonly: false },
  { fn: registerDisableIntegration, readonly: false },
  { fn: registerListIntegrationTypes, readonly: true },
  { fn: registerGetIntegrationType, readonly: true },

  // Logs
  { fn: registerListLogs, readonly: true },
  { fn: registerGetLog, readonly: true },

  // Maintenance Windows
  { fn: registerListMaintenanceWindows, readonly: true },
  { fn: registerGetMaintenanceWindow, readonly: true },
  { fn: registerCreateMaintenanceWindow, readonly: false },
  { fn: registerUpdateMaintenanceWindow, readonly: false },
  { fn: registerDeleteMaintenanceWindow, readonly: false },

  // Notification Rules
  { fn: registerListNotificationRules, readonly: true },
  { fn: registerGetNotificationRule, readonly: true },
  { fn: registerCreateNotificationRule, readonly: false },
  { fn: registerUpdateNotificationRule, readonly: false },
  { fn: registerDeleteNotificationRule, readonly: false },

  // Routers
  { fn: registerListRouters, readonly: true },
  { fn: registerGetRouter, readonly: true },
  { fn: registerCreateRouter, readonly: false },
  { fn: registerUpdateRouter, readonly: false },
  { fn: registerDeleteRouter, readonly: false },

  // Schedules
  { fn: registerListSchedules, readonly: true },
  { fn: registerGetSchedule, readonly: true },
  { fn: registerCreateSchedule, readonly: false },
  { fn: registerUpdateSchedule, readonly: false },
  { fn: registerDeleteSchedule, readonly: false },
  { fn: registerFlushSchedule, readonly: false },
  { fn: registerGetScheduleCurrentOncall, readonly: true },
  { fn: registerGetScheduleWindowEvents, readonly: true },
  { fn: registerGetScheduleEvents, readonly: true },

  // Teams
  { fn: registerListTeams, readonly: true },
  { fn: registerGetTeam, readonly: true },
  { fn: registerCreateTeam, readonly: false },
  { fn: registerUpdateTeam, readonly: false },
  { fn: registerDeleteTeam, readonly: false },
  { fn: registerGetCurrentOncall, readonly: true },
  { fn: registerListTeamAlerts, readonly: true },

  // Users
  { fn: registerListUsers, readonly: true },
  { fn: registerGetUser, readonly: true },
];

export function registerAllTools(server: McpServer) {
  const readOnly = parseBoolean(process.env.PAGERTREE_READ_ONLY, true);
  const active = readOnly ? tools.filter(t => t.readonly) : tools;

  if (readOnly) {
    console.error("PagerTree MCP running in READ-ONLY mode");
  }

  active.forEach(t => t.fn(server));
}