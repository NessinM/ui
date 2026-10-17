"use client";

import { CollapsibleTrigger } from "@coss/ui/components/collapsible";
import { cn } from "@coss/ui/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import type { ComponentProps, ReactElement } from "react";

export type AgentDisclosureTriggerProps = ComponentProps<
  typeof CollapsibleTrigger
>;

/** The trigger reasoning and tool activity share: its content, then a chevron that turns when open. */
export function AgentDisclosureTrigger({
  className,
  children,
  ...props
}: AgentDisclosureTriggerProps): ReactElement {
  return (
    <CollapsibleTrigger
      className={cn(
        "flex w-fit min-w-0 max-w-full cursor-pointer items-start gap-1.5 rounded-sm text-start text-muted-foreground text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        className,
      )}
      data-slot="agent-disclosure-trigger"
      {...props}
    >
      {children}
      <ChevronRightIcon
        aria-hidden="true"
        className="h-lh w-3.5 shrink-0 in-data-panel-open:rotate-90 transition-transform motion-reduce:transition-none rtl:in-data-panel-open:-rotate-90 rtl:-scale-x-100"
      />
    </CollapsibleTrigger>
  );
}
