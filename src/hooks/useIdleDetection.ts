import { useCallback, useEffect, useRef, useState } from "react";
import { getIdleSeconds } from "../api/idleApi";

export type IdleState = "active" | "idle" | "returned" | "handled";

export interface UseIdleDetectionResult {
  idleState: IdleState;
  idleStartedAt: Date | null;
  idleDurationSeconds: number;
  dismissIdle: () => void;
}

const POLL_INTERVAL_MS = 10_000;

export function useIdleDetection(
  enabled: boolean,
  thresholdMinutes: number,
  hasActiveTimer: boolean,
): UseIdleDetectionResult {
  const [idleState, setIdleState] = useState<IdleState>("active");
  const [idleDurationSeconds, setIdleDurationSeconds] = useState(0);

  const idleStartRef = useRef<Date | null>(null);
  const lastHandledRef = useRef<number>(0);

  const dismissIdle = useCallback(() => {
    if (idleStartRef.current) {
      lastHandledRef.current = idleStartRef.current.getTime();
    }
    setIdleState("handled");
  }, []);

  useEffect(() => {
    if (!enabled || !hasActiveTimer) {
      setIdleState("active");
      idleStartRef.current = null;
      return;
    }

    const thresholdSec = thresholdMinutes * 60;

    const poll = async () => {
      try {
        const secs = await getIdleSeconds();
        const isIdle = secs >= thresholdSec;

        setIdleState((prev) => {
          if (isIdle) {
            if (prev === "active") {
              idleStartRef.current = new Date(
                Date.now() - secs * 1000,
              );
              setIdleDurationSeconds(secs);
              return "idle";
            }
            if (prev === "idle") {
              setIdleDurationSeconds(secs);
            }
            return prev;
          }

          // User returned (not idle anymore)
          if (prev === "idle") {
            const start = idleStartRef.current;
            if (
              start &&
              start.getTime() !== lastHandledRef.current
            ) {
              setIdleDurationSeconds(
                Math.round(
                  (Date.now() - start.getTime()) / 1000,
                ),
              );
              return "returned";
            }
            idleStartRef.current = null;
            return "active";
          }

          if (prev === "handled") {
            idleStartRef.current = null;
            return "active";
          }

          return prev;
        });
      } catch {
        // Idle detection unavailable on this platform
      }
    };

    poll();
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [enabled, thresholdMinutes, hasActiveTimer]);

  return {
    idleState,
    idleStartedAt: idleStartRef.current,
    idleDurationSeconds,
    dismissIdle,
  };
}
