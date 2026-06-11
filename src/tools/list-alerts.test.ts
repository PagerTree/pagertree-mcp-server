import { describe, it, expect, vi, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { registerListAlerts } from "./list-alerts.js";
import * as client from "../client.js";

vi.mock("../client.js");

describe("list_alerts", () => {
  let server: McpServer;
  let mcpClient: Client;

  beforeEach(async () => {
    server = new McpServer({ name: "test", version: "0.0.1" });
    registerListAlerts(server);

    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    mcpClient = new Client({ name: "test-client", version: "0.0.1" });
    await server.connect(serverTransport);
    await mcpClient.connect(clientTransport);
  });

  it("returns alerts", async () => {
    vi.spyOn(client.pagertree, "listAlerts").mockResolvedValue({
      data: [{ id: "1", title: "Test Alert", status: "open", created_at: "2024-01-01" }],
      has_more: false,
      total_count: 1,
    });

    const result = await mcpClient.callTool({ name: "list_alerts", arguments: {} });
    const text = (result.content as { type: string; text: string }[])[0].text;
    const parsed = JSON.parse(text);

    expect(parsed.data).toHaveLength(1);
    expect(parsed.data[0].id).toBe("1");
    expect(parsed.data[0].status).toBe("open");
  });

  it("passes status filter to client", async () => {
    const spy = vi.spyOn(client.pagertree, "listAlerts").mockResolvedValue({
      data: [],
      has_more: false,
      total_count: 0,
    });

    await mcpClient.callTool({ name: "list_alerts", arguments: { status: "resolved" } });

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ status: "resolved" }));
  });

  it("passes limit to client", async () => {
    const spy = vi.spyOn(client.pagertree, "listAlerts").mockResolvedValue({
      data: [],
      has_more: false,
      total_count: 0,
    });

    await mcpClient.callTool({ name: "list_alerts", arguments: { limit: 25 } });

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ limit: 25 }));
  });
});