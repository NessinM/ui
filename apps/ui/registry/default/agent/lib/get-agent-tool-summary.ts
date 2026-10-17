import type { AgentPhase } from "./get-agent-announcement";

export type AgentToolCallState = "running" | "done" | "failed" | "denied";

/** One tool call, already mapped from your agent runtime. */
export type AgentToolCall = {
  id: string;
  /** Looks up the call's renderer in the tool-renderer registry. */
  name: string;
  state: AgentToolCallState;
  output?: unknown;
  /** Why the call failed, shown after its label. */
  error?: string;
};

/** Localized summaries for a run of tool calls, by how many calls are in that state. */
export type AgentToolActivityLabels = {
  done: (count: number) => string;
  running: (count: number) => string;
  failed: (count: number) => string;
  denied: (count: number) => string;
};

export type AgentToolSummaryStatus = Extract<
  AgentPhase,
  "working" | "done" | "failed"
>;

function count(
  calls: readonly AgentToolCall[],
  state: AgentToolCallState,
): number {
  return calls.filter((call) => call.state === state).length;
}

/**
 * The status and one-line label for a run of tool calls. Failures win, then calls
 * still running, then declined calls. A single running call shows its own label.
 */
export function getAgentToolSummary(
  calls: readonly AgentToolCall[],
  labels: AgentToolActivityLabels,
  renderers: Readonly<Record<string, { label: string } | undefined>> = {},
): { status: AgentToolSummaryStatus; label: string } {
  const failed = count(calls, "failed");
  if (failed > 0) return { label: labels.failed(failed), status: "failed" };

  const running = calls.filter((call) => call.state === "running");
  if (running.length > 0) {
    const only = running.length === 1 ? running[0] : undefined;
    const label = only && renderers[only.name]?.label;
    return {
      label: label || labels.running(running.length),
      status: "working",
    };
  }

  const denied = count(calls, "denied");
  if (denied > 0) return { label: labels.denied(denied), status: "done" };
  return { label: labels.done(calls.length), status: "done" };
}
