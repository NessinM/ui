"use client";

import { cn } from "@coss/ui/lib/utils";
import type { ReactElement, UIEvent } from "react";
import {
  ChatConversation,
  type ChatConversationProps,
} from "../chat/chat-conversation";
import {
  AGENT_SCROLL_OFFSET_VAR,
  getAgentScrollOffset,
} from "./lib/get-agent-scroll-offset";

export type AgentConversationProps = ChatConversationProps;

export function AgentConversation({
  scroll,
  live = "off",
  contentClassName,
  ...props
}: AgentConversationProps): ReactElement {
  const onScroll = (event: UIEvent<HTMLDivElement>): void => {
    event.currentTarget.style.setProperty(
      AGENT_SCROLL_OFFSET_VAR,
      getAgentScrollOffset(event.currentTarget.scrollTop),
    );
    scroll.onScroll(event);
  };

  return (
    <ChatConversation
      data-slot="agent-conversation"
      scroll={{ ...scroll, onScroll }}
      live={live}
      contentClassName={cn(
        // Inside a popover crossfade snapshot ([data-previous]), keep the reader's place.
        // The variable is AGENT_SCROLL_OFFSET_VAR; Tailwind needs it spelled out here.
        "flex in-data-previous:-translate-y-(--agent-conversation-scroll-top) flex-col gap-6 pt-4",
        contentClassName,
      )}
      {...props}
    />
  );
}
