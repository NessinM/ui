import { ChatMessage } from "@/registry/default/chat/chat-message";
import { ChatMessageTimestamp } from "@/registry/default/chat/chat-message-timestamp";

export default function Particle() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <ChatMessage
        side="incoming"
        author="Riley"
        footer={
          <ChatMessageTimestamp
            dateTime="2026-10-17T09:41:00Z"
            title="17 October 2026, 09:41"
          >
            09:41
          </ChatMessageTimestamp>
        }
      >
        Can we move the design review to Thursday?
      </ChatMessage>
      <ChatMessage
        side="outgoing"
        footer={
          <ChatMessageTimestamp
            dateTime="2026-10-17T09:43:00Z"
            title="17 October 2026, 09:43"
          >
            09:43
          </ChatMessageTimestamp>
        }
      >
        Thursday works. I’ll send the new invite.
      </ChatMessage>
    </div>
  );
}
