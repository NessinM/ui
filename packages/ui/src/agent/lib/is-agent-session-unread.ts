export type AgentSessionActivity = {
  /** The session is open on screen, so the reader sees its changes as they happen. */
  active?: boolean;
  updatedAt?: Date | number;
  seenAt?: Date | number;
};

export function isAgentSessionUnread({
  active = false,
  updatedAt,
  seenAt,
}: AgentSessionActivity): boolean {
  if (active || updatedAt === undefined || seenAt === undefined) return false;
  return Number(updatedAt) > Number(seenAt);
}
