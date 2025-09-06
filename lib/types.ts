export type DecisionAction = {
  id: 'accept' | 'skip';
  label: string;
};

export type ProviderId = 'email_unsub' | 'photo_dupes' | 'workout';

export type DecisionPayload = Record<string, unknown> & {
  // Optional common fields used by UI mock data
  sender?: string;
  last_seen?: string;
  example_subjects?: string[];
  unsubscribe_link?: string;
  image?: string;
};

export type Decision = {
  id: string;
  providerId: ProviderId;
  title: string;
  explanation: string;
  payload: DecisionPayload;
  actions: DecisionAction[];
  createdAt: number;
};

export type Provider = {
  id: ProviderId;
  title: string;
  premium: boolean;
  isEnabledByDefault: boolean;
  generateDecision: (seed: number) => Decision;
};

export type QueueRecord = {
  pending: Decision[];
  acceptedIds: string[];
  skippedIds: string[];
  lastAction?: {
    type: 'accept' | 'skip';
    decision: Decision;
    timestamp: number;
  };
};

export type User = {
  id: string;
  email?: string;
  name?: string;
  isAnonymous?: boolean;
};

export type Entitlements = {
  isPremium: boolean;
  maxPerDay: number; // hard cap for free, soft cap for premium
};


