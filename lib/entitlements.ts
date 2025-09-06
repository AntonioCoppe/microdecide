import type { Entitlements } from './types';

// Stubbed entitlements check; replace with RevenueCat later
export async function fetchEntitlements(userId: string | null): Promise<Entitlements> {
  // In MVP, treat users with odd hash as premium (deterministic stub)
  const isPremium = !!userId && hashString(userId) % 2 === 1;
  return {
    isPremium,
    maxPerDay: isPremium ? 20 : 1,
  };
}

export function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h << 5) - h + input.charCodeAt(i);
  return Math.abs(h);
}


