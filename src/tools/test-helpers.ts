import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

export interface ToolResult {
  data: Record<string, unknown> | unknown[];
  [key: string]: unknown;
}

export async function createTestClient(registerFn: (server: McpServer) => void): Promise<Client> {
  const server = new McpServer({ name: "test", version: "0.0.1" });
  registerFn(server);

  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test-client", version: "0.0.1" });
  await server.connect(serverTransport);
  await client.connect(clientTransport);

  return client;
}

export function parseResult(result: Awaited<ReturnType<Client["callTool"]>>): ToolResult {
  const text = (result.content as { type: string; text: string }[])[0].text;
  return JSON.parse(text) as ToolResult;
}