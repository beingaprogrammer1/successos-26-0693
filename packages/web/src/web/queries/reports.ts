import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";

// Bug / feedback reports submitted from the Report tab.

export function useMyReports(enabled = true) {
  return useQuery(orpc.reports.mine.queryOptions({ enabled, staleTime: 10_000 }));
}

export function useReportStats() {
  return useQuery(orpc.reports.stats.queryOptions({ staleTime: 60_000 }));
}

export function useSubmitReport() {
  const queryClient = useQueryClient();
  return useMutation(
    orpc.reports.submit.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries({ queryKey: orpc.reports.key() }),
    }),
  );
}
