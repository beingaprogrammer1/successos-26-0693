import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

// Static site content served through the API: release notes and legal terms.

export function useChangelog() {
  return useQuery(orpc.content.changelog.queryOptions({ staleTime: Infinity }));
}

export function useTerms() {
  return useQuery(orpc.content.terms.queryOptions({ staleTime: Infinity }));
}
