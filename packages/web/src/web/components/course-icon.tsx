import {
  BookOpen,
  Compass,
  HeartHandshake,
  Presentation,
  Users,
  Wallet,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  BookOpen,
  HeartHandshake,
  Compass,
  Presentation,
  Wallet,
  Users,
};

export const ACCENT_BG: Record<string, string> = {
  navy: "bg-navy text-cream",
  gem: "bg-gem text-ink",
  sage: "bg-sage text-ink",
  ink: "bg-ink text-cream",
};

/** Bordered square badge carrying a course's lucide icon in its accent color. */
export function CourseIcon({
  icon,
  accent,
  className,
  iconClassName,
}: {
  icon: string;
  accent: string;
  className?: string;
  iconClassName?: string;
}) {
  const Icon = ICONS[icon] ?? Sparkles;
  return (
    <span
      className={cn(
        "inline-flex size-12 shrink-0 items-center justify-center rounded-[11px] border-2 border-ink",
        ACCENT_BG[accent] ?? ACCENT_BG.navy,
        className,
      )}
    >
      <Icon className={cn("size-[22px]", iconClassName)} strokeWidth={2.1} />
    </span>
  );
}
