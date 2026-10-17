"use client";

import { type UIEvent, useRef, useState } from "react";

export type ChatScrollOptions = {
  active?: boolean;
  /** Disables ordinary following; explicit navigation and prepend preservation still apply. */
  paused?: boolean;
  /** @deprecated Content changes are observed by MessageScroller. */
  itemCount?: number;
  /** @deprecated Content and viewport resizing are observed by MessageScroller. */
  layoutKey?: string | number;
  onReachEnd?: () => void;
};

export function useChatScroll({
  active = true,
  paused = false,
  onReachEnd,
}: ChatScrollOptions = {}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const lastScrollTop = useRef(0);
  const pendingInterruption = useRef(false);
  const [showJump, setShowJump] = useState(false);
  const [following, setFollowing] = useState(true);
  const [opening, setOpening] = useState({
    key: 0,
    position: "end" as "start" | "end",
  });
  const [navigation, setNavigation] = useState<{
    id: number;
    behavior: ScrollBehavior;
  } | null>(null);

  const updatePosition = (): void => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    atBottomRef.current =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= 1;
    setShowJump(!atBottomRef.current);
    pendingInterruption.current = false;
    setFollowing(atBottomRef.current);
    lastScrollTop.current = viewport.scrollTop;
  };

  const onScroll = (_event: UIEvent<HTMLDivElement>): void => {
    if (paused || !active) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    atBottomRef.current =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= 1;
    setShowJump(!atBottomRef.current);
    // Content growth and drawer resizing can change the end gap before shadcn follows.
    // Only movement toward history releases following; reaching the end resumes it.
    if (viewport.scrollTop < lastScrollTop.current && !atBottomRef.current) {
      pendingInterruption.current = false;
      setFollowing(false);
    } else if (atBottomRef.current && !pendingInterruption.current) {
      setFollowing(true);
    }
    lastScrollTop.current = viewport.scrollTop;
    if (atBottomRef.current) onReachEnd?.();
  };

  const resetScroll = (atBottom = true): void => {
    pendingInterruption.current = false;
    atBottomRef.current = atBottom;
    setShowJump(!atBottom);
    setFollowing(atBottom);
    setNavigation(null);
    setOpening((current) => ({
      key: current.key + 1,
      position: atBottom ? "end" : "start",
    }));
  };

  // Queue explicit sends/jumps until React has committed the new messages.
  const scrollToLatest = (): void => {
    pendingInterruption.current = false;
    atBottomRef.current = true;
    setFollowing(true);
    setNavigation((current) => ({
      id: (current?.id ?? 0) + 1,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    }));
  };

  return {
    viewportRef,
    atBottomRef,
    showJump,
    onScroll,
    resetScroll,
    updatePosition,
    scrollToLatest,
    active,
    paused,
    following,
    stopFollowing: () => {
      const top = viewportRef.current?.scrollTop ?? 0;
      if (top > 0) {
        // A queued automatic scroll event can arrive before the first upward frame.
        pendingInterruption.current = true;
        lastScrollTop.current = top;
        setFollowing(false);
      }
    },
    opening,
    navigation,
    setShowJump,
  };
}

export type ChatScrollController = ReturnType<typeof useChatScroll>;
