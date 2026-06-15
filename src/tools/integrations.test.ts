import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { registerListIntegrations } from "../tools/list-integrations.js";
import { registerGetIntegration } from "../tools/get-integration.js";
import { registerCreateIntegration } from "../tools/create-integration.js";
import { registerUpdateIntegration } from "../tools/update-integration.js";
import { registerDeleteIntegration } from "../tools/delete-integration.js";
import { registerEnableIntegration } from "../tools/enable-integration.js";
import { registerDisableIntegration } from "../tools/disable-integration.js";
import { registerListIntegrationTypes } from "../tools/list-integration-types.js";
import { registerGetIntegrationType } from "../tools/get-integration-type.js";
import * as client from "../client.js";
import { createTestClient, parseResult } from "./test-helpers.js";

vi.mock("../client.js");

const mockIntegration = { id: "int_123", name: "Test Integration", enabled: true };

describe("integrations", () => {
  describe("list_integrations", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListIntegrations); });

    it("returns integrations", async () => {
      vi.spyOn(client.pagertree, "listIntegrations").mockResolvedValue({ data: [mockIntegration], has_more: false, total_count: 1 });
      const result = parseResult(await mcpClient.callTool({ name: "list_integrations", arguments: {} }));
      expect(result.data).toHaveLength(1);
    });
  });

  describe("get_integration", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetIntegration); });

    it("calls getIntegration with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getIntegration").mockResolvedValue({ data: mockIntegration });
      await mcpClient.callTool({ name: "get_integration", arguments: { id: "int_123" } });
      expect(spy).toHaveBeenCalledWith("int_123");
    });
  });

  describe("create_integration", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerCreateIntegration); });

    it("calls createIntegration with required fields", async () => {
      const spy = vi.spyOn(client.pagertree, "createIntegration").mockResolvedValue({ data: mockIntegration });
      await mcpClient.callTool({ name: "create_integration", arguments: {
        name: "Test Integration",
        urgency: "high",
        integration_type_id: "it_123",
        team_ids: ["tem_123"],
      }});
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        name: "Test Integration",
        urgency: "high",
        integration_type_id: "it_123",
      }));
    });

    it("spreads options into request", async () => {
      const spy = vi.spyOn(client.pagertree, "createIntegration").mockResolvedValue({ data: mockIntegration });
      await mcpClient.callTool({ name: "create_integration", arguments: {
        name: "Test",
        urgency: "high",
        integration_type_id: "it_123",
        team_ids: ["tem_123"],
        options: { option_send_resolved: true },
      }});
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ option_send_resolved: true }));
    });
  });

  describe("update_integration", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerUpdateIntegration); });

    it("calls updateIntegration with id and fields", async () => {
      const spy = vi.spyOn(client.pagertree, "updateIntegration").mockResolvedValue({ data: mockIntegration });
      await mcpClient.callTool({ name: "update_integration", arguments: { id: "int_123", name: "Updated" } });
      expect(spy).toHaveBeenCalledWith("int_123", expect.objectContaining({ name: "Updated" }));
    });
  });

  describe("delete_integration", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerDeleteIntegration); });

    it("calls deleteIntegration with id", async () => {
      const spy = vi.spyOn(client.pagertree, "deleteIntegration").mockResolvedValue({ data: { id: "int_123" } });
      await mcpClient.callTool({ name: "delete_integration", arguments: { id: "int_123" } });
      expect(spy).toHaveBeenCalledWith("int_123");
    });
  });

  describe("enable_integration", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerEnableIntegration); });

    it("calls enableIntegration with id", async () => {
      const spy = vi.spyOn(client.pagertree, "enableIntegration").mockResolvedValue({ data: { ...mockIntegration, enabled: true } });
      await mcpClient.callTool({ name: "enable_integration", arguments: { id: "int_123" } });
      expect(spy).toHaveBeenCalledWith("int_123");
    });
  });

  describe("disable_integration", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerDisableIntegration); });

    it("calls disableIntegration with id", async () => {
      const spy = vi.spyOn(client.pagertree, "disableIntegration").mockResolvedValue({ data: { ...mockIntegration, enabled: false } });
      await mcpClient.callTool({ name: "disable_integration", arguments: { id: "int_123" } });
      expect(spy).toHaveBeenCalledWith("int_123");
    });
  });

  describe("list_integration_types", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListIntegrationTypes); });

    it("returns integration types", async () => {
      vi.spyOn(client.pagertree, "listIntegrationTypes").mockResolvedValue({ data: [{ id: "it_123", name: "Datadog" }], has_more: false, total_count: 1 });
      const result = parseResult(await mcpClient.callTool({ name: "list_integration_types", arguments: {} }));
      expect(result.data).toHaveLength(1);
    });
  });

  describe("get_integration_type", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetIntegrationType); });

    it("calls getIntegrationType with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getIntegrationType").mockResolvedValue({ data: { id: "it_123", name: "Datadog" } });
      await mcpClient.callTool({ name: "get_integration_type", arguments: { id: "it_123" } });
      expect(spy).toHaveBeenCalledWith("it_123");
    });
  });
});
