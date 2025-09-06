type EventName =
  | 'onboarding_completed'
  | 'decision_generated'
  | 'decision_accepted'
  | 'decision_skipped'
  | 'paywall_shown'
  | 'trial_started'
  | 'day_streak_incremented';

export function track(event: EventName, props?: Record<string, unknown>) {
  // Minimal console-based logger for MVP
  // Replace with analytics backend later
  // eslint-disable-next-line no-console
  console.log('[analytics]', event, props ?? {});
}


