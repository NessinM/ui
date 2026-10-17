"use client";

import { MessageCircleIcon, PlusIcon, SearchIcon } from "lucide-react";
import { type ReactElement, useState } from "react";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxSeparator,
  ComboboxTrigger,
} from "@/registry/default/ui/combobox";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/default/ui/empty";
import { Spinner } from "@/registry/default/ui/spinner";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";
import { filterAgentHistory } from "./lib/filter-agent-history";

export type AgentHistoryItem = {
  id: string;
  title: string;
  updatedAt: Date;
  /** Short text before the date, such as the session’s owner or a message count. */
  metadata?: string;
  /** Derive it with `isAgentSessionUnread`. */
  unread?: boolean;
};

export type AgentHistoryLabels = {
  /** Names the trigger, its tooltip and the popup. */
  history: string;
  /** Names the search field and fills its placeholder. */
  search: string;
  noResults: string;
  emptyTitle: string;
  emptyDescription?: string;
  loading: string;
  /** Read after an unread conversation’s title, such as “Unread”. */
  unread: string;
  /** Labels the start-chat row. Required with `onStartChat`. */
  startChat?: string;
  formatDate: (date: Date) => string;
};

export type AgentHistoryProps = {
  items: readonly AgentHistoryItem[];
  labels: AgentHistoryLabels;
  /** The open conversation. It shows as the list’s selected item. */
  activeId?: string;
  onSelect: (item: AgentHistoryItem) => void;
  /** Adds a start-chat row above the list while not searching, and a start button to the empty state. */
  onStartChat?: () => void;
  /** Shows a spinner while there are no items yet. */
  loading?: boolean;
  /** An icon button. It’s rendered through the combobox trigger and gets a tooltip. */
  trigger: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
};

type Row =
  | { kind: "start"; id: string; title: string }
  | ({ kind: "conversation" } & AgentHistoryItem);

const START_ROW_ID = "agent-history-start-chat";

/** Searchable conversation history in a popover, on coss Combobox. */
export function AgentHistory({
  items,
  labels,
  activeId,
  onSelect,
  onStartChat,
  loading = false,
  trigger,
  open,
  onOpenChange,
  side = "top",
  align = "end",
  className,
}: AgentHistoryProps): ReactElement {
  const [query, setQuery] = useState("");
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = open ?? uncontrolledOpen;
  const setOpen = (nextOpen: boolean): void => {
    if (!nextOpen) setQuery("");
    setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };
  const conversations: Row[] = filterAgentHistory(items, query).map((item) => ({
    kind: "conversation",
    ...item,
  }));
  const startRow: Row | null =
    onStartChat && labels.startChat
      ? { kind: "start", id: START_ROW_ID, title: labels.startChat }
      : null;
  // While searching, the first match leads, so Enter opens it.
  const rows =
    startRow && !query.trim() ? [startRow, ...conversations] : conversations;
  const active = conversations.find((row) => row.id === activeId) ?? null;

  let content: ReactElement;
  if (items.length === 0 && loading) {
    content = (
      <div
        aria-busy="true"
        className="flex items-center justify-center gap-2 p-6 text-muted-foreground text-sm"
        data-slot="agent-history-loading"
      >
        <Spinner aria-hidden="true" />
        {labels.loading}
      </div>
    );
  } else if (items.length === 0) {
    content = (
      <Empty data-slot="agent-history-empty">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageCircleIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>{labels.emptyTitle}</EmptyTitle>
          {labels.emptyDescription && (
            <EmptyDescription>{labels.emptyDescription}</EmptyDescription>
          )}
        </EmptyHeader>
        {startRow && (
          <EmptyContent>
            <Button
              onClick={() => {
                setOpen(false);
                onStartChat?.();
              }}
            >
              {startRow.title}
            </Button>
          </EmptyContent>
        )}
      </Empty>
    );
  } else {
    content = (
      <>
        <div className="border-b p-2">
          <ComboboxInput
            aria-label={labels.search}
            className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
            placeholder={labels.search}
            showTrigger={false}
            startAddon={<SearchIcon />}
          />
        </div>
        <ComboboxEmpty>{labels.noResults}</ComboboxEmpty>
        <ComboboxList>
          {(row: Row) =>
            row.kind === "start" ? (
              <AgentHistoryStartRow key={row.id} row={row} />
            ) : (
              <ComboboxItem
                data-slot="agent-history-item"
                data-unread={row.unread || undefined}
                key={row.id}
                value={row}
              >
                <span className="flex min-w-0 items-center justify-between gap-2">
                  <span className="min-w-0 truncate">{row.title}</span>
                  <span className="flex shrink-0 items-center gap-2 text-muted-foreground text-xs">
                    {row.unread && (
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-primary"
                        data-slot="agent-history-item-unread"
                      />
                    )}
                    {row.unread && (
                      <span className="sr-only">{labels.unread}</span>
                    )}
                    {row.metadata && <span>{row.metadata}</span>}
                    <time dateTime={row.updatedAt.toISOString()}>
                      {labels.formatDate(row.updatedAt)}
                    </time>
                  </span>
                </span>
              </ComboboxItem>
            )
          }
        </ComboboxList>
      </>
    );
  }

  return (
    <Combobox<Row>
      autoHighlight
      filter={null}
      inputValue={query}
      isItemEqualToValue={(a, b) => a.id === b.id}
      itemToStringLabel={(row) => row.title}
      items={rows}
      onInputValueChange={(value, details) => {
        // Only typing searches. Selection would otherwise copy the chosen title into the field.
        if (
          details.reason === "input-change" ||
          details.reason === "input-clear"
        )
          setQuery(value);
      }}
      onOpenChange={setOpen}
      onValueChange={(row) => {
        if (!row) return;
        if (row.kind === "start") onStartChat?.();
        else onSelect(row);
      }}
      open={isOpen}
      value={active}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <ComboboxTrigger aria-label={labels.history} render={trigger} />
          }
        />
        <TooltipPopup>{labels.history}</TooltipPopup>
      </Tooltip>
      <ComboboxPopup
        align={align}
        aria-label={labels.history}
        className={cn("w-96", className)}
        side={side}
      >
        <div className="contents" data-slot="agent-history">
          {content}
        </div>
      </ComboboxPopup>
    </Combobox>
  );
}

function AgentHistoryStartRow({
  row,
}: {
  row: Extract<Row, { kind: "start" }>;
}): ReactElement {
  return (
    <>
      <ComboboxItem data-slot="agent-history-start-chat" value={row}>
        <span className="flex min-w-0 items-center gap-2">
          <PlusIcon aria-hidden="true" />
          <span className="min-w-0 truncate">{row.title}</span>
        </span>
      </ComboboxItem>
      <ComboboxSeparator />
    </>
  );
}
