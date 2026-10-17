"use client";

import { useState } from "react";
import { AgentAnnouncer } from "@/registry/default/agent/agent-announcer";
import { AgentApprovalCard } from "@/registry/default/agent/agent-approval-card";
import { useAgentAnnouncer } from "@/registry/default/agent/hooks/use-agent-announcer";
import type { AgentApprovalDecision } from "@/registry/default/agent/lib/get-agent-approval-state";
import { Button } from "@/registry/default/ui/button";
import { Label } from "@/registry/default/ui/label";
import { Switch } from "@/registry/default/ui/switch";

const prompt = {
  approveLabel: "Cancel booking",
  badge: "Bookings",
  context: "Dana gets a cancellation email with your note.",
  denyLabel: "Keep it",
  question: "Cancel your 3 pm call with Dana?",
};

const labels = {
  approve: "Confirm",
  approved: "Booking cancelled",
  denied: "Booking kept",
  deny: "Cancel",
  error: "Your answer didn’t go through. Try again.",
};

export default function Particle() {
  const [decision, setDecision] = useState<AgentApprovalDecision | null>(null);
  const [failAnswers, setFailAnswers] = useState(false);
  const announcer = useAgentAnnouncer({
    detail: prompt.question,
    labels: {},
    phase: decision ? "idle" : "approval",
  });

  const respond = (choice: AgentApprovalDecision) =>
    new Promise<void>((resolve, reject) => {
      window.setTimeout(() => {
        if (failAnswers) {
          reject(new Error("Not delivered"));
          return;
        }
        setDecision(choice);
        resolve();
      }, 1000);
    });

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <AgentApprovalCard
        announce={announcer.announce}
        decision={decision}
        labels={labels}
        onRespond={respond}
        prompt={prompt}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Label>
          <Switch checked={failAnswers} onCheckedChange={setFailAnswers} />
          Fail answers
        </Label>
        <Button
          disabled={!decision}
          onClick={() => setDecision(null)}
          size="sm"
          variant="outline"
        >
          Ask again
        </Button>
      </div>
      <AgentAnnouncer announcer={announcer} />
    </div>
  );
}
