import { cn } from "@/lib/utils";

/** The square "S" mark, cropped from the favicon logo. */
export function Mark({ className }: { className?: string }) {
  return (
    <img
      src="/images/logo-mark-512.png"
      alt="Success"
      className={cn("size-9 rounded-[9px] border-2 border-ink object-cover", className)}
    />
  );
}

/** Mark + the SuccessOS 26 wordmark, for nav bars. */
export function Wordmark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "cream";
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Mark className={tone === "cream" ? "border-cream/60" : undefined} />
      <span className="leading-none">
        <span
          className={cn(
            "display block text-[17px] font-900 uppercase tracking-[-0.01em]",
            tone === "cream" ? "text-cream" : "text-ink",
          )}
        >
          SuccessOS 26
        </span>
        <span
          className={cn(
            "label mt-[3px] block text-[9px]",
            tone === "cream" ? "text-cream/60" : "text-muted-ink",
          )}
        >
          Study &amp; Work Smarter
        </span>
      </span>
    </span>
  );
}

/** Script lockup image used in hero / footer. */
export function ScriptLogo({
  variant = "submark",
  className,
}: {
  variant?: "primary" | "secondary" | "submark";
  className?: string;
}) {
  const src =
    variant === "primary"
      ? "/images/logo-primary-wide.png"
      : variant === "secondary"
        ? "/images/logo-secondary-wide.png"
        : "/images/logo-submark-wide.png";
  return (
    <img
      src={src}
      alt="Success — Study & Work Smarter"
      className={cn("rounded-xl border-2 border-ink bg-navy object-contain", className)}
    />
  );
}
