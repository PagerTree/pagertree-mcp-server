import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Account Users
import { registerGetAccountUser } from "./get-account-user.js";
import { registerListAccountUsers } from "./list-account-users.js";
import { registerCreateAccountUser } from "./create-account-user.js";
import { registerUpdateAccountUser } from "./update-account-user.js";
import { registerDeleteAccountUser } from "./delete-account-user.js";

// Alerts
import { registerAcknowledgeAlert } from "./acknowledge-alert.js";
import { registerCreateAlert } from "./create-alert.js";
import { registerCreateAlertComment } from "./create-alert-comment.js";
import { registerGetAlert } from "./get-alert.js";
import { registerListAlertComments } from "./list-alert-comments.js";
import { registerListAlerts } from "./list-alerts.js";
import { registerRejectAlert } from "./reject-alert.js";
import { registerResolveAlert } from "./resolve-alert.js";
import { registerUpdateAlert } from "./update-alert.js";
import { registerDeleteAlert } from "./delete-alert.js";

// Broadcasts
import { registerCreateBroadcast } from "./create-broadcast.js";
import { registerCreateBroadcastComment } from "./create-broadcast-comment.js";
import { registerDeleteBroadcast } from "./delete-broadcast.js";
import { registerGetBroadcast } from "./get-broadcast.js";
import { registerListBroadcastComments } from "./list-broadcast-comments.js";
import { registerListBroadcasts } from "./list-broadcasts.js";
import { registerUpdateBroadcast } from "./update-broadcast.js";

// Escalation Policies
import { registerCreateEscalationPolicy } from "./create-escalation-policy.js";
import { registerDeleteEscalationPolicy } from "./delete-escalation-policy.js";
import { registerGetEscalationPolicy } from "./get-escalation-policy.js";
import { registerListEscalationPolicies } from "./list-escalation-policies.js";
import { registerUpdateEscalationPolicy } from "./update-escalation-policy.js";

// Events
import { registerAddEventException } from "./add-event-exception.js";
import { registerCreateEvent } from "./create-event.js";
import { registerDeleteEvent } from "./delete-event.js";
import { registerGetEvent } from "./get-event.js";
import { registerListEventTimeZones } from "./list-event-time-zones.js";
import { registerListEvents } from "./list-events.js";
import { registerOverrideEvent } from "./override-event.js";
import { registerUpdateEvent } from "./update-event.js";
import { registerTerminateEvent } from "./terminate-event.js";

// Integrations
import { registerDisableIntegration } from "./disable-integration.js";
import { registerEnableIntegration } from "./enable-integration.js";
import { registerGetIntegration } from "./get-integration.js";
import { registerListIntegrations } from "./list-integrations.js";
import { registerCreateIntegration } from "./create-integration.js";
import { registerUpdateIntegration } from "./update-integration.js";
import { registerDeleteIntegration } from "./delete-integration.js";
import { registerListIntegrationTypes } from "./list-integration-types.js";
import { registerGetIntegrationType } from "./get-integration-type.js";

// Logs
import { registerGetLog } from "./get-log.js";
import { registerListLogs } from "./list-logs.js";

// Maintenance Windows
import { registerCreateMaintenanceWindow } from "./create-maintenance-window.js";
import { registerDeleteMaintenanceWindow } from "./delete-maintenance-window.js";
import { registerGetMaintenanceWindow } from "./get-maintenance-window.js";
import { registerListMaintenanceWindows } from "./list-maintenance-windows.js";
import { registerUpdateMaintenanceWindow } from "./update-maintenance-window.js";

// Notification Rules
import { registerCreateNotificationRule } from "./create-notification-rule.js";
import { registerDeleteNotificationRule } from "./delete-notification-rule.js";
import { registerGetNotificationRule } from "./get-notification-rule.js";
import { registerListNotificationRules } from "./list-notification-rules.js";
import { registerUpdateNotificationRule } from "./update-notification-rule.js";

// Routers
import { registerCreateRouter } from "./create-router.js";
import { registerDeleteRouter } from "./delete-router.js";
import { registerGetRouter } from "./get-router.js";
import { registerListRouters } from "./list-routers.js";
import { registerUpdateRouter } from "./update-router.js";

// Schedules
import { registerCreateSchedule } from "./create-schedule.js";
import { registerDeleteSchedule } from "./delete-schedule.js";
import { registerFlushSchedule } from "./flush-schedule.js";
import { registerGetSchedule } from "./get-schedule.js";
import { registerGetScheduleCurrentOncall } from "./get-schedule-current-oncall.js";
import { registerGetScheduleEvents } from "./get-schedule-events.js";
import { registerGetScheduleWindowEvents } from "./get-schedule-window-events.js";
import { registerListSchedules } from "./list-schedules.js";
import { registerUpdateSchedule } from "./update-schedule.js";

// Teams
import { registerCreateTeam } from "./create-team.js";
import { registerDeleteTeam } from "./delete-team.js";
import { registerGetCurrentOncall } from "./get-current-oncall.js";
import { registerGetTeam } from "./get-team.js";
import { registerListTeamAlerts } from "./list-team-alerts.js";
import { registerListTeams } from "./list-teams.js";
import { registerUpdateTeam } from "./update-team.js";

// Users
import { registerGetUser } from "./get-user.js";
import { registerListUsers } from "./list-users.js";

