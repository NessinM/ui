import { describe, expect, it } from "bun:test";
import {
  getAgentAnnouncement,
  getAgentAnnouncerMessage,
} from "../../registry/default/agent/lib/get-agent-announcement";

describe("agent announcement", () => {
  it("records the first state as a baseline without announcing it", () => {
    expect(
      getAgentAnnouncement(null, { phase: "working", text: "Working" }),
    ).toBe("");
  });

  it("announces a phase change with that phase's text", () => {
    expect(
      getAgentAnnouncement(
        { phase: "idle", text: "" },
        { phase: "thinking", text: "Thinking" },
      ),
    ).toBe("Thinking");
  });

  it("stays quiet when a busy turn moves between thinking and working", () => {
    expect(
      getAgentAnnouncement(
        { phase: "thinking", text: "Thinking" },
        { phase: "working", text: "Working" },
      ),
    ).toBe("");
    expect(
      getAgentAnnouncement(
        { phase: "working", text: "Working" },
        { phase: "thinking", text: "Thinking" },
      ),
    ).toBe("");
  });

  it("replays nothing when the conversation changes", () => {
    expect(
      getAgentAnnouncement(
        { conversationId: "a", phase: "done", text: "Response ready" },
        { conversationId: "b", phase: "failed", text: "Network error" },
      ),
    ).toBe("");
  });

  it("announces a new error or approval within the same phase", () => {
    expect(
      getAgentAnnouncement(
        { phase: "failed", text: "Network error" },
        { phase: "failed", text: "Rate limited" },
      ),
    ).toBe("Rate limited");
    expect(
      getAgentAnnouncement(
        { phase: "approval", text: "Cancel the 3 p.m. meeting?" },
        { phase: "approval", text: "Move the 4 p.m. meeting?" },
      ),
    ).toBe("Move the 4 p.m. meeting?");
  });

  it("never re-announces an unchanged phase or busy progress", () => {
    expect(
      getAgentAnnouncement(
        { phase: "failed", text: "Network error" },
        { phase: "failed", text: "Network error" },
      ),
    ).toBe("");
    expect(
      getAgentAnnouncement(
        { phase: "working", text: "Searching calendars" },
        { phase: "working", text: "Checking availability" },
      ),
    ).toBe("");
  });
});

describe("agent announcer message", () => {
  it("shows a new message as given", () => {
    expect(getAgentAnnouncerMessage("Thinking", "Copied")).toBe("Copied");
  });

  it("changes a repeated message so a screen reader reads it again", () => {
    const first = getAgentAnnouncerMessage("", "Copied");
    const second = getAgentAnnouncerMessage(first, "Copied");
    const third = getAgentAnnouncerMessage(second, "Copied");
    expect(second).not.toBe(first);
    expect(third).not.toBe(second);
    expect(second.trim()).toBe("Copied");
  });
});
