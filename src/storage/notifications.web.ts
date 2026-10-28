// Browsers don't get scheduled local notifications; reminders are a phone feature.

export const remindersSupported = false;

export function configureNotifications() {}

export async function requestReminderPermission(): Promise<boolean> {
  return false;
}

export async function scheduleCheckIn(_date: Date, _title: string, _body: string): Promise<string | null> {
  return null;
}

export async function cancelCheckIn(_id: string | null): Promise<void> {}

export function useCheckInTap(_onTap: () => void) {}
