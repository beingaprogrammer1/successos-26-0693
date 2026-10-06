import { cn } from "@/lib/utils";

/** The Success Gem icon — a faceted diamond drawn inline so it inherits size and color. */
export function GemIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
    >
      <path
        d="M6.2 3h11.6l3.7 5.6L12 21.4 2.5 8.6 6.2 3Z"
        fill="currentColor"
        stroke="var(--ink)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 8.6h19M9 3l-1.4 5.6L12 21.4l4.4-12.8L15 3"
        stroke="var(--ink)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pill showing a Gem amount. */
export function GemChip({
  amount,
  className,
  tone = "gem",
  prefix,
  size = "md",
}: {
  amount: number;
  className?: string;
  tone?: "gem" | "ink" | "outline";
  prefix?: string;
  size?: "sm" | "md" | "lg";
}) {
  const tones = {
    gem: "bg-gem text-ink border-ink",
    ink: "bg-ink text-gem border-ink",
    outline: "bg-transparent text-ink border-ink",
  };
  const sizes = {
    sm: "px-2 py-[3px] text-[11px] gap-1",
    md: "px-3 py-1 text-[13px] gap-1.5",
    lg: "px-4 py-1.5 text-[15px] gap-2",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border-2 font-semibold whitespace-nowrap",
        tones[tone],
        sizes[size],
        className,
      )}
    >
      <GemIcon className={size === "sm" ? "size-3" : size === "lg" ? "size-[18px]" : "size-4"} />
      {prefix}
      {amount.toLocaleString()}
    </span>
  );
}
