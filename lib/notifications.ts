// Local notifications stub with Expo fallback at runtime
export type ScheduleRequest = {
  title: string;
  body: string;
  secondsFromNow: number;
  deepLinkPath?: string;
};

export async function requestPermissions(): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Notifications = require('expo-notifications');
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return true; // web/dev fallback
  }
}

export async function scheduleLocalNotification(req: ScheduleRequest): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Notifications = require('expo-notifications');
    await Notifications.scheduleNotificationAsync({
      content: { title: req.title, body: req.body, data: req.deepLinkPath ? { path: req.deepLinkPath } : undefined },
      trigger: { seconds: req.secondsFromNow },
    });
  } catch {
    // eslint-disable-next-line no-console
    console.log('Would schedule notification:', req);
  }
}


