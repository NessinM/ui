import { cn } from "@coss/ui/lib/utils";
import type { ComponentProps, ReactElement, ReactNode } from "react";

export type ChatMessageTextProps = Omit<ComponentProps<"p">, "children"> & {
  text: string;
  mentions?: readonly string[];
  children?: ReactNode;
};

export function ChatMessageText({
  text,
  mentions = [],
  children,
  className,
  ...props
}: ChatMessageTextProps): ReactElement {
  const names = new Set(mentions.map((name) => `@${name}`));
  const parts = text.split(/(@[\p{L}\p{N}_.-]+)/u);
  return (
    <p
      data-slot="chat-message-text"
      className={cn(
        "m-0 whitespace-pre-wrap break-words text-sm leading-[1.55]",
        className,
      )}
      {...props}
    >
      {parts.map((part, index) => {
        if (index > 0 && !/(?:^|\s)$/.test(parts[index - 1] ?? "")) return part;
        const mention = names.has(part) ? part : part.replace(/[.-]+$/, "");
        if (!names.has(mention)) return part;
        return (
          <span key={`${index}-${part}`}>
            <span className="font-medium">{mention}</span>
            {part.slice(mention.length)}
          </span>
        );
      })}
      {children}
    </p>
  );
}
