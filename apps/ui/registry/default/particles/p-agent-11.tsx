"use client";

import { RotateCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AgentReasoning } from "@/registry/default/agent/agent-reasoning";
import { Button } from "@/registry/default/ui/button";

const reasoning =
  "The user wants an hour with the design team this week. Thursday morning is free for everyone except Priya, who is free after 14:00. Friday afternoon works for all four, so I’ll suggest Friday at 14:00 and offer Thursday as a fallback.";
const chunks = reasoning.match(/\S+\s*/g) ?? [];

export default function Particle() {
  const [count, setCount] = useState(0);
  const [run, setRun] = useState(0);
  const streaming = count < chunks.length;

  useEffect(() => {
    if (count >= chunks.length) return;
    const timeout = window.setTimeout(() => setCount(count + 1), 70);
    return () => window.clearTimeout(timeout);
  }, [count]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <AgentReasoning
        completedLabel="Thought for 3 seconds"
        key={run}
        streaming={streaming}
        streamingLabel="Thinking…"
      >
        {chunks.slice(0, count).join("")}
      </AgentReasoning>
      <Button
        className="self-start"
        disabled={streaming}
        size="sm"
        variant="outline"
        onClick={() => {
          setRun(run + 1);
          setCount(0);
        }}
      >
        <RotateCcwIcon aria-hidden="true" />
        Replay
      </Button>
    </div>
  );
}
