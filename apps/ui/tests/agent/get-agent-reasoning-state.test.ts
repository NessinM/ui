import { describe, expect, it } from "bun:test";
import {
  type AgentReasoningState,
  getAgentReasoningState,
  getInitialAgentReasoningState,
} from "../../registry/default/agent/lib/get-agent-reasoning-state";

function run(
  state: AgentReasoningState,
  ...events: Parameters<typeof getAgentReasoningState>[1][]
): AgentReasoningState {
  return events.reduce(getAgentReasoningState, state);
}

const start = { autoOpen: true, streaming: true, type: "stream" } as const;
const end = { autoOpen: true, streaming: false, type: "stream" } as const;

describe("agent reasoning state", () => {
  it("starts open while streaming and closed once finished", () => {
    expect(getInitialAgentReasoningState(true).open).toBe(true);
    expect(getInitialAgentReasoningState(false).open).toBe(false);
  });

  it("starts as defaultOpen says when it's given", () => {
    expect(getInitialAgentReasoningState(false, true).open).toBe(true);
    expect(getInitialAgentReasoningState(true, false).open).toBe(false);
  });

  it("opens when streaming starts", () => {
    const state = run(getInitialAgentReasoningState(false), start);
    expect(state.open).toBe(true);
    expect(state.closing).toBe(false);
  });

  it("doesn't open on its own when auto-open is off", () => {
    const state = run(getInitialAgentReasoningState(false, false), {
      ...start,
      autoOpen: false,
    });
    expect(state.open).toBe(false);
  });

  it("schedules a close when streaming finishes, then closes", () => {
    const finished = run(getInitialAgentReasoningState(true), end);
    expect(finished).toMatchObject({ closing: true, open: true });
    expect(run(finished, { type: "close" })).toMatchObject({
      closing: false,
      open: false,
    });
  });

  it("cancels the scheduled close when the user toggles", () => {
    const toggled = run(getInitialAgentReasoningState(true), end, {
      open: true,
      type: "toggle",
    });
    expect(toggled).toMatchObject({ closing: false, open: true });
    expect(run(toggled, { type: "close" }).open).toBe(true);
  });

  it("keeps it open after streaming when the user toggled during the stream", () => {
    const state = run(
      getInitialAgentReasoningState(true),
      { open: false, type: "toggle" },
      { open: true, type: "toggle" },
      end,
    );
    expect(state).toMatchObject({ closing: false, open: true });
  });

  it("schedules nothing when it finishes already closed", () => {
    const state = run(getInitialAgentReasoningState(true, false), {
      ...end,
      autoOpen: false,
    });
    expect(state).toMatchObject({ closing: false, open: false });
  });

  it("ignores a repeated streaming value, so mounting finished reasoning stays put", () => {
    const initial = getInitialAgentReasoningState(false, true);
    expect(run(initial, end)).toEqual(initial);
    const streaming = getInitialAgentReasoningState(true);
    expect(run(streaming, start)).toEqual(streaming);
  });

  it("ignores a close that's no longer scheduled", () => {
    const initial = getInitialAgentReasoningState(false, true);
    expect(run(initial, { type: "close" })).toEqual(initial);
  });

  it("auto-closes again after a new stream, even if the user toggled an earlier one", () => {
    const state = run(
      getInitialAgentReasoningState(true),
      { open: true, type: "toggle" },
      end,
      start,
      end,
    );
    expect(state).toMatchObject({ closing: true, open: true });
  });
});
