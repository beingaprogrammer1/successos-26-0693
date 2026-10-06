import { Link } from "wouter";
import { ArrowRight, Clock, ExternalLink } from "lucide-react";
import { useCatalogue } from "../queries/progress";
import { authClient } from "../lib/auth";
import { CourseIcon } from "../components/course-icon";
import { BrandLink } from "../components/ui/brand-button";
import { GemChip } from "../components/ui/gem";
import { Band, Eyebrow, Panel, Progress, Shell, Skeleton, StatusPill } from "../components/ui/primitives";

const LEVEL_TONE = { Foundation: "gem", Core: "sage", Advanced: "navy" } as const;

export default function CoursesPage() {
  const catalogue = useCatalogue();
  const { data: session } = authClient.useSession();

  return (
    <>
      <Band tone="cream" dots>
        <Shell wide className="py-14 lg:py-20">
          <Eyebrow tone="navy">Courses</Eyebrow>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <h1 className="text-[clamp(2.2rem,6vw,3.6rem)] uppercase">
                The whole
                <br />
                curriculum.
              </h1>
              <p className="mt-5 max-w-xl text-[15.5px] text-muted-ink">
                Start anywhere, but Foundation courses make the rest land harder. Each course opens
                a NotebookLM workspace holding the source material — you study there and tick
                lessons off here.
              </p>
            </div>
            {catalogue.isLoading ? (
              <Skeleton className="h-28" />
            ) : (
              <Panel className="grid grid-cols-3 divide-x-2 divide-ink/12 p-0">
                {[
                  { label: "Courses", value: catalogue.data?.totals.courses },
                  { label: "Lessons", value: catalogue.data?.totals.lessons },
                  { label: "Gems", value: catalogue.data?.totals.gems.toLocaleString() },
                ].map((stat) => (
                  <div key={stat.label} className="px-4 py-6 text-center">
                    <p className="display text-[28px] leading-none">{stat.value}</p>
                    <p className="label mt-2 text-muted-ink">{stat.label}</p>
                  </div>
                ))}
              </Panel>
            )}
          </div>
        </Shell>
      </Band>

      <Band tone="paper" bordered={false}>
        <Shell wide className="py-16">
          {catalogue.isLoading ? (
            <div className="space-y-6">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-56" />
              ))}
            </div>
          ) : (
            <div className="space-y-7">
              {catalogue.data?.courses.map((course, i) => (
                <Panel key={course.slug} className="overflow-hidden p-0">
                  <div className="grid lg:grid-cols-[1.45fr_1fr]">
                    {/* Left */}
                    <div className="border-b-2 border-ink p-7 lg:border-r-2 lg:border-b-0 lg:p-9">
                      <div className="flex items-start gap-4">
                        <CourseIcon icon={course.icon} accent={course.accent} className="size-14" iconClassName="size-6" />
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="label text-muted-ink">
                              Course {String(i + 1).padStart(2, "0")}
                            </span>
                            <StatusPill tone={LEVEL_TONE[course.level]}>{course.level}</StatusPill>
                            {course.complete ? <StatusPill tone="done">Complete</StatusPill> : null}
                          </div>
                          <h2 className="mt-2.5 text-[clamp(1.5rem,3.2vw,2rem)] uppercase">
                            {course.title}
                          </h2>
                          <p className="mt-1 text-[13.5px] font-semibold text-navy">
                            {course.tagline}
                          </p>
                        </div>
                      </div>

                      <p className="mt-6 text-[14.5px] leading-relaxed text-muted-ink">
                        {course.description}
                      </p>

                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <BrandLink to={`/courses/${course.slug}`} variant="navy">
                          {session ? (course.done > 0 ? "Continue course" : "Start course") : "View course"}
                          <ArrowRight className="size-4" />
                        </BrandLink>
                        <a
                          href={course.notebookUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-11 items-center gap-2 rounded-[10px] border-2 border-ink bg-paper px-5 text-[14px] font-semibold hard-sm transition-all hover:bg-cream hover:shadow-[5px_5px_0_0_var(--ink)]"
                        >
                          Open NotebookLM
                          <ExternalLink className="size-4" />
                        </a>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="bg-cream p-7 lg:p-9">
                      <div className="flex items-center justify-between">
                        <p className="label text-muted-ink">Payout</p>
                        <GemChip amount={course.lessonGems + course.completionBonus} size="md" />
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-[10px] border-2 border-ink bg-paper px-4 py-3">
                          <p className="display text-[22px] leading-none">{course.lessons.length}</p>
                          <p className="label mt-1.5 text-muted-ink">Lessons</p>
                        </div>
                        <div className="rounded-[10px] border-2 border-ink bg-paper px-4 py-3">
                          <p className="display flex items-center gap-1.5 text-[22px] leading-none">
                            <Clock className="size-4 text-navy" />
                            {course.totalMinutes}
                          </p>
                          <p className="label mt-1.5 text-muted-ink">Minutes</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center justify-between text-[12.5px] font-semibold">
                          <span>Your progress</span>
                          <span className="text-navy">
                            {course.done}/{course.lessons.length}
                          </span>
                        </div>
                        <Progress percent={course.percent} className="mt-2" />
                      </div>

                      <ul className="mt-6 space-y-2 border-t-2 border-ink/12 pt-5">
                        {course.outcomes.map((outcome) => (
                          <li key={outcome} className="flex gap-2.5 text-[13px] text-muted-ink">
                            <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-navy" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          )}

          {!session ? (
            <Panel tone="gem" className="mt-10 flex flex-wrap items-center justify-between gap-5 p-7">
              <div>
                <h2 className="text-[20px] uppercase">Sign in to bank your Gems</h2>
                <p className="mt-1.5 text-[13.5px] text-ink/75">
                  Lesson ticks, progress bars and achievements all need an account. It takes a
                  minute.
                </p>
              </div>
              <BrandLink to="/sign-in?mode=create" variant="ink" size="lg">
                Create account
              </BrandLink>
            </Panel>
          ) : null}

          <p className="mt-10 text-center text-[13px] text-muted-ink">
            Looking for something that isn&apos;t here?{" "}
            <Link to="/report" className="font-semibold text-navy underline">
              Tell us on the Report page
            </Link>
            .
          </p>
        </Shell>
      </Band>
    </>
  );
}
