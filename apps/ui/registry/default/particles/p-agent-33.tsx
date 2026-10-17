"use client";

import { useState } from "react";
import { AgentAnnouncer } from "@/registry/default/agent/agent-announcer";
import { AgentConversationMenu } from "@/registry/default/agent/agent-conversation-menu";
import { useAgentAnnouncer } from "@/registry/default/agent/hooks/use-agent-announcer";
import { Button } from "@/registry/default/ui/button";

const markdown = `**You:** Plan the Lisbon offsite.

**Assistant:** Here’s a three-day outline with venues near Alfama.`;

const menuLabels = {
  cancel: "Cancel",
  copied: "Conversation copied as Markdown",
  copyAsMarkdown: "Copy as Markdown",
  copyFailed: "Couldn’t copy the conversation",
  delete: "Delete",
  deleteConfirm: "Delete",
  deleteDescription:
    "This permanently deletes the conversation and its replies.",
  deleteTitle: "Delete this conversation?",
  menu: "Conversation options",
};

export default function Particle() {
  const [deleted, setDeleted] = useState(false);
  const announcer = useAgentAnnouncer({ labels: {}, phase: "idle" });

  if (deleted)
    return (
      <div className="flex flex-col items-center gap-2 text-sm">
        <p className="text-muted-foreground">Conversation deleted.</p>
        <Button onClick={() => setDeleted(false)} size="sm" variant="outline">
          Restore
        </Button>
      </div>
    );

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div className="flex items-center justify-between gap-2 border-b pb-2">
        <span className="truncate font-medium text-sm">
          Plan the Lisbon offsite
        </span>
        <AgentConversationMenu
          announcer={announcer}
          labels={menuLabels}
          markdown={markdown}
          onDelete={() => setDeleted(true)}
        />
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
