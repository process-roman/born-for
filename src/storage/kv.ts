// Offline-first key-value storage on device, backed by SQLite (Blueprint §13).
// The web build uses kv.web.ts instead, which avoids SQLite's wasm setup for the browser preview.

import Storage from 'expo-sqlite/kv-store';

export function getItem(key: string): string | null {
  return Storage.getItemSync(key);
}

export function setItem(key: string, value: string): void {
  Storage.setItemSync(key, value);
}

export function removeItem(key: string): void {
  Storage.removeItemSync(key);
}
