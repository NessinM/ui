import type { AgentToolCall } from "./get-agent-tool-summary";

/** One part of a turn: a tool call, some content, or nothing to show. */
export type AgentTurnItem<T> =
  | { type: "tool"; call: AgentToolCall }
  | { type: "content"; content: T }
  | null
  | undefined;

export type AgentTurnSegment<T> =
  | { type: "tools"; key: string; calls: AgentToolCall[] }
  | { type: "content"; key: string; content: T };

/**
 * Groups each run of consecutive tool calls into one segment. Hidden items are
 * dropped without splitting a run. Keys come from each segment's first position,
 * so a run that grows while streaming keeps its key.
 */
export function groupAgentToolRuns<T>(
  items: readonly AgentTurnItem<T>[],
): AgentTurnSegment<T>[] {
  const segments: AgentTurnSegment<T>[] = [];
  items.forEach((item, index) => {
    if (!item) return;
    if (item.type === "content") {
      segments.push({
        content: item.content,
        key: `content-${index}`,
        type: "content",
      });
      return;
    }
    const last = segments.at(-1);
    if (last?.type === "tools") last.calls.push(item.call);
    else
      segments.push({
        calls: [item.call],
        key: `tools-${index}`,
        type: "tools",
      });
  });
  return segments;
}
