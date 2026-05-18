import { useEffect } from "react";
import { loadSettings } from "../settings/service";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function useAppearance() {
  useEffect(() => {
    const apply = async () => {
      const s = await loadSettings();
      document.documentElement.dataset.accent = s.accentStyle;
      document.documentElement.dataset.reduceMotion = String(s.reduceVisualEffects);
      document.documentElement.dataset.compact = String(s.useCompactPopup);
    };
    apply();

    const win = getCurrentWindow();
    const unlistenFocus = win.onFocusChanged(({ payload }) => {
      if (payload) apply();
    });
    return () => { unlistenFocus.then((fn) => fn()); };
  }, []);
}
