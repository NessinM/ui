import type { ComponentProps, ReactElement } from "react";
import { cn } from "@/registry/default/lib/utils";

export function ChatMessageCaret({
  className,
  ...props
}: Omit<ComponentProps<"span">, "children">): ReactElement {
  return (
    <span
      aria-hidden="true"
      data-slot="chat-message-caret"
      className={cn(
        // Zero inline size: showing or removing the caret never rewraps text.
        "relative inline-block h-[1em] w-0 align-[-0.125em] after:absolute after:inset-y-0 after:start-0.5 after:w-0.5 after:rounded-full after:bg-current after:opacity-64 motion-safe:after:animate-pulse",
        className,
      )}
      {...props}
    />
  );
}
