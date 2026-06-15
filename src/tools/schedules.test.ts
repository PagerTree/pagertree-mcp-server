import { describe, it, expect, vi, beforeEach } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { registerListSchedules } from "../tools/list-schedules.js";
import { registerGetSchedule } from "../tools/get-schedule.js";
import { registerCreateSchedule } from "../tools/create-schedule.js";
import { registerUpdateSchedule } from "../tools/update-schedule.js";
import { registerDeleteSchedule } from "../tools/delete-schedule.js";
import { registerFlushSchedule } from "../tools/flush-schedule.js";
import { registerGetScheduleCurrentOncall } from "../tools/get-schedule-current-oncall.js";
import { registerGetScheduleWindowEvents } from "../tools/get-schedule-window-events.js";
import { registerGetScheduleEvents } from "../tools/get-schedule-events.js";
import * as client from "../client.js";
import { createTestClient, parseResult } from "./test-helpers.js";

vi.mock("../client.js");

const mockSchedule = { id: "sch_123", name: "Default Schedule" };

describe("schedules", () => {
  describe("list_schedules", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerListSchedules); });

    it("returns schedules", async () => {
      vi.spyOn(client.pagertree, "listSchedules").mockResolvedValue({ data: [mockSchedule], has_more: false, total_count: 1 });
      const result = parseResult(await mcpClient.callTool({ name: "list_schedules", arguments: {} }));
      expect(result.data).toHaveLength(1);
    });
  });

  describe("get_schedule", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetSchedule); });

    it("calls getSchedule with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getSchedule").mockResolvedValue({ data: mockSchedule });
      await mcpClient.callTool({ name: "get_schedule", arguments: { id: "sch_123" } });
      expect(spy).toHaveBeenCalledWith("sch_123");
    });
  });

  describe("create_schedule", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerCreateSchedule); });

    it("calls createSchedule with name", async () => {
      const spy = vi.spyOn(client.pagertree, "createSchedule").mockResolvedValue({ data: mockSchedule });
      await mcpClient.callTool({ name: "create_schedule", arguments: { name: "New Schedule" } });
      expect(spy).toHaveBeenCalledWith({ name: "New Schedule" });
    });
  });

  describe("update_schedule", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerUpdateSchedule); });

    it("calls updateSchedule with id and name", async () => {
      const spy = vi.spyOn(client.pagertree, "updateSchedule").mockResolvedValue({ data: mockSchedule });
      await mcpClient.callTool({ name: "update_schedule", arguments: { id: "sch_123", name: "Updated Schedule" } });
      expect(spy).toHaveBeenCalledWith("sch_123", { name: "Updated Schedule" });
    });
  });

  describe("delete_schedule", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerDeleteSchedule); });

    it("calls deleteSchedule with id", async () => {
      const spy = vi.spyOn(client.pagertree, "deleteSchedule").mockResolvedValue({ data: { id: "sch_123" } });
      await mcpClient.callTool({ name: "delete_schedule", arguments: { id: "sch_123" } });
      expect(spy).toHaveBeenCalledWith("sch_123");
    });
  });

  describe("flush_schedule", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerFlushSchedule); });

    it("calls flushSchedule with id", async () => {
      const spy = vi.spyOn(client.pagertree, "flushSchedule").mockResolvedValue({ data: { id: "sch_123" } });
      await mcpClient.callTool({ name: "flush_schedule", arguments: { id: "sch_123" } });
      expect(spy).toHaveBeenCalledWith("sch_123");
    });
  });

  describe("get_schedule_current_oncall", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetScheduleCurrentOncall); });

    it("calls getScheduleCurrentOncall with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getScheduleCurrentOncall").mockResolvedValue({ data: [{ id: "au_123" }] });
      await mcpClient.callTool({ name: "get_schedule_current_oncall", arguments: { id: "sch_123" } });
      expect(spy).toHaveBeenCalledWith("sch_123");
    });

    it("returns oncall users", async () => {
      vi.spyOn(client.pagertree, "getScheduleCurrentOncall").mockResolvedValue({ data: [{ id: "au_123", name: "Alice" }] });
      const result = parseResult(await mcpClient.callTool({ name: "get_schedule_current_oncall", arguments: { id: "sch_123" } }));
      expect(result.data).toHaveLength(1);
    });
  });

  describe("get_schedule_window_events", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetScheduleWindowEvents); });

    it("calls getScheduleWindowEvents with id, start, end", async () => {
      const spy = vi.spyOn(client.pagertree, "getScheduleWindowEvents").mockResolvedValue({ data: [] });
      await mcpClient.callTool({ name: "get_schedule_window_events", arguments: { id: "sch_123", start: "2024-01-15 00:00:00", end: "2024-01-22 00:00:00" } });
      expect(spy).toHaveBeenCalledWith("sch_123", { start: "2024-01-15 00:00:00", end: "2024-01-22 00:00:00" });
    });
  });

  describe("get_schedule_events", () => {
    let mcpClient: Client;
    beforeEach(async () => { mcpClient = await createTestClient(registerGetScheduleEvents); });

    it("calls getScheduleEvents with id", async () => {
      const spy = vi.spyOn(client.pagertree, "getScheduleEvents").mockResolvedValue({ data: [] });
      await mcpClient.callTool({ name: "get_schedule_events", arguments: { id: "sch_123" } });
      expect(spy).toHaveBeenCalledWith("sch_123");
    });
  });
});
