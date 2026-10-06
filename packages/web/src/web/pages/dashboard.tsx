import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Bug,
  Lock,
  MapPin,
  ScrollText,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useDashboard } from "../queries/progress";
import { CourseIcon } from "../components/course-icon";
import { BrandLink } from "../components/ui/brand-button";
import { GemChip, GemIcon } from "../components/ui/gem";
import { Eyebrow, Panel, Progress, Shell, Skeleton, StatusPill } from "../components/ui/primitives";
import { cn } from "@/lib/utils";

const TABS = [
  {
    to: "/courses",
    label: "Courses",
    body: "Six courses, thirty-six lessons, each linked to its NotebookLM workspace.",
    Icon: BookOpen,
    tone: "navy" as const,
  },
  {
    to: "/whats-new",
    label: "What's New?",
    body: "Every release, new course and fix shipped to the platform.",
    Icon: Sparkles,
    tone: "gem" as const,
  },
  {
    to: "/terms",
    label: "Terms of Service",
    body: "How the platform works, and what Success Gems are and aren't.",
    Icon: ScrollText,
    tone: "paper" as const,
  },
  {
    to: "/report",
    label: "Report",
    body: "Found a bug or a wrong answer? Send it straight through.",
    Icon: Bug,
    tone: "paper" as const,
  },
  {
    to: "/contact",
    label: "Contact / Find Us",
    body: "YouTube, TikTok and how to reach the team.",
    Icon: MapPin,
    tone: "sage" as const,
  },
];

const TIER_TONE = {
  Bronze: "sage",
  Silver: "gem",
  Gold: "gem",
  Legend: "navy",
} as const;

