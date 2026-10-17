"use client";

import { RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import {
  AgentMessage,
  AgentMessageText,
} from "@/registry/default/agent/agent-message";
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
  const [status, setStatus] = useState("");

  return (
    <div className="flex w-full max-w-sm flex-col gap-10">
      <AgentMessage
        from="user"
        actionsAlwaysVisible={alwaysVisible}
        actions={
          <AgentMessageActions label="Message actions">
            <AgentMessageEditAction
              label="Edit"
              onEdit={() => setStatus("Editing the prompt")}
            />
            <AgentMessageCopyAction
              copiedLabel="Copied"
              label="Copy"
              text={prompt}
            />
          </AgentMessageActions>
        }
      >
        <AgentMessageText>{prompt}</AgentMessageText>
      </AgentMessage>
      <AgentMessage
        from="assistant"
        actionsAlwaysVisible={alwaysVisible}
        actions={
          <AgentMessageActions label="Response actions">
            <AgentMessageCopyAction
              copiedLabel="Copied"
              label="Copy"
              text={answer}
            />
            <AgentMessageAction
              label="Retry"
              onClick={() => setStatus("Retrying the reply")}
            >
              <RotateCcwIcon aria-hidden="true" />
            </AgentMessageAction>
          </AgentMessageActions>
        }
      >
        <AgentMessageText>{answer}</AgentMessageText>
      </AgentMessage>
      <div className="flex items-center justify-between gap-4">
        <Label>
          <Switch checked={alwaysVisible} onCheckedChange={setAlwaysVisible} />
          Always show actions
        </Label>
        <p className="text-muted-foreground text-xs">{status}</p>
      </div>
    </div>
  );
}
