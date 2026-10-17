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

/** Localized text for tool activity. */
export type AgentToolActivityLabels = {
  /** Summaries for a run of tool calls, by how many calls are in that state. */
  done: (count: number) => string;
  running: (count: number) => string;
  failed: (count: number) => string;
  denied: (count: number) => string;
  /** A failed call's row, given its tool label, such as “Checking availability failed.” */
  callFailed: (label: string) => string;
  /** A declined call's row, given its tool label, such as “Checking availability, declined”. */
  callDenied: (label: string) => string;
};

export type AgentToolSummaryStatus = Extract<
  AgentPhase,
  "working" | "done" | "failed"
>;

function inState(
  calls: readonly AgentToolCall[],
  state: AgentToolCallState,
): AgentToolCall[] {
  return calls.filter((call) => call.state === state);
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
  const failed = inState(calls, "failed").length;
  if (failed > 0) return { label: labels.failed(failed), status: "failed" };

  const running = inState(calls, "running");
  if (running.length > 0) {
    const only = running.length === 1 ? running[0] : undefined;
    const label = only && renderers[only.name]?.label;
    return {
      label: label || labels.running(running.length),
      status: "working",
    };
  }

  const denied = inState(calls, "denied").length;
  if (denied > 0) return { label: labels.denied(denied), status: "done" };
  return { label: labels.done(calls.length), status: "done" };
}
