import { describe, expect, it } from "bun:test";
import { canSubmitComposer } from "../../registry/default/hooks/use-composer-editor";

const ready = {
  isComposing: false,
  disabled: false,
  readOnly: false,
  submitDisabled: false,
  busy: false,
  allowEmpty: false,
  text: "hello",
};

describe("canSubmitComposer", () => {
  it("allows submit for a non-empty draft in an idle composer", () => {
    expect(canSubmitComposer(ready)).toBe(true);
  });

  it("blocks submit while busy, even with a draft", () => {
    expect(canSubmitComposer({ ...ready, busy: true })).toBe(false);
  });

  it("blocks submit for each disabling flag", () => {
    expect(canSubmitComposer({ ...ready, isComposing: true })).toBe(false);
    expect(canSubmitComposer({ ...ready, disabled: true })).toBe(false);
    expect(canSubmitComposer({ ...ready, readOnly: true })).toBe(false);
    expect(canSubmitComposer({ ...ready, submitDisabled: true })).toBe(false);
  });

  it("blocks an empty or whitespace draft unless allowEmpty is set", () => {
    expect(canSubmitComposer({ ...ready, text: "   " })).toBe(false);
    expect(canSubmitComposer({ ...ready, text: "" })).toBe(false);
    expect(canSubmitComposer({ ...ready, text: "", allowEmpty: true })).toBe(
      true,
    );
  });
});
