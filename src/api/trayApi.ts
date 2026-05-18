import { invoke } from "@tauri-apps/api/core";

export async function setTrayTooltip(text: string): Promise<void> {
  try {
    await invoke("set_tray_tooltip", { text });
  } catch {
    // best-effort — tooltip update is non-critical
  }
}
