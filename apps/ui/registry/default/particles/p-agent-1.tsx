"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { AgentConversation } from "@/registry/default/agent/agent-conversation";
import { AgentMessage } from "@/registry/default/agent/agent-message";
import { useChatScroll } from "@/registry/default/chat/hooks/use-chat-scroll";
import { Button } from "@/registry/default/ui/button";

type Message = { id: number; from: "user" | "assistant"; text: string };

const initialMessages: Message[] = [
  { from: "user", id: 1, text: "Find a time for the design review." },
  {
    from: "assistant",
    id: 2,
    text: "Everyone is free on Thursday from 10:00 to 11:30, and on Friday after 14:00.",
  },
  { from: "user", id: 3, text: "Thursday, please. Keep it to an hour." },
  {
    from: "assistant",
    id: 4,
    text: "I’ve held Thursday 10:00–11:00 and invited the four reviewers.",
  },
  { from: "user", id: 5, text: "Add the brief to the invite." },
  {
    from: "assistant",
    id: 6,
    text: "Done. The brief is attached, and everyone can edit the agenda.",
  },
];

const replies = [
  "Two reviewers accepted. I’ll remind the others an hour before.",
  "Priya asked to join remotely, so I added a video link.",
  "All four reviewers accepted. You’re set for Thursday.",
];

export default function Particle() {
  const [messages, setMessages] = useState(initialMessages);
  const scroll = useChatScroll({ itemCount: messages.length });
  const added = messages.length - initialMessages.length;

  const addReply = () => {
    setMessages((current) => [
      ...current,
      {
        from: "assistant",
        id: current.length + 1,
        text: replies[added % replies.length] ?? "",
      },
    ]);
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex h-80 flex-col overflow-hidden rounded-xl border bg-popover">
        <AgentConversation
          scroll={scroll}
          label="Conversation with the assistant"
          jumpLabel="Latest"
        >
          {messages.map((message) => (
            <AgentMessage key={message.id} from={message.from}>
              {message.text}
            </AgentMessage>
          ))}
        </AgentConversation>
      </div>
      <Button
        className="self-start"
        size="sm"
        variant="outline"
        onClick={addReply}
      >
        <PlusIcon aria-hidden="true" />
        Add a reply
      </Button>
    </div>
  );
}
