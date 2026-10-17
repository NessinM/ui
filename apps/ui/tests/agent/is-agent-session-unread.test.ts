import { describe, expect, it } from "bun:test";
import { isAgentSessionUnread } from "../../registry/default/agent/lib/is-agent-session-unread";

const seen = new Date("2026-10-17T09:00:00Z");
const before = new Date("2026-10-17T08:59:59Z");
const after = new Date("2026-10-17T09:00:01Z");

describe("agent session unread", () => {
  it("is unread when the session changed after the reader last saw it", () => {
    expect(isAgentSessionUnread({ seenAt: seen, updatedAt: after })).toBe(true);
  });

  it("is read while the session is open, whatever its timestamps", () => {
    expect(
      isAgentSessionUnread({ active: true, seenAt: seen, updatedAt: after }),
    ).toBe(false);
  });

  it("is read when nothing changed since the reader last saw it", () => {
    expect(isAgentSessionUnread({ seenAt: seen, updatedAt: before })).toBe(
      false,
    );
    expect(isAgentSessionUnread({ seenAt: seen, updatedAt: seen })).toBe(false);
  });

  it("has no baseline without seenAt, so a session it never tracked stays read", () => {
    expect(isAgentSessionUnread({ updatedAt: after })).toBe(false);
  });

  it("treats seenAt 0 as never opened, so any activity is unread", () => {
    expect(isAgentSessionUnread({ seenAt: 0, updatedAt: after })).toBe(true);
  });

  it("is read when the session has no activity or an invalid time", () => {
    expect(isAgentSessionUnread({ seenAt: seen })).toBe(false);
    expect(
      isAgentSessionUnread({ seenAt: seen, updatedAt: new Date("nope") }),
    ).toBe(false);
    expect(
      isAgentSessionUnread({ seenAt: new Date("nope"), updatedAt: after }),
    ).toBe(false);
  });

  it("accepts epoch milliseconds as well as dates", () => {
    expect(
      isAgentSessionUnread({ seenAt: seen.getTime(), updatedAt: after }),
    ).toBe(true);
  });
});
