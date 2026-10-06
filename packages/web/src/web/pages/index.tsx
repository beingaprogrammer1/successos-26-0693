import { ArrowRight, Check, ExternalLink, Sparkles, Trophy, Zap } from "lucide-react";
import { Link } from "wouter";
import { authClient } from "../lib/auth";
import { useCatalogue } from "../queries/progress";
import { useChangelog } from "../queries/content";
import { CourseIcon } from "../components/course-icon";
import { BrandLink } from "../components/ui/brand-button";
import { GemChip, GemIcon } from "../components/ui/gem";
import { ScriptLogo } from "../components/ui/brand";
import { Band, Eyebrow, Panel, Progress, SectionHead, Shell, Skeleton, StatusPill } from "../components/ui/primitives";

const MARQUEE = [
  "Study smarter",
  "Earn Success Gems",
  "Six courses",
  "Work smarter",
  "Real progress",
  "Achievements",
];

const HOW = [
  {
    step: "01",
    title: "Pick a course",
    body: "Six courses, Foundation through Advanced. Each one opens a NotebookLM workspace holding the source material you study from.",
  },
  {
    step: "02",
    title: "Work the lessons",
    body: "Six lessons per course, each with an estimated time. Tick one off and its Success Gems land in your balance immediately.",
  },
  {
    step: "03",
    title: "Bank the bonuses",
    body: "Clear a whole course for a completion bonus, and unlock achievements from Bronze up to the Legend-tier Full Six.",
  },
];

