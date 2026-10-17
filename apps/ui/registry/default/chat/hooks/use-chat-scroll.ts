"use client";

import {
  type UIEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type ChatScrollOptions = {
  active?: boolean;
  paused?: boolean;
  itemCount: number;
  layoutKey?: string | number;
  onReachEnd?: () => void;
};

export type ChatScrollMetrics = {
  scrollHeight: number;
  scrollTop: number;
  clientHeight: number;
};

export function isNearBottom({
  scrollHeight,
  scrollTop,
  clientHeight,
}: ChatScrollMetrics): boolean {
  return scrollHeight - scrollTop - clientHeight < 64;
}

// A resize can bring the bottom into view without firing a scroll event.
export function resolveResizeScroll(metrics: ChatScrollMetrics): {
  atBottom: boolean;
  showJump: boolean;
} {
  const atBottom = isNearBottom(metrics);
  return { atBottom, showJump: !atBottom };
}

export function useChatScroll({
  active = true,
  paused = false,
  itemCount,
  layoutKey,
  onReachEnd,
}: ChatScrollOptions) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const [showJump, setShowJump] = useState(false);
  const onReachEndRef = useRef(onReachEnd);
  useLayoutEffect(() => {
    onReachEndRef.current = onReachEnd;
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: Follow content changes before scroll events can misinterpret the new height.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!active || paused || !viewport) return;
    // Follow before a scroll event can interpret newly added height as scrolling away.
    if (atBottomRef.current) {
      viewport.scrollTop = viewport.scrollHeight;
      setShowJump(false);
    } else {
      setShowJump(!isNearBottom(viewport));
    }
  }, [active, paused, itemCount, layoutKey]);

  useEffect(() => {
    if (!active || paused) return;
    let observer: ResizeObserver | undefined;
    const frame = requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      observer = new ResizeObserver(() => {
        if (atBottomRef.current) {
          viewport.scrollTop = viewport.scrollHeight;
          return;
        }
        const next = resolveResizeScroll(viewport);
        atBottomRef.current = next.atBottom;
        setShowJump(next.showJump);
        if (next.atBottom) onReachEndRef.current?.();
      });
      observer.observe(viewport);
      if (viewport.firstElementChild)
        observer.observe(viewport.firstElementChild);
    });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [active, paused]);

  const updatePosition = (): void => {
    const viewport = viewportRef.current;
    atBottomRef.current = Boolean(viewport && isNearBottom(viewport));
  };

  const onScroll = (_event: UIEvent<HTMLDivElement>): void => {
    if (paused) return;
    updatePosition();
    setShowJump(!atBottomRef.current);
    if (atBottomRef.current) onReachEnd?.();
  };

  const resetScroll = (atBottom = true): void => {
    atBottomRef.current = atBottom;
    setShowJump(!atBottom);
    requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (viewport) viewport.scrollTop = atBottom ? viewport.scrollHeight : 0;
    });
  };

  const scrollToLatest = (): void => {
    atBottomRef.current = true;
    const viewport = viewportRef.current;
    viewport?.scrollTo({
      top: viewport.scrollHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return {
    viewportRef,
    atBottomRef,
    showJump,
    onScroll,
    resetScroll,
    updatePosition,
    scrollToLatest,
  };
}

export type ChatScrollController = ReturnType<typeof useChatScroll>;
