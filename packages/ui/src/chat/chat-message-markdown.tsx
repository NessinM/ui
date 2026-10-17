import { cn } from "@coss/ui/lib/utils";
import type { ComponentProps, ReactElement } from "react";

export function ChatMessageMarkdown({
  className,
  ...props
}: ComponentProps<"div">): ReactElement {
  return (
    <div
      data-slot="chat-message-markdown"
      className={cn(
        "min-w-0 break-words text-sm leading-[1.55] [&>:first-child]:mt-0 [&>:last-child]:mb-0",
        "[&_:is(h1,h2,h3,h4,h5,h6)]:mt-4 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-2 [&_:is(h1,h2,h3,h4,h5,h6)]:font-semibold [&_:is(h1,h2,h3,h4,h5,h6)]:leading-snug [&_:is(p,ul,ol,pre,blockquote,table)]:my-3 [&_h1]:text-lg [&_h2]:text-base [&_h6]:text-muted-foreground",
        "[&_a:hover]:decoration-foreground [&_a]:underline [&_a]:decoration-foreground/32 [&_a]:underline-offset-2 [&_hr]:my-4 [&_strong]:font-semibold",
        "[&_:is(ul,ol)]:ps-5 [&_li+li]:mt-1 [&_li>:is(ul,ol)]:mt-1 [&_li>:is(ul,ol)]:mb-0 [&_li>p]:my-0 [&_li]:marker:text-muted-foreground [&_ol>li]:marker:tabular-nums [&_ol]:list-decimal [&_ul]:list-disc",
        "[&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:bg-foreground/8 [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_code]:font-mono [&_code]:text-[.875em] [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:bg-foreground/4 [&_pre]:px-3 [&_pre]:py-2.5 [&_pre]:leading-normal",
        "[&_blockquote]:border-s-2 [&_blockquote]:ps-3 [&_blockquote]:text-muted-foreground",
        "has-[>table]:overflow-x-auto [&_:has(>table)]:overflow-x-auto [&_:is(th,td):first-child]:ps-0 [&_:is(th,td):last-child]:pe-0 [&_:is(th,td)]:px-3 [&_:is(th,td)]:py-1.5 [&_table]:border-collapse [&_tbody_tr:last-child]:border-b-0 [&_td]:align-top [&_td]:tabular-nums [&_th]:text-start [&_th]:align-bottom [&_th]:font-medium [&_tr]:border-b",
        className,
      )}
      {...props}
    />
  );
}
