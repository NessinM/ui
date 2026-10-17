"use client";

import { Button } from "@coss/ui/components/button";
import { ScrollArea } from "@coss/ui/components/scroll-area";
import { cn } from "@coss/ui/lib/utils";
import { ArrowDownIcon } from "lucide-react";
import {
  type ComponentProps,
  type ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  AGENT_SCROLL_OFFSET_VAR,
  getAgentScrollOffset,
  isAgentScrollAtBottom,
} from "./lib/agent-scroll";

export type AgentConversationProps = ComponentProps<"div"> & {
  contentClassName?: string;
  /** Names the jump-to-latest button, which shows only when this is set. */
  scrollToLatestLabel?: string;
};

export function AgentConversation({
  children,
  className,
  contentClassName,
  scrollToLatestLabel,
  ...props
}: AgentConversationProps): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const hasScrolledToInitialContentRef = useRef(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const getViewport = useCallback(
    (): HTMLElement | null =>
      rootRef.current?.querySelector('[data-slot="scroll-area-viewport"]') ??
      null,
    [],
  );

  const recordScroll = useCallback((viewport: HTMLElement): void => {
    viewport.style.setProperty(
      AGENT_SCROLL_OFFSET_VAR,
      getAgentScrollOffset(viewport.scrollTop),
    );
    const next = isAgentScrollAtBottom(viewport);
    isAtBottomRef.current = next;
    setIsAtBottom(next);
  }, []);

  const scrollToLatest = useCallback((): void => {
    const viewport = getViewport();
    if (!viewport) return;
    viewport.scrollTo({ top: viewport.scrollHeight });
    recordScroll(viewport);
  }, [getViewport, recordScroll]);

  useEffect(() => {
    const viewport = getViewport();
    if (!viewport) return;
    const onScroll = (): void => recordScroll(viewport);
    viewport.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => viewport.removeEventListener("scroll", onScroll);
  }, [getViewport, recordScroll]);

  // Follow content that grows without a re-render, such as streamed text or images loading.
  useEffect(() => {
    const content = rootRef.current?.querySelector(
      '[data-slot="scroll-area-content"]',
    );
    if (!content) return;
    const observer = new ResizeObserver(() => {
      if (isAtBottomRef.current) scrollToLatest();
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [scrollToLatest]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: New children mean new content to follow; land the first scroll before paint.
  useLayoutEffect(() => {
    if (!hasScrolledToInitialContentRef.current || isAtBottomRef.current) {
      scrollToLatest();
      hasScrolledToInitialContentRef.current = true;
    }
  }, [children, scrollToLatest]);

  return (
    <div
      ref={rootRef}
      data-slot="agent-conversation"
      className={cn("relative h-full min-h-0", className)}
      {...props}
    >
      <ScrollArea className="h-full" overscrollContain scrollFade>
        <div
          className={cn(
            // Inside a popover crossfade snapshot ([data-previous]), keep the reader's place.
            // The variable is AGENT_SCROLL_OFFSET_VAR; Tailwind needs it spelled out here.
            "flex min-h-full in-data-previous:-translate-y-(--agent-conversation-scroll-top) flex-col gap-8",
            contentClassName,
          )}
        >
          {children}
        </div>
      </ScrollArea>
      {scrollToLatestLabel && !isAtBottom && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-end px-4">
          <Button
            aria-label={scrollToLatestLabel}
            className="pointer-events-auto rounded-full before:rounded-full"
            data-slot="agent-conversation-scroll-button"
            onClick={scrollToLatest}
            size="icon-sm"
            variant="outline"
          >
            <ArrowDownIcon aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}
