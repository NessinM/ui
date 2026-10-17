"use client";

import { useState } from "react";
import { Button } from "@/registry/default/ui/button";
import { Input } from "@/registry/default/ui/input";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/default/ui/message-scroller";

type Message = { id: string; author: "Sam" | "You"; text: string };
const initialMessages: Message[] = [
  { id: "1", author: "Sam", text: "Are we still meeting at ten tomorrow?" },
  { id: "2", author: "You", text: "Yes! Let’s meet in the studio." },
  {
    id: "3",
    author: "Sam",
    text: "Perfect. I’ll bring the sketches from our last session.",
  },
  {
    id: "4",
    author: "You",
    text: "I’ve put together a short agenda so we have time to discuss everyone’s ideas.",
  },
  {
    id: "5",
    author: "Sam",
    text: "Great. Could we leave a few minutes at the end to agree on next steps?",
  },
  {
    id: "6",
    author: "You",
    text: "Absolutely. We’ll finish with owners and dates for each action.",
  },
];
const incomingMessages = [
  "I’ve added the meeting notes to our shared folder.",
  "The room is booked. We’ll have a whiteboard too.",
  "I’ll bring coffee. See you in the morning!",
];

export default function Particle() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [received, setReceived] = useState(0);

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-sm">Chat with Sam</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const text = incomingMessages[received % incomingMessages.length];
            if (text === undefined) return;
            const id = crypto.randomUUID();
            setMessages((rows) => [
              ...rows,
              {
                id,
                author: "Sam",
                text,
              },
            ]);
            setReceived((count) => count + 1);
          }}
        >
          Receive a message
        </Button>
      </div>
      <MessageScrollerProvider
        autoScroll
        defaultScrollPosition="end"
        scrollEdgeThreshold={0}
      >
        <MessageScroller className="h-80 rounded-lg border">
          <MessageScrollerViewport aria-label="Team conversation">
            <MessageScrollerContent className="gap-4 p-4">
              {messages.map((message) => (
                <MessageScrollerItem
                  key={message.id}
                  messageId={message.id}
                  className={
                    message.author === "You"
                      ? "ms-auto max-w-[85%] rounded-xl bg-primary px-3 py-2 text-primary-foreground"
                      : "me-auto max-w-[85%] rounded-xl bg-muted px-3 py-2"
                  }
                >
                  <p className="mb-1 font-medium text-xs">{message.author}</p>
                  <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton aria-label="Latest chat messages" />
        </MessageScroller>
      </MessageScrollerProvider>
      <form
        className="flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) return;
          const id = crypto.randomUUID();
          setMessages((rows) => [
            ...rows,
            { id, author: "You", text: draft.trim() },
          ]);
          setDraft("");
        }}
      >
        <Input
          type="text"
          aria-label="Chat message"
          placeholder="Write a message…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <Button type="submit" disabled={!draft.trim()}>
          Send message
        </Button>
      </form>
      <p className="text-muted-foreground text-xs">
        Receive a message while at the bottom, then scroll up and receive
        another. Your reading position stays put. Use the arrow to return to the
        latest messages.
      </p>
    </div>
  );
}
