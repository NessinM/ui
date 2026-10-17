export type AgentFeedbackRating = "positive" | "negative";

export type AgentFeedbackValue = {
  rating: AgentFeedbackRating;
  /** The values of the reasons the person picked. Empty for a thumbs up. */
  reasons: string[];
  /** Trimmed and capped at the details limit. */
  details: string;
};

export type AgentFeedbackAction =
  | { type: "submit"; feedback: AgentFeedbackValue }
  | { type: "clear" }
  | { type: "describe" };

/** What pressing a rating does, given the rating already shown. */
export function getAgentFeedbackAction(
  current: AgentFeedbackRating | null,
  next: AgentFeedbackRating,
): AgentFeedbackAction {
  if (current === next) return { type: "clear" };
  if (next === "negative") return { type: "describe" };
  return {
    type: "submit",
    feedback: { details: "", rating: "positive", reasons: [] },
  };
}

export type AgentFeedbackDraft = {
  reasons: readonly string[];
  details: string;
  /** Whether the form offered reasons to pick from. */
  reasonsOffered: boolean;
  detailsMaxLength?: number;
};

/** The thumbs-down feedback a draft submits, or null while it can’t be submitted yet. */
export function getAgentFeedbackSubmission({
  reasons,
  details,
  reasonsOffered,
  detailsMaxLength,
}: AgentFeedbackDraft): AgentFeedbackValue | null {
  if (reasonsOffered && reasons.length === 0) return null;
  return {
    rating: "negative",
    reasons: [...reasons],
    details: details.trim().slice(0, detailsMaxLength),
  };
}
