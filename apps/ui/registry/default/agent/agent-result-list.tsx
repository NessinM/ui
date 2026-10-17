"use client";

import type { useRender } from "@base-ui/react/use-render";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { type ReactElement, type ReactNode, useState } from "react";
import { cn } from "@/registry/default/lib/utils";
import { Card } from "@/registry/default/ui/card";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/default/ui/collapsible";
import {
  AGENT_RESULT_LIST_PREVIEW_COUNT,
  splitAgentResultItems,
} from "./lib/split-agent-result-items";

export type AgentResultItem = {
  id: string;
  title: string;
  /** Short secondary text after the title, such as a time. */
  description?: string;
  /** Shown at the end of the row, such as badges. */
  trailing?: ReactNode;
  /** Makes the row a link. */
  href?: string;
  /** The link's accessible name. Defaults to the title. */
  label?: string;
};

export type AgentResultListProps = Omit<
  useRender.ComponentProps<"div">,
  "children"
> & {
  items: readonly AgentResultItem[];
  /** Rows shown before “show more”. A leftover of one row is shown instead of hidden. */
  previewCount?: number;
  /** The toggle's label while rows are hidden, given how many. */
  showMoreLabel: (hiddenCount: number) => string;
  showLessLabel: string;
};

const rowClassName = "flex items-center gap-2 px-3 py-2 text-xs";
const interactiveRowClassName =
  "outline-none hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

function AgentResultRows({
  items,
}: {
  items: readonly AgentResultItem[];
}): ReactElement {
  return (
    <ul className="flex flex-col">
      {items.map((item) => {
        const content = (
          <>
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <span className="min-w-0 truncate font-medium text-foreground">
                {item.title}
              </span>
              {item.description && (
                <span className="shrink-0 text-muted-foreground">
                  {item.description}
                </span>
              )}
            </span>
            {item.trailing && (
              <span className="flex shrink-0 items-center gap-1.5">
                {item.trailing}
              </span>
            )}
          </>
        );
        return (
          <li
            className="not-first:border-t"
            data-slot="agent-result-list-item"
            key={item.id}
          >
            {item.href ? (
              <a
                aria-label={item.label ?? item.title}
                className={cn(rowClassName, interactiveRowClassName)}
                href={item.href}
              >
                {content}
              </a>
            ) : (
              <div className={rowClassName}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function AgentResultListRemainder({
  hidden,
  showMoreLabel,
  showLessLabel,
}: {
  hidden: readonly AgentResultItem[];
  showMoreLabel: (hiddenCount: number) => string;
  showLessLabel: string;
}): ReactElement {
  const [open, setOpen] = useState(false);
  const Icon = open ? ChevronsDownUpIcon : ChevronsUpDownIcon;
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsiblePanel className="border-t motion-reduce:transition-none">
        <AgentResultRows items={hidden} />
      </CollapsiblePanel>
      <CollapsibleTrigger
        className={cn(
          rowClassName,
          interactiveRowClassName,
          "w-full cursor-pointer border-t text-start text-muted-foreground",
        )}
        data-slot="agent-result-list-toggle"
      >
        <Icon aria-hidden="true" className="size-3.5 shrink-0" />
        {open ? showLessLabel : showMoreLabel(hidden.length)}
      </CollapsibleTrigger>
    </Collapsible>
  );
}

/** A card of result rows. Long lists show the first rows and put the rest behind a toggle. */
export function AgentResultList({
  items,
  previewCount = AGENT_RESULT_LIST_PREVIEW_COUNT,
  showMoreLabel,
  showLessLabel,
  className,
  ...props
}: AgentResultListProps): ReactElement | null {
  if (items.length === 0) return null;
  const { visible, hidden } = splitAgentResultItems(items, previewCount);
  return (
    <Card
      className={cn("w-full min-w-0 overflow-hidden", className)}
      data-slot="agent-result-list"
      {...props}
    >
      <AgentResultRows items={visible} />
      {hidden.length > 0 && (
        <AgentResultListRemainder
          // A new result set starts collapsed again.
          key={items.map((item) => item.id).join("\0")}
          hidden={hidden}
          showLessLabel={showLessLabel}
          showMoreLabel={showMoreLabel}
        />
      )}
    </Card>
  );
}
