import { describe, expect, it } from "bun:test";
import {
  getAgentApprovalGroupShared,
  getAgentApprovalState,
} from "../../registry/default/agent/lib/get-agent-approval-state";

describe("agent approval state", () => {
  it("is idle while the question waits for an answer", () => {
    expect(getAgentApprovalState({})).toBe("idle");
  });

  it("shows the recorded decision", () => {
    expect(getAgentApprovalState({ decision: "approved" })).toBe("approved");
    expect(getAgentApprovalState({ decision: "denied" })).toBe("denied");
  });

  it("is responding while an answer is on its way", () => {
    expect(getAgentApprovalState({ responding: true })).toBe("responding");
  });

  it("shows an error when the last answer didn't land", () => {
    expect(getAgentApprovalState({ error: true })).toBe("error");
  });

  it("is responding again while a retried answer is on its way", () => {
    expect(getAgentApprovalState({ error: true, responding: true })).toBe(
      "responding",
    );
  });

  it("keeps the recorded decision over a stale error or a late response", () => {
    expect(
      getAgentApprovalState({
        decision: "approved",
        error: true,
        responding: true,
      }),
    ).toBe("approved");
  });
});

const cancel = (id: string, question = "Cancel this booking?") => ({
  id,
  prompt: { question, sharedQuestion: "Cancel these bookings?" },
});

describe("agent approval group shared question", () => {
  it("asks one shared question when every item asks the same", () => {
    expect(
      getAgentApprovalGroupShared([cancel("a"), cancel("b")]).question,
    ).toBe("Cancel these bookings?");
  });

  it("falls back to the question itself when there's no shared wording", () => {
    expect(
      getAgentApprovalGroupShared([
        { id: "a", prompt: { question: "Send the invite?" } },
        { id: "b", prompt: { question: "Send the invite?" } },
      ]).question,
    ).toBe("Send the invite?");
  });

  it("asks each item's question when the questions differ", () => {
    expect(
      getAgentApprovalGroupShared([
        cancel("a"),
        cancel("b", "Delete this event type?"),
      ]).question,
    ).toBeUndefined();
  });

  it("shares nothing for an empty group", () => {
    expect(getAgentApprovalGroupShared([])).toEqual({});
  });

  it("shares the approve label only when every item uses the same one", () => {
    const withLabel = (id: string, approveLabel?: string) => ({
      id,
      prompt: { question: "Cancel this booking?", approveLabel },
    });
    expect(
      getAgentApprovalGroupShared([
        withLabel("a", "Cancel booking"),
        withLabel("b", "Cancel booking"),
      ]).approveLabel,
    ).toBe("Cancel booking");
    expect(
      getAgentApprovalGroupShared([
        withLabel("a", "Cancel booking"),
        withLabel("b"),
      ]).approveLabel,
    ).toBeUndefined();
  });
});
