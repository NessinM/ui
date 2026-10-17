"use client";

import { useState } from "react";
import { AgentStatusIndicator } from "@/registry/default/agent/agent-status-indicator";
import { cn } from "@/registry/default/lib/utils";
import { Label } from "@/registry/default/ui/label";
import { Switch } from "@/registry/default/ui/switch";

const statuses = [
  { label: "Thinking…", status: "thinking" },
  { label: "Checking your calendar…", status: "working" },
  { label: "Response ready", status: "done" },
  { label: "Response stopped", status: "stopped" },
  { label: "Couldn’t reach the calendar", status: "failed" },
] as const;

export default function Particle() {
  const [neutral, setNeutral] = useState(false);

  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <div
        className={cn(
          "flex flex-col gap-3",
          neutral &&
            "[--agent-shimmer:linear-gradient(105deg,transparent_30%,var(--color-foreground)_50%,transparent_70%)]",
        )}
      >
        {statuses.map(({ label, status }) => (
          <AgentStatusIndicator key={status} status={status}>
            {label}
          </AgentStatusIndicator>
        ))}
      </div>
      <Label>
        <Switch checked={neutral} onCheckedChange={setNeutral} />
        Neutral shimmer
      </Label>
    </div>
  );
}
