import type { ConnectionStatus } from "../hooks/useActiveTimer";

interface HeaderStatusProps {
  status: ConnectionStatus;
  errorMessage?: string;
}

const DOT_STYLES: Record<ConnectionStatus, string> = {
  connected: "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.6)]",
  loading: "bg-amber-400 animate-pulse",
  error: "bg-red-500",
  offline: "bg-gray-300 dark:bg-gray-600",
  unconfigured: "bg-gray-300 dark:bg-gray-600",
};

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connected: "",
  loading: "Connecting…",
  error: "Error",
  offline: "Offline",
  unconfigured: "Not configured",
};

export default function HeaderStatus({
  status,
  errorMessage,
}: HeaderStatusProps) {
  const label = errorMessage || STATUS_LABEL[status];

  return (
    <header className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${DOT_STYLES[status]}`}
        />
        <span className="text-[11px] font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase">
          KimaiMate
        </span>
      </div>
      {label && (
        <span
          className={`text-[10px] truncate max-w-[180px] ${
            status === "error"
              ? "text-red-500"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {label}
        </span>
      )}
    </header>
  );
}
