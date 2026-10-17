"use client";

import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@shadcn/react/message-scroller";
import { ArrowDownIcon } from "lucide-react";
import {
  type ComponentProps,
  type ReactElement,
  useEffect,
  useState,
} from "react";
import { cn } from "@/registry/default/lib/utils";
import { Button } from "@/registry/default/ui/button";
import {
  ScrollAreaPrimitive,
  ScrollBar,
} from "@/registry/default/ui/scroll-area";

function MessageScrollerProvider(
  props: ComponentProps<typeof MessageScrollerPrimitive.Provider>,
): ReactElement {
  return <MessageScrollerPrimitive.Provider {...props} />;
}

function MessageScroller({
  className,
  children,
  ...props
}: ComponentProps<typeof MessageScrollerPrimitive.Root>): ReactElement {
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      className={cn(
        "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Root className="relative size-full min-h-0 rounded-[inherit]">
        {children}
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    </MessageScrollerPrimitive.Root>
  );
}

function MessageScrollerViewport({
  className,
  preserveScrollOnPrepend,
  ...props
}: ComponentProps<typeof MessageScrollerPrimitive.Viewport>): ReactElement {
  return (
    <ScrollAreaPrimitive.Viewport
      render={
        <MessageScrollerPrimitive.Viewport
          preserveScrollOnPrepend={preserveScrollOnPrepend}
        />
      }
      data-slot="message-scroller-viewport"
      className={cn(
        "size-full min-h-0 min-w-0 overscroll-contain rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset data-pending-scroll:invisible",
        className,
      )}
      {...props}
    />
  );
}

function MessageScrollerContent({
  className,
  spacerClassName,
  style,
  ...props
}: ComponentProps<typeof MessageScrollerPrimitive.Content>): ReactElement {
  return (
    <ScrollAreaPrimitive.Content
      render={
        <MessageScrollerPrimitive.Content spacerClassName={spacerClassName} />
      }
      data-slot="message-scroller-content"
      role="log"
      aria-live="off"
      className={cn("flex min-h-full flex-col gap-6", className)}
      style={{ minWidth: 0, ...style }}
      {...props}
    />
  );
}

function MessageScrollerItem({
  className,
  ...props
}: ComponentProps<typeof MessageScrollerPrimitive.Item>): ReactElement {
  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      className={cn("min-w-0 shrink-0", className)}
      {...props}
    />
  );
}

function MessageScrollerButton({
  behavior = "smooth",
  direction = "end",
  className,
  children,
  render,
  variant = "outline",
  size = "icon-sm",
  ...props
}: ComponentProps<typeof MessageScrollerPrimitive.Button> &
  Pick<ComponentProps<typeof Button>, "variant" | "size">): ReactElement {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (): void => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return (): void => preference.removeEventListener("change", update);
  }, []);
  return (
    <MessageScrollerPrimitive.Button
      behavior={reducedMotion ? "auto" : behavior}
      data-slot="message-scroller-button"
      direction={direction}
      aria-label={
        children
          ? undefined
          : direction === "end"
            ? "Scroll to end"
            : "Scroll to start"
      }
      className={cn(
        "absolute start-1/2 z-10 -translate-x-1/2 rounded-full transition-[translate,opacity] duration-200 data-[active=false]:pointer-events-none data-[direction=start]:top-4 data-[direction=end]:bottom-4 data-[active=false]:opacity-0 motion-reduce:transition-none rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180",
        className,
      )}
      render={render ?? <Button variant={variant} size={size} />}
      {...props}
    >
      {children ?? <ArrowDownIcon aria-hidden="true" />}
    </MessageScrollerPrimitive.Button>
  );
}

export {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
};
