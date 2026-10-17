"use client";

import { RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import { AgentMessage } from "@/registry/default/agent/agent-message";
import {
  AgentMessageAction,
  AgentMessageActions,
  AgentMessageCopyAction,
  AgentMessageEditAction,
} from "@/registry/default/agent/agent-message-actions";
import { Label } from "@/registry/default/ui/label";
import { Switch } from "@/registry/default/ui/switch";

const prompt = "Draft a reply declining Friday’s offsite.";
const answer =
  "Thanks for the invite. I can’t make Friday’s offsite, but I’d love to hear how it goes and help with any follow-ups.";

export default function Particle() {
  const [alwaysVisible, setAlwaysVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [retries, setRetries] = useState(0);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <AgentMessage
        from="user"
        actionsAlwaysVisible={alwaysVisible}
        footer={editing ? "Editing…" : undefined}
        actions={
          <AgentMessageActions label="Message actions">
            <AgentMessageEditAction
              label={editing ? "Stop editing" : "Edit"}
              onEdit={() => setEditing(!editing)}
            />
            <AgentMessageCopyAction
              copiedLabel="Copied"
              label="Copy"
              text={prompt}
            />
          </AgentMessageActions>
        }
      >
        {prompt}
      </AgentMessage>
      <AgentMessage
        from="assistant"
        actionsAlwaysVisible={alwaysVisible}
        footer={retries > 0 ? `Retried ${retries}×` : undefined}
        actions={
          <AgentMessageActions label="Response actions">
            <AgentMessageCopyAction
              copiedLabel="Copied"
              label="Copy"
              text={answer}
            />
            <AgentMessageAction
              label="Retry"
              onClick={() => setRetries(retries + 1)}
            >
              <RotateCcwIcon aria-hidden="true" />
            </AgentMessageAction>
          </AgentMessageActions>
        }
      >
        {answer}
      </AgentMessage>
      <Label>
        <Switch checked={alwaysVisible} onCheckedChange={setAlwaysVisible} />
        Always show actions
      </Label>
    </div>
  );
}
