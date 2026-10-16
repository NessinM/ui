"use client";

import { Plug, Riffle, Settle } from "@lucasmarkes/hairline/react";
import { type CSSProperties, useState } from "react";
import { cn } from "@/lib/utils";

const figures = { plug: Plug, riffle: Riffle, settle: Settle };

export type HairlineFigureName = keyof typeof figures;

// Hairline's palette, mapped onto the site's tokens. The plate is the page
// background, since plates are opaque and must match what they sit on.
const palette = {
  "--hairline-edge":
    "color-mix(in oklab, var(--muted-foreground) 72%, var(--sidebar))",
  "--hairline-hi": "var(--foreground)",
  "--hairline-lo":
    "color-mix(in oklab, var(--muted-foreground) 24%, var(--sidebar))",
  "--hairline-mid":
    "color-mix(in oklab, var(--muted-foreground) 50%, var(--sidebar))",
  "--hairline-plate": "var(--sidebar)",
} as CSSProperties;

/** A figure with its read-out: what the pointer is over, or "rest". */
export function HairlineFigureReadout({
  figure,
  className,
  figureClassName,
}: {
  figure: HairlineFigureName;
  className?: string;
  figureClassName?: string;
}) {
  const [text, setText] = useState("rest");
  const Figure = figures[figure];
  return (
    <>
      <Figure
        className={cn("w-full", figureClassName)}
        onRead={(value) => setText(value || "rest")}
        style={palette}
      />
      <span aria-hidden="true" className={className}>
        {text}
      </span>
    </>
  );
}
