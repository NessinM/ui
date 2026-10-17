import { describe, expect, it } from "bun:test";
import { shouldStackComposer } from "../../registry/default/lib/composer-editor";

describe("shouldStackComposer", () => {
  it("stacks explicit line breaks even when each line fits", () => {
    expect(shouldStackComposer("a\nb", 20, 400, false)).toBe(true);
  });

  it("stacks single-line text that is wider than the inline width", () => {
    expect(shouldStackComposer("draft", 401, 400, false)).toBe(true);
  });

  it("keeps the inline layout near the wrapping boundary", () => {
    expect(shouldStackComposer("draft", 395, 400, false)).toBe(false);
  });

  it("keeps the stacked layout until the text fits with a 12px margin", () => {
    expect(shouldStackComposer("draft", 395, 400, true)).toBe(true);
    expect(shouldStackComposer("draft", 380, 400, true)).toBe(false);
  });

  it("reflows when the available width changes", () => {
    expect(shouldStackComposer("draft", 300, 250, false)).toBe(true);
    expect(shouldStackComposer("draft", 300, 500, true)).toBe(false);
  });

  it("never stacks an empty draft, even in a hidden container", () => {
    expect(shouldStackComposer("", 0, 0, true)).toBe(false);
  });
});
