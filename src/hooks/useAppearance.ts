import { useEffect } from "react";
import { loadSettings, onSettingsChange } from "../settings/service";
import type { AppSettings } from "../types";

function apply(s: AppSettings) {
  document.documentElement.dataset.accent = s.accentStyle;
  document.documentElement.dataset.reduceMotion = String(s.reduceVisualEffects);
  document.documentElement.dataset.compact = String(s.useCompactPopup);
}

export function useAppearance() {
  useEffect(() => {
    loadSettings().then(apply);
    const cleanup = onSettingsChange(apply);
    return () => { cleanup.then((fn) => fn()); };
  }, []);
}
