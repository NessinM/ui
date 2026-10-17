import { describe, expect, it } from "bun:test";
import { getAgentApprovalGroupShared } from "../../registry/default/agent/lib/get-agent-approval-state";

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

  it("falls back to the question itself when there’s no shared wording", () => {
    expect(
      getAgentApprovalGroupShared([
        { id: "a", prompt: { question: "Send the invite?" } },
        { id: "b", prompt: { question: "Send the invite?" } },
      ]).question,
    ).toBe("Send the invite?");
  });

  it("asks each item’s question when the questions differ", () => {
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
