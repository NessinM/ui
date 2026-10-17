import { describe, expect, it } from "bun:test";
import {
  getAgentScrollOffset,
  isAgentScrollAtBottom,
} from "../../registry/default/agent/lib/agent-scroll";

describe("agent scroll offset", () => {
  it("records how far the transcript is scrolled", () => {
    expect(getAgentScrollOffset(240)).toBe("240px");
  });

  it("ignores overscroll bounce above the top", () => {
    expect(getAgentScrollOffset(-18)).toBe("0px");
  });
});

describe("agent scroll position", () => {
  it("treats a viewport within 24px of the end as at the bottom", () => {
    expect(
      isAgentScrollAtBottom({
        clientHeight: 400,
        scrollHeight: 1000,
        scrollTop: 576,
      }),
    ).toBe(true);
    expect(
      isAgentScrollAtBottom({
        clientHeight: 400,
        scrollHeight: 1000,
        scrollTop: 575,
      }),
    ).toBe(false);
  });

  it("treats a transcript shorter than its viewport as at the bottom", () => {
    expect(
      isAgentScrollAtBottom({
        clientHeight: 400,
        scrollHeight: 200,
        scrollTop: 0,
      }),
    ).toBe(true);
  });
});
