import { z } from "zod";
import { and, desc, eq, sql } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { authed, withUser } from "../middleware/auth";
import { db } from "../database";
import * as schema from "../database/schema";
import {
  ACHIEVEMENTS,
  COURSES,
  TOTAL_GEMS_AVAILABLE,
  TOTAL_LESSONS,
  findCourse,
  findLesson,
  type Achievement,
} from "../data/curriculum";

async function completedLessonIds(userId: string): Promise<string[]> {
  const rows = await db
    .select({ lessonId: schema.lessonCompletions.lessonId })
    .from(schema.lessonCompletions)
    .where(eq(schema.lessonCompletions.userId, userId));
  return rows.map((r) => r.lessonId);
}

async function gemBalance(userId: string): Promise<number> {
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${schema.gemLedger.amount}), 0)` })
    .from(schema.gemLedger)
    .where(eq(schema.gemLedger.userId, userId));
  return Number(row?.total ?? 0);
}

function courseStats(completed: Set<string>) {
  return COURSES.map((course) => {
    const done = course.lessons.filter((l) => completed.has(l.id)).length;
    return {
      slug: course.slug,
      done,
      total: course.lessons.length,
      complete: done === course.lessons.length,
      percent: Math.round((done / course.lessons.length) * 100),
    };
  });
}

function achievementEarned(a: Achievement, completed: Set<string>): boolean {
  const stats = courseStats(completed);
  const rule = a.rule;
  switch (rule.type) {
    case "firstLesson":
      return completed.size >= 1;
    case "lessons":
      return completed.size >= rule.count;
    case "courses":
      return stats.filter((s) => s.complete).length >= rule.count;
    case "course":
      return stats.find((s) => s.slug === rule.slug)?.complete ?? false;
  }
}

/** Credits any newly earned achievements + course bonuses. Returns gems awarded. */
async function settleRewards(userId: string, completed: Set<string>): Promise<number> {
  let awarded = 0;

  // Course completion bonuses (ledger row per course, keyed by refId).
  const bonusRows = await db
    .select({ refId: schema.gemLedger.refId })
    .from(schema.gemLedger)
    .where(and(eq(schema.gemLedger.userId, userId), eq(schema.gemLedger.kind, "course")));
  const paidCourses = new Set(bonusRows.map((r) => r.refId));

  for (const stat of courseStats(completed)) {
    if (!stat.complete || paidCourses.has(stat.slug)) continue;
    const course = findCourse(stat.slug)!;
    await db.insert(schema.gemLedger).values({
      userId,
      amount: course.completionBonus,
      reason: `Completed the ${course.title} course`,
      kind: "course",
      refId: course.slug,
    });
    awarded += course.completionBonus;
  }

  // Achievements.
  const unlockedRows = await db
    .select({ achievementId: schema.unlockedAchievements.achievementId })
    .from(schema.unlockedAchievements)
    .where(eq(schema.unlockedAchievements.userId, userId));
  const unlocked = new Set(unlockedRows.map((r) => r.achievementId));

  for (const achievement of ACHIEVEMENTS) {
    if (unlocked.has(achievement.id)) continue;
    if (!achievementEarned(achievement, completed)) continue;
    await db
      .insert(schema.unlockedAchievements)
      .values({ userId, achievementId: achievement.id })
      .onConflictDoNothing();
    await db.insert(schema.gemLedger).values({
      userId,
      amount: achievement.gems,
      reason: `Achievement unlocked: ${achievement.title}`,
      kind: "achievement",
      refId: achievement.id,
    });
    awarded += achievement.gems;
  }

  return awarded;
}

export const progress = {
  /** Public catalogue — course shells with a member's progress folded in when signed in. */
  catalogue: withUser.handler(async ({ context }) => {
    const completed = context.user ? new Set(await completedLessonIds(context.user.id)) : new Set<string>();
    const stats = courseStats(completed);
    return {
      totals: { lessons: TOTAL_LESSONS, gems: TOTAL_GEMS_AVAILABLE, courses: COURSES.length },
      courses: COURSES.map((course) => {
        const stat = stats.find((s) => s.slug === course.slug)!;
        return {
          ...course,
          lessons: course.lessons.map((l) => ({ ...l, completed: completed.has(l.id) })),
          lessonGems: course.lessons.reduce((n, l) => n + l.gems, 0),
          totalMinutes: course.lessons.reduce((n, l) => n + l.minutes, 0),
          done: stat.done,
          percent: stat.percent,
          complete: stat.complete,
        };
      }),
    };
  }),

  /** One course with the signed-in member's lesson state. */
  course: withUser.input(z.object({ slug: z.string() })).handler(async ({ input, context }) => {
    const course = findCourse(input.slug);
    if (!course) throw new ORPCError("NOT_FOUND", { message: "Course not found" });
    const completed = context.user ? new Set(await completedLessonIds(context.user.id)) : new Set<string>();
    const done = course.lessons.filter((l) => completed.has(l.id)).length;
    return {
      ...course,
      lessons: course.lessons.map((l) => ({ ...l, completed: completed.has(l.id) })),
      lessonGems: course.lessons.reduce((n, l) => n + l.gems, 0),
      totalMinutes: course.lessons.reduce((n, l) => n + l.minutes, 0),
      done,
      percent: Math.round((done / course.lessons.length) * 100),
      complete: done === course.lessons.length,
      achievements: ACHIEVEMENTS.filter(
        (a) =>
          (a.rule.type === "course" && a.rule.slug === course.slug) ||
          a.rule.type === "courses" ||
          a.rule.type === "firstLesson",
      ),
    };
  }),

  /** Tick a lesson on or off. Turning it on pays gems and settles achievements. */
  toggleLesson: authed
    .input(z.object({ lessonId: z.string(), completed: z.boolean() }))
    .handler(async ({ input, context }) => {
      const found = findLesson(input.lessonId);
      if (!found) throw new ORPCError("NOT_FOUND", { message: "Lesson not found" });
      const userId = context.user.id;

      if (input.completed) {
        const inserted = await db
          .insert(schema.lessonCompletions)
          .values({ userId, courseSlug: found.course.slug, lessonId: found.lesson.id })
          .onConflictDoNothing()
          .returning();
        let gemsAwarded = 0;
        if (inserted.length > 0) {
          await db.insert(schema.gemLedger).values({
            userId,
            amount: found.lesson.gems,
            reason: `Lesson complete: ${found.lesson.title}`,
            kind: "lesson",
            refId: found.lesson.id,
          });
          gemsAwarded += found.lesson.gems;
          const completed = new Set(await completedLessonIds(userId));
          gemsAwarded += await settleRewards(userId, completed);
        }
        return { completed: true, gemsAwarded, balance: await gemBalance(userId) };
      }

      // Un-ticking removes the lesson gems only; bonuses already banked stay banked.
      await db
        .delete(schema.lessonCompletions)
        .where(
          and(
            eq(schema.lessonCompletions.userId, userId),
            eq(schema.lessonCompletions.lessonId, found.lesson.id),
          ),
        );
      await db
        .delete(schema.gemLedger)
        .where(
          and(
            eq(schema.gemLedger.userId, userId),
            eq(schema.gemLedger.kind, "lesson"),
            eq(schema.gemLedger.refId, found.lesson.id),
          ),
        );
      return { completed: false, gemsAwarded: 0, balance: await gemBalance(userId) };
    }),

  /** Everything the dashboard needs in one call. */
  dashboard: authed.handler(async ({ context }) => {
    const userId = context.user.id;
    const completedIds = await completedLessonIds(userId);
    const completed = new Set(completedIds);
    await settleRewards(userId, completed);

    const stats = courseStats(completed);
    const unlockedRows = await db
      .select()
      .from(schema.unlockedAchievements)
      .where(eq(schema.unlockedAchievements.userId, userId));
    const unlocked = new Map(unlockedRows.map((r) => [r.achievementId, r.unlockedAt]));

    const ledger = await db
      .select()
      .from(schema.gemLedger)
      .where(eq(schema.gemLedger.userId, userId))
      .orderBy(desc(schema.gemLedger.createdAt), desc(schema.gemLedger.id))
      .limit(8);

    const recent = await db
      .select()
      .from(schema.lessonCompletions)
      .where(eq(schema.lessonCompletions.userId, userId))
      .orderBy(desc(schema.lessonCompletions.completedAt))
      .limit(1);

    const lastCourseSlug = recent[0]?.courseSlug;
    const nextUp =
      COURSES.flatMap((course) =>
        course.lessons
          .filter((l) => !completed.has(l.id))
          .map((l) => ({ course, lesson: l })),
      ).sort((a, b) => {
        const aScore = a.course.slug === lastCourseSlug ? 0 : 1;
        const bScore = b.course.slug === lastCourseSlug ? 0 : 1;
        return aScore - bScore;
      })[0] ?? null;

    return {
      member: { name: context.user.name, email: context.user.email, image: context.user.image ?? null },
      gems: await gemBalance(userId),
      gemsAvailable: TOTAL_GEMS_AVAILABLE,
      lessonsDone: completed.size,
      lessonsTotal: TOTAL_LESSONS,
      coursesComplete: stats.filter((s) => s.complete).length,
      coursesTotal: COURSES.length,
      achievementsUnlocked: unlocked.size,
      achievementsTotal: ACHIEVEMENTS.length,
      percent: Math.round((completed.size / TOTAL_LESSONS) * 100),
      courses: COURSES.map((course) => {
        const stat = stats.find((s) => s.slug === course.slug)!;
        return {
          slug: course.slug,
          title: course.title,
          tagline: course.tagline,
          icon: course.icon,
          accent: course.accent,
          level: course.level,
          done: stat.done,
          total: stat.total,
          percent: stat.percent,
          complete: stat.complete,
        };
      }),
      achievements: ACHIEVEMENTS.map((a) => ({
        ...a,
        unlocked: unlocked.has(a.id),
        unlockedAt: unlocked.get(a.id) ?? null,
      })),
      ledger,
      nextUp: nextUp
        ? {
            courseSlug: nextUp.course.slug,
            courseTitle: nextUp.course.title,
            lessonId: nextUp.lesson.id,
            lessonTitle: nextUp.lesson.title,
            minutes: nextUp.lesson.minutes,
            gems: nextUp.lesson.gems,
          }
        : null,
    };
  }),

  /** Static content — no auth needed. */
  achievementList: base.handler(() => ACHIEVEMENTS),
};
