import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { registerListLogs } from "../tools/list-logs.js";
import { registerGetLog } from "../tools/get-log.js";
import * as client from "../client.js";
import { createTestClient, parseResult } from "./test-helpers.js";

vi.mock("../client.js");

const mockLog = { id: "log_123", body: "Alert created" };

describe("logs", () => {
  describe("list_logs", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListLogs); });

    it("returns logs", async () => {
      vi.spyOn(client.pagertree, "listLogs").mockResolvedValue({ data: [mockLog], has_more: false, total_count: 1 });
      const result = parseResult(await mcpClient.callTool({ name: "list_logs", arguments: {} }));
      expect(result.data).toHaveLength(1);
    });

    it("passes owner_id and owner_type filters", async () => {
      const spy = vi.spyOn(client.pagertree, "listLogs").mockResolvedValue({ data: [], has_more: false, total_count: 0 });
      await mcpClient.callTool({ name: "list_logs", arguments: { owner_id: "alt_123", owner_type: "Alert" } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ owner_id: "alt_123", owner_type: "Alert" }));
    });
  });

  describe("get_log", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetLog); });

    it("calls getLog with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getLog").mockResolvedValue({ data: mockLog });
      await mcpClient.callTool({ name: "get_log", arguments: { id: "log_123" } });
      expect(spy).toHaveBeenCalledWith("log_123");
    });

    it("returns log data", async () => {
      vi.spyOn(client.pagertree, "getLog").mockResolvedValue({ data: mockLog });
      const result = parseResult(await mcpClient.callTool({ name: "get_log", arguments: { id: "log_123" } }));
      expect((result.data as Record<string, unknown>).body).toBe("Alert created");
    });
  });
});
