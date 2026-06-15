import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { registerListRouters } from "../tools/list-routers.js";
import { registerGetRouter } from "../tools/get-router.js";
import { registerCreateRouter } from "../tools/create-router.js";
import { registerUpdateRouter } from "../tools/update-router.js";
import { registerDeleteRouter } from "../tools/delete-router.js";
import * as client from "../client.js";
import { createTestClient, parseResult } from "./test-helpers.js";

vi.mock("../client.js");

const mockRouter = { id: "rtr_123", name: "Main Router" };
const sampleYaml = `---\nrules:\n- match:\n    always: true\n  actions:\n  - type: assign\n    receiver: tem_123\n`;

describe("routers", () => {
  describe("list_routers", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListRouters); });

    it("returns routers", async () => {
      vi.spyOn(client.pagertree, "listRouters").mockResolvedValue({ data: [mockRouter], has_more: false, total_count: 1 });
      const result = parseResult(await mcpClient.callTool({ name: "list_routers", arguments: {} }));
      expect((result as any).data).toHaveLength(1);
    });
  });

  describe("get_router", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetRouter); });

    it("calls getRouter with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getRouter").mockResolvedValue({ data: mockRouter });
      await mcpClient.callTool({ name: "get_router", arguments: { id: "rtr_123" } });
      expect(spy).toHaveBeenCalledWith("rtr_123");
    });
  });

  describe("create_router", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerCreateRouter); });

    it("calls createRouter with required fields", async () => {
      const spy = vi.spyOn(client.pagertree, "createRouter").mockResolvedValue({ data: mockRouter });
      await mcpClient.callTool({ name: "create_router", arguments: { name: "Main Router", default_receiver_team_id: "tem_123" } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        name: "Main Router",
        default_receiver_team_id: "tem_123",
      }));
    });

    it("passes yaml rules", async () => {
      const spy = vi.spyOn(client.pagertree, "createRouter").mockResolvedValue({ data: mockRouter });
      await mcpClient.callTool({ name: "create_router", arguments: { name: "Router", default_receiver_team_id: "tem_123", rules: sampleYaml } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ rules: sampleYaml }));
    });
  });

  describe("update_router", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerUpdateRouter); });

    it("calls updateRouter with id and fields", async () => {
      const spy = vi.spyOn(client.pagertree, "updateRouter").mockResolvedValue({ data: mockRouter });
      await mcpClient.callTool({ name: "update_router", arguments: { id: "rtr_123", name: "Updated Router" } });
      expect(spy).toHaveBeenCalledWith("rtr_123", expect.objectContaining({ name: "Updated Router" }));
    });

    it("passes updated yaml rules", async () => {
      const spy = vi.spyOn(client.pagertree, "updateRouter").mockResolvedValue({ data: mockRouter });
      await mcpClient.callTool({ name: "update_router", arguments: { id: "rtr_123", rules: sampleYaml } });
      expect(spy).toHaveBeenCalledWith("rtr_123", expect.objectContaining({ rules: sampleYaml }));
    });
  });

  describe("delete_router", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerDeleteRouter); });

    it("calls deleteRouter with id", async () => {
      const spy = vi.spyOn(client.pagertree, "deleteRouter").mockResolvedValue({ data: { id: "rtr_123" } });
      await mcpClient.callTool({ name: "delete_router", arguments: { id: "rtr_123" } });
      expect(spy).toHaveBeenCalledWith("rtr_123");
    });
  });
});
