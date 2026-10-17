"use client";

import { HistoryIcon } from "lucide-react";
import { useState } from "react";
import {
  AgentHistory,
  type AgentHistoryItem,
} from "@/registry/default/agent/agent-history";
import { Button } from "@/registry/default/ui/button";

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

const items: AgentHistoryItem[] = [
  {
    id: "offsite",
    title: "Plan the Lisbon offsite",
    updatedAt: new Date("2026-10-15T10:00:00Z"),
  },
  {
    id: "invoices",
    metadata: "3 tools",
    title: "Chase overdue invoices",
    unread: true,
    updatedAt: new Date("2026-10-17T08:00:00Z"),
  },
  {
    id: "flights",
    title: "Compare flights to Lisbon for the whole team",
    updatedAt: new Date("2026-10-16T12:00:00Z"),
  },
  {
    id: "standup",
    title: "Summarize standup notes",
    updatedAt: new Date("2026-10-09T09:00:00Z"),
  },
];

export default function Particle() {
  const [activeId, setActiveId] = useState("offsite");
  const active = items.find((item) => item.id === activeId);

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">
        {active?.title ?? "New conversation"}
      </span>
      <AgentHistory
        activeId={activeId}
        items={items}
        labels={labels}
        onSelect={(item) => setActiveId(item.id)}
        onStartChat={() => setActiveId("")}
        side="bottom"
        trigger={
          <Button size="icon-sm" variant="ghost">
            <HistoryIcon aria-hidden="true" />
          </Button>
        }
      />
    </div>
  );
}
