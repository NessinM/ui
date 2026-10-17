"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { Columns3Icon, XIcon } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { cn } from "@/registry/default/lib/utils";
import { Button, type ButtonProps } from "@/registry/default/ui/button";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuPopup,
  ContextMenuTrigger,
} from "@/registry/default/ui/context-menu";

export type AgentActionBarProps = Omit<
  useRender.ComponentProps<"div">,
  "aria-label" | "role"
> & {
  label: string;
};

/** A labelled row of session chips and a launcher. Your application places it, for example fixed to a corner. */
export function AgentActionBar({
  label,
  className,
  render,
  ...props
}: AgentActionBarProps): ReactElement {
  const defaultProps = {
    "aria-label": label,
    role: "group",
    "data-slot": "agent-action-bar",
    className: cn("flex min-w-0 items-center justify-end gap-1", className),
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}

const chipClassName =
  "text-muted-foreground hover:text-foreground aria-[current]:bg-accent aria-[current]:text-foreground data-popup-open:bg-accent data-popup-open:text-foreground";

export type AgentActionBarSessionProps = Omit<
  ButtonProps,
  "aria-current" | "children" | "size" | "variant"
> & {
  label: string;
  /** The session is open, for example in a panel. Sets `aria-current`. */
  active?: boolean;
  /** The session changed since the reader last saw it. Derive it with `isAgentSessionUnread`. */
  unread?: boolean;
  /** Read after the label while `unread` is set, such as “Unread”. */
  unreadLabel?: string;
  /** The close button’s accessible name. Include the session, such as “Close Plan the offsite”. */
  closeLabel?: string;
  /** Without it, the chip has no close button. */
  onClose?: () => void;
  closeOthersLabel?: string;
  /** Adds a context menu with close and close others. */
  onCloseOthers?: () => void;
};

/**
 * One open session. Props other than the ones below go to the session button, so it can be the
 * `render` of a popover trigger. The close button shows on hover and focus, and always on touch.
 */
export function AgentActionBarSession({
  label,
  active = false,
  unread = false,
  unreadLabel,
  closeLabel,
  onClose,
  closeOthersLabel,
  onCloseOthers,
  onClick,
  render,
  disabled,
  className,
  ...props
}: AgentActionBarSessionProps): ReactElement {
  const closable = Boolean(onClose && closeLabel);
  const chip = (
    <div
      data-slot="agent-action-bar-session"
      data-active={active || undefined}
      data-unread={unread || undefined}
      className={cn("relative flex min-w-0 max-w-44", className)}
    >
      <Button
        aria-current={active ? "true" : undefined}
        className={cn(
          "w-full min-w-0 justify-start",
          chipClassName,
          // The chip stays lit while the pointer is on its close button.
          closable &&
            "in-[[data-slot=agent-action-bar-session]:hover]:bg-accent pe-7 in-[[data-slot=agent-action-bar-session]:hover]:text-foreground sm:pe-6",
        )}
        disabled={disabled || (!onClick && !render)}
        onClick={onClick}
        render={render}
        size="xs"
        variant="ghost"
        {...props}
      >
        {unread && (
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-primary"
            data-slot="agent-action-bar-session-unread"
          />
        )}
        <span className="min-w-0 truncate">{label}</span>
        {unread && unreadLabel && (
          <span className="sr-only">, {unreadLabel}</span>
        )}
      </Button>
      {closable && (
        <Button
          aria-label={closeLabel}
          className={cn(
            "absolute inset-y-0 end-0 text-muted-foreground transition-opacity hover:bg-transparent hover:text-foreground motion-reduce:transition-none",
            // Fine pointers reveal close on hover or focus. Coarse pointers have no hover, so it stays.
            "pointer-fine:in-[[data-slot=agent-action-bar-session]:not(:hover):not(:focus-within)]:opacity-0",
          )}
          data-slot="agent-action-bar-session-close"
          onClick={onClose}
          size="icon-xs"
          variant="ghost"
        >
          <XIcon aria-hidden="true" />
        </Button>
      )}
    </div>
  );

  if (!onCloseOthers || !closeOthersLabel || !closable) return chip;

  return (
    <ContextMenu>
      <ContextMenuTrigger render={chip} />
      <ContextMenuPopup>
        <ContextMenuItem onClick={onClose}>
          <XIcon aria-hidden="true" />
          {closeLabel}
        </ContextMenuItem>
        <ContextMenuItem onClick={onCloseOthers}>
          <Columns3Icon aria-hidden="true" />
          {closeOthersLabel}
        </ContextMenuItem>
      </ContextMenuPopup>
    </ContextMenu>
  );
}

export type AgentActionBarLauncherProps = Omit<
  ButtonProps,
  "aria-current" | "size" | "variant"
> & {
  /** The new conversation is open. Sets `aria-current`. */
  active?: boolean;
  /** The agent’s identity mark before the label, such as a logo. It’s hidden from screen readers. */
  mark?: ReactNode;
};

/** Starts a new conversation. Its children are the label. */
export function AgentActionBarLauncher({
  active = false,
  mark,
  children,
  onClick,
  render,
  disabled,
  className,
  ...props
}: AgentActionBarLauncherProps): ReactElement {
  return (
    <Button
      aria-current={active ? "true" : undefined}
      className={cn("shrink-0", chipClassName, className)}
      data-slot="agent-action-bar-launcher"
      disabled={disabled || (!onClick && !render)}
      onClick={onClick}
      render={render}
      size="xs"
      variant="ghost"
      {...props}
    >
      {mark && (
        <span
          aria-hidden="true"
          className="flex shrink-0 items-center"
          data-slot="agent-action-bar-launcher-mark"
        >
          {mark}
        </span>
      )}
      {children}
    </Button>
  );
}
