import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { registerListEscalationPolicies } from "../tools/list-escalation-policies.js";
import { registerGetEscalationPolicy } from "../tools/get-escalation-policy.js";
import { registerCreateEscalationPolicy } from "../tools/create-escalation-policy.js";
import { registerUpdateEscalationPolicy } from "../tools/update-escalation-policy.js";
import { registerDeleteEscalationPolicy } from "../tools/delete-escalation-policy.js";
import * as client from "../client.js";
import { createTestClient, parseResult } from "./test-helpers.js";

vi.mock("../client.js");

const mockPolicy = { id: "ep_123", name: "Default Policy" };

describe("escalation policies", () => {
  describe("list_escalation_policies", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListEscalationPolicies); });

    it("returns escalation policies", async () => {
      vi.spyOn(client.pagertree, "listEscalationPolicies").mockResolvedValue({ data: [mockPolicy], has_more: false, total_count: 1 });
      const result = parseResult(await mcpClient.callTool({ name: "list_escalation_policies", arguments: {} }));
      expect(result.data).toHaveLength(1);
    });
  });

  describe("get_escalation_policy", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetEscalationPolicy); });

    it("calls getEscalationPolicy with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getEscalationPolicy").mockResolvedValue({ data: mockPolicy });
      await mcpClient.callTool({ name: "get_escalation_policy", arguments: { id: "ep_123" } });
      expect(spy).toHaveBeenCalledWith("ep_123");
    });
  });

  describe("create_escalation_policy", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerCreateEscalationPolicy); });

    it("calls createEscalationPolicy with name", async () => {
      const spy = vi.spyOn(client.pagertree, "createEscalationPolicy").mockResolvedValue({ data: mockPolicy });
      await mcpClient.callTool({ name: "create_escalation_policy", arguments: { name: "New Policy" } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ name: "New Policy" }));
    });

    it("passes escalation layers", async () => {
      const spy = vi.spyOn(client.pagertree, "createEscalationPolicy").mockResolvedValue({ data: mockPolicy });
      await mcpClient.callTool({ name: "create_escalation_policy", arguments: {
        name: "Policy",
        escalation_layers_attributes: [{ layer: 1, timeout: 5, timeout_unit: "minute" }],
      }});
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        escalation_layers_attributes: [{ layer: 1, timeout: 5, timeout_unit: "minute" }],
      }));
    });
  });

  describe("update_escalation_policy", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerUpdateEscalationPolicy); });

    it("calls updateEscalationPolicy with id and fields", async () => {
      const spy = vi.spyOn(client.pagertree, "updateEscalationPolicy").mockResolvedValue({ data: mockPolicy });
      await mcpClient.callTool({ name: "update_escalation_policy", arguments: { id: "ep_123", name: "Updated Policy" } });
      expect(spy).toHaveBeenCalledWith("ep_123", expect.objectContaining({ name: "Updated Policy" }));
    });
  });

  describe("delete_escalation_policy", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerDeleteEscalationPolicy); });

    it("calls deleteEscalationPolicy with id", async () => {
      const spy = vi.spyOn(client.pagertree, "deleteEscalationPolicy").mockResolvedValue({ data: { id: "ep_123" } });
      await mcpClient.callTool({ name: "delete_escalation_policy", arguments: { id: "ep_123" } });
      expect(spy).toHaveBeenCalledWith("ep_123");
    });
  });
});
