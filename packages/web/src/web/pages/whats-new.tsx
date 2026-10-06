import { Rocket, Sparkles, Wrench, Bug } from "lucide-react";
import { useChangelog } from "../queries/content";
import { BrandLink } from "../components/ui/brand-button";
import { Band, Eyebrow, Panel, Shell, Skeleton, StatusPill } from "../components/ui/primitives";
import { cn } from "@/lib/utils";

const TAG_META = {
  Launch: { Icon: Rocket, tone: "navy" as const, bg: "bg-navy text-cream" },
  New: { Icon: Sparkles, tone: "gem" as const, bg: "bg-gem text-ink" },
  Improved: { Icon: Wrench, tone: "sage" as const, bg: "bg-sage text-ink" },
  Fixed: { Icon: Bug, tone: "open" as const, bg: "bg-gem-soft text-ink" },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function WhatsNewPage() {
  const changelog = useChangelog();

  return (
    <>
      <Band tone="gem" dots>
        <Shell wide className="py-14 lg:py-20">
          <Eyebrow>What&apos;s new?</Eyebrow>
          <h1 className="mt-6 max-w-3xl text-[clamp(2.2rem,6vw,3.6rem)] uppercase">
            Every change,
            <br />
            written down.
          </h1>
          <p className="mt-5 max-w-xl text-[15.5px] text-ink/75">
            New courses, new achievements, and fixes that came straight from member reports. Newest
            release first.
          </p>
        </Shell>
      </Band>

      <Band tone="cream" bordered={false}>
        <Shell wide className="py-16">
          {changelog.isLoading ? (
            <div className="space-y-6">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : (
            <ol className="relative space-y-8 lg:pl-10">
              <span
                className="pointer-events-none absolute top-3 bottom-3 left-[13px] hidden w-[2px] bg-ink/20 lg:block"
                aria-hidden="true"
              />
              {changelog.data?.map((entry, i) => {
                const meta = TAG_META[entry.tag];
                return (
                  <li key={entry.version} className="relative">
                    <span
                      className={cn(
                        "absolute top-7 -left-10 hidden size-7 items-center justify-center rounded-full border-2 border-ink lg:inline-flex",
                        meta.bg,
                      )}
                      aria-hidden="true"
                    >
                      <meta.Icon className="size-3.5" strokeWidth={2.4} />
                    </span>

                    <Panel
                      tone={i === 0 ? "paper" : "paper"}
                      shadow={i === 0 ? "ink" : "ink"}
                      className="p-7 lg:p-8"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <StatusPill tone="navy">{entry.version}</StatusPill>
                        <StatusPill tone={meta.tone}>{entry.tag}</StatusPill>
                        {i === 0 ? <StatusPill tone="sage">Latest</StatusPill> : null}
                        <span className="text-[12.5px] font-semibold text-muted-ink">
                          {formatDate(entry.date)}
                        </span>
                      </div>

                      <h2 className="mt-5 text-[clamp(1.4rem,3.2vw,1.9rem)] uppercase">
                        {entry.title}
                      </h2>

                      <ul className="mt-5 space-y-3 border-t-2 border-ink/12 pt-5">
                        {entry.notes.map((note) => (
                          <li key={note} className="flex gap-3 text-[14px] text-ink/80">
                            <span className="mt-[8px] size-1.5 shrink-0 rounded-full bg-navy" />
                            {note}
                          </li>
                        ))}
                      </ul>
                    </Panel>
                  </li>
                );
              })}
            </ol>
          )}

          <Panel tone="ink" className="mt-12 flex flex-wrap items-center justify-between gap-5 p-8">
            <div>
              <h2 className="text-[21px] uppercase text-cream">Spotted something broken?</h2>
              <p className="mt-2 max-w-md text-[13.5px] text-cream/70">
                Most of the fixes on this page started as a member report. Send yours and it gets
                triaged by severity.
              </p>
            </div>
            <BrandLink to="/report" variant="gem" size="lg">
              Report a problem
            </BrandLink>
          </Panel>
        </Shell>
      </Band>
    </>
  );
}
