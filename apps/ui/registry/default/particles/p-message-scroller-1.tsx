"use client";

import { useEffect, useState } from "react";
import { Button } from "@/registry/default/ui/button";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/default/ui/message-scroller";
import { Textarea } from "@/registry/default/ui/textarea";

type Message = { id: string; text: string; role: "user" | "assistant" };
const answer = [
  "Start with a shared goal. Ask each teammate to bring one problem they would like the group to solve, then leave room for discussion and a short break.",
  "Begin with a quick check-in. Give everyone a minute to describe what they hope to learn, then write down the themes that come up more than once.",
  "Choose one of those themes for a focused exercise. Working in pairs makes it easier for quieter teammates to contribute before sharing with the whole group.",
  "After the exercise, take a short break. When everyone returns, compare the ideas and identify the smallest useful next step.",
  "Keep the final discussion practical. Decide who will own each action and when the team will review it. A short list of clear commitments is easier to follow than a long list of possibilities.",
  "Send the recap while the conversation is fresh. Include the decisions, the owners, and the next check-in date so everyone can pick up where the workshop left off.",
].join("\n\n");

export default function Particle() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("Help me plan a team workshop.");
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [conversation, setConversation] = useState(0);

  useEffect(() => {
    if (!streamingId) return;
    let length = 0;
    const timer = window.setInterval(() => {
      length = Math.min(length + 32, answer.length);
      setMessages((rows) =>
        rows.map((row) =>
          row.id === streamingId
            ? { ...row, text: answer.slice(0, length) }
            : row,
        ),
      );
      if (length === answer.length) setStreamingId(null);
    }, 80);
    return () => window.clearInterval(timer);
  }, [streamingId]);

  function sendPrompt() {
    if (!draft.trim() || streamingId) return;
    const id = crypto.randomUUID();
    setMessages((rows) => [
      ...rows,
      { id, text: draft.trim(), role: "user" },
      { id: `${id}-reply`, text: "", role: "assistant" },
    ]);
    setDraft("");
    setStreamingId(`${id}-reply`);
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span aria-live="polite" className="text-muted-foreground text-sm">
          {streamingId ? "Writing a reply…" : "Workshop assistant"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setStreamingId(null);
            setMessages([]);
            setDraft("Help me plan a team workshop.");
            setConversation((value) => value + 1);
          }}
        >
          New chat
        </Button>
      </div>
      <MessageScrollerProvider
        key={conversation}
        autoScroll
        defaultScrollPosition="end"
        scrollPreviousItemPeek={0}
        scrollEdgeThreshold={0}
      >
        <MessageScroller className="h-96 rounded-lg border">
          <MessageScrollerViewport aria-label="Workshop conversation">
            <MessageScrollerContent className="gap-6 p-4">
              {messages.length === 0 && (
                <MessageScrollerItem className="py-12 text-center text-muted-foreground text-sm">
                  Send a prompt to start a conversation.
                </MessageScrollerItem>
              )}
              {messages.map((message) => (
                <MessageScrollerItem
                  key={message.id}
                  messageId={message.id}
                  scrollAnchor={message.role === "user"}
                  className={
                    message.role === "user"
                      ? "ms-auto max-w-[85%] rounded-xl bg-muted px-4 py-3"
                      : "px-1"
                  }
                >
                  <p className="mb-1 font-medium text-sm">
                    {message.role === "user" ? "You" : "Assistant"}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.text || "…"}
                  </p>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton aria-label="Jump to latest" />
        </MessageScroller>
      </MessageScrollerProvider>
      <form
        className="flex items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          sendPrompt();
        }}
      >
        <Textarea
          aria-label="Message"
          placeholder="Ask a follow-up…"
          value={draft}
          rows={2}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <Button type="submit" disabled={!draft.trim() || streamingId !== null}>
          Send
        </Button>
      </form>
      <p className="text-muted-foreground text-xs">
        Replies are simulated. Send another prompt to see anchoring, then scroll
        up while the reply arrives. Jump to latest to follow again.
      </p>
    </div>
  );
}
