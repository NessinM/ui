"use client";

import { useState } from "react";
import { AgentErrorRecovery } from "@/registry/default/agent/agent-error-recovery";
import { AgentMessage } from "@/registry/default/agent/agent-message";
import { Label } from "@/registry/default/ui/label";
import { Switch } from "@/registry/default/ui/switch";

export default function Particle() {
  const [mayHaveWritten, setMayHaveWritten] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const recover = () => setAttempts(attempts + 1);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <AgentMessage from="user">Move my 1:1 with Priya to Friday.</AgentMessage>
      <AgentMessage
        footer={attempts > 0 ? `Recovery attempts: ${attempts}` : undefined}
        from="assistant"
      >
        {mayHaveWritten ? (
          <AgentErrorRecovery
            checkStatusLabel="Check status"
            onCheckStatus={recover}
          >
            The connection dropped after the agent started changing your
            calendar. It may have finished.
          </AgentErrorRecovery>
        ) : (
          <AgentErrorRecovery onRetry={recover} retryLabel="Try again">
            The connection dropped before the agent replied.
          </AgentErrorRecovery>
        )}
      </AgentMessage>
      <Label>
        <Switch checked={mayHaveWritten} onCheckedChange={setMayHaveWritten} />
        Turn may have changed something
      </Label>
    </div>
  );
}
