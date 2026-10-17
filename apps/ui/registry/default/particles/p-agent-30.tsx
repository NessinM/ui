"use client";

import { SparklesIcon } from "lucide-react";
import { useState } from "react";
import {
  AgentActionBar,
  AgentActionBarLauncher,
  AgentActionBarSession,
} from "@/registry/default/agent/agent-action-bar";
import { isAgentSessionUnread } from "@/registry/default/agent/lib/is-agent-session-unread";
import { Button } from "@/registry/default/ui/button";

type Session = {
  id: string;
  title: string;
  updatedAt: number;
  seenAt: number;
};

const initialSessions: Session[] = [
  { id: "offsite", seenAt: 2, title: "Plan the Lisbon offsite", updatedAt: 2 },
  { id: "invoices", seenAt: 1, title: "Chase overdue invoices", updatedAt: 3 },
  { id: "standup", seenAt: 1, title: "Summarize standup notes", updatedAt: 1 },
];

export default function Particle() {
  const [sessions, setSessions] = useState(initialSessions);
  const [activeId, setActiveId] = useState<string | null>("offsite");
  const [clock, setClock] = useState(4);

  const open = (id: string | null) => {
    setActiveId(id);
    setSessions((current) =>
      current.map((session) =>
        session.id === id ? { ...session, seenAt: clock } : session,
      ),
    );
    setClock(clock + 1);
  };

  const close = (id: string) => {
    setSessions((current) => current.filter((session) => session.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const replyInBackground = () => {
    const background = sessions.find((session) => session.id !== activeId);
    if (!background) return;
    setSessions((current) =>
      current.map((session) =>
        session.id === background.id
          ? { ...session, updatedAt: clock }
          : session,
      ),
    );
    setClock(clock + 1);
  };

  return (
    <div className="flex w-full flex-col items-end gap-4">
      <AgentActionBar className="w-full" label="Agent sessions">
        {sessions.map((session) => (
          <AgentActionBarSession
            active={session.id === activeId}
            closeLabel={`Close ${session.title}`}
            closeOthersLabel="Close other sessions"
            key={session.id}
            label={session.title}
            onClick={() => open(session.id)}
            onClose={() => close(session.id)}
            onCloseOthers={() =>
              setSessions((current) =>
                current.filter((other) => other.id === session.id),
              )
            }
            unread={isAgentSessionUnread({
              active: session.id === activeId,
              seenAt: session.seenAt,
              updatedAt: session.updatedAt,
            })}
            unreadLabel="Unread"
          />
        ))}
        <AgentActionBarLauncher
          active={activeId === null}
          mark={<SparklesIcon aria-hidden="true" />}
          onClick={() => open(null)}
        >
          Ask
        </AgentActionBarLauncher>
      </AgentActionBar>
      <Button
        disabled={!sessions.some((session) => session.id !== activeId)}
        onClick={replyInBackground}
        size="sm"
        variant="outline"
      >
        Reply in a background session
      </Button>
    </div>
  );
}
