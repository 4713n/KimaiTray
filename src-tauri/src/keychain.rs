use keyring::Entry;

const SERVICE: &str = "kimaimate";

fn make_entry(base_url: &str) -> Result<Entry, String> {
    let account = format!("api-token:{}", base_url.trim_end_matches('/'));
    Entry::new(SERVICE, &account).map_err(|e| format!("Keychain access error: {e}"))
}

#[tauri::command]
pub async fn save_api_token(base_url: String, token: String) -> Result<(), String> {
    if base_url.is_empty() || token.is_empty() {
        return Err("URL and token must not be empty".into());
    }
    make_entry(&base_url)?
        .set_password(&token)
        .map_err(|e| format!("Failed to save token: {e}"))
}

#[tauri::command]
pub async fn get_api_token(base_url: String) -> Result<Option<String>, String> {
    if base_url.is_empty() {
        return Ok(None);
    }
    let entry = make_entry(&base_url)?;
    match entry.get_password() {
        Ok(token) => Ok(Some(token)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(format!("Failed to read token: {e}")),
    }
}

#[tauri::command]
pub async fn delete_api_token(base_url: String) -> Result<(), String> {
    if base_url.is_empty() {
        return Ok(());
    }
    let entry = make_entry(&base_url)?;
    match entry.delete_credential() {
        Ok(()) | Err(keyring::Error::NoEntry) => Ok(()),
        Err(e) => Err(format!("Failed to delete token: {e}")),
    }
}
