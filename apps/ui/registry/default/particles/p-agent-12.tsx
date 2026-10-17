"use client";

import { CalendarIcon, RotateCcwIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AgentToolActivity,
  type AgentToolRenderers,
} from "@/registry/default/agent/agent-tool-activity";
import type { AgentToolCall } from "@/registry/default/agent/lib/get-agent-tool-summary";
import { Button } from "@/registry/default/ui/button";

const labels = {
  denied: (count: number) =>
    count === 1 ? "Declined 1 step" : `Declined ${count} steps`,
  done: (count: number) =>
    count === 1 ? "Completed 1 step" : `Completed ${count} steps`,
  failed: (count: number) =>
    count === 1 ? "1 step failed" : `${count} steps failed`,
  running: (count: number) =>
    count === 1 ? "Running 1 step" : `Running ${count} steps`,
};

const renderers: AgentToolRenderers = {
  availability: {
    icon: <CalendarIcon />,
    label: "Checking availability",
    render: (call) =>
      call.state === "done" ? `Found ${call.output} free slots` : undefined,
  },
  members: { icon: <UsersIcon />, label: "Looking up the design team" },
};

const steps: AgentToolCall[][] = [
  [{ id: "1", name: "members", state: "running" }],
  [
    { id: "1", name: "members", state: "done" },
    { id: "2", name: "availability", state: "running" },
  ],
  [
    { id: "1", name: "members", state: "done" },
    { id: "2", name: "availability", output: 3, state: "done" },
  ],
];

const failed: AgentToolCall[] = [
  { id: "1", name: "members", state: "done" },
  {
    error: "The calendar service timed out.",
    id: "2",
    name: "availability",
    state: "failed",
  },
];

export default function Particle() {
  const [step, setStep] = useState(0);
  const running = step < steps.length - 1;

  useEffect(() => {
    if (!running) return;
    const timeout = window.setTimeout(() => setStep(step + 1), 1600);
    return () => window.clearTimeout(timeout);
  }, [running, step]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <AgentToolActivity
        calls={steps[step] ?? []}
        labels={labels}
        renderers={renderers}
      />
      <AgentToolActivity calls={failed} labels={labels} renderers={renderers} />
      <Button
        className="self-start"
        disabled={running}
        size="sm"
        variant="outline"
        onClick={() => setStep(0)}
      >
        <RotateCcwIcon aria-hidden="true" />
        Replay
      </Button>
    </div>
  );
}
