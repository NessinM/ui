export const AGENT_RESULT_LIST_PREVIEW_COUNT = 5;

/** Splits a result list into the rows shown up front and the rows behind “show more”. A leftover of one isn’t worth a toggle. */
export function splitAgentResultItems<T>(
  items: readonly T[],
  previewCount: number = AGENT_RESULT_LIST_PREVIEW_COUNT,
): { visible: T[]; hidden: T[] } {
  if (items.length <= previewCount + 1)
    return { hidden: [], visible: [...items] };
  return {
    hidden: items.slice(previewCount),
    visible: items.slice(0, previewCount),
  };
}
