import { readFileSync, writeFileSync } from "fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAllTools } from "./tools/index.js";

const server = new McpServer({ name: "pagertree", version: "0.1.0" });
registerAllTools(server);

const tools = (server as unknown as { _registeredTools: Record<string, { description: string; inputSchema: { shape: Record<string, unknown> } }> })._registeredTools;

const toolRows = Object.entries(tools)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, tool]) => {
    const params = Object.keys(tool.inputSchema?.shape ?? {}).join(", ");
    return `| \`${name}\` | ${tool.description} | ${params || "-"} |`;
  })
  .join("\n");

const template = readFileSync("README.template.md", "utf-8");
const readme = template.replace("{{TOOLS_TABLE}}", toolRows);
writeFileSync("README.md", readme);
console.log("README.md generated successfully");