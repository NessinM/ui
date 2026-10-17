"use client";

import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@coss/ui/components/alert-dialog";
import { Button, type ButtonProps } from "@coss/ui/components/button";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@coss/ui/components/menu";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@coss/ui/components/tooltip";
import { cn } from "@coss/ui/lib/utils";
import { CopyIcon, EllipsisIcon, TrashIcon } from "lucide-react";
import { type ReactElement, useState } from "react";
import type { AgentAnnouncerController } from "./hooks/use-agent-announcer";
import { copyAgentText } from "./lib/copy-agent-text";

export type AgentConversationMenuLabels = {
  /** Names the trigger and fills its tooltip. */
  menu: string;
  copyAsMarkdown: string;
  /** Announced after a successful copy. */
  copied: string;
  /** Announced when the clipboard refuses the copy. */
  copyFailed: string;
  delete: string;
  deleteTitle: string;
  deleteDescription: string;
  deleteConfirm: string;
  cancel: string;
};

export type AgentConversationMenuProps = Omit<
  ButtonProps,
  "aria-label" | "children" | "onClick" | "render" | "size" | "variant"
> & {
  labels: AgentConversationMenuLabels;
  /** The conversation as Markdown. Without it there’s no copy item; while empty, the item is disabled. */
  markdown?: string;
  /** The conversation’s announcer, or anything with `announce`. Hears the copy result once. */
  announcer: Pick<AgentAnnouncerController, "announce">;
  /** Runs after the reader confirms. Without it there’s no delete item. */
  onDelete?: () => void;
};

/** The conversation’s “…” menu: copy as Markdown, and delete behind a confirmation. */
export function AgentConversationMenu({
  labels,
  markdown,
  announcer,
  onDelete,
  className,
  ...props
}: AgentConversationMenuProps): ReactElement {
  const [confirming, setConfirming] = useState(false);

  const copy = async (): Promise<void> => {
    const copied = await copyAgentText(markdown ?? "", navigator.clipboard);
    announcer.announce(copied ? labels.copied : labels.copyFailed);
  };

  return (
    <>
      <Menu>
        <Tooltip>
          <TooltipTrigger
            render={
              <MenuTrigger
                render={
                  <Button
                    aria-label={labels.menu}
                    className={cn(
                      "text-muted-foreground hover:text-foreground data-popup-open:text-foreground",
                      className,
                    )}
                    data-slot="agent-conversation-menu"
                    size="icon-xs"
                    variant="ghost"
                    {...props}
                  />
                }
              />
            }
          >
            <EllipsisIcon aria-hidden="true" />
          </TooltipTrigger>
          <TooltipPopup>{labels.menu}</TooltipPopup>
        </Tooltip>
        <MenuPopup align="end">
          {markdown !== undefined && (
            <MenuItem disabled={!markdown} onClick={() => void copy()}>
              <CopyIcon aria-hidden="true" />
              {labels.copyAsMarkdown}
            </MenuItem>
          )}
          {markdown !== undefined && onDelete && <MenuSeparator />}
          {onDelete && (
            <MenuItem onClick={() => setConfirming(true)} variant="destructive">
              <TrashIcon aria-hidden="true" />
              {labels.delete}
            </MenuItem>
          )}
        </MenuPopup>
      </Menu>
      {onDelete && (
        <AlertDialog onOpenChange={setConfirming} open={confirming}>
          <AlertDialogPopup>
            <AlertDialogHeader>
              <AlertDialogTitle>{labels.deleteTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {labels.deleteDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogClose render={<Button variant="ghost" />}>
                {labels.cancel}
              </AlertDialogClose>
              <Button
                onClick={() => {
                  setConfirming(false);
                  onDelete();
                }}
                variant="destructive"
              >
                {labels.deleteConfirm}
              </Button>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialog>
      )}
    </>
  );
}
