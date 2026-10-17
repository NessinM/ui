import { describe, expect, it } from "bun:test";
import { getAgentScrollOffset } from "../../registry/default/agent/lib/get-agent-scroll-offset";

describe("agent scroll offset", () => {
  it("records how far the transcript is scrolled", () => {
    expect(getAgentScrollOffset(240)).toBe("240px");
  });

  it("ignores overscroll bounce above the top", () => {
    expect(getAgentScrollOffset(-18)).toBe("0px");
  });
});
