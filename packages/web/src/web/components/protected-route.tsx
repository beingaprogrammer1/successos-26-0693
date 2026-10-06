import { useEffect } from "react";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";
import { authClient } from "../lib/auth";
import { Panel, Shell, Skeleton } from "./ui/primitives";
import { BrandLink } from "./ui/brand-button";

/** Gates member-only pages. Sends signed-out visitors to /sign-in with a return path. */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const [location] = useLocation();

  useEffect(() => {
    if (!isPending && !session) {
      const next = encodeURIComponent(location);
      window.history.replaceState(null, "", `/sign-in?next=${next}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, [isPending, session, location]);

  if (isPending) {
    return (
      <Shell className="py-20">
        <Skeleton className="h-10 w-64" />
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="mt-6 h-72" />
      </Shell>
    );
  }

  if (!session) {
    return (
      <Shell className="py-24">
        <Panel className="mx-auto max-w-lg p-10 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-full border-2 border-ink bg-gem">
            <Lock className="size-5" />
          </span>
          <h1 className="mt-5 text-2xl uppercase">Members only</h1>
          <p className="mt-3 text-sm text-muted-ink">
            Sign in to track lessons and collect Success Gems.
          </p>
          <BrandLink to="/sign-in" variant="navy" size="lg" className="mt-7">
            Sign in
          </BrandLink>
        </Panel>
      </Shell>
    );
  }

  return <>{children}</>;
}
