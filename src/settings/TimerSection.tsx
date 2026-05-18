import type { AppSettings } from "../types";
import { SectionDescription, SectionTitle } from "./Controls";

interface Props {
  settings: AppSettings;
  update: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const menuBarOptions: {
  value: AppSettings["menuBarLabelStyle"];
  label: string;
  previewWithSeconds: string;
  previewWithoutSeconds: string;
}[] = [
  { value: "timer", label: "Elapsed time", previewWithSeconds: "1:23:45", previewWithoutSeconds: "1:23" },
  { value: "project", label: "Project name", previewWithSeconds: "Acme Corp", previewWithoutSeconds: "Acme Corp" },
  { value: "activity", label: "Activity name", previewWithSeconds: "Development", previewWithoutSeconds: "Development" },
  { value: "hidden", label: "Icon only", previewWithSeconds: "", previewWithoutSeconds: "" },
];

function TrayDot() {
  return (
    <span
      className="inline-block h-[8px] w-[8px] rounded-full bg-emerald-500 shrink-0"
      style={{ boxShadow: "0 0 4px rgba(16,185,129,0.4)" }}
    />
  );
}

export default function TimerSection({ settings, update }: Props) {
  return (
    <div>
      <SectionTitle>Timer</SectionTitle>
      <SectionDescription>
        Control how running timers appear in the menu bar and tray.
      </SectionDescription>

      <div className="text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        Menu bar label
      </div>
      <div className="text-[11px] text-gray-400 dark:text-gray-500 mb-3">
        What to display next to the tray icon while a timer is running
      </div>

      <div className="grid grid-cols-2 gap-2">
        {menuBarOptions.map((opt) => {
          const active = settings.menuBarLabelStyle === opt.value;
          const preview = settings.showSecondsInTimer
            ? opt.previewWithSeconds
            : opt.previewWithoutSeconds;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => update("menuBarLabelStyle", opt.value)}
              className={`relative flex flex-col items-center gap-2 rounded-lg border px-3 py-3 transition-colors text-left
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                ${
                  active
                    ? "border-[var(--accent)] bg-[var(--accent-light)]"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
            >
              <div className="flex items-center gap-1.5 h-5">
                <TrayDot />
                {preview && (
                  <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 truncate max-w-[80px]">
                    {preview}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 w-full">
                <span
                  className={`inline-flex items-center justify-center h-3.5 w-3.5 rounded-full border shrink-0
                    ${
                      active
                        ? "border-[var(--accent)]"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                >
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  )}
                </span>
                <span className="text-[12px] text-gray-600 dark:text-gray-400">
                  {opt.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {settings.menuBarLabelStyle === "timer" && (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2.5">
          <div>
            <div className="text-[12px] font-medium text-gray-700 dark:text-gray-300">
              Show seconds
            </div>
            <div className="text-[11px] text-gray-400 dark:text-gray-500">
              Display HH:MM:SS instead of HH:MM
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.showSecondsInTimer}
            onClick={() => update("showSecondsInTimer", !settings.showSecondsInTimer)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1
              ${settings.showSecondsInTimer ? "bg-[var(--accent)]" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform
                ${settings.showSecondsInTimer ? "translate-x-[18px]" : "translate-x-[3px]"}`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
