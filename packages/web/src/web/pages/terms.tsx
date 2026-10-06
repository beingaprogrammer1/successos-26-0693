import { AlertTriangle, FileText } from "lucide-react";
import { useTerms } from "../queries/content";
import { BrandLink } from "../components/ui/brand-button";
import { Band, Eyebrow, Panel, Shell, Skeleton, StatusPill } from "../components/ui/primitives";

export default function TermsPage() {
  const terms = useTerms();

  return (
    <>
      <Band tone="ink" dots>
        <Shell wide className="py-14 lg:py-18">
          <Eyebrow tone="gem">Terms of Service</Eyebrow>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="max-w-2xl text-[clamp(2.1rem,5.5vw,3.3rem)] uppercase text-cream">
                The rules of
                <br />
                the platform.
              </h1>
              <p className="mt-5 max-w-xl text-[15px] text-cream/70">
                Plain-language standard terms covering your account, the course material, and what
                Success Gems are and are not.
              </p>
            </div>
            {terms.isLoading ? (
              <Skeleton className="h-16 w-56" />
            ) : (
              <Panel tone="cream" shadow="gem" className="px-6 py-4">
                <p className="label text-muted-ink">Effective date</p>
                <p className="display mt-1.5 text-[19px] uppercase">
                  {terms.data?.effectiveDate}
                </p>
              </Panel>
            )}
          </div>
        </Shell>
      </Band>

      <Band tone="cream" bordered={false}>
        <Shell wide className="py-14">
          <Panel tone="gem-soft" className="flex items-start gap-4 p-6">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] border-2 border-ink bg-gem">
              <AlertTriangle className="size-5" strokeWidth={2.2} />
            </span>
            <div>
              <h2 className="text-[17px] uppercase">A note on these terms</h2>
              <p className="mt-2 text-[13.5px] text-muted-ink">
                These are drafted standard terms provided as a starting point for SuccessOS 26. They
                are not legal advice — have a qualified lawyer review them before relying on them
                commercially.
              </p>
            </div>
          </Panel>

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.3fr_0.7fr] lg:items-start">
            {/* Contents */}
            <Panel className="p-6 lg:sticky lg:top-24">
              <p className="label flex items-center gap-2 text-muted-ink">
                <FileText className="size-3.5" />
                Contents
              </p>
              {terms.isLoading ? (
                <div className="mt-4 space-y-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-5" />
                  ))}
                </div>
              ) : (
                <ol className="mt-4 space-y-2.5">
                  {terms.data?.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block text-[13px] text-muted-ink transition-colors hover:font-semibold hover:text-navy"
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </Panel>

            {/* Sections */}
            <div>
              {terms.isLoading ? (
                <div className="space-y-6">
                  {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-40" />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {terms.data?.sections.map((section) => (
                    <Panel key={section.id} id={section.id} className="scroll-mt-24 p-7">
                      <h2 className="text-[clamp(1.15rem,2.4vw,1.45rem)] uppercase">
                        {section.heading}
                      </h2>
                      <div className="mt-4 space-y-3.5">
                        {section.body.map((para, i) => (
                          <p key={i} className="text-[14.5px] leading-relaxed text-ink/80">
                            {para}
                          </p>
                        ))}
                      </div>
                      {section.id === "gems" ? (
                        <StatusPill tone="gem" className="mt-5">
                          No monetary value
                        </StatusPill>
                      ) : null}
                    </Panel>
                  ))}
                </div>
              )}

              <Panel tone="navy" className="mt-8 flex flex-wrap items-center justify-between gap-5 p-7">
                <div>
                  <h2 className="text-[19px] uppercase text-cream">Questions about any of this?</h2>
                  <p className="mt-2 text-[13.5px] text-cream/70">
                    Send it through the Report tab or reach us on the Contact page.
                  </p>
                </div>
                <div className="flex gap-3">
                  <BrandLink to="/report" variant="gem">
                    Report
                  </BrandLink>
                  <BrandLink to="/contact" variant="outlineCream">
                    Contact
                  </BrandLink>
                </div>
              </Panel>
            </div>
          </div>
        </Shell>
      </Band>
    </>
  );
}
