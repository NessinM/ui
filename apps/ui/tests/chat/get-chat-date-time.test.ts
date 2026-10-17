import { describe, expect, it } from "bun:test";
import { getChatDateTime } from "../../registry/default/chat/lib/get-chat-date-time";

describe("chat timestamp machine value", () => {
  it("serializes a Date as an ISO 8601 instant", () => {
    expect(getChatDateTime(new Date(Date.UTC(2026, 9, 17, 8, 42)))).toBe(
      "2026-10-17T08:42:00.000Z",
    );
  });

  it.each([
    "2026-10-17",
    "2026-10-17T10:42+02:00",
    "PT2H30M",
  ])("passes the caller’s %s string through unchanged", (value) => {
    expect(getChatDateTime(value)).toBe(value);
  });

  it("omits the machine value for an invalid Date instead of throwing", () => {
    expect(getChatDateTime(new Date("not a date"))).toBeUndefined();
  });
});
