import { describe, expect, it } from "bun:test";
import {
  type AgentToolCall,
  getAgentToolSummary,
} from "../../registry/default/agent/lib/get-agent-tool-summary";

const labels = {
  callDenied: (label: string) => `${label}, declined`,
  callFailed: (label: string) => `${label} failed.`,
  denied: (count: number) => `Declined ${count}`,
  done: (count: number) => `Completed ${count}`,
  failed: (count: number) => `${count} failed`,
  running: (count: number) => `Running ${count}`,
};

const renderers = {
  availability: { label: "Checking availability" },
  bookings: { label: "Finding bookings" },
};

function call(
  name: string,
  state: AgentToolCall["state"],
  id = `${name}-${state}`,
): AgentToolCall {
  return { id, name, state };
}

describe("agent tool summary", () => {
  it("counts completed calls when everything finished", () => {
    expect(
      getAgentToolSummary(
        [call("availability", "done"), call("bookings", "done")],
        labels,
        renderers,
      ),
    ).toEqual({ label: "Completed 2", status: "done" });
  });

  it("names the one call still running", () => {
    expect(
      getAgentToolSummary(
        [call("bookings", "done"), call("availability", "running")],
        labels,
        renderers,
      ),
    ).toEqual({ label: "Checking availability", status: "working" });
  });

  it("counts running calls when more than one runs at once", () => {
    expect(
      getAgentToolSummary(
        [call("bookings", "running"), call("availability", "running")],
        labels,
        renderers,
      ),
    ).toEqual({ label: "Running 2", status: "working" });
  });

  it("counts the running call when it has no renderer label", () => {
    expect(
      getAgentToolSummary([call("search", "running")], labels, renderers),
    ).toEqual({ label: "Running 1", status: "working" });
    expect(getAgentToolSummary([call("search", "running")], labels)).toEqual({
      label: "Running 1",
      status: "working",
    });
  });

  it("reports declined calls once nothing is running", () => {
    expect(
      getAgentToolSummary(
        [call("bookings", "done"), call("availability", "denied")],
        labels,
        renderers,
      ),
    ).toEqual({ label: "Declined 1", status: "done" });
  });

  it("keeps reporting the running call over a declined one", () => {
    expect(
      getAgentToolSummary(
        [call("bookings", "denied"), call("availability", "running")],
        labels,
        renderers,
      ),
    ).toEqual({ label: "Checking availability", status: "working" });
  });

  it("reports failures over everything else", () => {
    expect(
      getAgentToolSummary(
        [
          call("bookings", "failed"),
          call("availability", "running"),
          call("search", "denied"),
        ],
        labels,
        renderers,
      ),
    ).toEqual({ label: "1 failed", status: "failed" });
  });
});
