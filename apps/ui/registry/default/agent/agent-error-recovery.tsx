"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { CircleAlertIcon } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";

export type AgentErrorRecoveryProps = useRender.ComponentProps<"div"> & {
  /** What went wrong, in your words, such as “The connection dropped.” */
  children: ReactNode;
  /** Names the retry action, such as “Try again”. */
  retryLabel?: string;
  /** Runs the turn again. Without it, the retry action isn't rendered. */
  onRetry?: () => void;
  /** Names the check-status action, such as “Check status”, for a turn that may have changed something. */
  checkStatusLabel?: string;
  /** Finds out whether the failed turn finished. Without it, the action isn't rendered. */
  onCheckStatus?: () => void;
};

/**
 * Shows a failed turn and the recovery your host offers. Your host decides what failed
 * and which action fits; remove it once recovery starts.
 */
export function AgentErrorRecovery({
  children,
  retryLabel,
  onRetry,
  checkStatusLabel,
  onCheckStatus,
  className,
  render,
  ...props
}: AgentErrorRecoveryProps): ReactElement {
  const actions = [
    { label: checkStatusLabel, onClick: onCheckStatus, slot: "check-status" },
    { label: retryLabel, onClick: onRetry, slot: "retry" },
  ].filter((action) => action.label && action.onClick);

  const defaultProps = {
    children: (
      <>
        <div
          className="flex items-start gap-1.5 text-muted-foreground text-sm"
          data-slot="agent-error-recovery-message"
        >
          <span className="flex h-lh shrink-0 items-center">
            <CircleAlertIcon
              aria-hidden="true"
              className="size-4 text-destructive-foreground"
            />
          </span>
          <div>{children}</div>
        </div>
        {actions.length > 0 && (
          <div
            className="flex flex-wrap gap-2"
            data-slot="agent-error-recovery-actions"
          >
            {actions.map((action) => (
              <Button
                data-slot={`agent-error-recovery-${action.slot}`}
                key={action.slot}
                onClick={action.onClick}
                size="xs"
                variant="outline"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </>
    ),
    className: cn("flex flex-col items-start gap-2", className),
    "data-slot": "agent-error-recovery",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}
