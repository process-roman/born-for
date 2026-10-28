// Local check-in reminders for quests (Blueprint §4.3). No server push needed.

import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

const CHANNEL = 'quest-check-ins';
const CHECK_IN = 'check-in';

export const remindersSupported = true;

export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/** Asked in context when the user starts a quest, never at launch. */
export async function requestReminderPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, { name: 'Quest check-ins', importance: AndroidImportance.DEFAULT });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const { granted } = await Notifications.requestPermissionsAsync();
  return granted;
}

export async function scheduleCheckIn(date: Date, title: string, body: string): Promise<string | null> {
  if (date.getTime() <= Date.now()) return null;
  return Notifications.scheduleNotificationAsync({
    content: { title, body, data: { type: CHECK_IN } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL },
  });
}

export async function cancelCheckIn(id: string | null): Promise<void> {
  if (id) await Notifications.cancelScheduledNotificationAsync(id);
}

/** Calls onTap when the user opens the app from a check-in reminder, including from a cold start. */
export function useCheckInTap(onTap: () => void) {
  const response = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (
      response &&
      response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER &&
      response.notification.request.content.data?.type === CHECK_IN
    ) {
      onTap();
      // Handled once; without this the same tap would fire again on the next launch.
      void Notifications.clearLastNotificationResponseAsync();
    }
  }, [response, onTap]);
}
