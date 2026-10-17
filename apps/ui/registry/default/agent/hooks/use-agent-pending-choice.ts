"use client";

import { useCallback, useRef, useState } from "react";

export type AgentPendingChoiceOutcome = "succeeded" | "failed" | "ignored";

/**
 * Tracks the choice whose host callback is still running, and whether the last one failed.
 * A callback that returns nothing settles at once; a rejected promise sets `failed`.
 */
export function useAgentPendingChoice<T>() {
  const [pending, setPending] = useState<T | null>(null);
  const [failed, setFailed] = useState(false);
  const runningRef = useRef(false);

  /** Runs the callback for a choice. Another choice is ignored while one is running. */
  const run = useCallback(
    async (
      choice: T,
      callback: () => void | Promise<void>,
    ): Promise<AgentPendingChoiceOutcome> => {
      if (runningRef.current) return "ignored";
      setFailed(false);
      const result = callback();
      if (!result) return "succeeded";
      runningRef.current = true;
      setPending(choice);
      try {
        await result;
        return "succeeded";
      } catch {
        setFailed(true);
        return "failed";
      } finally {
        runningRef.current = false;
        setPending(null);
      }
    },
    [],
  );

  return { failed, pending, run };
}
