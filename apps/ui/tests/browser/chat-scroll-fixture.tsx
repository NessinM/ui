"use client";

import { useRef, useState } from "react";
import {
  ChatConversation,
  ChatConversationItem,
} from "@/registry/default/chat/chat-conversation";
import { useChatScroll } from "@/registry/default/chat/hooks/use-chat-scroll";
import { ChatDemo } from "@/registry/default/chat-demo/chat-demo";
import { Button } from "@/registry/default/ui/button";
import { DrawerTrigger } from "@/registry/default/ui/drawer";

export function ChatScrollFixture() {
  const [messages, setMessages] = useState(() =>
    Array.from({ length: 12 }, (_, id) => ({ id, text: `Message ${id}` })),
  );
  const [paused, setPaused] = useState(false);
  const [unread, setUnread] = useState(0);
  const nextId = useRef(12);
  const scroll = useChatScroll({
    paused,
    onReachEnd: () => setUnread(0),
  });
  const append = (own: boolean) => {
    const id = nextId.current++;
    if (own) scroll.scrollToLatest();
    else if (!scroll.atBottomRef.current) setUnread((count) => count + 1);
    setMessages((rows) => [
      ...rows,
      { id, text: `${own ? "Sent" : "Received"} ${id}` },
    ]);
  };
  return (
    <main className="p-8">
      <div className="flex gap-4">
        <button type="button" onClick={() => append(false)}>
          Receive
        </button>
        <button type="button" onClick={() => append(true)}>
          Send
        </button>
        <button
          type="button"
          onClick={() =>
            setMessages((rows) => [{ id: -1, text: "Older message" }, ...rows])
          }
        >
          Load older
        </button>
        <button type="button" onClick={() => setPaused((value) => !value)}>
          {paused ? "Resume" : "Pause"}
        </button>
        <button type="button" onClick={() => scroll.resetScroll(false)}>
          Reset to start
        </button>
        <button type="button" onClick={() => scroll.resetScroll()}>
          Reset to end
        </button>
      </div>
      <div className="flex h-80 w-96 flex-col border">
        <ChatConversation
          scroll={scroll}
          label="Test chat"
          jumpLabel={unread ? `${unread} unread` : "Latest"}
        >
          {messages.map((message) => (
            <ChatConversationItem
              key={message.id}
              messageId={String(message.id)}
              className="h-16"
            >
              {message.text}
            </ChatConversationItem>
          ))}
        </ChatConversation>
      </div>
    </main>
  );
}

export function ChatDrawerFixture() {
  return (
    <ChatDemo
      renderTriggers={(select) => (
        <DrawerTrigger
          render={<Button />}
          onClick={() => select("conversation")}
        >
          Open chat
        </DrawerTrigger>
      )}
    />
  );
}
