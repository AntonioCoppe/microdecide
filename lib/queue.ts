import { storage } from './storage';
import type { Decision, QueueRecord } from './types';

const STORAGE_KEY = 'microdecide.queue.v1';

export async function loadQueue(): Promise<QueueRecord> {
  const raw = await storage.getItem(STORAGE_KEY);
  if (!raw) return { pending: [], acceptedIds: [], skippedIds: [] };
  try {
    const parsed = JSON.parse(raw) as QueueRecord;
    return parsed;
  } catch {
    return { pending: [], acceptedIds: [], skippedIds: [] };
  }
}

export async function saveQueue(state: QueueRecord): Promise<void> {
  await storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function enqueue(state: QueueRecord, decisions: Decision[]): Promise<QueueRecord> {
  const mergedIds = new Set(state.pending.map((d) => d.id));
  const newItems = decisions.filter((d) => !mergedIds.has(d.id));
  const next = { ...state, pending: [...state.pending, ...newItems] };
  await saveQueue(next);
  return next;
}

export async function accept(state: QueueRecord, decisionId: string): Promise<QueueRecord> {
  if (state.acceptedIds.includes(decisionId)) return state; // idempotent
  const decision = state.pending.find((d) => d.id === decisionId);
  const nextPending = state.pending.filter((d) => d.id !== decisionId);
  const next: QueueRecord = {
    ...state,
    pending: nextPending,
    acceptedIds: [...state.acceptedIds, decisionId],
    lastAction: decision
      ? { type: 'accept', decision, timestamp: Date.now() }
      : state.lastAction,
  };
  await saveQueue(next);
  return next;
}

export async function skip(state: QueueRecord, decisionId: string): Promise<QueueRecord> {
  if (state.skippedIds.includes(decisionId)) return state; // idempotent
  const decision = state.pending.find((d) => d.id === decisionId);
  const nextPending = state.pending.filter((d) => d.id !== decisionId);
  const next: QueueRecord = {
    ...state,
    pending: nextPending,
    skippedIds: [...state.skippedIds, decisionId],
    lastAction: decision
      ? { type: 'skip', decision, timestamp: Date.now() }
      : state.lastAction,
  };
  await saveQueue(next);
  return next;
}

export async function undoLast(state: QueueRecord): Promise<QueueRecord> {
  if (!state.lastAction) return state;
  const { type, decision } = state.lastAction;
  let acceptedIds = state.acceptedIds;
  let skippedIds = state.skippedIds;
  if (type === 'accept') acceptedIds = acceptedIds.filter((id) => id !== decision.id);
  if (type === 'skip') skippedIds = skippedIds.filter((id) => id !== decision.id);
  const next: QueueRecord = {
    ...state,
    pending: [decision, ...state.pending],
    acceptedIds,
    skippedIds,
    lastAction: undefined,
  };
  await saveQueue(next);
  return next;
}


