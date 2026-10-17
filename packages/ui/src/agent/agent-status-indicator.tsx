"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@coss/ui/lib/utils";
import {
  CircleCheckIcon,
  CircleStopIcon,
  CircleXIcon,
  LoaderCircleIcon,
} from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import type { AgentPhase } from "./lib/get-agent-announcement";

export type AgentStatus = Extract<
  AgentPhase,
  "thinking" | "working" | "done" | "stopped" | "failed"
>;

export type AgentStatusIndicatorProps = useRender.ComponentProps<"span"> & {
  status: AgentStatus;
  /** Replaces the neutral busy glyph while thinking or working, such as a brand loader. */
  indicator?: ReactNode;
};

const settledIcons = {
  done: CircleCheckIcon,
  failed: CircleXIcon,
  stopped: CircleStopIcon,
};

function isAgentStatusBusy(
  status: AgentStatus,
): status is "thinking" | "working" {
  return status === "thinking" || status === "working";
}

/**
 * A status line: a glyph and its label. It never announces itself; route phase
 * changes through the conversation's announcer. While busy, the label shimmers
 * with `--agent-shimmer`, a gradient image you can set on any ancestor.
 */
export function AgentStatusIndicator({
  status,
  indicator,
  className,
  children,
  render,
  ...props
}: AgentStatusIndicatorProps): ReactElement {
  const Icon = isAgentStatusBusy(status) ? undefined : settledIcons[status];
  const busy = !Icon;
  const defaultProps = {
    children: (
      <>
        <span
          aria-hidden="true"
          className="flex h-lh w-3.5 shrink-0 items-center justify-center [&_svg:not([class*='size-'])]:size-3.5"
          data-slot="agent-status-indicator-glyph"
        >
          {Icon ? (
            <Icon />
          ) : (
            (indicator ?? (
              <LoaderCircleIcon className="motion-safe:animate-spin" />
            ))
          )}
        </span>
        <span
          className={cn(
            "min-w-0 [overflow-wrap:anywhere]",
            busy &&
              // Purple to rose by default. The base layer keeps the text readable between sweeps.
              "motion-safe:animate-[skeleton_1.2s_-0.6s_infinite_linear] motion-safe:bg-clip-text motion-safe:text-transparent motion-safe:[background-image:var(--agent-shimmer,linear-gradient(105deg,transparent_12%,--alpha(var(--color-info-foreground)/72%)_32%,--alpha(var(--color-purple-500)/76%)_50%,--alpha(var(--color-rose-500)/68%)_68%,transparent_88%)),linear-gradient(var(--color-muted-foreground),var(--color-muted-foreground))] motion-safe:[background-size:200%_100%,100%_100%]",
          )}
          data-slot="agent-status-indicator-label"
        >
          {children}
        </span>
      </>
    ),
    className: cn(
      "inline-flex min-w-0 max-w-full items-start gap-1.5 text-muted-foreground text-xs",
      status === "failed" && "font-medium text-destructive-foreground",
      className,
    ),
    "data-slot": "agent-status-indicator",
    "data-status": status,
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}