export default function DashboardPage() {
  const dashboard = useDashboard();

  if (dashboard.isLoading) {
    return (
      <Shell wide className="py-14">
        <Skeleton className="h-12 w-80" />
        <div className="mt-8 grid gap-5 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
        <Skeleton className="mt-6 h-64" />
      </Shell>
    );
  }

  if (dashboard.isError || !dashboard.data) {
    return (
      <Shell className="py-24">
        <Panel className="mx-auto max-w-md p-9 text-center">
          <h1 className="text-xl uppercase">Could not load your dashboard</h1>
          <p className="mt-3 text-sm text-muted-ink">Refresh the page, or sign in again.</p>
        </Panel>
      </Shell>
    );
  }

  const d = dashboard.data;
  const firstName = (d.member.name ?? "there").split(" ")[0];

  return (
    <div className="bg-cream">
      <Shell wide className="py-12 lg:py-16">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow tone="navy">Your dashboard</Eyebrow>
            <h1 className="mt-5 text-[clamp(2rem,5vw,3rem)] uppercase">
              Good to see you, {firstName}.
            </h1>
            <p className="mt-3 text-[14.5px] text-muted-ink">
              {d.lessonsDone === 0
                ? "Nothing ticked yet — pick a course and bank your first Gems."
                : `${d.lessonsDone} of ${d.lessonsTotal} lessons done. Keep the run going.`}
            </p>
          </div>
          <GemChip amount={d.gems} size="lg" className="hard" />
        </div>

        {/* Stat row */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Panel tone="navy" className="p-6">
            <p className="label text-gem">Success Gems</p>
            <p className="display mt-3 flex items-center gap-2.5 text-[42px] leading-none">
              <GemIcon className="size-7 text-gem" />
              {d.gems.toLocaleString()}
            </p>
            <p className="mt-2 text-[12.5px] text-cream/65">
              of {d.gemsAvailable.toLocaleString()} available
            </p>
          </Panel>

          <Panel className="p-6">
            <p className="label text-muted-ink">Overall progress</p>
            <p className="display mt-3 text-[42px] leading-none">{d.percent}%</p>
            <Progress percent={d.percent} className="mt-3" />
          </Panel>

          <Panel className="p-6">
            <p className="label text-muted-ink">Lessons done</p>
            <p className="display mt-3 text-[42px] leading-none">
              {d.lessonsDone}
              <span className="text-[22px] text-muted-ink">/{d.lessonsTotal}</span>
            </p>
            <p className="mt-2 text-[12.5px] text-muted-ink">
              {d.coursesComplete} of {d.coursesTotal} courses cleared
            </p>
          </Panel>

          <Panel tone="gem-soft" className="p-6">
            <p className="label text-muted-ink">Achievements</p>
            <p className="display mt-3 text-[42px] leading-none">
              {d.achievementsUnlocked}
              <span className="text-[22px] text-muted-ink">/{d.achievementsTotal}</span>
            </p>
            <p className="mt-2 text-[12.5px] text-muted-ink">Bronze through Legend</p>
          </Panel>
        </div>

        {/* Continue + ledger */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <Panel tone="ink" className="flex flex-col p-7">
            <p className="label text-gem">
              {d.nextUp ? "Continue learning" : "All thirty-six done"}
            </p>
            {d.nextUp ? (
              <>
                <h2 className="mt-4 text-[26px] uppercase">{d.nextUp.lessonTitle}</h2>
                <p className="mt-2 text-[13.5px] text-cream/65">
                  {d.nextUp.courseTitle} · {d.nextUp.minutes} min · +{d.nextUp.gems} Gems
                </p>
                <div className="mt-auto pt-7">
                  <BrandLink to={`/courses/${d.nextUp.courseSlug}`} variant="gem" size="lg">
                    Open the lesson
                    <ArrowRight className="size-[18px]" />
                  </BrandLink>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-4 text-[26px] uppercase">You cleared the whole system.</h2>
                <p className="mt-2 text-[13.5px] text-cream/65">
                  Every lesson ticked. Revisit any course any time — your Gems stay banked.
                </p>
                <div className="mt-auto pt-7">
                  <BrandLink to="/courses" variant="gem" size="lg">
                    Revisit the courses
                    <ArrowRight className="size-[18px]" />
                  </BrandLink>
                </div>
              </>
            )}
          </Panel>

          <Panel className="p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-[19px] uppercase">Gem ledger</h2>
              <StatusPill tone="gem">Latest 8</StatusPill>
            </div>
            {d.ledger.length === 0 ? (
              <p className="mt-6 text-[13.5px] text-muted-ink">
                Empty for now. Tick your first lesson and it shows up here.
              </p>
            ) : (
              <ul className="mt-5 divide-y-2 divide-ink/10">
                {d.ledger.map((row) => (
                  <li key={row.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold">{row.reason}</p>
                      <p className="label mt-1 text-muted-ink">{row.kind}</p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 text-[14px] font-bold",
                        row.amount >= 0 ? "text-navy" : "text-danger",
                      )}
                    >
                      {row.amount >= 0 ? "+" : ""}
                      {row.amount}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* Courses */}
        <div className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[clamp(1.5rem,3.4vw,2.1rem)] uppercase">Your courses</h2>
            <Link to="/courses" className="label text-navy hover:underline">
              See all six
            </Link>
          </div>
          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {d.courses.map((course) => (
              <Link key={course.slug} to={`/courses/${course.slug}`}>
                <Panel hover className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <CourseIcon icon={course.icon} accent={course.accent} />
                    {course.complete ? (
                      <StatusPill tone="done">Complete</StatusPill>
                    ) : (
                      <StatusPill tone="open">{course.level}</StatusPill>
                    )}
                  </div>
                  <h3 className="mt-5 text-[20px] uppercase">{course.title}</h3>
                  <p className="mt-1.5 flex-1 text-[13px] text-muted-ink">{course.tagline}</p>
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-[12.5px] font-semibold">
                      <span>
                        {course.done}/{course.total} lessons
                      </span>
                      <span className="text-navy">{course.percent}%</span>
                    </div>
                    <Progress percent={course.percent} height="h-2.5" className="mt-2" />
                  </div>
                </Panel>
              </Link>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-14">
          <h2 className="text-[clamp(1.5rem,3.4vw,2.1rem)] uppercase">Achievements</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {d.achievements.map((a) => (
              <Panel
                key={a.id}
                tone={a.unlocked ? "paper" : "cream"}
                shadow={a.unlocked ? "ink" : "none"}
                className={cn("flex gap-4 p-5", !a.unlocked && "border-dashed opacity-75")}
              >
                <span
                  className={cn(
                    "inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] border-2 border-ink",
                    a.unlocked ? "bg-gem" : "bg-paper",
                  )}
                >
                  {a.unlocked ? (
                    <Trophy className="size-5" strokeWidth={2.2} />
                  ) : (
                    <Lock className="size-4 text-muted-ink" />
                  )}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[15.5px] uppercase">{a.title}</h3>
                    <StatusPill tone={TIER_TONE[a.tier]}>{a.tier}</StatusPill>
                  </div>
                  <p className="mt-1.5 text-[12.5px] text-muted-ink">{a.description}</p>
                  <GemChip
                    amount={a.gems}
                    prefix="+"
                    size="sm"
                    tone={a.unlocked ? "gem" : "outline"}
                    className="mt-3"
                  />
                </div>
              </Panel>
            ))}
          </div>
        </div>

        {/* Tab tiles */}
        <div className="mt-14">
          <h2 className="text-[clamp(1.5rem,3.4vw,2.1rem)] uppercase">Everything else</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TABS.map((tab) => (
              <Link key={tab.to} to={tab.to}>
                <Panel hover tone={tab.tone} className="flex h-full items-start gap-4 p-6">
                  <span
                    className={cn(
                      "inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] border-2",
                      tab.tone === "navy"
                        ? "border-cream/40 bg-cream text-navy"
                        : "border-ink bg-ink text-gem",
                    )}
                  >
                    <tab.Icon className="size-5" strokeWidth={2.2} />
                  </span>
                  <div>
                    <h3 className="text-[17px] uppercase">{tab.label}</h3>
                    <p
                      className={cn(
                        "mt-1.5 text-[13px]",
                        tab.tone === "navy" ? "text-cream/70" : "text-muted-ink",
                      )}
                    >
                      {tab.body}
                    </p>
                  </div>
                </Panel>
              </Link>
            ))}
          </div>
        </div>
      </Shell>
    </div>
  );
}
