import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { registerListMaintenanceWindows } from "../tools/list-maintenance-windows.js";
import { registerGetMaintenanceWindow } from "../tools/get-maintenance-window.js";
import { registerCreateMaintenanceWindow } from "../tools/create-maintenance-window.js";
import { registerUpdateMaintenanceWindow } from "../tools/update-maintenance-window.js";
import { registerDeleteMaintenanceWindow } from "../tools/delete-maintenance-window.js";
import * as client from "../client.js";
import { createTestClient, parseResult } from "./test-helpers.js";

vi.mock("../client.js");

const mockWindow = { id: "mw_123", name: "Scheduled Maintenance" };

describe("maintenance windows", () => {
  describe("list_maintenance_windows", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListMaintenanceWindows); });

    it("returns maintenance windows", async () => {
      vi.spyOn(client.pagertree, "listMaintenanceWindows").mockResolvedValue({ data: [mockWindow], has_more: false, total_count: 1 });
      const result = parseResult(await mcpClient.callTool({ name: "list_maintenance_windows", arguments: {} }));
      expect((result as any).data).toHaveLength(1);
    });
  });

  describe("get_maintenance_window", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetMaintenanceWindow); });

    it("calls getMaintenanceWindow with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getMaintenanceWindow").mockResolvedValue({ data: mockWindow });
      await mcpClient.callTool({ name: "get_maintenance_window", arguments: { id: "mw_123" } });
      expect(spy).toHaveBeenCalledWith("mw_123");
    });
  });

  describe("create_maintenance_window", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerCreateMaintenanceWindow); });

    it("calls createMaintenanceWindow with required fields", async () => {
      const spy = vi.spyOn(client.pagertree, "createMaintenanceWindow").mockResolvedValue({ data: mockWindow });
      await mcpClient.callTool({ name: "create_maintenance_window", arguments: {
        name: "Scheduled Maintenance",
        start_datetime: "2024-01-15 02:00:00",
        end_datetime: "2024-01-15 04:00:00",
        time_zone: "UTC",
        integration_ids: ["int_123"],
      }});
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        name: "Scheduled Maintenance",
        start_datetime: "2024-01-15 02:00:00",
        time_zone: "UTC",
        integration_ids: ["int_123"],
      }));
    });
  });

  describe("update_maintenance_window", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerUpdateMaintenanceWindow); });

    it("calls updateMaintenanceWindow with id and fields", async () => {
      const spy = vi.spyOn(client.pagertree, "updateMaintenanceWindow").mockResolvedValue({ data: mockWindow });
      await mcpClient.callTool({ name: "update_maintenance_window", arguments: { id: "mw_123", name: "Updated Window" } });
      expect(spy).toHaveBeenCalledWith("mw_123", expect.objectContaining({ name: "Updated Window" }));
    });
  });

  describe("delete_maintenance_window", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerDeleteMaintenanceWindow); });

    it("calls deleteMaintenanceWindow with id", async () => {
      const spy = vi.spyOn(client.pagertree, "deleteMaintenanceWindow").mockResolvedValue({ data: { id: "mw_123" } });
      await mcpClient.callTool({ name: "delete_maintenance_window", arguments: { id: "mw_123" } });
      expect(spy).toHaveBeenCalledWith("mw_123");
    });
  });
});
