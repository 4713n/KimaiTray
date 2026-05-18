import { load } from "@tauri-apps/plugin-store";
import type { AppSettings } from "../types";

const STORE_PATH = "settings.json";
const SETTINGS_KEY = "settings";

export const defaultSettings: AppSettings = {
  kimaiUrl: "",

  launchAtLogin: false,
  refreshInterval: 60,
  openKimaiInBrowser: true,

  showElapsedInTray: true,
  showTaskNameInTray: false,
  menuBarLabelStyle: "timer",
  showSecondsInTimer: true,

  enableIdleDetection: false,
  idleThresholdMinutes: 5,
  idleAction: "ask",
  showIdleNotification: true,

  useCompactPopup: false,
  roundedPopupCorners: true,
  reduceVisualEffects: false,
  accentStyle: "blue",
};

let storePromise: ReturnType<typeof load> | null = null;

function getStore() {
  if (!storePromise) {
    storePromise = load(STORE_PATH, { defaults: {}, autoSave: true });
  }
  return storePromise;
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const store = await getStore();
    const raw = await store.get<AppSettings>(SETTINGS_KEY);
    if (!raw) return { ...defaultSettings };
    return { ...defaultSettings, ...raw };
  } catch {
    return { ...defaultSettings };
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const store = await getStore();
  await store.set(SETTINGS_KEY, settings);
  await store.save();
}

export async function onSettingsChange(
  cb: (settings: AppSettings) => void,
): Promise<() => void> {
  const store = await getStore();
  const unlisten = await store.onKeyChange<AppSettings>(SETTINGS_KEY, (val) => {
    cb(val ? { ...defaultSettings, ...val } : { ...defaultSettings });
  });
  return unlisten;
}
