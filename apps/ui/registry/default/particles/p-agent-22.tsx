"use client";

import { useState } from "react";
import { AgentAnnouncer } from "@/registry/default/agent/agent-announcer";
import { AgentMessage } from "@/registry/default/agent/agent-message";
import {
  AgentMessageActions,
  AgentMessageCopyAction,
} from "@/registry/default/agent/agent-message-actions";
import { AgentResponseFeedback } from "@/registry/default/agent/agent-response-feedback";
import { useAgentAnnouncer } from "@/registry/default/agent/hooks/use-agent-announcer";
import type {
  AgentFeedbackRating,
  AgentFeedbackValue,
} from "@/registry/default/agent/lib/get-agent-feedback";
import { Label } from "@/registry/default/ui/label";
import { Switch } from "@/registry/default/ui/switch";

const answer =
  "Your Thursday is clear after 2 pm. I held 2:00–2:30 pm for the design review and sent the invite to the team.";

const labels = {
  cancel: "Cancel",
  details: "Details",
  detailsPlaceholder: "What should the agent have done?",
  dialogDescription: "Your feedback helps improve the agent.",
  dialogTitle: "What went wrong?",
  error: "Feedback wasn’t saved",
  negative: "Bad response",
  positive: "Good response",
  reasons: "Pick at least one reason",
  submit: "Send feedback",
  submitted: "Thanks for your feedback",
};

const reasons = [
  { label: "Wrong time", value: "wrong_time" },
  { label: "Wrong person", value: "wrong_person" },
  { label: "Didn’t do what I asked", value: "ignored_request" },
  { label: "Other", value: "other" },
];

export default function Particle() {
  const [rating, setRating] = useState<AgentFeedbackRating | null>(null);
  const [failSaves, setFailSaves] = useState(false);
  const announcer = useAgentAnnouncer({ labels: {}, phase: "idle" });

  const saveFeedback = (feedback: AgentFeedbackValue | null) =>
    new Promise<void>((resolve, reject) => {
      window.setTimeout(() => {
        if (failSaves) {
          reject(new Error("Not saved"));
          return;
        }
        setRating(feedback?.rating ?? null);
        resolve();
      }, 800);
    });

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <AgentMessage
        actions={
          <AgentMessageActions label="Response actions">
            <AgentMessageCopyAction
              copiedLabel="Copied"
              label="Copy"
              onCopy={() => announcer.announce("Copied")}
              text={answer}
            />
            <AgentResponseFeedback
              announce={announcer.announce}
              detailsMaxLength={200}
              labels={labels}
              onFeedback={saveFeedback}
              reasons={reasons}
              value={rating}
            />
          </AgentMessageActions>
        }
        actionsAlwaysVisible
        from="assistant"
      >
        {answer}
      </AgentMessage>
      <div className="flex flex-col gap-4">
        <Label>
          <Switch checked={failSaves} onCheckedChange={setFailSaves} />
          Fail saves
        </Label>
        <p aria-hidden="true" className="text-muted-foreground text-sm">
          Screen readers hear:{" "}
          <span className="font-medium text-foreground">
            {announcer.message || "nothing yet"}
          </span>
        </p>
      </div>
      <AgentAnnouncer announcer={announcer} />
    </div>
  );
}
