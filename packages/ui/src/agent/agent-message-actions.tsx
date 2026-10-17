"use client";

import type { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import { Button, type ButtonProps } from "@coss/ui/components/button";
import { Toolbar, ToolbarButton } from "@coss/ui/components/toolbar";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@coss/ui/components/tooltip";
import { useCopyToClipboard } from "@coss/ui/hooks/use-copy-to-clipboard";
import { cn } from "@coss/ui/lib/utils";
import { CheckIcon, CopyIcon, PencilIcon } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

export type AgentMessageActionsProps = Omit<
  ToolbarPrimitive.Root.Props,
  "aria-label"
> & {
  label: string;
};

export function AgentMessageActions({
  label,
  className,
  ...props
}: AgentMessageActionsProps): ReactElement {
  return (
    <TooltipProvider>
      <Toolbar
        aria-label={label}
        data-slot="agent-message-actions"
        className={cn(
          "w-fit items-center gap-0.5 rounded-none border-0 bg-transparent p-0",
          className,
        )}
        {...props}
      />
    </TooltipProvider>
  );
}

export type AgentMessageActionProps = Omit<
  ButtonProps,
  "aria-label" | "children" | "size" | "variant"
> & {
  label: string;
  children: ReactNode;
  /** Tooltip content. Defaults to `label`. */
  tooltip?: ReactNode;
};

export function AgentMessageAction({
  label,
  children,
  tooltip = label,
  onClick,
  render,
  disabled,
  className,
  ...props
}: AgentMessageActionProps): ReactElement {
  // An action that can't do anything is a real disabled button, never aria-disabled alone.
  const inactive = disabled || (!onClick && !render);
  return (
    <Tooltip disableHoverablePopup>
      <TooltipTrigger
        render={
          <ToolbarButton
            disabled={inactive}
            focusableWhenDisabled={false}
            render={
              <Button
                aria-label={label}
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  className,
                )}
                data-slot="agent-message-action"
                disabled={inactive}
                onClick={onClick}
                render={render}
                size="icon-xs"
                variant="ghost"
                {...props}
              />
            }
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipPopup side="bottom">{tooltip}</TooltipPopup>
    </Tooltip>
  );
}

export type AgentMessageCopyActionProps = Omit<
  AgentMessageActionProps,
  "children" | "onClick" | "render" | "tooltip"
> & {
  text: string;
  copiedLabel: string;
  /** Called after the text reaches the clipboard. Announce `copiedLabel` here; the button's name stays `label`. */
  onCopy?: () => void;
};

export function AgentMessageCopyAction({
  text,
  label,
  copiedLabel,
  onCopy,
  disabled,
  ...props
}: AgentMessageCopyActionProps): ReactElement {
  const { copyToClipboard, isCopied } = useCopyToClipboard({ onCopy });
  return (
    <AgentMessageAction
      data-copied={isCopied || undefined}
      disabled={disabled || !text}
      label={label}
      tooltip={isCopied ? copiedLabel : label}
      onClick={() => copyToClipboard(text)}
      {...props}
    >
      {isCopied ? (
        <CheckIcon aria-hidden="true" />
      ) : (
        <CopyIcon aria-hidden="true" />
      )}
    </AgentMessageAction>
  );
}

export type AgentMessageEditActionProps = Omit<
  AgentMessageActionProps,
  "children" | "onClick" | "render"
> & {
  onEdit: () => void;
};

export function AgentMessageEditAction({
  onEdit,
  ...props
}: AgentMessageEditActionProps): ReactElement {
  return (
    <AgentMessageAction onClick={onEdit} {...props}>
      <PencilIcon aria-hidden="true" />
    </AgentMessageAction>
  );
}
