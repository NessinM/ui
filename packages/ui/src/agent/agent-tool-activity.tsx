"use client";

import { Collapsible, CollapsiblePanel } from "@coss/ui/components/collapsible";
import { cn } from "@coss/ui/lib/utils";
import { WrenchIcon } from "lucide-react";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { AgentDisclosureTrigger } from "./agent-disclosure-trigger";
import { AgentStatusIndicator } from "./agent-status-indicator";
import {
  type AgentToolActivityLabels,
  type AgentToolCall,
  getAgentToolSummary,
} from "./lib/get-agent-tool-summary";

/** How one tool's calls look in tool activity. */
export type AgentToolRenderer = {
  /** What the tool does, such as “Checking availability”. Names a single running call in the summary. */
  label: string;
  /** Shown before each row. Defaults to a wrench. */
  icon?: ReactNode;
  /** The row's content for a call, such as a summary of its output. Return nothing to keep the label. */
  render?: (call: AgentToolCall) => ReactNode;
};

/** Tool renderers by tool name. */
export type AgentToolRenderers = Readonly<
  Record<string, AgentToolRenderer | undefined>
>;

export type AgentToolActivityProps = Omit<
  ComponentProps<typeof Collapsible>,
  "children"
> & {
  calls: readonly AgentToolCall[];
  labels: AgentToolActivityLabels;
  renderers?: AgentToolRenderers;
  /** Replaces the neutral busy glyph while calls run. */
  indicator?: ReactNode;
};

function AgentToolCallContent({
  call,
  renderer,
}: {
  call: AgentToolCall;
  renderer: AgentToolRenderer | undefined;
}): ReactNode {
  const custom = renderer?.render?.(call);
  if (custom !== undefined && custom !== null) return custom;
  const label = renderer?.label ?? call.name;
  switch (call.state) {
    case "running":
      return <span className="motion-safe:animate-pulse">{label}</span>;
    case "failed":
      return (
        <>
          <span className="font-medium">{label}</span>
          {call.error && (
            <span className="text-muted-foreground"> {call.error}</span>
          )}
        </>
      );
    case "denied":
      return <del className="text-muted-foreground">{label}</del>;
    default:
      return label;
  }
}

/** A run of tool calls behind one summary line, closed until the reader opens it. */
export function AgentToolActivity({
  calls,
  labels,
  renderers = {},
  indicator,
  className,
  ...props
}: AgentToolActivityProps): ReactElement {
  const summary = getAgentToolSummary(calls, labels, renderers);

  return (
    <Collapsible
      className={cn("flex min-w-0 flex-col", className)}
      data-slot="agent-tool-activity"
      data-status={summary.status}
      {...props}
    >
      <AgentDisclosureTrigger data-slot="agent-tool-activity-trigger">
        <AgentStatusIndicator indicator={indicator} status={summary.status}>
          {summary.label}
        </AgentStatusIndicator>
      </AgentDisclosureTrigger>
      <CollapsiblePanel className="motion-reduce:transition-none">
        <ul className="flex flex-col gap-1.5 ps-5 pt-1.5">
          {calls.map((call) => {
            const renderer = renderers[call.name];
            return (
              <li
                className="flex gap-1.5 text-foreground text-xs"
                data-slot="agent-tool-activity-row"
                data-state={call.state}
                key={call.id}
              >
                <span
                  aria-hidden="true"
                  className="flex h-lh w-3.5 shrink-0 items-center justify-center text-muted-foreground [&_svg:not([class*='size-'])]:size-3.5"
                >
                  {renderer?.icon ?? <WrenchIcon />}
                </span>
                <div className="min-w-0">
                  <AgentToolCallContent call={call} renderer={renderer} />
                </div>
              </li>
            );
          })}
        </ul>
      </CollapsiblePanel>
    </Collapsible>
  );
}
