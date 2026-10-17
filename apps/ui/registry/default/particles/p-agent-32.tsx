"use client";

import { HistoryIcon } from "lucide-react";
import { useState } from "react";
import {
  AgentHistory,
  type AgentHistoryItem,
} from "@/registry/default/agent/agent-history";
import { Button } from "@/registry/default/ui/button";
import { Label } from "@/registry/default/ui/label";
import { Switch } from "@/registry/default/ui/switch";

const dateFormat = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
});

const labels = {
  emptyDescription: "Conversations you start with the assistant show up here.",
  emptyTitle: "No conversations yet",
  formatDate: (date: Date) => dateFormat.format(date),
  history: "Conversation history",
  loading: "Loading conversations…",
  noResults: "No conversations found.",
  search: "Search conversations",
  startChat: "New conversation",
  unread: "Unread",
};

const items: AgentHistoryItem[] = [];

export default function Particle() {
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <AgentHistory
        items={items}
        labels={labels}
        loading={loading}
        onSelect={() => {}}
        onStartChat={() => setStarted(started + 1)}
        side="bottom"
        trigger={
          <Button size="icon-sm" variant="outline">
            <HistoryIcon aria-hidden="true" />
          </Button>
        }
      />
      <Label>
        <Switch checked={loading} onCheckedChange={setLoading} />
        Loading
      </Label>
      {started > 0 && (
        <p className="text-muted-foreground text-sm">
          Started {started} {started === 1 ? "conversation" : "conversations"}
        </p>
      )}
    </div>
  );
}
