import { storage } from './storage';
import type { Entitlements } from './types';

const STORAGE_KEY = 'microdecide.counts.v1';

type Counts = {
  dateKey: string; // YYYY-MM-DD
  generated: number; // decisions generated today
};

export function todayKey(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function loadCounts(): Promise<Counts> {
  const raw = await storage.getItem(STORAGE_KEY);
  const key = todayKey();
  if (!raw) return { dateKey: key, generated: 0 };
  try {
    const parsed = JSON.parse(raw) as Counts;
    if (parsed.dateKey !== key) return { dateKey: key, generated: 0 };
    return parsed;
  } catch {
    return { dateKey: key, generated: 0 };
  }
}

export async function incrementGenerated(): Promise<Counts> {
  const current = await loadCounts();
  const next: Counts = { dateKey: todayKey(), generated: current.generated + 1 };
  await storage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function canGenerate(entitlements: Entitlements, counts: Counts): boolean {
  return counts.generated < entitlements.maxPerDay;
}


