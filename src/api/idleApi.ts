import { invoke } from "@tauri-apps/api/core";

export async function getIdleSeconds(): Promise<number> {
  return invoke<number>("get_idle_seconds");
}
