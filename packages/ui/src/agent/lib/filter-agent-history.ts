export type AgentHistoryEntry = {
  title: string;
  updatedAt: Date;
};

/** Conversations whose title contains the query, ignoring case and outer spaces, newest first. */
export function filterAgentHistory<Item extends AgentHistoryEntry>(
  items: readonly Item[],
  query: string,
): Item[] {
  const needle = query.trim().toLocaleLowerCase();
  return items
    .filter((item) => item.title.toLocaleLowerCase().includes(needle))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}
