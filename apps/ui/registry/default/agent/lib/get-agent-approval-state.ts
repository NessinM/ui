export type AgentApprovalDecision = "approved" | "denied";

export type AgentApprovalState =
  | "idle"
  | "responding"
  | AgentApprovalDecision
  | "error";

export type AgentApprovalStateInput = {
  /** The answer the agent runtime recorded. Once set, the question is resolved. */
  decision?: AgentApprovalDecision | null;
  /** An answer is on its way and hasn't landed yet. */
  responding?: boolean;
  /** The last answer didn't land. The question can be answered again. */
  error?: boolean;
};

export function getAgentApprovalState({
  decision,
  responding = false,
  error = false,
}: AgentApprovalStateInput): AgentApprovalState {
  // The runtime is the source of truth: a recorded decision outlasts any local attempt.
  if (decision) return decision;
  if (responding) return "responding";
  if (error) return "error";
  return "idle";
}

/** Everything one approval says. All wording comes from the host. */
export type AgentApprovalPrompt = {
  question: string;
  /** The question a group card asks once when every item asks `question`, such as its plural. */
  sharedQuestion?: string;
  /** One line on what happens, such as the affected booking. */
  context?: string;
  /** Lines listed under the question, such as the fields that change. */
  details?: readonly string[];
  /** A short tag, such as the tool or the resource. */
  badge?: string;
  /** The approve verb for this action, such as “Cancel booking”. Defaults to the card's label. */
  approveLabel?: string;
  /** The deny verb for this action. Defaults to the card's label. */
  denyLabel?: string;
};

export type AgentApprovalGroupItem = {
  id: string;
  prompt: AgentApprovalPrompt;
};

export type AgentApprovalGroupShared = {
  /** Set when every item asks the same question: the group asks it once. */
  question?: string;
  /** Set when every item uses the same approve verb: approve-all uses it. */
  approveLabel?: string;
};

function allSame<T>(
  items: readonly AgentApprovalGroupItem[],
  pick: (prompt: AgentApprovalPrompt) => T,
): boolean {
  const first = items[0];
  return (
    !!first && items.every((item) => pick(item.prompt) === pick(first.prompt))
  );
}

export function getAgentApprovalGroupShared(
  items: readonly AgentApprovalGroupItem[],
): AgentApprovalGroupShared {
  const first = items[0]?.prompt;
  if (!first) return {};
  const shared: AgentApprovalGroupShared = {};
  if (allSame(items, (prompt) => prompt.question))
    shared.question = first.sharedQuestion ?? first.question;
  if (allSame(items, (prompt) => prompt.approveLabel) && first.approveLabel)
    shared.approveLabel = first.approveLabel;
  return shared;
}
