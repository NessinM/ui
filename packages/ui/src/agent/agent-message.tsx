import type { ReactElement, ReactNode } from "react";
import { ChatBubble } from "../chat/chat-bubble";
import {
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageFooter,
  ChatMessageLayout,
  type ChatMessageLayoutProps,
} from "../chat/chat-message-layout";
import { ChatMessageText } from "../chat/chat-message-text";

export type AgentMessageProps = Omit<ChatMessageLayoutProps, "align"> & {
  from: "user" | "assistant";
  /** The agent's identity mark beside an assistant reply. Ignored on user messages. */
  avatar?: ReactNode;
  actions?: ReactNode;
  /** Keep actions shown instead of revealing them on hover and focus. */
  actionsAlwaysVisible?: boolean;
  footer?: ReactNode;
  streaming?: boolean;
};

export function AgentMessage({
  from,
  avatar,
  actions,
  actionsAlwaysVisible = false,
  footer,
  streaming,
  children,
  ...props
}: AgentMessageProps): ReactElement {
  const user = from === "user";
  const content =
    typeof children === "string" ? (
      <ChatMessageText text={children} />
    ) : (
      children
    );

  return (
    <ChatMessageLayout
      align={user ? "end" : "start"}
      data-slot="agent-message"
      data-from={from}
      data-actions-visible={actionsAlwaysVisible || undefined}
      {...props}
    >
      {!user && avatar && <ChatMessageAvatar>{avatar}</ChatMessageAvatar>}
      <ChatMessageContent streaming={streaming}>
        {user ? (
          <ChatBubble align="end" className="max-w-[83%]">
            {content}
          </ChatBubble>
        ) : (
          content
        )}
        {actions}
        {footer && <ChatMessageFooter>{footer}</ChatMessageFooter>}
      </ChatMessageContent>
    </ChatMessageLayout>
  );
}
