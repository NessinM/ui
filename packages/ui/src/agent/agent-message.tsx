"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@coss/ui/lib/utils";
import type { ComponentProps, ReactElement, ReactNode } from "react";

export type AgentMessageProps = useRender.ComponentProps<"div"> & {
  from: "user" | "assistant";
  actions?: ReactNode;
  /** Keep actions shown and in the flow, such as on the latest finished reply. */
  actionsAlwaysVisible?: boolean;
};

export function AgentMessage({
  from,
  actions,
  actionsAlwaysVisible = false,
  children,
  className,
  render,
  ...props
}: AgentMessageProps): ReactElement {
  const user = from === "user";
  const defaultProps = {
    children: (
      <>
        <div
          data-slot="agent-message-content"
          className={cn(
            "flex min-w-0 max-w-3xl flex-col gap-2 text-foreground text-sm leading-6 [overflow-wrap:anywhere]",
            user &&
              "ms-auto w-fit max-w-[min(85%,48rem)] rounded-lg bg-muted px-3 py-2",
          )}
        >
          {children}
        </div>
        {actions != null && (
          <div
            data-slot="agent-message-actions-slot"
            className={cn(
              "z-10 flex pt-1 transition-opacity motion-reduce:transition-none",
              actionsAlwaysVisible
                ? "static"
                : "absolute top-full in-[[data-slot=agent-message]:focus-within]:opacity-100 in-[[data-slot=agent-message]:hover]:opacity-100 opacity-0 pointer-coarse:opacity-100 has-data-popup-open:opacity-100",
              user ? "end-0 self-end" : "start-0 self-start",
            )}
          >
            {actions}
          </div>
        )}
      </>
    ),
    className: cn(
      "flex w-full min-w-0 flex-col gap-1",
      actions != null && "relative",
      className,
    ),
    "data-actions-visible": actionsAlwaysVisible || undefined,
    "data-from": from,
    "data-slot": "agent-message",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

/** Wraps prompt and reply prose. Plain text keeps its line breaks; block markup wraps normally. */
export function AgentMessageText({
  className,
  ...props
}: ComponentProps<"div">): ReactElement {
  return (
    <div
      data-slot="agent-message-text"
      className={cn(
        "min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere] has-[ol,ul,p,pre,h1,h2,h3,h4,h5,h6,blockquote,table,hr]:whitespace-normal",
        className,
      )}
      {...props}
    />
  );
}
