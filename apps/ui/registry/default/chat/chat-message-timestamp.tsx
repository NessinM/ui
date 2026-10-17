import type { ComponentProps, ReactElement } from "react";
import { cn } from "@/registry/default/lib/utils";
import { getChatDateTime } from "./lib/get-chat-date-time";

export type ChatMessageTimestampProps = Omit<
  ComponentProps<"time">,
  "dateTime"
> & {
  dateTime: Date | string;
};

export function ChatMessageTimestamp({
  dateTime,
  className,
  ...props
}: ChatMessageTimestampProps): ReactElement {
  return (
    <time
      data-slot="chat-message-timestamp"
      dateTime={getChatDateTime(dateTime)}
      className={cn("whitespace-nowrap tabular-nums", className)}
      {...props}
    />
  );
}
