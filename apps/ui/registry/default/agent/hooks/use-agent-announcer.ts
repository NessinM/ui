"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type AgentAnnouncementState,
  type AgentPhase,
  getAgentAnnouncement,
  getAgentAnnouncerMessage,
} from "../lib/get-agent-announcement";

export type AgentAnnouncerLabels = Partial<
  Record<Exclude<AgentPhase, "idle">, string>
>;

export type AgentAnnouncerOptions = {
  phase: AgentPhase;
  /** Localized text for each phase. A phase without a label is never announced. */
  labels: AgentAnnouncerLabels;
  /** Replaces the phase label, such as the error or the approval question. */
  detail?: string;
  /** Changing it starts a new baseline, so a switched conversation isn't replayed. */
  conversationId?: string;
};

export function useAgentAnnouncer({
  phase,
  labels,
  detail,
  conversationId,
}: AgentAnnouncerOptions) {
  const [message, setMessage] = useState("");
  const previousRef = useRef<AgentAnnouncementState | null>(null);
  const text = phase === "idle" ? "" : (detail ?? labels[phase] ?? "");

  useEffect(() => {
    const next = { conversationId, phase, text };
    const announcement = getAgentAnnouncement(previousRef.current, next);
    previousRef.current = next;
    if (announcement)
      setMessage((current) => getAgentAnnouncerMessage(current, announcement));
  }, [conversationId, phase, text]);

  /** Announce a one-off result, such as a copied message. */
  const announce = useCallback((value: string): void => {
    if (value)
      setMessage((current) => getAgentAnnouncerMessage(current, value));
  }, []);

  return { announce, message };
}

export type AgentAnnouncerController = ReturnType<typeof useAgentAnnouncer>;
