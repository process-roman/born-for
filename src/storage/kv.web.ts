// Browser storage for the web preview. Storage can be unavailable (private mode, blocked site data),
// so every call is guarded and the app simply runs without saving.

export function getItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Nothing to do; progress just won't survive a reload.
  }
}

export function removeItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Same as above.
  }
}
