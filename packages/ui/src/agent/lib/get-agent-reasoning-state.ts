/** How long finished reasoning stays open before it closes, in milliseconds. */
export const AGENT_REASONING_CLOSE_DELAY = 1000;

export type AgentReasoningState = {
  streaming: boolean;
  open: boolean;
  /** A close is scheduled; the caller fires `close` after `AGENT_REASONING_CLOSE_DELAY`. */
  closing: boolean;
  /** The user opened or closed it during the current stream. */
  toggled: boolean;
};

export type AgentReasoningEvent =
  | { type: "stream"; streaming: boolean; autoOpen: boolean }
  | { type: "toggle"; open: boolean }
  | { type: "close" };

export function getInitialAgentReasoningState(
  streaming: boolean,
  defaultOpen: boolean = streaming,
): AgentReasoningState {
  return { closing: false, open: defaultOpen, streaming, toggled: false };
}

/**
 * Reasoning opens while it streams and closes a moment after it finishes.
 * Once the user toggles it, it stays as they left it until the next stream.
 */
export function getAgentReasoningState(
  state: AgentReasoningState,
  event: AgentReasoningEvent,
): AgentReasoningState {
  switch (event.type) {
    case "stream": {
      if (event.streaming === state.streaming) return state;
      if (event.streaming)
        return {
          closing: false,
          open: event.autoOpen || state.open,
          streaming: true,
          toggled: false,
        };
      return {
        ...state,
        closing: state.open && !state.toggled,
        streaming: false,
      };
    }
    case "toggle":
      return { ...state, closing: false, open: event.open, toggled: true };
    case "close":
      if (!state.closing) return state;
      return { ...state, closing: false, open: false };
  }
}
