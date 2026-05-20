import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ExternalIssue, IssueIntegrationSettings } from "./types";
import { createIssueProvider } from "./issueProvider";

function useDebouncedValue(value: string, ms: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

export function useIssues(
  config: IssueIntegrationSettings | null,
  token: string | null,
  search: string,
) {
  const debouncedSearch = useDebouncedValue(search, 300);
  const enabled = !!config?.enabled && !!token && !!config.baseUrl && !!config.projectPathOrRepo;

  const provider = useMemo(() => {
    if (!enabled || !config || !token) return null;
    return createIssueProvider(config, token);
  }, [enabled, config?.provider, config?.baseUrl, config?.apiBaseUrl, config?.projectPathOrRepo, config?.assigneeOnly, token]);

  const query = useQuery<ExternalIssue[]>({
    queryKey: [
      "issues",
      config?.provider,
      config?.projectPathOrRepo,
      config?.defaultState,
      config?.assigneeOnly,
      debouncedSearch,
    ],
    queryFn: () => provider!.searchIssues(debouncedSearch),
    enabled: enabled && !!provider,
    staleTime: 2 * 60_000,
    retry: 1,
  });

  return {
    issues: query.data ?? [],
    isLoading: query.isLoading && enabled,
    isError: query.isError,
    error: query.error?.message ?? null,
  };
}