export default function IndexPage() {
  const { data: session } = authClient.useSession();
  const catalogue = useCatalogue();
  const changelog = useChangelog();
  const latest = changelog.data?.[0];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <Band tone="cream" dots className="overflow-hidden">
        <Shell wide className="grid items-center gap-14 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
          <div className="reveal">
            <Eyebrow tone="navy">Success Study &amp; Work Smarter</Eyebrow>
            <h1 className="mt-6 text-[clamp(2.6rem,7vw,4.6rem)] uppercase">
              Learn the things
              <br />
              school never
              <br />
              <span className="bg-gem px-2.5 pb-1 [box-decoration-break:clone]">sat you down</span>
              <br />
              and taught.
            </h1>
            <p className="mt-7 max-w-lg text-[16px] text-muted-ink">
              SuccessOS 26 is a six-course system covering studying, empathy, life advice,
              presenting, money and leadership. Thirty-six lessons, each paying out Success Gems
              as you go.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <BrandLink to={session ? "/dashboard" : "/sign-in?mode=create"} variant="navy" size="lg">
                {session ? "Open your dashboard" : "Start learning free"}
                <ArrowRight className="size-[18px]" />
              </BrandLink>
              <BrandLink to="/courses" variant="paper" size="lg">
                Browse the six courses
              </BrandLink>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px] font-semibold text-ink/80">
              {["36 lessons", "6 NotebookLM workspaces", "9 achievements"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <Check className="size-4 text-navy" strokeWidth={3} />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Hero card stack */}
          <div className="reveal relative" style={{ animationDelay: "120ms" }}>
            <Panel tone="paper" shadow="ink" className="relative z-10 p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="label text-muted-ink">{session ? "Gems on offer" : "Up for grabs"}</p>
                  <p className="display mt-2 text-[52px] leading-none">
                    {catalogue.isLoading ? "—" : (catalogue.data?.totals.gems ?? 0).toLocaleString()}
                  </p>
                  <p className="mt-1 text-[13px] text-muted-ink">Success Gems across all six courses</p>
                </div>
                <span className="gem-spin inline-flex size-14 items-center justify-center rounded-[13px] border-2 border-ink bg-gem">
                  <GemIcon className="size-7" />
                </span>
              </div>

              <div className="mt-7 space-y-3.5 border-t-2 border-ink pt-6">
                {catalogue.isLoading
                  ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-12" />)
                  : catalogue.data?.courses.slice(0, 3).map((course) => (
                      <div key={course.slug} className="flex items-center gap-3.5">
                        <CourseIcon
                          icon={course.icon}
                          accent={course.accent}
                          className="size-10 rounded-[9px]"
                          iconClassName="size-[18px]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-semibold">{course.title}</p>
                          <Progress percent={course.percent} height="h-2" className="mt-1.5" />
                        </div>
                        <GemChip amount={course.lessonGems + course.completionBonus} size="sm" tone="outline" />
                      </div>
                    ))}
              </div>
            </Panel>

            <Panel
              tone="navy"
              shadow="ink"
              className="absolute -bottom-16 -left-6 z-20 hidden max-w-[240px] p-4 sm:block"
            >
              <p className="label text-gem">Achievement unlocked</p>
              <p className="display mt-2 text-lg uppercase">The Full Six</p>
              <p className="mt-1 text-[12.5px] text-cream/70">
                Clear all six courses. +500 Gems.
              </p>
            </Panel>

            <div className="absolute -top-8 -right-4 -z-0 hidden rotate-[6deg] rounded-xl border-2 border-ink bg-gem px-4 py-3 hard-sm lg:block">
              <p className="label">Lesson complete · +25</p>
            </div>
          </div>
        </Shell>
      </Band>

      {/* ── Marquee ──────────────────────────────────────────── */}
      <Band tone="ink" bordered={false} className="overflow-hidden border-b-2">
        <div className="flex w-max py-4 marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center">
              {MARQUEE.map((word) => (
                <span key={`${dup}-${word}`} className="label flex items-center gap-8 px-8 text-[13px] text-cream">
                  {word}
                  <GemIcon className="size-3.5 text-gem" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </Band>

      {/* ── Courses ──────────────────────────────────────────── */}
      <Band tone="paper">
        <Shell wide className="py-20">
          <SectionHead
            align="left"
            eyebrow="The catalogue"
            title={
              <>
                Six courses. One
                <br className="hidden sm:block" /> operating system.
              </>
            }
            lede="Every course links straight into its own NotebookLM workspace, so the source material, summaries and Q&A live in one place while you tick lessons off here."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {catalogue.isLoading
              ? [0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-64" />)
              : catalogue.data?.courses.map((course, i) => (
                  <Link key={course.slug} to={`/courses/${course.slug}`} className="block">
                    <Panel
                      hover
                      className="flex h-full flex-col p-6"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <CourseIcon icon={course.icon} accent={course.accent} />
                        <StatusPill tone={course.level === "Advanced" ? "navy" : course.level === "Core" ? "sage" : "gem"}>
                          {course.level}
                        </StatusPill>
                      </div>
                      <h3 className="mt-5 text-[22px] uppercase">{course.title}</h3>
                      <p className="mt-1.5 text-[13px] font-semibold text-navy">{course.tagline}</p>
                      <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted-ink">
                        {course.description.split(".")[0]}.
                      </p>
                      <div className="mt-6 flex items-center justify-between border-t-2 border-ink pt-4">
                        <span className="text-[12.5px] font-semibold text-muted-ink">
                          {course.lessons.length} lessons · {course.totalMinutes} min
                        </span>
                        <GemChip amount={course.lessonGems + course.completionBonus} size="sm" />
                      </div>
                    </Panel>
                  </Link>
                ))}
          </div>
        </Shell>
      </Band>

      {/* ── How it works ─────────────────────────────────────── */}
      <Band tone="navy" dots>
        <Shell wide className="py-20">
          <SectionHead
            tone="cream"
            align="left"
            eyebrow="How it works"
            title="Study, tick, collect."
            lede="No streak guilt, no fake urgency. You study the material, mark what you finished, and the platform keeps the score."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOW.map((item) => (
              <Panel key={item.step} tone="cream" shadow="gem" className="p-7">
                <p className="display text-[44px] leading-none text-navy/25">{item.step}</p>
                <h3 className="mt-4 text-xl uppercase">{item.title}</h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted-ink">{item.body}</p>
              </Panel>
            ))}
          </div>
        </Shell>
      </Band>

      {/* ── Success Gems ─────────────────────────────────────── */}
      <Band tone="cream">
        <Shell wide className="grid items-center gap-14 py-20 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <Eyebrow tone="gem">The currency</Eyebrow>
            <h2 className="mt-6 text-[clamp(2rem,5vw,3.1rem)] uppercase">
              Success Gems
              <br />
              measure the work,
              <br />
              not the hype.
            </h2>
            <p className="mt-6 max-w-lg text-[15.5px] text-muted-ink">
              Gems are earned two ways: finishing lessons and unlocking achievements. Clear a full
              course and the completion bonus lands on top. Every single Gem is itemised in your
              ledger, so your balance always traces back to work you actually did.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GemChip amount={20} prefix="+" size="lg" tone="gem" className="hard-sm" />
              <GemChip amount={150} prefix="+" size="lg" tone="outline" />
              <GemChip amount={500} prefix="+" size="lg" tone="ink" className="hard-sm" />
            </div>
            <p className="mt-4 text-[12.5px] text-muted-ink">
              Lesson payout · course bonus · Legend achievement
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                Icon: Zap,
                title: "Lessons pay instantly",
                body: "20–30 Gems per lesson, credited the moment you tick it.",
                tone: "paper" as const,
              },
              {
                Icon: Trophy,
                title: "Course bonuses",
                body: "120–150 Gems for clearing every lesson in a course.",
                tone: "gem-soft" as const,
              },
              {
                Icon: Sparkles,
                title: "Nine achievements",
                body: "Bronze to Legend, from your first lesson to all thirty-six.",
                tone: "paper" as const,
              },
              {
                Icon: GemIcon as never,
                title: "A full ledger",
                body: "Every credit, with a reason, on your dashboard.",
                tone: "sage" as const,
              },
            ].map(({ Icon, title, body, tone }) => (
              <Panel key={title} tone={tone} className="p-6">
                <span className="inline-flex size-11 items-center justify-center rounded-[10px] border-2 border-ink bg-ink text-gem">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-[17px] uppercase">{title}</h3>
                <p className="mt-2 text-[13px] text-muted-ink">{body}</p>
              </Panel>
            ))}
          </div>
        </Shell>
      </Band>

      {/* ── Latest release ───────────────────────────────────── */}
      <Band tone="paper">
        <Shell wide className="py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow>What&apos;s new</Eyebrow>
              <h2 className="mt-5 text-[clamp(1.8rem,4vw,2.6rem)] uppercase">
                The platform keeps moving.
              </h2>
              <p className="mt-4 text-[14.5px] text-muted-ink">
                New courses, new achievements, fixes shipped from your reports. Every release is
                written up on the What&apos;s New page.
              </p>
              <BrandLink to="/whats-new" variant="ink" className="mt-7">
                Read the full changelog
                <ArrowRight className="size-4" />
              </BrandLink>
            </div>

            {changelog.isLoading || !latest ? (
              <Skeleton className="h-60" />
            ) : (
              <Panel tone="cream" className="p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusPill tone="navy">{latest.version}</StatusPill>
                  <StatusPill tone="gem">{latest.tag}</StatusPill>
                  <span className="text-[12.5px] font-semibold text-muted-ink">
                    {new Date(latest.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl uppercase">{latest.title}</h3>
                <ul className="mt-5 space-y-3">
                  {latest.notes.map((note) => (
                    <li key={note} className="flex gap-3 text-[14px] text-ink/80">
                      <Check className="mt-[3px] size-4 shrink-0 text-navy" strokeWidth={3} />
                      {note}
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
          </div>
        </Shell>
      </Band>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Band tone="gem" dots bordered={false}>
        <Shell className="py-20 text-center">
          <ScriptLogo variant="secondary" className="mx-auto h-24 w-auto hard" />
          <h2 className="mt-9 text-[clamp(2rem,5.5vw,3.4rem)] uppercase">
            Thirty-six lessons.
            <br />
            Start with one.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15.5px] text-ink/75">
            Create a free account, open the Studying course, and your first Gems are twelve minutes
            away.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <BrandLink to={session ? "/courses" : "/sign-in?mode=create"} variant="ink" size="lg">
              {session ? "Continue learning" : "Create your account"}
              <ArrowRight className="size-[18px]" />
            </BrandLink>
            <a
              href="https://www.youtube.com/@Success26-real"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[52px] items-center gap-2 rounded-[10px] border-2 border-ink bg-paper px-7 text-[15px] font-semibold hard-sm transition-all hover:shadow-[5px_5px_0_0_var(--ink)]"
            >
              Watch on YouTube
              <ExternalLink className="size-4" />
            </a>
          </div>
        </Shell>
      </Band>
    </>
  );
}
