import { ArrowUpRight, Bug, MessageSquare } from "lucide-react";
import { SOCIALS } from "../components/site-footer";
import { BrandLink } from "../components/ui/brand-button";
import { ScriptLogo } from "../components/ui/brand";
import { Band, Eyebrow, Panel, Shell } from "../components/ui/primitives";

export default function ContactPage() {
  return (
    <>
      <Band tone="sage" dots>
        <Shell wide className="py-14 lg:py-20">
          <Eyebrow tone="navy">Contact / Find us</Eyebrow>
          <h1 className="mt-6 text-[clamp(2.2rem,6vw,3.6rem)] uppercase">
            Find Success
            <br />
            where you scroll.
          </h1>
          <p className="mt-5 max-w-xl text-[15.5px] text-ink/75">
            Lesson walkthroughs on YouTube, quick ideas on TikTok. Follow along, ask questions in
            the comments, or send anything platform-related through the Report tab.
          </p>
        </Shell>
      </Band>

      <Band tone="cream" bordered={false}>
        <Shell wide className="py-16">
          <div className="grid gap-7 md:grid-cols-2">
            {SOCIALS.map((s, i) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${s.label} — ${s.handle}`}
                className="block"
              >
                <Panel hover tone={i === 0 ? "navy" : "ink"} className="flex h-full flex-col p-8">
                  <div className="flex items-start justify-between">
                    <span className="inline-flex size-16 items-center justify-center rounded-[14px] border-2 border-cream/30 bg-cream text-ink">
                      <s.Icon className="size-8" />
                    </span>
                    <ArrowUpRight className="size-7 text-gem" />
                  </div>
                  <p className="label mt-8 text-gem">{s.label}</p>
                  <h2 className="mt-3 text-[clamp(1.6rem,3.6vw,2.3rem)] text-cream">{s.handle}</h2>
                  <p className="mt-3 flex-1 text-[14px] text-cream/70">{s.blurb}</p>
                  <span className="mt-8 inline-flex h-11 w-fit items-center rounded-[10px] border-2 border-ink bg-gem px-5 text-[14px] font-semibold text-ink">
                    {i === 0 ? "Subscribe" : "Follow"} on {s.label}
                  </span>
                </Panel>
              </a>
            ))}
          </div>

          <div className="mt-8 grid gap-7 md:grid-cols-[1.2fr_0.8fr]">
            <Panel className="flex flex-col p-8">
              <span className="inline-flex size-12 items-center justify-center rounded-[11px] border-2 border-ink bg-gem">
                <Bug className="size-5" />
              </span>
              <h2 className="mt-5 text-[22px] uppercase">Platform problem?</h2>
              <p className="mt-2 flex-1 text-[14px] text-muted-ink">
                Bugs, account issues and content errors get tracked fastest through the Report tab,
                with a status you can follow.
              </p>
              <BrandLink to="/report" variant="navy" className="mt-6 w-fit">
                <MessageSquare className="size-4" />
                Open the Report tab
              </BrandLink>
            </Panel>
            <Panel tone="navy" className="flex items-center justify-center overflow-hidden p-0">
              <ScriptLogo variant="submark" className="h-full max-h-64 w-full rounded-none border-0" />
            </Panel>
          </div>
        </Shell>
      </Band>
    </>
  );
}
