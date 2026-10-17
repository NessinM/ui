import { describe, expect, it } from "bun:test";
import {
  isNearBottom,
  resolveResizeScroll,
} from "../../registry/default/chat/hooks/use-chat-scroll";

describe("chat scroll position", () => {
  it("treats a viewport within 64px of the end as at bottom", () => {
    expect(
      isNearBottom({ scrollHeight: 1000, scrollTop: 540, clientHeight: 400 }),
    ).toBe(true);
    expect(
      isNearBottom({ scrollHeight: 1000, scrollTop: 0, clientHeight: 400 }),
    ).toBe(false);
  });

  it("hides the jump button when a resize brings the bottom into view", () => {
    expect(
      resolveResizeScroll({
        scrollHeight: 1000,
        scrollTop: 0,
        clientHeight: 1000,
      }),
    ).toEqual({
      atBottom: true,
      showJump: false,
    });
  });

  it("keeps the jump button when a resize leaves the bottom out of view", () => {
    expect(
      resolveResizeScroll({
        scrollHeight: 1000,
        scrollTop: 0,
        clientHeight: 400,
      }),
    ).toEqual({
      atBottom: false,
      showJump: true,
    });
  });
});
