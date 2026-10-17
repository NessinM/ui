import { describe, expect, it } from "bun:test";
import {
  shouldStackComposer,
  stackingMeasureWidth,
} from "../../registry/default/lib/composer-editor";

describe("shouldStackComposer", () => {
  it("stacks an explicit line break even when the text fits on one line", () => {
    expect(
      shouldStackComposer({
        hasNewline: true,
        isEmpty: false,
        fitsOneLine: true,
      }),
    ).toBe(true);
  });

  it("stacks a draft that wraps onto a second line", () => {
    expect(
      shouldStackComposer({
        hasNewline: false,
        isEmpty: false,
        fitsOneLine: false,
      }),
    ).toBe(true);
  });

  it("keeps a one-line draft inline", () => {
    expect(
      shouldStackComposer({
        hasNewline: false,
        isEmpty: false,
        fitsOneLine: true,
      }),
    ).toBe(false);
  });

  it("never stacks an empty draft, even when it does not fit", () => {
    expect(
      shouldStackComposer({
        hasNewline: false,
        isEmpty: true,
        fitsOneLine: false,
      }),
    ).toBe(false);
  });
});

describe("stackingMeasureWidth", () => {
  it("measures at the inline width when not stacked", () => {
    expect(stackingMeasureWidth(400, false)).toBe(400);
  });

  it("leaves a 12px margin while stacked, so the draft must fit with room to spare", () => {
    expect(stackingMeasureWidth(400, true)).toBe(388);
  });
});
