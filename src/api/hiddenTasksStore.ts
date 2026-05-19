import { load } from "@tauri-apps/plugin-store";

const STORE_PATH = "settings.json";
const KEY = "hiddenRecentTasks";

let storePromise: ReturnType<typeof load> | null = null;

function getStore() {
  if (!storePromise) {
    storePromise = load(STORE_PATH, { defaults: {}, autoSave: true });
  }
  return storePromise;
}

export async function loadHiddenTasks(): Promise<string[]> {
  try {
    const store = await getStore();
    return (await store.get<string[]>(KEY)) ?? [];
  } catch {
    return [];
  }
}

export async function addHiddenTask(key: string): Promise<string[]> {
  const store = await getStore();
  const current = (await store.get<string[]>(KEY)) ?? [];
  if (current.includes(key)) return current;
  const updated = [...current, key];
  await store.set(KEY, updated);
  await store.save();
  return updated;
}

export async function removeHiddenTask(key: string): Promise<string[]> {
  const store = await getStore();
  const current = (await store.get<string[]>(KEY)) ?? [];
  const updated = current.filter((k) => k !== key);
  await store.set(KEY, updated);
  await store.save();
  return updated;
}

export async function clearHiddenTasks(): Promise<void> {
  const store = await getStore();
  await store.delete(KEY);
  await store.save();
}
