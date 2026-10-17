"use client";

import { useEffect, useState } from "react";
import { AgentAnnouncer } from "@/registry/default/agent/agent-announcer";
import {
  AgentMessageActions,
  AgentMessageCopyAction,
} from "@/registry/default/agent/agent-message-actions";
import { useAgentAnnouncer } from "@/registry/default/agent/hooks/use-agent-announcer";
import type { AgentPhase } from "@/registry/default/agent/lib/get-agent-announcement";
import { Button } from "@/registry/default/ui/button";

const labels = {
  approval: "Approval needed",
  done: "Response ready",
  failed: "Something went wrong",
  stopped: "Response stopped",
  thinking: "Thinking",
  working: "Working",
};

export default function Particle() {
  const [phase, setPhase] = useState<AgentPhase>("idle");
  const announcer = useAgentAnnouncer({ labels, phase });
  const busy = phase === "thinking" || phase === "working";

  useEffect(() => {
    if (!busy) return;
    const timeout = window.setTimeout(
      () => setPhase(phase === "thinking" ? "working" : "done"),
      1500,
    );
    return () => window.clearTimeout(timeout);
  }, [busy, phase]);

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          disabled={busy}
          size="sm"
          variant="outline"
          onClick={() => setPhase("thinking")}
        >
          Send
        </Button>
        <Button
          disabled={!busy}
          size="sm"
          variant="outline"
          onClick={() => setPhase("stopped")}
        >
          Stop
        </Button>
        <Button
          disabled={phase === "failed"}
          size="sm"
          variant="outline"
          onClick={() => setPhase("failed")}
        >
          Fail
        </Button>
        <AgentMessageActions label="Response actions">
          <AgentMessageCopyAction
            copiedLabel="Copied"
            label="Copy"
            text="Response ready"
            onCopy={() => announcer.announce("Copied")}
          />
        </AgentMessageActions>
      </div>
      <p aria-hidden="true" className="text-muted-foreground text-sm">
        Screen readers hear:{" "}
        <span className="font-medium text-foreground">
          {announcer.message || "nothing yet"}
        </span>
      </p>
      <AgentAnnouncer announcer={announcer} />
    </div>
  );
}
