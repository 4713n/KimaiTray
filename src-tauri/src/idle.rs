#[tauri::command]
pub fn get_idle_seconds() -> Result<u64, String> {
    platform::idle_seconds()
}

#[cfg(target_os = "macos")]
mod platform {
    use std::os::raw::c_double;

    #[link(name = "CoreGraphics", kind = "framework")]
    extern "C" {
        fn CGEventSourceSecondsSinceLastEventType(
            source_state: u32,
            event_type: u32,
        ) -> c_double;
    }

    pub fn idle_seconds() -> Result<u64, String> {
        // kCGEventSourceStateCombinedSessionState = 0, kCGAnyInputEventType = 0xFFFFFFFF
        let secs =
            unsafe { CGEventSourceSecondsSinceLastEventType(0, 0xFFFFFFFF) };
        if secs >= 0.0 {
            Ok(secs as u64)
        } else {
            Err("Failed to query idle time".into())
        }
    }
}

#[cfg(target_os = "windows")]
mod platform {
    use windows_sys::Win32::System::SystemInformation::GetTickCount;
    use windows_sys::Win32::UI::Input::KeyboardAndMouse::{
        GetLastInputInfo, LASTINPUTINFO,
    };

    pub fn idle_seconds() -> Result<u64, String> {
        let mut info = LASTINPUTINFO {
            cbSize: std::mem::size_of::<LASTINPUTINFO>() as u32,
            dwTime: 0,
        };
        let ok = unsafe { GetLastInputInfo(&mut info) };
        if ok == 0 {
            return Err("GetLastInputInfo failed".into());
        }
        let tick = unsafe { GetTickCount() };
        let idle_ms = tick.wrapping_sub(info.dwTime);
        Ok((idle_ms / 1000) as u64)
    }
}

#[cfg(target_os = "linux")]
mod platform {
    use std::process::Command;

    pub fn idle_seconds() -> Result<u64, String> {
        // Try xprintidle first (works on X11, available on most distros)
        if let Ok(output) = Command::new("xprintidle").output() {
            if output.status.success() {
                let ms_str = String::from_utf8_lossy(&output.stdout);
                if let Ok(ms) = ms_str.trim().parse::<u64>() {
                    return Ok(ms / 1000);
                }
            }
        }
        Err("Idle detection unavailable — install xprintidle (X11) or use a supported environment".into())
    }
}

#[cfg(not(any(target_os = "macos", target_os = "windows", target_os = "linux")))]
mod platform {
    pub fn idle_seconds() -> Result<u64, String> {
        Err("Idle detection not supported on this platform".into())
    }
}
