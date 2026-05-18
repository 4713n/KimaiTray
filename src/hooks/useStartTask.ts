import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { KimaiClient } from "../api/kimaiClient";
import { KimaiApiError } from "../api/kimaiClient";
import { startTimesheet, stopTimesheet } from "../api/timesheetApi";
import type { RecentTask } from "../types";

class TaskSwitchError extends Error {
  stoppedExisting: boolean;
  constructor(cause: unknown, stoppedExisting: boolean) {
    super(cause instanceof KimaiApiError ? cause.message : String(cause));
    this.stoppedExisting = stoppedExisting;
  }
}

export function useStartTask(
  client: KimaiClient | null,
  activeTimerId: number | null,
) {
  const qc = useQueryClient();
  const [startingKey, setStartingKey] = useState<string | null>(null);
  const [switchError, setSwitchError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (task: RecentTask) => {
      let stoppedExisting = false;

      if (activeTimerId != null) {
        await stopTimesheet(client!, activeTimerId);
        stoppedExisting = true;
      }

      try {
        return await startTimesheet(client!, {
          project: task.projectId,
          activity: task.activityId,
          begin: new Date().toISOString(),
        });
      } catch (err) {
        throw new TaskSwitchError(err, stoppedExisting);
      }
    },
    onMutate: (task) => {
      setStartingKey(task.key);
      setSwitchError(null);
    },
    onSuccess: () => {
      setStartingKey(null);
      qc.invalidateQueries({ queryKey: ["active-timesheets"] });
      qc.invalidateQueries({ queryKey: ["recent-timesheets"] });
    },
    onError: (err: Error, task) => {
      setStartingKey(null);
      qc.invalidateQueries({ queryKey: ["active-timesheets"] });
      qc.invalidateQueries({ queryKey: ["recent-timesheets"] });

      if (err instanceof TaskSwitchError && err.stoppedExisting) {
        setSwitchError(
          `Timer stopped but "${task.project}" failed to start: ${err.message}`,
        );
      } else if (activeTimerId != null) {
        setSwitchError(`Failed to stop current timer: ${err.message}`);
      } else {
        setSwitchError(`Failed to start "${task.project}": ${err.message}`);
      }
    },
  });

  const startTask = useCallback(
    (task: RecentTask) => {
      if (!client || mutation.isPending) return;
      mutation.mutate(task);
    },
    [client, mutation],
  );

  const dismissError = useCallback(() => setSwitchError(null), []);

  return {
    startTask,
    startingKey,
    switchError,
    dismissError,
    isStarting: mutation.isPending,
  };
}
