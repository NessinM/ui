"use client";

import { CalendarIcon, RotateCcwIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AgentMessage } from "@/registry/default/agent/agent-message";
import { AgentReasoning } from "@/registry/default/agent/agent-reasoning";
import {
  type AgentResultItem,
  AgentResultList,
} from "@/registry/default/agent/agent-result-list";
import type { AgentToolRenderers } from "@/registry/default/agent/agent-tool-activity";
import { AgentTurn } from "@/registry/default/agent/agent-turn";
import type { AgentToolCall } from "@/registry/default/agent/lib/get-agent-tool-summary";
import { ChatMessageText } from "@/registry/default/chat/chat-message-text";
import { Button } from "@/registry/default/ui/button";

// Your application's own part shapes, already mapped from its agent runtime.
type Part =
  | { type: "reasoning"; text: string; streaming: boolean }
  | { type: "step" }
  | { type: "tool"; call: AgentToolCall }
  | { type: "text"; text: string }
  | { type: "slots"; items: AgentResultItem[] };

const toolLabels = {
  callDenied: (label: string) => `${label}, declined`,
  callFailed: (label: string) => `${label} failed.`,
  denied: (count: number) =>
    count === 1 ? "Declined 1 step" : `Declined ${count} steps`,
  done: (count: number) =>
    count === 1 ? "Completed 1 step" : `Completed ${count} steps`,
  failed: (count: number) =>
    count === 1 ? "1 step failed" : `${count} steps failed`,
  running: (count: number) =>
    count === 1 ? "Running 1 step" : `Running ${count} steps`,
};

const toolRenderers: AgentToolRenderers = {
  availability: {
    icon: <CalendarIcon />,
    label: "Checking availability",
    render: (call) =>
      call.state === "done" ? `Found ${call.output} shared slots` : undefined,
  },
  members: {
    icon: <UsersIcon />,
    label: "Looking up the design team",
    render: (call) =>
      call.state === "done" ? `${call.output} people` : undefined,
  },
};

const thought =
  "Find the design team, then check their calendars for a shared hour this week.";
const slots: AgentResultItem[] = [
  { description: "Thu 10:00", href: "#", id: "a", title: "Design review" },
  { description: "Fri 14:00", href: "#", id: "b", title: "Design review" },
];

const frames: Part[][] = [
  [{ streaming: true, text: thought.slice(0, 24), type: "reasoning" }],
  [{ streaming: true, text: thought, type: "reasoning" }],
  [
    { streaming: false, text: thought, type: "reasoning" },
    { type: "step" },
    { call: { id: "1", name: "members", state: "running" }, type: "tool" },
  ],
  [
    { streaming: false, text: thought, type: "reasoning" },
    { type: "step" },
    {
      call: { id: "1", name: "members", output: 4, state: "done" },
      type: "tool",
    },
    { type: "step" },
    { call: { id: "2", name: "availability", state: "running" }, type: "tool" },
  ],
  [
    { streaming: false, text: thought, type: "reasoning" },
    { type: "step" },
    {
      call: { id: "1", name: "members", output: 4, state: "done" },
      type: "tool",
    },
    { type: "step" },
    {
      call: { id: "2", name: "availability", output: 2, state: "done" },
      type: "tool",
    },
    { text: "All four of you are free at these times:", type: "text" },
    { items: slots, type: "slots" },
  ],
];

function renderPart(part: Part) {
  switch (part.type) {
    case "reasoning":
      return (
        <AgentReasoning
          completedLabel="Thought for 2 seconds"
          streaming={part.streaming}
          streamingLabel="Thinking…"
        >
          {part.text}
        </AgentReasoning>
      );
    case "text":
      return <ChatMessageText text={part.text} />;
    case "slots":
      return (
        <AgentResultList
          items={part.items}
          showLessLabel="Show less"
          showMoreLabel={(count) => `Show ${count} more`}
        />
      );
    default:
      // Step markers render nothing, and don't split the run of tool calls.
      return null;
  }
}

export default function Particle() {
  const [frame, setFrame] = useState(0);
  const busy = frame < frames.length - 1;

  useEffect(() => {
    if (!busy) return;
    const timeout = window.setTimeout(() => setFrame(frame + 1), 1400);
    return () => window.clearTimeout(timeout);
  }, [busy, frame]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <AgentMessage
        from="assistant"
        footer={busy ? "Working…" : "Checked 4 calendars"}
        streaming={busy}
      >
        <AgentTurn
          parts={frames[frame] ?? []}
          renderPart={renderPart}
          tools={{
            getCall: (part) => (part.type === "tool" ? part.call : undefined),
            labels: toolLabels,
            renderers: toolRenderers,
          }}
        />
      </AgentMessage>
      <Button
        className="self-start"
        disabled={busy}
        size="sm"
        variant="outline"
        onClick={() => setFrame(0)}
      >
        <RotateCcwIcon aria-hidden="true" />
        Replay
      </Button>
    </div>
  );
}
