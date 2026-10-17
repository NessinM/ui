import type { ComponentProps, ReactElement } from "react";
import { cn } from "@/registry/default/lib/utils";
import type { AgentAnnouncerController } from "./hooks/use-agent-announcer";

export type AgentAnnouncerProps = Omit<
  ComponentProps<"span">,
  "children" | "role"
> & {
  announcer: AgentAnnouncerController;
};

/** The conversation's one status region. Render it once, outside the scrolling log. */
export function AgentAnnouncer({
  announcer,
  className,
  ...props
}: AgentAnnouncerProps): ReactElement {
  return (
    <span
      aria-atomic="true"
      aria-live="polite"
      data-slot="agent-announcer"
      role="status"
      className={cn("sr-only", className)}
      {...props}
    >
      {announcer.message}
    </span>
  );
}
