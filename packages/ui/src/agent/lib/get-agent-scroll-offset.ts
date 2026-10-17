export const AGENT_SCROLL_OFFSET_VAR = "--agent-conversation-scroll-top";

/**
 * Base UI popover viewports crossfade a cloned snapshot of the outgoing content,
 * and a clone keeps attributes but not scroll position. Written to the viewport's
 * inline style, this offset travels with the clone so the transcript can be
 * translated back to where the reader was.
 */
export function getAgentScrollOffset(scrollTop: number): string {
  return `${Math.max(0, scrollTop)}px`;
}
