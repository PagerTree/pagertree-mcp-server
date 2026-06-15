import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { registerListNotificationRules } from "../tools/list-notification-rules.js";
import { registerGetNotificationRule } from "../tools/get-notification-rule.js";
import { registerCreateNotificationRule } from "../tools/create-notification-rule.js";
import { registerUpdateNotificationRule } from "../tools/update-notification-rule.js";
import { registerDeleteNotificationRule } from "../tools/delete-notification-rule.js";
import * as client from "../client.js";
import { createTestClient, parseResult } from "./test-helpers.js";

vi.mock("../client.js");

const mockRule = { id: "nr_123", name: "Default Rule" };
const sampleYaml = `---\nrules:\n  - match:\n      always: true\n    actions:\n    - type: notify\n      channels:\n      - email\n      timeout: 1m\n`;

describe("notification rules", () => {
  describe("list_notification_rules", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListNotificationRules); });

    it("returns notification rules", async () => {
      vi.spyOn(client.pagertree, "listNotificationRules").mockResolvedValue({ data: [mockRule], has_more: false, total_count: 1 });
      const result = parseResult(await mcpClient.callTool({ name: "list_notification_rules", arguments: {} }));
      expect(result.data).toHaveLength(1);
    });
  });

  describe("get_notification_rule", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetNotificationRule); });

    it("calls getNotificationRule with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getNotificationRule").mockResolvedValue({ data: mockRule });
      await mcpClient.callTool({ name: "get_notification_rule", arguments: { id: "nr_123" } });
      expect(spy).toHaveBeenCalledWith("nr_123");
    });
  });

  describe("create_notification_rule", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerCreateNotificationRule); });

    it("calls createNotificationRule with name and rules", async () => {
      const spy = vi.spyOn(client.pagertree, "createNotificationRule").mockResolvedValue({ data: mockRule });
      await mcpClient.callTool({ name: "create_notification_rule", arguments: { name: "My Rule", rules: sampleYaml } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ name: "My Rule", rules: sampleYaml }));
    });

    it("passes enabled flag", async () => {
      const spy = vi.spyOn(client.pagertree, "createNotificationRule").mockResolvedValue({ data: mockRule });
      await mcpClient.callTool({ name: "create_notification_rule", arguments: { name: "My Rule", enabled: false } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
    });
  });

  describe("update_notification_rule", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerUpdateNotificationRule); });

    it("calls updateNotificationRule with id and fields", async () => {
      const spy = vi.spyOn(client.pagertree, "updateNotificationRule").mockResolvedValue({ data: mockRule });
      await mcpClient.callTool({ name: "update_notification_rule", arguments: { id: "nr_123", name: "Updated Rule" } });
      expect(spy).toHaveBeenCalledWith("nr_123", expect.objectContaining({ name: "Updated Rule" }));
    });

    it("passes updated yaml rules", async () => {
      const spy = vi.spyOn(client.pagertree, "updateNotificationRule").mockResolvedValue({ data: mockRule });
      await mcpClient.callTool({ name: "update_notification_rule", arguments: { id: "nr_123", rules: sampleYaml } });
      expect(spy).toHaveBeenCalledWith("nr_123", expect.objectContaining({ rules: sampleYaml }));
    });
  });

  describe("delete_notification_rule", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerDeleteNotificationRule); });

    it("calls deleteNotificationRule with id", async () => {
      const spy = vi.spyOn(client.pagertree, "deleteNotificationRule").mockResolvedValue({ data: { id: "nr_123" } });
      await mcpClient.callTool({ name: "delete_notification_rule", arguments: { id: "nr_123" } });
      expect(spy).toHaveBeenCalledWith("nr_123");
    });
  });
});
