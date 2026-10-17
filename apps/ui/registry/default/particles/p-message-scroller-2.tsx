"use client";

import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerVisibility,
} from "@/registry/default/ui/message-scroller";

const conversation = [
  { id: "goal", role: "user", text: "What should our workshop achieve?" },
  {
    id: "goal-reply",
    role: "assistant",
    text: "Agree on one problem the team can solve together. Collect examples in advance, then choose a concrete outcome everyone can help deliver.",
  },
  { id: "agenda", role: "user", text: "Can you suggest an agenda?" },
  {
    id: "agenda-reply",
    role: "assistant",
    text: "Start with a ten-minute check-in. Spend twenty minutes exploring the problem in pairs, then share ideas with the group. Take a short break before choosing one idea to develop.\n\nGive each pair a sheet of paper and ask them to sketch their proposal. Leave time for questions before selecting the next step.",
  },
  { id: "recap", role: "user", text: "How should we follow up afterward?" },
  {
    id: "recap-reply",
    role: "assistant",
    text: Array.from(
      { length: 6 },
      () =>
        "Write down each decision while it is fresh. Assign an owner and a date to every action, then share the recap with everyone who attended. Schedule a short check-in to discuss what changed and what the team learned.",
    ).join("\n\n"),
  },
];

export default function Particle() {
  const [position, setPosition] = useState<"start" | "end" | "last-anchor">(
    "last-anchor",
  );
  const [pages, setPages] = useState(0);
  const older = Array.from({ length: pages }, (_, index) => ({
    id: `earlier-${pages - index}`,
    role: "user",
    text: `Earlier note ${pages - index}: gather everyone’s goals before writing the agenda.`,
  }));
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">Open at</span>
        {(["start", "end", "last-anchor"] as const).map((value) => (
          <Button
            key={value}
            size="sm"
            variant={position === value ? "secondary" : "ghost"}
            aria-pressed={position === value}
            onClick={() => {
              setPosition(value);
              setPages(0);
            }}
          >
            {value === "last-anchor"
              ? "Last prompt"
              : value === "start"
                ? "Start"
                : "End"}
          </Button>
        ))}
      </div>
      <MessageScrollerProvider
        key={position}
        defaultScrollPosition={position}
        scrollPreviousItemPeek={0}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPages((value) => value + 1)}
          >
            Load earlier messages
          </Button>
          <HistoryNavigation />
        </div>
        <MessageScroller className="h-80 rounded-lg border">
          <MessageScrollerViewport aria-label="Saved workshop conversation">
            <MessageScrollerContent className="p-4">
              {[...older, ...conversation].map((message) => (
                <MessageScrollerItem
                  key={message.id}
                  messageId={message.id}
                  scrollAnchor={message.role === "user"}
                  className={
                    message.role === "user" ? "rounded-lg bg-muted p-3" : "px-3"
                  }
                >
                  <p className="mb-1 font-medium text-sm">
                    {message.role === "user" ? "You" : "Assistant"}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.text}
                  </p>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="start" />
          <MessageScrollerButton direction="end" />
        </MessageScroller>
      </MessageScrollerProvider>
      <p className="text-muted-foreground text-xs">
        Changing the opening position reopens this saved conversation. Loading
        earlier messages keeps your place.
      </p>
    </div>
  );
}

function HistoryNavigation() {
  const { scrollToMessage } = useMessageScroller();
  const { currentAnchorId } = useMessageScrollerVisibility();
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => scrollToMessage("agenda")}
      >
        Go to agenda
      </Button>
      <span className="text-muted-foreground text-xs">
        {currentAnchorId ? `Reading: ${currentAnchorId}` : "Saved conversation"}
      </span>
    </>
  );
}