type ToolRegistrar = (server: McpServer) => void;
type TaggedTool = { fn: ToolRegistrar; readonly: boolean };

function parseBoolean(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined) return defaultValue;
  return ["true", "1", "yes"].includes(value.toLowerCase());
}

const tools: TaggedTool[] = [
  // Account Users
  { fn: registerGetAccountUser, readonly: true },
  { fn: registerListAccountUsers, readonly: true },
  { fn: registerCreateAccountUser, readonly: false },
  { fn: registerUpdateAccountUser, readonly: false },
  { fn: registerDeleteAccountUser, readonly: false },

  // Alerts
  { fn: registerAcknowledgeAlert, readonly: false },
  { fn: registerCreateAlert, readonly: false },
  { fn: registerCreateAlertComment, readonly: false },
  { fn: registerGetAlert, readonly: true },
  { fn: registerListAlertComments, readonly: true },
  { fn: registerListAlerts, readonly: true },
  { fn: registerRejectAlert, readonly: false },
  { fn: registerResolveAlert, readonly: false },
  { fn: registerUpdateAlert, readonly: false },
  { fn: registerDeleteAlert, readonly: false },

  // Broadcasts
  { fn: registerCreateBroadcast, readonly: false },
  { fn: registerCreateBroadcastComment, readonly: false },
  { fn: registerDeleteBroadcast, readonly: false },
  { fn: registerGetBroadcast, readonly: true },
  { fn: registerListBroadcastComments, readonly: true },
  { fn: registerListBroadcasts, readonly: true },
  { fn: registerUpdateBroadcast, readonly: false },

  // Escalation Policies
  { fn: registerCreateEscalationPolicy, readonly: false },
  { fn: registerDeleteEscalationPolicy, readonly: false },
  { fn: registerGetEscalationPolicy, readonly: true },
  { fn: registerListEscalationPolicies, readonly: true },
  { fn: registerUpdateEscalationPolicy, readonly: false },

  // Events
  { fn: registerAddEventException, readonly: false },
  { fn: registerCreateEvent, readonly: false },
  { fn: registerDeleteEvent, readonly: false },
  { fn: registerGetEvent, readonly: true },
  { fn: registerListEventTimeZones, readonly: true },
  { fn: registerListEvents, readonly: true },
  { fn: registerOverrideEvent, readonly: false },
  { fn: registerUpdateEvent, readonly: false },
  { fn: registerTerminateEvent, readonly: false },

  // Integrations
  { fn: registerDisableIntegration, readonly: false },
  { fn: registerEnableIntegration, readonly: false },
  { fn: registerGetIntegration, readonly: true },
  { fn: registerListIntegrations, readonly: true },
  { fn: registerCreateIntegration, readonly: false },
  { fn: registerUpdateIntegration, readonly: false },
  { fn: registerDeleteIntegration, readonly: false },
  { fn: registerListIntegrationTypes, readonly: true },
  { fn: registerGetIntegrationType, readonly: true },

  // Logs
  { fn: registerGetLog, readonly: true },
  { fn: registerListLogs, readonly: true },

  // Maintenance Windows
  { fn: registerCreateMaintenanceWindow, readonly: false },
  { fn: registerDeleteMaintenanceWindow, readonly: false },
  { fn: registerGetMaintenanceWindow, readonly: true },
  { fn: registerListMaintenanceWindows, readonly: true },
  { fn: registerUpdateMaintenanceWindow, readonly: false },

  // Notification Rules
  { fn: registerCreateNotificationRule, readonly: false },
  { fn: registerDeleteNotificationRule, readonly: false },
  { fn: registerGetNotificationRule, readonly: true },
  { fn: registerListNotificationRules, readonly: true },
  { fn: registerUpdateNotificationRule, readonly: false },

  // Routers
  { fn: registerCreateRouter, readonly: false },
  { fn: registerDeleteRouter, readonly: false },
  { fn: registerGetRouter, readonly: true },
  { fn: registerListRouters, readonly: true },
  { fn: registerUpdateRouter, readonly: false },

  // Schedules
  { fn: registerCreateSchedule, readonly: false },
  { fn: registerDeleteSchedule, readonly: false },
  { fn: registerFlushSchedule, readonly: false },
  { fn: registerGetSchedule, readonly: true },
  { fn: registerGetScheduleCurrentOncall, readonly: true },
  { fn: registerGetScheduleEvents, readonly: true },
  { fn: registerGetScheduleWindowEvents, readonly: true },
  { fn: registerListSchedules, readonly: true },
  { fn: registerUpdateSchedule, readonly: false },

  // Teams
  { fn: registerCreateTeam, readonly: false },
  { fn: registerDeleteTeam, readonly: false },
  { fn: registerGetCurrentOncall, readonly: true },
  { fn: registerGetTeam, readonly: true },
  { fn: registerListTeamAlerts, readonly: true },
  { fn: registerListTeams, readonly: true },
  { fn: registerUpdateTeam, readonly: false },

  // Users
  { fn: registerGetUser, readonly: true },
  { fn: registerListUsers, readonly: true },
];

export function registerAllTools(server: McpServer) {
  const readOnly = parseBoolean(process.env.PAGERTREE_READ_ONLY, true);
  const active = readOnly ? tools.filter(t => t.readonly) : tools;

  if (readOnly) {
    console.error("PagerTree MCP running in READ-ONLY mode");
  }

  active.forEach(t => t.fn(server));
}