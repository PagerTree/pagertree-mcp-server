import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { registerListTeams } from "../tools/list-teams.js";
import { registerGetTeam } from "../tools/get-team.js";
import { registerCreateTeam } from "../tools/create-team.js";
import { registerUpdateTeam } from "../tools/update-team.js";
import { registerDeleteTeam } from "../tools/delete-team.js";
import { registerGetCurrentOncall } from "../tools/get-current-oncall.js";
import { registerListTeamAlerts } from "../tools/list-team-alerts.js";
import * as client from "../client.js";
import { createTestClient, parseResult } from "./test-helpers.js";

vi.mock("../client.js");

const mockTeam = { id: "tem_123", name: "Engineering" };

describe("teams", () => {
  describe("list_teams", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListTeams); });

    it("returns teams", async () => {
      vi.spyOn(client.pagertree, "listTeams").mockResolvedValue({ data: [mockTeam], has_more: false, total_count: 1 });
      const result = parseResult(await mcpClient.callTool({ name: "list_teams", arguments: {} }));
      expect(result.data).toHaveLength(1);
    });

    it("passes pagination params", async () => {
      const spy = vi.spyOn(client.pagertree, "listTeams").mockResolvedValue({ data: [], has_more: false, total_count: 0 });
      await mcpClient.callTool({ name: "list_teams", arguments: { limit: 5 } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ limit: 5 }));
    });
  });

  describe("get_team", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetTeam); });

    it("calls getTeam with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getTeam").mockResolvedValue({ data: mockTeam });
      await mcpClient.callTool({ name: "get_team", arguments: { id: "tem_123" } });
      expect(spy).toHaveBeenCalledWith("tem_123");
    });

    it("returns team data", async () => {
      vi.spyOn(client.pagertree, "getTeam").mockResolvedValue({ data: mockTeam });
      const result = parseResult(await mcpClient.callTool({ name: "get_team", arguments: { id: "tem_123" } }));
      expect(result.data.name).toBe("Engineering");
    });
  });

  describe("create_team", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerCreateTeam); });

    it("calls createTeam with required fields", async () => {
      const spy = vi.spyOn(client.pagertree, "createTeam").mockResolvedValue({ data: mockTeam });
      await mcpClient.callTool({ name: "create_team", arguments: {
        name: "Engineering",
        member_account_user_ids: ["au_123"],
        admin_account_user_ids: ["au_123"],
      }});
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        name: "Engineering",
        member_account_user_ids: ["au_123"],
        admin_account_user_ids: ["au_123"],
      }));
    });

    it("passes drop_notifications setting", async () => {
      const spy = vi.spyOn(client.pagertree, "createTeam").mockResolvedValue({ data: mockTeam });
      await mcpClient.callTool({ name: "create_team", arguments: {
        name: "Engineering",
        member_account_user_ids: ["au_123"],
        admin_account_user_ids: ["au_123"],
        drop_notifications: "team_admins",
      }});
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ drop_notifications: "team_admins" }));
    });
  });

  describe("update_team", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerUpdateTeam); });

    it("calls updateTeam with id and fields", async () => {
      const spy = vi.spyOn(client.pagertree, "updateTeam").mockResolvedValue({ data: mockTeam });
      await mcpClient.callTool({ name: "update_team", arguments: { id: "tem_123", name: "Platform Engineering" } });
      expect(spy).toHaveBeenCalledWith("tem_123", expect.objectContaining({ name: "Platform Engineering" }));
    });

    it("passes schedule_id when switching schedule", async () => {
      const spy = vi.spyOn(client.pagertree, "updateTeam").mockResolvedValue({ data: mockTeam });
      await mcpClient.callTool({ name: "update_team", arguments: { id: "tem_123", schedule_id: "sch_456" } });
      expect(spy).toHaveBeenCalledWith("tem_123", expect.objectContaining({ schedule_id: "sch_456" }));
    });

    it("passes escalation_policy_id when switching policy", async () => {
      const spy = vi.spyOn(client.pagertree, "updateTeam").mockResolvedValue({ data: mockTeam });
      await mcpClient.callTool({ name: "update_team", arguments: { id: "tem_123", escalation_policy_id: "ep_456" } });
      expect(spy).toHaveBeenCalledWith("tem_123", expect.objectContaining({ escalation_policy_id: "ep_456" }));
    });
  });

  describe("delete_team", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerDeleteTeam); });

    it("calls deleteTeam with id", async () => {
      const spy = vi.spyOn(client.pagertree, "deleteTeam").mockResolvedValue({ data: { id: "tem_123" } });
      await mcpClient.callTool({ name: "delete_team", arguments: { id: "tem_123" } });
      expect(spy).toHaveBeenCalledWith("tem_123");
    });
  });

  describe("get_current_oncall", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetCurrentOncall); });

    it("calls getCurrentOncallForTeam with team_id", async () => {
      const spy = vi.spyOn(client.pagertree, "getCurrentOncallForTeam").mockResolvedValue({ data: [{ id: "au_123" }] });
      await mcpClient.callTool({ name: "get_current_oncall", arguments: { team_id: "tem_123" } });
      expect(spy).toHaveBeenCalledWith("tem_123");
    });

    it("returns oncall users", async () => {
      vi.spyOn(client.pagertree, "getCurrentOncallForTeam").mockResolvedValue({ data: [{ id: "au_123", name: "Alice" }] });
      const result = parseResult(await mcpClient.callTool({ name: "get_current_oncall", arguments: { team_id: "tem_123" } }));
      expect(result.data).toHaveLength(1);
    });
  });

  describe("list_team_alerts", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListTeamAlerts); });

    it("calls listTeamAlerts with team id", async () => {
      const spy = vi.spyOn(client.pagertree, "listTeamAlerts").mockResolvedValue({ data: [], has_more: false, total_count: 0 });
      await mcpClient.callTool({ name: "list_team_alerts", arguments: { id: "tem_123" } });
      expect(spy).toHaveBeenCalledWith("tem_123", expect.any(Object));
    });

    it("passes pagination params", async () => {
      const spy = vi.spyOn(client.pagertree, "listTeamAlerts").mockResolvedValue({ data: [], has_more: false, total_count: 0 });
      await mcpClient.callTool({ name: "list_team_alerts", arguments: { id: "tem_123", limit: 5 } });
      expect(spy).toHaveBeenCalledWith("tem_123", expect.objectContaining({ limit: 5 }));
    });
  });
});
