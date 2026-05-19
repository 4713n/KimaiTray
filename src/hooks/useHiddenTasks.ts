import { useState, useEffect, useCallback } from "react";
import {
  loadHiddenTasks,
  addHiddenTask,
  removeHiddenTask,
  clearHiddenTasks,
} from "../api/hiddenTasksStore";

export function useHiddenTasks() {
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadHiddenTasks().then((keys) => setHiddenKeys(new Set(keys)));
  }, []);

  const hideTask = useCallback(async (key: string) => {
    const updated = await addHiddenTask(key);
    setHiddenKeys(new Set(updated));
  }, []);

  const unhideTask = useCallback(async (key: string) => {
    const updated = await removeHiddenTask(key);
    setHiddenKeys(new Set(updated));
  }, []);

  const clearAll = useCallback(async () => {
    await clearHiddenTasks();
    setHiddenKeys(new Set());
  }, []);

  return { hiddenKeys, hideTask, unhideTask, clearAll };
}
