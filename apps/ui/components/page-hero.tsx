import type { CSSProperties, ReactNode } from "react";
import {
  type HairlineFigureName,
  HairlineFigureReadout,
} from "@/components/hairline/hairline-figure";
import { cn } from "@/lib/utils";

// A drafting grid that reaches under the copy and fades out toward the left.
const grid = {
  backgroundImage:
    "radial-gradient(color-mix(in srgb, var(--foreground) 16%, transparent) 1px, transparent 1.3px)",
  backgroundPosition: "-1px -1px",
  backgroundSize: "24px 24px",
  maskImage: "linear-gradient(to left, #000 35%, transparent)",
} as CSSProperties;

function RegistrationMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("absolute size-2.25 text-muted-foreground/48", className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 9 9"
    >
      <path d="M4.5 0v9M0 4.5h9" />
    </svg>
  );
}

/** The hairline under a hero, with squares where it crosses the side rails. */
export function HeroDivider() {
  return (
    <div className="relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border/64">
      <div
        aria-hidden="true"
        className="container pointer-events-none absolute inset-0 z-50 before:absolute before:top-[-3.5px] before:-left-[11.5px] before:z-1 before:-ml-1 before:size-2 before:rounded-[2px] before:border before:border-border before:bg-popover before:bg-clip-padding before:shadow-xs after:absolute after:top-[-3.5px] after:-right-[11.5px] after:z-1 after:-mr-1 after:size-2 after:rounded-[2px] after:border after:border-border after:bg-background after:bg-clip-padding after:shadow-xs dark:after:bg-clip-border dark:before:bg-clip-border"
      />
    </div>
  );
}

/**
 * A page's hero: the copy on the left and, from lg up, a side cell on the
 * right that runs to the rail and holds a hairline figure on a drafting grid,
 * or whatever `aside` gives it in the figure's place. The grid is absolutely
 * positioned, so an aside needs a positioned box (`relative`) to sit above it.
 */
export function PageHero({
  aside,
  children,
  className,
  figure,
}: {
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  figure?: HairlineFigureName;
}) {
  return (
    <>
      <section className={cn("container", className)}>
        <div className="grid lg:min-h-120 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="relative z-10 flex min-w-0 flex-col items-start justify-center gap-2 py-8 md:py-12 lg:py-16 lg:pe-12 xl:gap-4">
            {children}
          </div>
          {/* A figure is decoration and only shows from lg up; an aside stacks under the copy below lg. */}
          <div
            className={cn(
              "relative items-center justify-center border-border/64 lg:-me-9 lg:px-6 lg:py-10",
              figure
                ? "hidden lg:flex"
                : "-mx-4 flex border-t px-4 pt-10 pb-14 sm:-mx-6 sm:px-6 lg:mx-0 lg:border-t-0 lg:pb-12",
            )}
          >
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 left-0 lg:-left-48"
              style={grid}
            />
            {figure && (
              <>
                <RegistrationMark className="top-3 right-3" />
                <RegistrationMark className="bottom-3 left-1/2" />
              </>
            )}
            {figure ? (
              <HairlineFigureReadout
                className="absolute right-5 bottom-4 font-mono text-muted-foreground text-xs"
                figure={figure}
                figureClassName="relative max-w-140"
              />
            ) : (
              aside
            )}
          </div>
        </div>
      </section>
      <HeroDivider />
    </>
  );
}
