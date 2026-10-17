import { describe, expect, it } from "bun:test";
import type { AgentToolCall } from "../../registry/default/agent/lib/get-agent-tool-summary";
import {
  type AgentTurnItem,
  groupAgentToolRuns,
} from "../../registry/default/agent/lib/group-agent-tool-runs";

function tool(id: string): AgentTurnItem<string> {
  return { call: { id, name: "search", state: "done" }, type: "tool" };
}

function content(text: string): AgentTurnItem<string> {
  return { content: text, type: "content" };
}

const calls = (...ids: string[]): AgentToolCall[] =>
  ids.map((id) => ({ id, name: "search", state: "done" }));

describe("agent tool runs", () => {
  it("groups consecutive tool calls into one run between content", () => {
    expect(
      groupAgentToolRuns([
        content("Let me check."),
        tool("a"),
        tool("b"),
        content("Here’s what I found."),
        tool("c"),
      ]),
    ).toEqual([
      { content: "Let me check.", key: "content-0", type: "content" },
      { calls: calls("a", "b"), key: "tools-1", type: "tools" },
      { content: "Here’s what I found.", key: "content-3", type: "content" },
      { calls: calls("c"), key: "tools-4", type: "tools" },
    ]);
  });

  it("drops hidden items without splitting the run around them", () => {
    expect(groupAgentToolRuns([tool("a"), null, undefined, tool("b")])).toEqual(
      [{ calls: calls("a", "b"), key: "tools-0", type: "tools" }],
    );
  });

  it("keys each segment by its first item's position, so a growing run keeps its key", () => {
    const before = groupAgentToolRuns([content("Checking."), tool("a")]);
    const after = groupAgentToolRuns([
      content("Checking."),
      tool("a"),
      tool("b"),
    ]);
    expect(before.map((segment) => segment.key)).toEqual(
      after.map((segment) => segment.key),
    );
  });

  it("returns nothing for an empty turn", () => {
    expect(groupAgentToolRuns([])).toEqual([]);
  });
});
