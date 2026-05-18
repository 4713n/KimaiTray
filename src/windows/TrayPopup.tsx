import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import HeaderStatus from "../components/HeaderStatus";
import ActiveTimerCard from "../components/ActiveTimerCard";
import EmptyTimerState from "../components/EmptyTimerState";
import RecentTasksList from "../components/RecentTasksList";
import PopupFooterActions from "../components/PopupFooterActions";
import { useKimaiClient } from "../hooks/useKimaiClient";
import { useActiveTimer } from "../hooks/useActiveTimer";
import { setTrayTooltip } from "../api/trayApi";
import { formatElapsed } from "../components/ActiveTimerCard";
import { mockRecentTasks } from "../mock/data";
import type { RecentTask } from "../types";

export default function TrayPopup() {
  const { client, isConfigured, refreshInterval } = useKimaiClient();
  const {
    timer,
    multipleActive,
    status,
    errorMessage,
    isStopping,
    stopTimer,
  } = useActiveTimer(client, isConfigured, refreshInterval);

  // ESC to hide
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") getCurrentWindow().hide();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Update tray tooltip with elapsed time
  useEffect(() => {
    if (!timer) {
      setTrayTooltip("KimaiMate");
      return;
    }
    const tick = () => {
      const secs = Math.max(
        0,
        Math.floor(Date.now() / 1000) - timer.beginSeconds,
      );
      setTrayTooltip(`${timer.project} — ${formatElapsed(secs)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => {
      clearInterval(id);
      setTrayTooltip("KimaiMate");
    };
  }, [timer?.id, timer?.beginSeconds, timer?.project]);

  const handleStart = (_task: RecentTask) => {
    /* TODO: start timesheet via API */
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100">
      <HeaderStatus status={status} errorMessage={errorMessage} />

      {status === "loading" ? (
        <EmptyTimerState variant="loading" />
      ) : status === "unconfigured" ? (
        <EmptyTimerState variant="unconfigured" />
      ) : timer ? (
        <ActiveTimerCard
          timer={timer}
          onStop={stopTimer}
          isStopping={isStopping}
          multipleActive={multipleActive}
        />
      ) : (
        <EmptyTimerState />
      )}

      <div className="mx-3 mt-2 border-t border-gray-100 dark:border-gray-800" />

      <RecentTasksList tasks={mockRecentTasks} onStart={handleStart} />

      <PopupFooterActions
        onNewTask={() => {}}
        onOpenKimai={() => {}}
        onSettings={() => {}}
      />
    </div>
  );
}
