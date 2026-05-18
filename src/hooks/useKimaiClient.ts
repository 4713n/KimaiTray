import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { createKimaiClient, type KimaiClient } from "../api/kimaiClient";
import { getApiToken } from "../api/secureStore";
import { loadSettings } from "../settings/service";

interface UseKimaiClientResult {
  client: KimaiClient | null;
  isConfigured: boolean;
  refreshInterval: number;
  baseUrl: string;
}

export function useKimaiClient(): UseKimaiClientResult {
  const [baseUrl, setBaseUrl] = useState("");
  const [token, setToken] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const s = await loadSettings();
    setBaseUrl(s.kimaiUrl);
    setRefreshInterval(s.refreshInterval);
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

  useEffect(() => {
    load();
  }, [load]);

  // Reload credentials when the popup gains focus (picks up Settings changes)
  useEffect(() => {
    const cancel = getCurrentWindow().onFocusChanged(({ payload }) => {
      if (payload) load();
    });
    return () => {
      cancel.then((fn) => fn());
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
  };
}
