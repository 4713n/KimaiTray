import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ExternalIssue } from "./types";

interface IssueLinkActionsProps {
  issue: ExternalIssue;
  description: string;
  onDescriptionChange: (value: string) => void;
}

export default function IssueLinkActions({
  issue,
  description,
  onDescriptionChange,
}: IssueLinkActionsProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleOpenInBrowser = useCallback(async () => {
    const { openUrl } = await import("@tauri-apps/plugin-opener");
    openUrl(issue.webUrl);
  }, [issue.webUrl]);

  const handleAddUrl = useCallback(() => {
    const trimmed = description.trim();
    onDescriptionChange(trimmed ? `${trimmed}\n${issue.webUrl}` : issue.webUrl);
  }, [description, issue.webUrl, onDescriptionChange]);

  const handleAddTitleUrl = useCallback(() => {
    const line = `Issue: #${issue.id} ${issue.title}\n${issue.webUrl}`;
    const trimmed = description.trim();
    onDescriptionChange(trimmed ? `${trimmed}\n${line}` : line);
  }, [description, issue, onDescriptionChange]);

  const handleCopyUrl = useCallback(async () => {
    await navigator.clipboard.writeText(issue.webUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [issue.webUrl]);

  const btnCls =
    "rounded px-1.5 py-1 text-[10px] font-medium transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] text-gray-500 dark:text-gray-400 hover:text-[var(--accent)] hover:bg-[var(--accent)]/10";

  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1">
      <button type="button" onClick={handleOpenInBrowser} className={btnCls}>
        <span className="flex items-center gap-1">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
          {t("integrations.openInBrowser")}
        </span>
      </button>

      <button type="button" onClick={handleAddUrl} className={btnCls}>
        {t("integrations.addUrl")}
      </button>

      <button type="button" onClick={handleAddTitleUrl} className={btnCls}>
        {t("integrations.addTitleUrl")}
      </button>

      <button type="button" onClick={handleCopyUrl} className={btnCls}>
        {copied ? t("integrations.copied") : t("integrations.copyUrl")}
      </button>
    </div>
  );
}
