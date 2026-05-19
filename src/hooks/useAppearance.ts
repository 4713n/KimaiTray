import { useEffect } from "react";
import { loadSettings, onSettingsChange } from "../settings/service";
import { setPopupCornerRadius, setPopupVibrancy } from "../api/trayApi";
import type { AppSettings } from "../types";

let mediaCleanup: (() => void) | null = null;

function applyThemeClass(theme: AppSettings["theme"]) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
  }
}

function apply(s: AppSettings) {
  document.documentElement.dataset.accent = s.accentStyle;
  document.documentElement.dataset.reduceMotion = String(s.reduceVisualEffects);
  document.documentElement.dataset.compact = String(s.useCompactPopup);
  document.documentElement.dataset.roundedPopup = String(s.roundedPopupCorners);
  document.documentElement.dataset.theme = s.theme;
  document.documentElement.dataset.layout = s.popupLayout;

  applyThemeClass(s.theme);

  if (mediaCleanup) {
    mediaCleanup();
    mediaCleanup = null;
  }

  if (s.theme === "transparent") {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };
    mq.addEventListener("change", handler);
    mediaCleanup = () => mq.removeEventListener("change", handler);
  }

  if (document.documentElement.dataset.window === "tray-popup") {
    setPopupCornerRadius(s.roundedPopupCorners ? 10.0 : 0.0);
    setPopupVibrancy(s.theme === "transparent");
  }
}

export function useAppearance() {
  useEffect(() => {
    loadSettings().then(apply);
    const cleanup = onSettingsChange(apply);
    return () => {
      cleanup.then((fn) => fn());
      if (mediaCleanup) {
        mediaCleanup();
        mediaCleanup = null;
      }
    };
  }, []);
}
