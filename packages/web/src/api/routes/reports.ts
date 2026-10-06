import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { base } from "../__core/app";
import { withUser } from "../middleware/auth";
import { db } from "../database";
import * as schema from "../database/schema";

const reportInput = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  category: z.enum(["bug", "content", "account", "feedback", "other"]),
  severity: z.enum(["low", "medium", "high"]),
  area: z.string().min(1).max(120),
  subject: z.string().min(3).max(160),
  details: z.string().min(10).max(4000),
});

export const reports = {
  submit: withUser.input(reportInput).handler(async ({ input, context }) => {
    const [row] = await db
      .insert(schema.reports)
      .values({ ...input, userId: context.user?.id ?? null, status: "open" })
      .returning();
    return row;
  }),

  /** The signed-in member's own reports, newest first. */
  mine: withUser.handler(async ({ context }) => {
    if (!context.user) return [];
    return db
      .select()
      .from(schema.reports)
      .where(eq(schema.reports.userId, context.user.id))
      .orderBy(desc(schema.reports.createdAt))
      .limit(25);
  }),

  /** Public counter for the Report page. */
  stats: base.handler(async () => {
    const rows = await db.select({ status: schema.reports.status }).from(schema.reports);
    return {
      total: rows.length,
      resolved: rows.filter((r) => r.status === "resolved").length,
    };
  }),
};
