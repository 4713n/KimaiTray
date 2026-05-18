import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { createKimaiClient, type KimaiClient } from "../api/kimaiClient";
import { getApiToken } from "../api/secureStore";
import { loadSettings, onSettingsChange } from "../settings/service";

interface IdleSettings {
  enableIdleDetection: boolean;
  idleThresholdMinutes: number;
  idleAction: "ask" | "stop" | "discard" | "continue";
  showIdleNotification: boolean;
}

interface TraySettings {
  showElapsedInTray: boolean;
  showTaskNameInTray: boolean;
  menuBarLabelStyle: "timer" | "project" | "activity" | "hidden";
  showSecondsInTimer: boolean;
}

interface UseKimaiClientResult {
  client: KimaiClient | null;
  isConfigured: boolean;
  refreshInterval: number;
  baseUrl: string;
  openKimaiInBrowser: boolean;
  idleSettings: IdleSettings;
  traySettings: TraySettings;
}

const defaultIdleSettings: IdleSettings = {
  enableIdleDetection: false,
  idleThresholdMinutes: 5,
  idleAction: "ask",
  showIdleNotification: true,
};

const defaultTraySettings: TraySettings = {
  showElapsedInTray: true,
  showTaskNameInTray: false,
  menuBarLabelStyle: "timer",
  showSecondsInTimer: true,
};

export function useKimaiClient(): UseKimaiClientResult {
  const [baseUrl, setBaseUrl] = useState("");
  const [token, setToken] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [openKimaiInBrowser, setOpenKimaiInBrowser] = useState(true);
  const [ready, setReady] = useState(false);
  const [idleSettings, setIdleSettings] =
    useState<IdleSettings>(defaultIdleSettings);
  const [traySettings, setTraySettings] =
    useState<TraySettings>(defaultTraySettings);

  const applySettings = useCallback(async (s: Awaited<ReturnType<typeof loadSettings>>) => {
    setBaseUrl(s.kimaiUrl);
    setRefreshInterval(s.refreshInterval);
    setOpenKimaiInBrowser(s.openKimaiInBrowser);
    setIdleSettings({
      enableIdleDetection: s.enableIdleDetection,
      idleThresholdMinutes: s.idleThresholdMinutes,
      idleAction: s.idleAction,
      showIdleNotification: s.showIdleNotification,
    });
    setTraySettings({
      showElapsedInTray: s.showElapsedInTray,
      showTaskNameInTray: s.showTaskNameInTray,
      menuBarLabelStyle: s.menuBarLabelStyle,
      showSecondsInTimer: s.showSecondsInTimer,
    });
    if (s.kimaiUrl) {
      try {
        const t = await getApiToken(s.kimaiUrl);
        setToken(t ?? "");
      } catch {
        setToken("");
      }
    } else {
      setToken("");
    }
    setReady(true);
  }, []);

  const load = useCallback(async () => {
    const s = await loadSettings();
    await applySettings(s);
  }, [applySettings]);

  useEffect(() => {
    load();
  }, [load]);

  // React to cross-window store changes immediately
  useEffect(() => {
    const cleanup = onSettingsChange((s) => { applySettings(s); });
    return () => { cleanup.then((fn) => fn()); };
  }, [applySettings]);

  // Also reload on focus/show as fallback
  useEffect(() => {
    const win = getCurrentWindow();
    const unlistenFocus = win.onFocusChanged(({ payload }) => {
      if (payload) load();
    });
    const unlistenShow = win.listen("tauri://window-show", () => {
      load();
    });
    return () => {
      unlistenFocus.then((fn) => fn());
      unlistenShow.then((fn) => fn());
    };
  }, [load]);

  const client = useMemo(() => {
    if (!baseUrl || !token) return null;
    return createKimaiClient(baseUrl, token);
  }, [baseUrl, token]);

  return {
    client,
    isConfigured: ready && !!baseUrl && !!token,
    refreshInterval,
    baseUrl,
    openKimaiInBrowser,
    idleSettings,
    traySettings,
  };
}
