import type { RecentTask } from "../types";

interface RecentTaskItemProps {
  task: RecentTask;
  onStart: (task: RecentTask) => void;
  isStarting?: boolean;
  disabled?: boolean;
}

export default function RecentTaskItem({
  task,
  onStart,
  isStarting,
  disabled,
}: RecentTaskItemProps) {
  const subtitle = [task.customer, task.description]
    .filter(Boolean)
    .join(" · ");

  return (
    <button
      onClick={() => onStart(task)}
      disabled={disabled}
      className="group flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5
        text-left transition-colors
        hover:bg-gray-100 dark:hover:bg-white/[0.06]
        focus:outline-none focus-visible:bg-gray-100 dark:focus-visible:bg-white/[0.06]
        focus-visible:ring-1 focus-visible:ring-[var(--accent)]
        disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span
        className="inline-block h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: task.projectColor }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
            {task.project}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
            {task.activity}
          </span>
        </div>
        {subtitle && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          {task.lastUsed}
        </span>
        {isStarting ? (
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--accent)] dark:border-gray-600 dark:border-t-[var(--accent)]" />
        ) : (
          <svg
            className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500
              group-hover:text-[var(--accent)]
              transition-colors"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </div>
    </button>
  );
}
