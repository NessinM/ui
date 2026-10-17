"use client";

import { Collapsible, CollapsiblePanel } from "@coss/ui/components/collapsible";
import { cn } from "@coss/ui/lib/utils";
import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  useEffect,
  useReducer,
} from "react";
import { AgentDisclosureTrigger } from "./agent-disclosure-trigger";
import { AgentStatusIndicator } from "./agent-status-indicator";
import {
  AGENT_REASONING_CLOSE_DELAY,
  getAgentReasoningState,
  getInitialAgentReasoningState,
} from "./lib/get-agent-reasoning-state";

export type AgentReasoningProps = Omit<
  ComponentProps<typeof Collapsible>,
  "children" | "defaultOpen" | "onOpenChange" | "open"
> & {
  children: ReactNode;
  /** Shown while the reasoning streams, such as “Thinking…”. */
  streamingLabel: string;
  /** Shown once it finishes, such as “Thought for 4 seconds”. */
  completedLabel: string;
  streaming?: boolean;
  /** Open on mount. `false` also stops it opening when streaming starts. Defaults to `streaming`. */
  defaultOpen?: boolean;
  /** Replaces the neutral busy glyph while streaming. */
  indicator?: ReactNode;
};

/**
 * Reasoning behind a disclosure. It opens while streaming and closes a second after
 * it finishes, unless the user has opened or closed it in the meantime.
 */
export function AgentReasoning({
  children,
  streamingLabel,
  completedLabel,
  streaming = false,
  defaultOpen,
  indicator,
  className,
  ...props
}: AgentReasoningProps): ReactElement {
  const [state, dispatch] = useReducer(getAgentReasoningState, undefined, () =>
    getInitialAgentReasoningState(streaming, defaultOpen),
  );

  useEffect(() => {
    dispatch({ autoOpen: defaultOpen !== false, streaming, type: "stream" });
  }, [defaultOpen, streaming]);

  useEffect(() => {
    if (!state.closing) return;
    const timeout = window.setTimeout(
      () => dispatch({ type: "close" }),
      AGENT_REASONING_CLOSE_DELAY,
    );
    return () => window.clearTimeout(timeout);
  }, [state.closing]);

  return (
    <Collapsible
      className={cn("flex min-w-0 flex-col", className)}
      data-slot="agent-reasoning"
      data-streaming={streaming || undefined}
      open={state.open}
      onOpenChange={(open) => dispatch({ open, type: "toggle" })}
      {...props}
    >
      <AgentDisclosureTrigger data-slot="agent-reasoning-trigger">
        <AgentStatusIndicator
          indicator={indicator}
          status={streaming ? "thinking" : "done"}
        >
          {streaming ? streamingLabel : completedLabel}
        </AgentStatusIndicator>
      </AgentDisclosureTrigger>
      <CollapsiblePanel className="motion-reduce:transition-none">
        <div
          aria-busy={streaming || undefined}
          className="whitespace-pre-wrap ps-5 pt-2 text-muted-foreground text-xs/relaxed"
          data-slot="agent-reasoning-content"
        >
          {children}
        </div>
      </CollapsiblePanel>
    </Collapsible>
  );
}
