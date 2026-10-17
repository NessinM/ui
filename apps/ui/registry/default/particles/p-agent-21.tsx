"use client";

import { useState } from "react";
import { AgentApprovalGroupCard } from "@/registry/default/agent/agent-approval-card";
import type { AgentApprovalDecision } from "@/registry/default/agent/lib/get-agent-approval-state";
import { Button } from "@/registry/default/ui/button";
import { Label } from "@/registry/default/ui/label";
import { Switch } from "@/registry/default/ui/switch";

const cancelDana = {
  id: "dana",
  prompt: {
    context: "Tue, 3:00–3:30 pm with Dana Lee",
    question: "Cancel this booking?",
    sharedQuestion: "Cancel these 2 bookings?",
  },
};

const cancellations = [
  cancelDana,
  {
    id: "sam",
    prompt: {
      context: "Wed, 10:00–10:45 am with Sam Ortiz",
      question: "Cancel this booking?",
      sharedQuestion: "Cancel these 2 bookings?",
    },
  },
];

const reschedule = {
  id: "sam",
  prompt: {
    context: "Moves Wed, 10:00 am with Sam Ortiz to Thu, 2:00 pm",
    details: ["Sam gets an updated invite", "The video link stays the same"],
    question: "Reschedule this booking?",
  },
};

const labels = {
  approveAll: "Approve all",
  approved: "Approved",
  denied: "Skipped",
  error: "Your answer didn’t go through. Try again.",
  hint: "Skip first to request changes",
  skipAll: "Skip all",
};

export default function Particle() {
  const [sameQuestion, setSameQuestion] = useState(true);
  const [decision, setDecision] = useState<AgentApprovalDecision | null>(null);
  const items = sameQuestion ? cancellations : [cancelDana, reschedule];

  const respond = (choice: AgentApprovalDecision) =>
    new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setDecision(choice);
        resolve();
      }, 800);
    });

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <AgentApprovalGroupCard
        decision={decision}
        items={items}
        labels={labels}
        onRespond={respond}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Label>
          <Switch checked={sameQuestion} onCheckedChange={setSameQuestion} />
          Same question
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
    </div>
  );
}
