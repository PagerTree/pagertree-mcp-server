import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerDisableIntegration } from "./disable-integration.js";
import { registerEnableIntegration } from "./enable-integration.js";
import { registerGetAccountUser } from "./get-account-user.js";
import { registerGetAlert } from "./get-alert.js";
import { registerGetCurrentOncall } from "./get-current-oncall.js";
import { registerGetIntegration } from "./get-integration.js";
import { registerGetLog } from "./get-log.js";
import { registerGetUser } from "./get-user.js";
import { registerListAccountUsers } from "./list-account-users.js";
import { registerListAlerts } from "./list-alerts.js";
import { registerListIntegrations } from "./list-integrations.js";
import { registerListLogs } from "./list-logs.js";
import { registerListSchedules } from "./list-schedules.js";
import { registerListTeams } from "./list-teams.js";
import { registerListUsers } from "./list-users.js";
// import { registerAcknowledgeAlert } from "./acknowledge-alert.js";
// import { registerResolveAlert } from "./resolve-alert.js";

const tools = [
  registerDisableIntegration,
  registerEnableIntegration,
  registerGetAccountUser,
  registerGetAlert,
  registerGetCurrentOncall,
  registerGetIntegration,
  registerGetLog,
  registerGetUser,
  registerListAccountUsers,
  registerListAlerts,
  registerListIntegrations,
  registerListLogs,
  registerListSchedules,
  registerListTeams,
  registerListUsers,
  // registerAcknowledgeAlert,
  // registerResolveAlert,
];

export function registerAllTools(server: McpServer) {
  tools.forEach(register => register(server));
}