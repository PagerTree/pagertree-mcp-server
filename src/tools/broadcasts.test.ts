import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { registerListBroadcasts } from "../tools/list-broadcasts.js";
import { registerGetBroadcast } from "../tools/get-broadcast.js";
import { registerCreateBroadcast } from "../tools/create-broadcast.js";
import { registerUpdateBroadcast } from "../tools/update-broadcast.js";
import { registerDeleteBroadcast } from "../tools/delete-broadcast.js";
import { registerListBroadcastComments } from "../tools/list-broadcast-comments.js";
import { registerCreateBroadcastComment } from "../tools/create-broadcast-comment.js";
import * as client from "../client.js";
import { createTestClient, parseResult } from "./test-helpers.js";

vi.mock("../client.js");

const mockBroadcast = { id: "brd_123", title: "Test Broadcast" };

describe("broadcasts", () => {
  describe("list_broadcasts", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListBroadcasts); });

    it("returns broadcasts", async () => {
      vi.spyOn(client.pagertree, "listBroadcasts").mockResolvedValue({ data: [mockBroadcast], has_more: false, total_count: 1 });
      const result = parseResult(await mcpClient.callTool({ name: "list_broadcasts", arguments: {} }));
      expect(result.data).toHaveLength(1);
    });

    it("passes pagination params", async () => {
      const spy = vi.spyOn(client.pagertree, "listBroadcasts").mockResolvedValue({ data: [], has_more: false, total_count: 0 });
      await mcpClient.callTool({ name: "list_broadcasts", arguments: { limit: 5 } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ limit: 5 }));
    });
  });

  describe("get_broadcast", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetBroadcast); });

    it("calls getBroadcast with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getBroadcast").mockResolvedValue({ data: mockBroadcast });
      await mcpClient.callTool({ name: "get_broadcast", arguments: { id: "brd_123" } });
      expect(spy).toHaveBeenCalledWith("brd_123");
    });
  });

  describe("create_broadcast", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerCreateBroadcast); });

    it("calls createBroadcast with required fields", async () => {
      const spy = vi.spyOn(client.pagertree, "createBroadcast").mockResolvedValue({ data: mockBroadcast });
      await mcpClient.callTool({ name: "create_broadcast", arguments: { title: "Test Broadcast", destination_team_ids: ["tem_123"] } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ title: "Test Broadcast" }));
    });

    it("passes response_requested fields", async () => {
      const spy = vi.spyOn(client.pagertree, "createBroadcast").mockResolvedValue({ data: mockBroadcast });
      await mcpClient.callTool({ name: "create_broadcast", arguments: {
        title: "Test", destination_team_ids: ["tem_123"],
        response_requested: true,
        broadcast_response_options_attributes: [{ value: "Yes" }, { value: "No" }],
      }});
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        response_requested: true,
        broadcast_response_options_attributes: [{ value: "Yes" }, { value: "No" }],
      }));
    });
  });

  describe("update_broadcast", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerUpdateBroadcast); });

    it("calls updateBroadcast with only title, description, tag_list", async () => {
      const spy = vi.spyOn(client.pagertree, "updateBroadcast").mockResolvedValue({ data: mockBroadcast });
      await mcpClient.callTool({ name: "update_broadcast", arguments: { id: "brd_123", title: "Updated" } });
      expect(spy).toHaveBeenCalledWith("brd_123", expect.objectContaining({ title: "Updated" }));
    });
  });

  describe("delete_broadcast", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerDeleteBroadcast); });

    it("calls deleteBroadcast with id", async () => {
      const spy = vi.spyOn(client.pagertree, "deleteBroadcast").mockResolvedValue({ data: { id: "brd_123" } });
      await mcpClient.callTool({ name: "delete_broadcast", arguments: { id: "brd_123" } });
      expect(spy).toHaveBeenCalledWith("brd_123");
    });
  });

  describe("list_broadcast_comments", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListBroadcastComments); });

    it("calls listBroadcastComments with id", async () => {
      const spy = vi.spyOn(client.pagertree, "listBroadcastComments").mockResolvedValue({ data: [] });
      await mcpClient.callTool({ name: "list_broadcast_comments", arguments: { id: "brd_123" } });
      expect(spy).toHaveBeenCalledWith("brd_123");
    });
  });

  describe("create_broadcast_comment", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerCreateBroadcastComment); });

    it("calls createBroadcastComment with id and body", async () => {
      const spy = vi.spyOn(client.pagertree, "createBroadcastComment").mockResolvedValue({ data: { id: "com_123" } });
      await mcpClient.callTool({ name: "create_broadcast_comment", arguments: { id: "brd_123", body: "Update from comms team" } });
      expect(spy).toHaveBeenCalledWith("brd_123", "Update from comms team");
    });
  });
});
