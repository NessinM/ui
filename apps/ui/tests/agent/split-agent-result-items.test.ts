import { describe, expect, it } from "bun:test";
import { splitAgentResultItems } from "../../registry/default/agent/lib/split-agent-result-items";

const items = (count: number) =>
  Array.from({ length: count }, (_, index) => index + 1);

describe("agent result list split", () => {
  it("shows every item when there are no more than the preview count", () => {
    expect(splitAgentResultItems(items(5))).toEqual({
      hidden: [],
      visible: [1, 2, 3, 4, 5],
    });
  });

  it("shows a leftover of one instead of hiding it behind a toggle", () => {
    expect(splitAgentResultItems(items(6))).toEqual({
      hidden: [],
      visible: [1, 2, 3, 4, 5, 6],
    });
  });

  it("hides everything after the first five once two or more would be left over", () => {
    expect(splitAgentResultItems(items(7))).toEqual({
      hidden: [6, 7],
      visible: [1, 2, 3, 4, 5],
    });
  });

  it("takes a custom preview count", () => {
    expect(splitAgentResultItems(items(6), 3)).toEqual({
      hidden: [4, 5, 6],
      visible: [1, 2, 3],
    });
    expect(splitAgentResultItems(items(4), 3)).toEqual({
      hidden: [],
      visible: [1, 2, 3, 4],
    });
  });

  it("returns empty lists for no items", () => {
    expect(splitAgentResultItems([])).toEqual({ hidden: [], visible: [] });
  });
});
