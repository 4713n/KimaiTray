import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { KimaiClient } from "../api/kimaiClient";
import { updateTimesheet } from "../api/timesheetApi";

interface EditPayload {
  description?: string;
  begin?: string;
}

export function useEditTimer(client: KimaiClient | null) {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, ...payload }: { id: number } & EditPayload) =>
      updateTimesheet(client!, id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["active-timesheets"] });
    },
  });

  return {
    editTimer: (id: number, payload: EditPayload) =>
      mutation.mutate({ id, ...payload }),
    isSaving: mutation.isPending,
    saveError: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
