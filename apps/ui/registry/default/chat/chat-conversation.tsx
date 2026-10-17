"use client";

import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  useLayoutEffect,
  useRef,
} from "react";
import { cn } from "@/registry/default/lib/utils";
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
} from "@/registry/default/ui/message-scroller";
import { ChatJumpToLatestButton } from "./chat-jump-to-latest-button";
import type { ChatScrollController } from "./hooks/use-chat-scroll";

export type ChatConversationProps = ComponentProps<"div"> & {
  scroll: ChatScrollController;
  label: string;
  jumpLabel: ReactNode;
  contentClassName?: string;
  overlay?: ReactNode;
  inactive?: boolean;
  /** "off" when the caller announces arrivals itself, e.g. so paged-in history isn't read out. */
  live?: "polite" | "off";
};

export function ChatConversation({
  scroll,
  label,
  jumpLabel,
  contentClassName,
  children,
  overlay,
  inactive = false,
  live,
  className,
  ...props
}: ChatConversationProps): ReactElement {
  return (
    <div
      data-slot="chat-conversation"
      className={cn("relative isolate flex min-h-0 flex-1 flex-col", className)}
      {...props}
    >
      <MessageScrollerProvider
        key={scroll.opening.key}
        autoScroll={scroll.active && !scroll.paused && scroll.following}
        defaultScrollPosition={scroll.opening.position}
        scrollEdgeThreshold={0}
      >
        <MessageScroller
          inert={inactive}
          onPointerDownCapture={(event) => {
            if (
              event.target instanceof Element &&
              event.target.closest('[data-slot="scroll-area-scrollbar"]')
            )
              scroll.stopFollowing();
          }}
          className="flex-1 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-6 before:bg-linear-to-b before:from-popover before:to-transparent before:opacity-0 before:content-[''] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-6 after:bg-linear-to-t after:from-popover after:to-transparent after:opacity-0 after:content-[''] data-[scrollable~=end]:after:opacity-100 data-[scrollable~=start]:before:opacity-100"
        >
          <MessageScrollerViewport
            ref={scroll.viewportRef}
            aria-label={label}
            onScroll={scroll.onScroll}
            onTouchMove={() => scroll.stopFollowing()}
            onWheel={(event) => {
              if (event.deltaY < 0) scroll.stopFollowing();
            }}
            onKeyDown={(event) => {
              if (
                ["Home", "PageUp", "ArrowUp"].includes(event.key) ||
                (event.key === " " && event.shiftKey)
              )
                scroll.stopFollowing();
            }}
          >
            <MessageScrollerContent
              aria-label={label}
              aria-live={live ?? "polite"}
              aria-relevant="additions text"
              className={cn("gap-0 px-4 pb-4", contentClassName)}
            >
              {children}
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
        <ChatScrollBinding scroll={scroll} />
      </MessageScrollerProvider>
      {scroll.showJump && !scroll.following && !inactive && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-30 flex justify-center">
          <ChatJumpToLatestButton
            onClick={() => {
              scroll.viewportRef.current?.focus({ preventScroll: true });
              scroll.scrollToLatest();
            }}
          >
            {jumpLabel}
          </ChatJumpToLatestButton>
        </div>
      )}
      {overlay}
    </div>
  );
}

// Chat owns unread state and explicit navigation; MessageScroller owns following.
function ChatScrollBinding({ scroll }: { scroll: ChatScrollController }) {
  const { scrollToEnd } = useMessageScroller();
  const { end } = useMessageScrollerScrollable();
  const handledNavigation = useRef<ChatScrollController["navigation"]>(null);
  const { active, paused, following, navigation, setShowJump, viewportRef } =
    scroll;
  const currentScroll = useRef(scroll);
  currentScroll.current = scroll;
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let frame = 0;
    // Safari may restore a scroll offset after layout. Align through the public
    // command on the next frame, only while the reader still wants to follow.
    const follow = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const current = currentScroll.current;
        if (
          current.active &&
          !current.paused &&
          current.following &&
          viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight > 1
        )
          scrollToEnd({ behavior: "auto" });
      });
    };
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(follow);
    observer?.observe(viewport);
    viewport.addEventListener("scroll", follow);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      viewport.removeEventListener("scroll", follow);
    };
  }, [viewportRef, scrollToEnd]);
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (
      active &&
      !paused &&
      following &&
      viewport &&
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= 1
    )
      scrollToEnd({ behavior: "auto" });
  }, [active, paused, following, viewportRef, scrollToEnd]);
  useLayoutEffect(() => {
    if (active && !paused && !following) setShowJump(end);
  }, [active, paused, following, end, setShowJump]);
  useLayoutEffect(() => {
    if (
      !active ||
      paused ||
      !navigation ||
      handledNavigation.current === navigation
    )
      return;
    if (scrollToEnd({ behavior: navigation.behavior }))
      handledNavigation.current = navigation;
  }, [active, paused, navigation, scrollToEnd]);
  return null;
}

export function ChatConversationItem(
  props: Omit<ComponentProps<typeof MessageScrollerItem>, "scrollAnchor">,
): ReactElement {
  return <MessageScrollerItem {...props} scrollAnchor={false} />;
}
