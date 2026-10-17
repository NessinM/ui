"use client";

import { RotateCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ChatMessage } from "@/registry/default/chat/chat-message";
import { ChatMessageCaret } from "@/registry/default/chat/chat-message-caret";
import { ChatMessageText } from "@/registry/default/chat/chat-message-text";
import { Button } from "@/registry/default/ui/button";

const reply =
  "Tuesday at 10:30 works for every interviewer. I’ve held the slot and added a 15-minute buffer before the next call.";
const chunks = reply.match(/\S+\s*/g) ?? [];

export default function Particle() {
  const [count, setCount] = useState(0);
  const streaming = count < chunks.length;

  useEffect(() => {
    if (count >= chunks.length) return;
    const timeout = window.setTimeout(() => setCount(count + 1), 90);
    return () => window.clearTimeout(timeout);
  }, [count]);

  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-4">
      <ChatMessage
        side="incoming"
        author="Assistant"
        className="w-full"
        streaming={streaming}
        footer={streaming ? "Writing…" : "Just now"}
      >
        <ChatMessageText text={chunks.slice(0, count).join("")}>
          {streaming && <ChatMessageCaret />}
        </ChatMessageText>
      </ChatMessage>
      <Button
        disabled={streaming}
        size="sm"
        variant="outline"
        onClick={() => setCount(0)}
      >
        <RotateCcwIcon aria-hidden="true" />
        Replay
      </Button>
    </div>
  );
}
