import { base } from "../__core/app";
import { CHANGELOG } from "../data/curriculum";

export interface TermsSection {
  id: string;
  heading: string;
  body: string[];
}

const EFFECTIVE_DATE = "30 September 2026";

const TERMS: TermsSection[] = [
  {
    id: "agreement",
    heading: "1. Agreement to these terms",
    body: [
      "These Terms of Service govern your access to and use of SuccessOS 26, the learning platform operated by Success (\"Success\", \"we\", \"us\"). By creating an account or using any part of the platform you agree to be bound by these terms.",
      "If you do not agree with any part of these terms, please do not use the platform. These are standard terms provided as a starting point and are not legal advice.",
    ],
  },
  {
    id: "accounts",
    heading: "2. Your account",
    body: [
      "You must provide accurate information when creating an account and keep your login credentials confidential. You are responsible for all activity that takes place under your account.",
      "One account is intended for one person. Sharing an account, or selling or transferring access to it, is not permitted.",
      "If you believe your account has been accessed without your permission, tell us through the Report tab as soon as possible.",
    ],
  },
  {
    id: "courses",
    heading: "3. Courses and educational content",
    body: [
      "SuccessOS 26 courses are educational material intended for general learning. Course content is delivered in part through third-party study workspaces, including Google NotebookLM, which are governed by their own terms.",
      "Nothing in our Money Management, Life Advice, Leadership Skills or any other course constitutes financial, legal, medical or professional advice. You are responsible for decisions you make based on what you learn.",
      "We may add, revise, reorder or retire lessons and courses as the material is improved. Where a change affects progress you have already recorded, we will preserve your completion history wherever technically possible.",
    ],
  },
  {
    id: "gems",
    heading: "4. Success Gems",
    body: [
      "Success Gems are a virtual reward inside SuccessOS 26, earned by completing lessons and unlocking achievements. They record your progress and effort on the platform.",
      "Success Gems have no monetary value. They are not currency, not a security, not redeemable for cash, and cannot be bought, sold, transferred between accounts or exchanged outside the platform.",
      "We may adjust Gem payouts, add new ways to earn, or correct balances affected by an error or by abuse of the reward system. Gems earned dishonestly — including through automated tools that tick lessons you have not studied — may be removed.",
      "If your account is closed, any Gem balance associated with it ends with it.",
    ],
  },
  {
    id: "conduct",
    heading: "5. Acceptable use",
    body: [
      "You agree not to interfere with or disrupt the platform, attempt to access accounts or data that are not yours, probe or scan our systems, or use automated means to scrape content or inflate progress.",
      "You agree not to copy, redistribute or resell course content, and not to upload anything unlawful, abusive or infringing through forms on the platform.",
      "We may suspend or terminate access where these terms are breached.",
    ],
  },
  {
    id: "ip",
    heading: "6. Intellectual property",
    body: [
      "The Success name, the Success logos, the SuccessOS 26 interface, and the structure and wording of our course material belong to Success and are protected by intellectual property law.",
      "You are granted a personal, non-exclusive, non-transferable licence to use the platform and its content for your own learning. All other rights are reserved.",
    ],
  },
  {
    id: "reports",
    heading: "7. Reports and submissions",
    body: [
      "When you send us a bug report, issue or piece of feedback, you allow us to read it, act on it, and use it to improve the platform. Do not include passwords or sensitive personal information in a report.",
      "We aim to review reports promptly but do not guarantee a response time or that any particular change will be made.",
    ],
  },
  {
    id: "availability",
    heading: "8. Availability and changes to the service",
    body: [
      "We work to keep SuccessOS 26 available and reliable, but the platform is provided on an \"as is\" and \"as available\" basis without warranties of any kind. Access may be interrupted for maintenance, updates or reasons outside our control.",
      "We may change, suspend or discontinue features at any time. Material changes will be announced on the What's New page.",
    ],
  },
  {
    id: "liability",
    heading: "9. Limitation of liability",
    body: [
      "To the fullest extent permitted by law, Success is not liable for indirect, incidental, special or consequential loss, for lost data, lost opportunity or lost profit, or for outcomes arising from your use of course material.",
      "Nothing in these terms excludes liability that cannot lawfully be excluded.",
    ],
  },
  {
    id: "termination",
    heading: "10. Ending your use",
    body: [
      "You may stop using SuccessOS 26 and request account closure at any time through the Contact page. We may suspend or close an account that breaches these terms or that poses a risk to the platform or other members.",
      "Sections covering intellectual property, limitation of liability and the status of Success Gems continue to apply after an account is closed.",
    ],
  },
  {
    id: "updates",
    heading: "11. Updates to these terms",
    body: [
      "We may revise these terms as the platform grows. The effective date at the top of this page always reflects the current version, and significant revisions will be noted on the What's New page.",
      "Continuing to use SuccessOS 26 after a revision means you accept the revised terms.",
    ],
  },
  {
    id: "contact",
    heading: "12. Contacting us",
    body: [
      "Questions about these terms can be sent through the Report tab or the channels listed on the Contact page, including our YouTube and TikTok accounts.",
    ],
  },
];

export const content = {
  changelog: base.handler(() => CHANGELOG),
  terms: base.handler(() => ({ effectiveDate: EFFECTIVE_DATE, sections: TERMS })),
};
