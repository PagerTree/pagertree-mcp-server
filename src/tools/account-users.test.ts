import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { registerListAccountUsers } from "../tools/list-account-users.js";
import { registerGetAccountUser } from "../tools/get-account-user.js";
import { registerCreateAccountUser } from "../tools/create-account-user.js";
import { registerUpdateAccountUser } from "../tools/update-account-user.js";
import { registerDeleteAccountUser } from "../tools/delete-account-user.js";
import * as client from "../client.js";
import { createTestClient, parseResult } from "./test-helpers.js";

vi.mock("../client.js");

describe("account users", () => {
  describe("list_account_users", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListAccountUsers); });

    it("calls listAccountUsers and returns data", async () => {
      vi.spyOn(client.pagertree, "listAccountUsers").mockResolvedValue({ data: [{ id: "1", name: "Alice" }], has_more: false, total_count: 1 });
      const result = parseResult(await mcpClient.callTool({ name: "list_account_users", arguments: {} }));
      expect((result as any).data).toHaveLength(1);
    });

    it("passes pagination params", async () => {
      const spy = vi.spyOn(client.pagertree, "listAccountUsers").mockResolvedValue({ data: [], has_more: false, total_count: 0 });
      await mcpClient.callTool({ name: "list_account_users", arguments: { limit: 25, page: 2 } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ limit: 25, page: 2 }));
    });
  });

  describe("get_account_user", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetAccountUser); });

    it("calls getAccountUser with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getAccountUser").mockResolvedValue({ data: { id: "au_123", name: "Alice" } });
      await mcpClient.callTool({ name: "get_account_user", arguments: { id: "au_123" } });
      expect(spy).toHaveBeenCalledWith("au_123");
    });

    it("returns the account user data", async () => {
      vi.spyOn(client.pagertree, "getAccountUser").mockResolvedValue({ data: { id: "au_123", name: "Alice" } });
      const result = parseResult(await mcpClient.callTool({ name: "get_account_user", arguments: { id: "au_123" } }));
      expect((result as any).data.name).toBe("Alice");
    });
  });

  describe("create_account_user", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerCreateAccountUser); });

    it("calls createAccountUser with required fields", async () => {
      const spy = vi.spyOn(client.pagertree, "createAccountUser").mockResolvedValue({ data: { id: "au_123" } });
      await mcpClient.callTool({ name: "create_account_user", arguments: { name: "Alice", email: "alice@example.com" } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        user_attributes: expect.objectContaining({
          name: "Alice",
          emails_attributes: [{ email: "alice@example.com" }],
        }),
      }));
    });

    it("includes phone when provided", async () => {
      const spy = vi.spyOn(client.pagertree, "createAccountUser").mockResolvedValue({ data: { id: "au_123" } });
      await mcpClient.callTool({ name: "create_account_user", arguments: { name: "Alice", email: "alice@example.com", phone: "+15555555555" } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        user_attributes: expect.objectContaining({
          phones_attributes: [{ phone: "+15555555555", primary: true }],
        }),
      }));
    });

    it("omits phone when not provided", async () => {
      const spy = vi.spyOn(client.pagertree, "createAccountUser").mockResolvedValue({ data: { id: "au_123" } });
      await mcpClient.callTool({ name: "create_account_user", arguments: { name: "Alice", email: "alice@example.com" } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        user_attributes: expect.objectContaining({ phones_attributes: undefined }),
      }));
    });
  });

  describe("update_account_user", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerUpdateAccountUser); });

    it("calls updateAccountUser with id and fields", async () => {
      const spy = vi.spyOn(client.pagertree, "updateAccountUser").mockResolvedValue({ data: { id: "au_123" } });
      await mcpClient.callTool({ name: "update_account_user", arguments: { id: "au_123", name: "Alice Updated" } });
      expect(spy).toHaveBeenCalledWith("au_123", expect.objectContaining({
        user_attributes: expect.objectContaining({ name: "Alice Updated" }),
      }));
    });

    it("passes notification_rule_id", async () => {
      const spy = vi.spyOn(client.pagertree, "updateAccountUser").mockResolvedValue({ data: { id: "au_123" } });
      await mcpClient.callTool({ name: "update_account_user", arguments: { id: "au_123", notification_rule_id: "nr_123" } });
      expect(spy).toHaveBeenCalledWith("au_123", expect.objectContaining({ notification_rule_id: "nr_123" }));
    });
  });

  describe("delete_account_user", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerDeleteAccountUser); });

    it("calls deleteAccountUser with id", async () => {
      const spy = vi.spyOn(client.pagertree, "deleteAccountUser").mockResolvedValue({ data: { id: "au_123" } });
      await mcpClient.callTool({ name: "delete_account_user", arguments: { id: "au_123" } });
      expect(spy).toHaveBeenCalledWith("au_123");
    });
  });
});
