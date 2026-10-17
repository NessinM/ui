export type AgentClipboard = Pick<Clipboard, "writeText">;

/** Writes text to the clipboard and says whether it worked, so the result can be announced. */
export async function copyAgentText(
  text: string,
  clipboard: AgentClipboard | undefined,
): Promise<boolean> {
  if (!clipboard) return false;
  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
