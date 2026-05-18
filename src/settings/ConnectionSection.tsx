import { useCallback, useState } from "react";
import type { AppSettings } from "../types";
import { testConnection, isInsecureUrl, type ConnectionResult } from "../api";
import {
  Divider,
  FieldGroup,
  SectionDescription,
  SectionTitle,
  TextInput,
} from "./Controls";

interface Props {
  settings: AppSettings;
  token: string;
  update: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  updateToken: (value: string) => void;
}

export default function ConnectionSection({
  settings,
  token,
  update,
  updateToken,
}: Props) {
  const [showToken, setShowToken] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "testing" | "connected" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const insecure =
    settings.kimaiUrl.length > 0 && isInsecureUrl(settings.kimaiUrl);

  const handleTest = useCallback(async () => {
    setStatus("testing");
    setStatusMessage("");

    let result: ConnectionResult;
    try {
      result = await testConnection(settings.kimaiUrl, token);
    } catch {
      setStatus("error");
      setStatusMessage("Unexpected error during connection test");
      return;
    }

    if (result.success && result.user) {
      setStatus("connected");
      const who = result.user.alias || result.user.username;
      const ver = result.version ? ` · Kimai ${result.version.version}` : "";
      setStatusMessage(`Connected as ${who}${ver}`);
    } else {
      setStatus("error");
      setStatusMessage(result.error ?? "Connection failed");
    }
  }, [settings.kimaiUrl, token]);

  return (
    <div>
      <SectionTitle>Connection</SectionTitle>
      <SectionDescription>
        Connect to your Kimai instance using its base URL and a personal API
        token. The token is stored in your operating system's secure keychain.
      </SectionDescription>

      {insecure && (
        <div className="mb-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-400">
          <svg
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <span>
            Insecure connection — your API token may be transmitted in plain
            text. Use HTTPS in production.
          </span>
        </div>
      )}

      <FieldGroup
        label="Kimai Base URL"
        description="The root URL of your Kimai installation"
      >
        <TextInput
          type="url"
          value={settings.kimaiUrl}
          onChange={(v) => update("kimaiUrl", v)}
          placeholder="https://kimai.example.com"
        />
      </FieldGroup>

      <FieldGroup
        label="API Token"
        description="Generate one in Kimai → Settings → API"
      >
        <div className="flex gap-2">
          <div className="flex-1">
            <TextInput
              type={showToken ? "text" : "password"}
              value={token}
              onChange={updateToken}
              placeholder="Paste your API token"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowToken(!showToken)}
            className="shrink-0 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[11px] text-gray-500
              hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700
              focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
          >
            {showToken ? "Hide" : "Show"}
          </button>
        </div>
      </FieldGroup>

      <Divider />

      {/* Test + status */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleTest}
          disabled={status === "testing" || !settings.kimaiUrl || !token}
          className="rounded-md bg-blue-600 px-3.5 py-1.5 text-[12px] font-medium text-white
            hover:bg-blue-700 active:bg-blue-800
            disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1
            transition-colors"
        >
          {status === "testing" ? "Testing…" : "Test Connection"}
        </button>

        <StatusBadge status={status} message={statusMessage} />
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  message,
}: {
  status: "idle" | "testing" | "connected" | "error";
  message: string;
}) {
  if (status === "idle" || status === "testing") return null;

  const isOk = status === "connected";
  return (
    <span
      className={`flex items-center gap-1.5 text-[12px] ${
        isOk
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-500 dark:text-red-400"
      }`}
    >
      {isOk ? (
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
      {message}
    </span>
  );
}
