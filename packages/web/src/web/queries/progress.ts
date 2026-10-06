import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";

// Course catalogue, per-member progress and the Success Gem balance.
// Every mutation settles server-side, so we invalidate broadly after a toggle.

export function useCatalogue() {
  return useQuery(orpc.progress.catalogue.queryOptions({ staleTime: 30_000 }));
}

export function useCourse(slug: string) {
  return useQuery(
    orpc.progress.course.queryOptions({ input: { slug }, staleTime: 15_000, enabled: !!slug }),
  );
}

export function useDashboard(enabled = true) {
  return useQuery(orpc.progress.dashboard.queryOptions({ enabled, staleTime: 5_000 }));
}

export function useAchievementList() {
  return useQuery(orpc.progress.achievementList.queryOptions({ staleTime: Infinity }));
}

/** Gem balance for the nav chip — reads the dashboard payload and plucks the total. */
export function useGemBalance(enabled = true) {
  return useQuery(
    orpc.progress.dashboard.queryOptions({
      enabled,
      staleTime: 5_000,
      select: (data) => data.gems,
    }),
  );
}

/**
 * Tick a lesson on or off. The course page updates instantly; the dashboard and
 * catalogue are refetched afterwards so gems, bonuses and achievements settle.
 */
export function useToggleLesson(slug: string) {
  const queryClient = useQueryClient();
  const courseKey = orpc.progress.course.queryOptions({ input: { slug } }).queryKey;

  return useMutation(
    orpc.progress.toggleLesson.mutationOptions({
      onMutate: async ({ lessonId, completed }) => {
        await queryClient.cancelQueries({ queryKey: courseKey });
        const prev = queryClient.getQueryData(courseKey);
        queryClient.setQueryData(courseKey, (old: any) => {
          if (!old) return old;
          const lessons = old.lessons.map((l: any) =>
            l.id === lessonId ? { ...l, completed } : l,
          );
          const done = lessons.filter((l: any) => l.completed).length;
          return {
            ...old,
            lessons,
            done,
            percent: Math.round((done / lessons.length) * 100),
            complete: done === lessons.length,
          };
        });
        return { prev };
      },
      onError: (_err, _input, ctx) => {
        if (ctx?.prev) queryClient.setQueryData(courseKey, ctx.prev);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: orpc.progress.key() });
      },
    }),
  );
}
