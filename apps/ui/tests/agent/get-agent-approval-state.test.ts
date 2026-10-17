import { describe, expect, it } from "bun:test";
import { getAgentApprovalState } from "../../registry/default/agent/lib/get-agent-approval-state";

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

  it("shows an error when the last answer didn’t land", () => {
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
