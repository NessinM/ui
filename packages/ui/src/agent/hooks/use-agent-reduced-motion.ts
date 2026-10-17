"use client";

import { useMediaQuery } from "@coss/ui/hooks/use-media-query";

/**
 * The agent family's reduced-motion check for motion timed in JavaScript, such as an
 * exit delay or an animation loop. CSS transitions use `motion-reduce:` variants instead.
 */
export function useAgentReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
