import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export * from "./auth-schema";

/** One row per lesson a member has ticked off. */
export const lessonCompletions = sqliteTable(
  "lesson_completions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull(),
    courseSlug: text("course_slug").notNull(),
    lessonId: text("lesson_id").notNull(),
    completedAt: integer("completed_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex("lesson_completions_user_lesson").on(table.userId, table.lessonId)],
);

/** Every Success Gem movement. The balance is always the sum of this ledger. */
export const gemLedger = sqliteTable("gem_ledger", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  /** "lesson" | "course" | "achievement" | "bonus" */
  kind: text("kind").notNull(),
  /** lesson id, course slug or achievement id this entry came from */
  refId: text("ref_id"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/** Achievements a member has unlocked. */
export const unlockedAchievements = sqliteTable(
  "unlocked_achievements",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull(),
    achievementId: text("achievement_id").notNull(),
    unlockedAt: integer("unlocked_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex("unlocked_achievements_user_ach").on(table.userId, table.achievementId)],
);

/** Bug / issue / feedback reports submitted from the Report tab. */
export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  /** "bug" | "content" | "account" | "feedback" | "other" */
  category: text("category").notNull(),
  /** "low" | "medium" | "high" */
  severity: text("severity").notNull(),
  area: text("area").notNull(),
  subject: text("subject").notNull(),
  details: text("details").notNull(),
  /** "open" | "in_review" | "resolved" */
  status: text("status").notNull().$default(() => "open"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
