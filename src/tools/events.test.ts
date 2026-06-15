import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { registerListEvents } from "../tools/list-events.js";
import { registerGetEvent } from "../tools/get-event.js";
import { registerCreateEvent } from "../tools/create-event.js";
import { registerUpdateEvent } from "../tools/update-event.js";
import { registerDeleteEvent } from "../tools/delete-event.js";
import { registerOverrideEvent } from "../tools/override-event.js";
import { registerTerminateEvent } from "../tools/terminate-event.js";
import { registerAddEventException } from "../tools/add-event-exception.js";
import { registerListEventTimeZones } from "../tools/list-event-time-zones.js";
import * as client from "../client.js";
import { createTestClient, parseResult } from "./test-helpers.js";

vi.mock("../client.js");

const mockEvent = { id: "evt_123", start_time: "2024-01-15 08:00:00", end_time: "2024-01-16 08:00:00", layer: 1 };

describe("events", () => {
  describe("list_events", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListEvents); });

    it("returns events", async () => {
      vi.spyOn(client.pagertree, "listEvents").mockResolvedValue({ data: [mockEvent], has_more: false, total_count: 1 });
      const result = parseResult(await mcpClient.callTool({ name: "list_events", arguments: {} }));
      expect(result.data).toHaveLength(1);
    });
  });

  describe("get_event", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetEvent); });

    it("calls getEvent with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getEvent").mockResolvedValue({ data: mockEvent });
      await mcpClient.callTool({ name: "get_event", arguments: { id: "evt_123" } });
      expect(spy).toHaveBeenCalledWith("evt_123");
    });
  });

  describe("create_event", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerCreateEvent); });

    it("calls createEvent with required fields", async () => {
      const spy = vi.spyOn(client.pagertree, "createEvent").mockResolvedValue({ data: mockEvent });
      await mcpClient.callTool({ name: "create_event", arguments: {
        start_time: "2024-01-15 08:00:00",
        end_time: "2024-01-16 08:00:00",
        layer: 1,
        time_zone: "UTC",
        account_user_ids: ["au_123"],
        schedule_ids: ["sch_123"],
      }});
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        start_time: "2024-01-15 08:00:00",
        layer: 1,
        time_zone: "UTC",
      }));
    });

    it("passes repeat fields", async () => {
      const spy = vi.spyOn(client.pagertree, "createEvent").mockResolvedValue({ data: mockEvent });
      await mcpClient.callTool({ name: "create_event", arguments: {
        start_time: "2024-01-15 08:00:00",
        end_time: "2024-01-16 08:00:00",
        layer: 1,
        time_zone: "UTC",
        account_user_ids: ["au_123"],
        schedule_ids: ["sch_123"],
        repeat: true,
        frequency: 1,
        frequency_unit: "weekly",
      }});
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        repeat: true,
        frequency: 1,
        frequency_unit: "weekly",
      }));
    });
  });

  describe("update_event", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerUpdateEvent); });

    it("calls updateEvent with id and fields", async () => {
      const spy = vi.spyOn(client.pagertree, "updateEvent").mockResolvedValue({ data: mockEvent });
      await mcpClient.callTool({ name: "update_event", arguments: { id: "evt_123", layer: 2 } });
      expect(spy).toHaveBeenCalledWith("evt_123", expect.objectContaining({ layer: 2 }));
    });
  });

  describe("delete_event", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerDeleteEvent); });

    it("calls deleteEvent with id", async () => {
      const spy = vi.spyOn(client.pagertree, "deleteEvent").mockResolvedValue({ data: { id: "evt_123" } });
      await mcpClient.callTool({ name: "delete_event", arguments: { id: "evt_123" } });
      expect(spy).toHaveBeenCalledWith("evt_123");
    });
  });

  describe("override_event", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerOverrideEvent); });

    it("calls overrideEvent with all required fields", async () => {
      const spy = vi.spyOn(client.pagertree, "overrideEvent").mockResolvedValue({ data: mockEvent });
      await mcpClient.callTool({ name: "override_event", arguments: {
        id: "evt_123",
        start_time: "2024-01-15 08:00",
        end_time: "2024-01-16 08:00",
        layer: 1,
        time_zone: "UTC",
        account_user_ids: ["au_456"],
        action_time: "2024-01-15T08:00:00.000Z",
      }});
      expect(spy).toHaveBeenCalledWith("evt_123", expect.objectContaining({
        start_time: "2024-01-15 08:00",
        action_time: "2024-01-15T08:00:00.000Z",
      }));
    });
  });

  describe("terminate_event", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerTerminateEvent); });

    it("calls terminateEvent with id and action_time", async () => {
      const spy = vi.spyOn(client.pagertree, "terminateEvent").mockResolvedValue({ data: { id: "evt_123" } });
      await mcpClient.callTool({ name: "terminate_event", arguments: { id: "evt_123", action_time: "2024-01-15T08:00:00.000Z" } });
      expect(spy).toHaveBeenCalledWith("evt_123", { action_time: "2024-01-15T08:00:00.000Z" });
    });
  });

  describe("add_event_exception", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerAddEventException); });

    it("calls addEventException with id and action_time", async () => {
      const spy = vi.spyOn(client.pagertree, "addEventException").mockResolvedValue({ data: { id: "evt_123" } });
      await mcpClient.callTool({ name: "add_event_exception", arguments: { id: "evt_123", action_time: "2024-01-15T08:00:00.000Z" } });
      expect(spy).toHaveBeenCalledWith("evt_123", { action_time: "2024-01-15T08:00:00.000Z" });
    });
  });

  describe("list_event_time_zones", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListEventTimeZones); });

    it("calls listEventTimeZones and returns data", async () => {
      vi.spyOn(client.pagertree, "listEventTimeZones").mockResolvedValue({ data: ["UTC", "Arizona", "Eastern Time (US & Canada)"] });
      const result = parseResult(await mcpClient.callTool({ name: "list_event_time_zones", arguments: {} }));
      expect(result.data).toContain("UTC");
    });
  });
});
