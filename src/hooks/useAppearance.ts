import { useEffect } from "react";
import { loadSettings, onSettingsChange } from "../settings/service";
import { setPopupCornerRadius } from "../api/trayApi";
import type { AppSettings } from "../types";

function apply(s: AppSettings) {
  document.documentElement.dataset.accent = s.accentStyle;
  document.documentElement.dataset.reduceMotion = String(s.reduceVisualEffects);
  document.documentElement.dataset.compact = String(s.useCompactPopup);
  document.documentElement.dataset.roundedPopup = String(s.roundedPopupCorners);

  if (document.documentElement.dataset.window === "tray-popup") {
    setPopupCornerRadius(s.roundedPopupCorners ? 10.0 : 0.0);
  }
}

export function useAppearance() {
  useEffect(() => {
    loadSettings().then(apply);
    const cleanup = onSettingsChange(apply);
    return () => { cleanup.then((fn) => fn()); };
  }, []);
}
