import { load } from "@tauri-apps/plugin-store";

const STORE_PATH = "settings.json";
const PAUSE_KEY = "pausedTimer";

export interface PausedTimerData {
  baseUrl: string;
  lastTimesheetId?: number;
  projectId: number;
  activityId: number;
  project: string;
  projectColor: string;
  activity: string;
  description: string;
  tags: string[];
  pausedAt: string;
}

let storePromise: ReturnType<typeof load> | null = null;

function getStore() {
  if (!storePromise) {
    storePromise = load(STORE_PATH, { defaults: {}, autoSave: true });
  }
  return storePromise;
}

export async function loadPausedTimer(): Promise<PausedTimerData | null> {
  try {
    const store = await getStore();
    return (await store.get<PausedTimerData>(PAUSE_KEY)) ?? null;
  } catch {
    return null;
  }
}

export async function savePausedTimer(data: PausedTimerData): Promise<void> {
  const store = await getStore();
  await store.set(PAUSE_KEY, data);
  await store.save();
}

export async function clearPausedTimer(): Promise<void> {
  const store = await getStore();
  await store.delete(PAUSE_KEY);
  await store.save();
}
