import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { authClient } from "../lib/auth";
import { useGemBalance } from "../queries/progress";
import { Wordmark } from "./ui/brand";
import { BrandLink, BrandButton } from "./ui/brand-button";
import { GemChip } from "./ui/gem";
import { Shell } from "./ui/primitives";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Courses", to: "/courses" },
  { label: "What's New", to: "/whats-new" },
  { label: "Terms", to: "/terms" },
  { label: "Report", to: "/report" },
  { label: "Contact", to: "/contact" },
];

export function SiteNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const gems = useGemBalance(!!session);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-cream">
      <Shell wide className="flex h-[70px] items-center justify-between gap-4">
        <Link to="/" className="shrink-0">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = location === item.to || location.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors",
                  active ? "bg-ink text-cream" : "text-ink/75 hover:bg-ink/8 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          {isPending ? (
            <div className="h-11 w-40 animate-pulse rounded-[10px] bg-ink/10" />
          ) : session ? (
            <>
              <Link to="/dashboard" title="Your Success Gems">
                <GemChip amount={gems.data ?? 0} size="md" className="hard-sm" />
              </Link>
              <BrandLink to="/dashboard" variant="navy" size="md">
                <LayoutDashboard className="size-4" />
                Dashboard
              </BrandLink>
              <BrandButton
                variant="ghost"
                size="icon"
                title="Sign out"
                onClick={() => authClient.signOut()}
              >
                <LogOut className="size-4" />
              </BrandButton>
            </>
          ) : (
            <>
              <BrandLink to="/sign-in" variant="ghost" size="md">
                Log in
              </BrandLink>
              <BrandLink to="/sign-in?mode=create" variant="ink" size="md">
                Start learning
              </BrandLink>
            </>
          )}
        </div>

        <button
          className="flex size-11 items-center justify-center rounded-[10px] border-2 border-ink bg-paper hard-sm lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Shell>

      {open ? (
        <div className="border-t-2 border-ink bg-paper lg:hidden">
          <Shell className="flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 font-semibold text-ink hover:bg-cream"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t-2 border-ink pt-4">
              {session ? (
                <>
                  <GemChip amount={gems.data ?? 0} size="md" className="self-start" />
                  <BrandLink to="/dashboard" variant="navy" onClick={() => setOpen(false)}>
                    Dashboard
                  </BrandLink>
                  <BrandButton
                    variant="ghost"
                    onClick={() => {
                      setOpen(false);
                      authClient.signOut();
                    }}
                  >
                    Sign out
                  </BrandButton>
                </>
              ) : (
                <>
                  <BrandLink to="/sign-in" variant="paper" onClick={() => setOpen(false)}>
                    Log in
                  </BrandLink>
                  <BrandLink
                    to="/sign-in?mode=create"
                    variant="ink"
                    onClick={() => setOpen(false)}
                  >
                    Start learning
                  </BrandLink>
                </>
              )}
            </div>
          </Shell>
        </div>
      ) : null}
    </header>
  );
}
