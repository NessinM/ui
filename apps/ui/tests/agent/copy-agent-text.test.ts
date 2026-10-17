import { describe, expect, it } from "bun:test";
import { copyAgentText } from "../../registry/default/agent/lib/copy-agent-text";

describe("agent text copy", () => {
  it("reports success once the clipboard has the text", async () => {
    let written = "";
    const clipboard = {
      writeText: async (text: string) => {
        written = text;
      },
    };
    expect(await copyAgentText("# Offsite", clipboard)).toBe(true);
    expect(written).toBe("# Offsite");
  });

  it("reports failure when the clipboard rejects the write", async () => {
    const clipboard = {
      writeText: () => Promise.reject(new Error("NotAllowedError")),
    };
    expect(await copyAgentText("# Offsite", clipboard)).toBe(false);
  });

  it("reports failure when there is no clipboard", async () => {
    expect(await copyAgentText("# Offsite", undefined)).toBe(false);
  });
});
