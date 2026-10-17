"use client";

import { RotateCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AgentMessage } from "@/registry/default/agent/agent-message";
import { ChatMessageCaret } from "@/registry/default/chat/chat-message-caret";
import { ChatMessageText } from "@/registry/default/chat/chat-message-text";
import { ChatMessageTimestamp } from "@/registry/default/chat/chat-message-timestamp";
import { Button } from "@/registry/default/ui/button";

const reply =
  "You have three meetings tomorrow. The first starts at 09:30, and there’s a free hour after lunch if you need focus time.";
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
    <div className="flex w-full max-w-sm flex-col gap-6">
      <AgentMessage
        from="user"
        footer={
          <ChatMessageTimestamp dateTime="2026-10-17T16:02:00Z">
            16:02
          </ChatMessageTimestamp>
        }
      >
        What does tomorrow look like?
      </AgentMessage>
      <AgentMessage
        from="assistant"
        streaming={streaming}
        footer={
          streaming ? (
            "Writing…"
          ) : (
            <ChatMessageTimestamp dateTime="2026-10-17T16:02:00Z">
              16:02
            </ChatMessageTimestamp>
          )
        }
      >
        <ChatMessageText text={chunks.slice(0, count).join("")}>
          {streaming && <ChatMessageCaret />}
        </ChatMessageText>
      </AgentMessage>
      <Button
        className="self-start"
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
