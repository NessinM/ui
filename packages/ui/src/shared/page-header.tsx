import { cn } from "@coss/ui/lib/utils";

function PageHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={className} {...props}>
      <div className="container flex flex-col items-center gap-2 px-0 py-8 text-center md:py-12 lg:py-16 xl:gap-4">
        {children}
      </div>
    </section>
  );
}

function PageHeaderHeading({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "text-balance font-bold font-heading text-[clamp(2.25rem,1.5rem+2.6vw,4rem)] leading-none [font-variation-settings:'GEOM'_50]",
        className,
      )}
      {...props}
    />
  );
}

function PageHeaderDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground lg:text-lg", className)}
      {...props}
    />
  );
}

export { PageHeader, PageHeaderDescription, PageHeaderHeading };
