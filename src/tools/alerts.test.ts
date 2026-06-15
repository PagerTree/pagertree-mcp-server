import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { registerListAlerts } from "../tools/list-alerts.js";
import { registerGetAlert } from "../tools/get-alert.js";
import { registerCreateAlert } from "../tools/create-alert.js";
import { registerUpdateAlert } from "../tools/update-alert.js";
import { registerDeleteAlert } from "../tools/delete-alert.js";
import { registerAcknowledgeAlert } from "../tools/acknowledge-alert.js";
import { registerRejectAlert } from "../tools/reject-alert.js";
import { registerResolveAlert } from "../tools/resolve-alert.js";
import { registerListAlertComments } from "../tools/list-alert-comments.js";
import { registerCreateAlertComment } from "../tools/create-alert-comment.js";
import * as client from "../client.js";
import { createTestClient, parseResult } from "./test-helpers.js";

vi.mock("../client.js");

const mockAlert = { id: "alt_123", title: "Test Alert", status: "open", urgency: "high" };

describe("alerts", () => {
  describe("list_alerts", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListAlerts); });

    it("returns alerts", async () => {
      vi.spyOn(client.pagertree, "listAlerts").mockResolvedValue({ data: [mockAlert], has_more: false, total_count: 1 });
      const result = parseResult(await mcpClient.callTool({ name: "list_alerts", arguments: {} }));
      expect((result as any).data).toHaveLength(1);
    });

    it("passes status filter", async () => {
      const spy = vi.spyOn(client.pagertree, "listAlerts").mockResolvedValue({ data: [], has_more: false, total_count: 0 });
      await mcpClient.callTool({ name: "list_alerts", arguments: { status: "open" } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ status: "open" }));
    });

    it("passes limit", async () => {
      const spy = vi.spyOn(client.pagertree, "listAlerts").mockResolvedValue({ data: [], has_more: false, total_count: 0 });
      await mcpClient.callTool({ name: "list_alerts", arguments: { limit: 25 } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ limit: 25 }));
    });
  });

  describe("get_alert", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetAlert); });

    it("calls getAlert with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getAlert").mockResolvedValue({ data: mockAlert });
      await mcpClient.callTool({ name: "get_alert", arguments: { id: "alt_123" } });
      expect(spy).toHaveBeenCalledWith("alt_123");
    });

    it("returns alert data", async () => {
      vi.spyOn(client.pagertree, "getAlert").mockResolvedValue({ data: mockAlert });
      const result = parseResult(await mcpClient.callTool({ name: "get_alert", arguments: { id: "alt_123" } }));
      expect((result as any).data.title).toBe("Test Alert");
    });
  });

  describe("create_alert", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerCreateAlert); });

    it("calls createAlert with required fields", async () => {
      const spy = vi.spyOn(client.pagertree, "createAlert").mockResolvedValue({ data: mockAlert });
      await mcpClient.callTool({ name: "create_alert", arguments: { title: "Test Alert", urgency: "high", destination_team_ids: ["tem_123"] } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ title: "Test Alert", urgency: "high" }));
    });

    it("includes incident fields when provided", async () => {
      const spy = vi.spyOn(client.pagertree, "createAlert").mockResolvedValue({ data: mockAlert });
      await mcpClient.callTool({ name: "create_alert", arguments: { title: "Test Alert", urgency: "critical", destination_team_ids: ["tem_123"], incident: true, incident_severity: "SEV-1" } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        meta: expect.objectContaining({ incident: true, incident_severity: "SEV-1" }),
      }));
    });
  });

  describe("update_alert", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerUpdateAlert); });

    it("calls updateAlert with id and fields", async () => {
      const spy = vi.spyOn(client.pagertree, "updateAlert").mockResolvedValue({ data: mockAlert });
      await mcpClient.callTool({ name: "update_alert", arguments: { id: "alt_123", title: "Updated Title" } });
      expect(spy).toHaveBeenCalledWith("alt_123", expect.objectContaining({ title: "Updated Title" }));
    });
  });

  describe("delete_alert", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerDeleteAlert); });

    it("calls deleteAlert with id", async () => {
      const spy = vi.spyOn(client.pagertree, "deleteAlert").mockResolvedValue({ data: { id: "alt_123" } });
      await mcpClient.callTool({ name: "delete_alert", arguments: { id: "alt_123" } });
      expect(spy).toHaveBeenCalledWith("alt_123");
    });
  });

  describe("acknowledge_alert", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerAcknowledgeAlert); });

    it("calls acknowledgeAlert then getAlert", async () => {
      const ackSpy = vi.spyOn(client.pagertree, "acknowledgeAlert").mockResolvedValue({ data: mockAlert });
      const getSpy = vi.spyOn(client.pagertree, "getAlert").mockResolvedValue({ data: { ...mockAlert, status: "acknowledged" } });
      await mcpClient.callTool({ name: "acknowledge_alert", arguments: { id: "alt_123" } });
      expect(ackSpy).toHaveBeenCalledWith("alt_123");
      expect(getSpy).toHaveBeenCalledWith("alt_123");
    });

    it("returns fresh state from getAlert not acknowledgeAlert response", async () => {
      vi.spyOn(client.pagertree, "acknowledgeAlert").mockResolvedValue({ data: mockAlert });
      vi.spyOn(client.pagertree, "getAlert").mockResolvedValue({ data: { ...mockAlert, status: "acknowledged" } });
      const result = parseResult(await mcpClient.callTool({ name: "acknowledge_alert", arguments: { id: "alt_123" } }));
      expect((result as any).data.status).toBe("acknowledged");
    });
  });

  describe("reject_alert", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerRejectAlert); });

    it("calls rejectAlert then getAlert", async () => {
      const rejectSpy = vi.spyOn(client.pagertree, "rejectAlert").mockResolvedValue({ data: mockAlert });
      const getSpy = vi.spyOn(client.pagertree, "getAlert").mockResolvedValue({ data: { ...mockAlert, status: "rejected" } });
      await mcpClient.callTool({ name: "reject_alert", arguments: { id: "alt_123" } });
      expect(rejectSpy).toHaveBeenCalledWith("alt_123");
      expect(getSpy).toHaveBeenCalledWith("alt_123");
    });
  });

  describe("resolve_alert", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerResolveAlert); });

    it("calls resolveAlert then getAlert", async () => {
      const resolveSpy = vi.spyOn(client.pagertree, "resolveAlert").mockResolvedValue({ data: mockAlert });
      const getSpy = vi.spyOn(client.pagertree, "getAlert").mockResolvedValue({ data: { ...mockAlert, status: "resolved" } });
      await mcpClient.callTool({ name: "resolve_alert", arguments: { id: "alt_123" } });
      expect(resolveSpy).toHaveBeenCalledWith("alt_123");
      expect(getSpy).toHaveBeenCalledWith("alt_123");
    });
  });

  describe("list_alert_comments", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListAlertComments); });

    it("calls listAlertComments with alert id", async () => {
      const spy = vi.spyOn(client.pagertree, "listAlertComments").mockResolvedValue({ data: [] });
      await mcpClient.callTool({ name: "list_alert_comments", arguments: { id: "alt_123" } });
      expect(spy).toHaveBeenCalledWith("alt_123");
    });
  });

  describe("create_alert_comment", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerCreateAlertComment); });

    it("calls createAlertComment with id and body", async () => {
      const spy = vi.spyOn(client.pagertree, "createAlertComment").mockResolvedValue({ data: { id: "com_123" } });
      await mcpClient.callTool({ name: "create_alert_comment", arguments: { id: "alt_123", body: "Looking into this now" } });
      expect(spy).toHaveBeenCalledWith("alt_123", "Looking into this now");
    });
  });
});
