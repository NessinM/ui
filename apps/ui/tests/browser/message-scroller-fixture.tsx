"use client";
import { MessageScroller as Primitive } from "@shadcn/react/message-scroller";
import { useState } from "react";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/registry/default/ui/message-scroller";

const history = Array.from({ length: 8 }, (_, index) => ({
  id: `history-${index}`,
  label: `History ${index}`,
  text: `Older message ${index}`,
}));

export function MessageScrollerFixture({
  native = false,
  empty = false,
}: {
  native?: boolean;
  empty?: boolean;
}) {
  const Frame = native ? Primitive.Root : MessageScroller;
  const Viewport = native ? Primitive.Viewport : MessageScrollerViewport;
  const Content = native ? Primitive.Content : MessageScrollerContent;
  const [loaded, setLoaded] = useState(!empty);
  const [saved, setSaved] = useState(false);
  const [defaultScrollPosition, setDefaultScrollPosition] = useState<
    "end" | "last-anchor"
  >("last-anchor");
  const [older, setOlder] = useState(false);
  const [sent, setSent] = useState(false);
  const [replyHeight, setReplyHeight] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  return (
    <main>
      {native && (
        <style>
          {
            ".native-message-viewport { overflow-y: scroll; scrollbar-width: auto; } .native-message-viewport::-webkit-scrollbar { width: 16px; } .native-message-viewport::-webkit-scrollbar-thumb { background: #888; }"
          }
        </style>
      )}
      <button
        type="button"
        onClick={() => {
          setLoaded(true);
          setSent(true);
          setReplyHeight(800);
        }}
      >
        Load conversation
      </button>
      <button
        type="button"
        onClick={() => {
          setSaved(true);
          setSent(true);
          setReplyHeight(800);
          setDefaultScrollPosition("end");
        }}
      >
        Open saved conversation
      </button>
      <button type="button" onClick={() => setOlder(true)}>
        Load history
      </button>
      <button type="button" onClick={() => setSent(true)}>
        Send prompt
      </button>
      <button type="button" onClick={() => setReplyHeight(80)}>
        Start reply
      </button>
      <button type="button" onClick={() => setReplyHeight(800)}>
        Continue reply
      </button>
      <button
        type="button"
        onClick={() => setReplyHeight((height) => height + 400)}
      >
        More reply
      </button>
      <button type="button" onClick={() => setAutoScroll((value) => !value)}>
        Toggle following
      </button>
      <div style={{ height: 320, width: 400 }}>
        <MessageScrollerProvider
          key={String(saved)}
          defaultScrollPosition={defaultScrollPosition}
          autoScroll={autoScroll}
          scrollPreviousItemPeek={0}
          scrollEdgeThreshold={0}
        >
          <Navigation />
          <Frame className="relative h-80">
            <Viewport
              aria-label="Agent conversation"
              className="native-message-viewport h-full"
            >
              <Content className="flex flex-col gap-4 p-4" aria-live="off">
                {older && (
                  <MessageScrollerItem messageId="older" scrollAnchor>
                    <article aria-label="Older prompt" style={{ height: 240 }}>
                      An earlier turn
                    </article>
                  </MessageScrollerItem>
                )}
                {loaded &&
                  history.map((message) => (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                    >
                      <article
                        aria-label={message.label}
                        style={{ height: 80 }}
                      >
                        {message.text}
                      </article>
                    </MessageScrollerItem>
                  ))}
                {sent && (
                  <MessageScrollerItem messageId="prompt" scrollAnchor>
                    <article aria-label="New prompt" style={{ height: 80 }}>
                      Explain the result.
                    </article>
                  </MessageScrollerItem>
                )}
                {replyHeight > 0 && (
                  <MessageScrollerItem messageId="reply">
                    <article
                      aria-label="Agent reply"
                      style={{ height: replyHeight }}
                    >
                      Streaming answer
                    </article>
                  </MessageScrollerItem>
                )}
              </Content>
            </Viewport>
            <MessageScrollerButton size="sm">
              Jump to latest
            </MessageScrollerButton>
          </Frame>
        </MessageScrollerProvider>
      </div>
    </main>
  );
}

function Navigation() {
  const { scrollToStart, scrollToMessage } = useMessageScroller();
  return (
    <div>
      <button type="button" onClick={() => scrollToStart()}>
        Jump to first
      </button>
      <button type="button" onClick={() => scrollToMessage("history-3")}>
        Jump to history 3
      </button>
    </div>
  );
}
