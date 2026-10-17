export type AgentPhase =
  | "idle"
  | "thinking"
  | "working"
  | "approval"
  | "done"
  | "stopped"
  | "failed";

export type AgentAnnouncementState = {
  phase: AgentPhase;
  /** What this phase would say: a phase label, or a detail such as the error. */
  text: string;
  conversationId?: string;
};

function isBusy(phase: AgentPhase): boolean {
  return phase === "thinking" || phase === "working";
}

export function getAgentAnnouncement(
  previous: AgentAnnouncementState | null,
  next: AgentAnnouncementState,
): string {
  // A new mount or conversation only records a baseline; its state isn't replayed.
  if (previous === null || previous.conversationId !== next.conversationId)
    return "";
  if (next.phase !== previous.phase) {
    if (isBusy(next.phase) && isBusy(previous.phase)) return "";
    return next.text;
  }
  // Busy text is progress, streamed or not: only settled phases re-announce new text.
  if (isBusy(next.phase) || next.text === previous.text) return "";
  return next.text;
}

const REPEAT_MARK = " ";

/** Live regions skip unchanged content, so a repeat toggles a trailing no-break space. */
export function getAgentAnnouncerMessage(
  current: string,
  text: string,
): string {
  if (current === text) return `${text}${REPEAT_MARK}`;
  return text;
}
