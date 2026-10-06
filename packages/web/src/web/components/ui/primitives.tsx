import * as React from "react";
import { cn } from "@/lib/utils";

/** Small uppercase label pill used above section headings. */
export function Eyebrow({
  children,
  tone = "ink",
  className,
}: {
  children: React.ReactNode;
  tone?: "ink" | "cream" | "gem" | "navy";
  className?: string;
}) {
  const tones = {
    ink: "bg-ink text-cream border-ink",
    cream: "bg-cream text-ink border-ink",
    gem: "bg-gem text-ink border-ink",
    navy: "bg-navy text-cream border-ink",
  };
  return (
    <span
      className={cn(
        "label inline-flex items-center rounded-full border-2 px-3.5 py-1.5",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Bordered card with the signature offset shadow. */
export function Panel({
  children,
  className,
  tone = "paper",
  shadow = "ink",
  hover = false,
  ...rest
}: React.ComponentProps<"div"> & {
  tone?: "paper" | "cream" | "ink" | "navy" | "gem" | "sage" | "gem-soft" | "transparent";
  shadow?: "ink" | "cream" | "navy" | "gem" | "none";
  hover?: boolean;
}) {
  const tones = {
    paper: "bg-paper text-ink",
    cream: "bg-cream text-ink",
    ink: "bg-ink text-cream",
    navy: "bg-navy text-cream",
    gem: "bg-gem text-ink",
    sage: "bg-sage text-ink",
    "gem-soft": "bg-gem-soft text-ink",
    transparent: "bg-transparent",
  };
  const shadows = {
    ink: "hard",
    cream: "hard-cream",
    navy: "hard-navy",
    gem: "hard-gem",
    none: "",
  };
  return (
    <div
      className={cn(
        "rounded-xl border-2 border-ink",
        tones[tone],
        shadows[shadow],
        hover && (shadow === "cream" ? "lift lift-cream" : "lift"),
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Section heading block: eyebrow + title + optional lede. */
export function SectionHead({
  eyebrow,
  title,
  lede,
  align = "center",
  tone = "ink",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "center" | "left";
  tone?: "ink" | "cream";
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-left",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow tone={tone === "cream" ? "gem" : "ink"} className="mb-5">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2
        className={cn(
          "text-[clamp(1.9rem,4.4vw,2.85rem)] uppercase",
          tone === "cream" ? "text-cream" : "text-ink",
        )}
      >
        {title}
      </h2>
      {lede ? (
        <p
          className={cn(
            "mt-4 text-[15px] md:text-base",
            tone === "cream" ? "text-cream/70" : "text-muted-ink",
            align === "center" && "mx-auto max-w-2xl",
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/** Full-bleed horizontal band. */
export function Band({
  children,
  tone,
  dots = false,
  className,
  bordered = true,
}: {
  children: React.ReactNode;
  tone: "navy" | "cream" | "ink" | "gem" | "sage" | "paper";
  dots?: boolean;
  className?: string;
  bordered?: boolean;
}) {
  const tones = {
    navy: "bg-navy text-cream",
    cream: "bg-cream text-ink",
    ink: "bg-ink text-cream",
    gem: "bg-gem text-ink",
    sage: "bg-sage text-ink",
    paper: "bg-paper text-ink",
  };
  const dotColor = {
    navy: "text-cream/20",
    cream: "text-ink/12",
    ink: "text-cream/12",
    gem: "text-ink/22",
    sage: "text-ink/15",
    paper: "text-ink/8",
  };
  return (
    <section
      className={cn(
        "relative",
        tones[tone],
        bordered && "border-b-2 border-ink",
        className,
      )}
    >
      {dots ? (
        <div
          className={cn("pointer-events-none absolute inset-0 dot-grid", dotColor[tone])}
          aria-hidden="true"
        />
      ) : null}
      <div className="relative">{children}</div>
    </section>
  );
}

/** Content width wrapper. */
export function Shell({
  children,
  className,
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        wide ? "max-w-[1240px]" : "max-w-[1120px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Progress bar in brand style. */
export function Progress({
  percent,
  className,
  tone = "gem",
  height = "h-3",
}: {
  percent: number;
  className?: string;
  tone?: "gem" | "navy" | "cream";
  height?: string;
}) {
  const fill = { gem: "bg-gem", navy: "bg-navy", cream: "bg-cream" };
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full border-2 border-ink bg-paper",
        height,
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-500", fill[tone])}
        style={{ width: `${Math.max(percent, 0)}%` }}
      />
    </div>
  );
}

/** Loading skeleton block. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-ink/10", className)} />;
}

/** Status pill for reports and changelog tags. */
export function StatusPill({
  children,
  tone,
  className,
}: {
  children: React.ReactNode;
  tone: "open" | "review" | "done" | "gem" | "navy" | "sage" | "danger";
  className?: string;
}) {
  const tones = {
    open: "bg-gem-soft text-ink",
    review: "bg-sage text-ink",
    done: "bg-navy text-cream",
    gem: "bg-gem text-ink",
    navy: "bg-navy text-cream",
    sage: "bg-sage text-ink",
    danger: "bg-danger text-paper",
  };
  return (
    <span
      className={cn(
        "label inline-flex items-center rounded-full border-2 border-ink px-2.5 py-1",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
