import { createRng } from './rng';
import type { Decision, Provider, ProviderId } from './types';

function createEmailUnsub(seed: number): Decision {
  const rnd = createRng(seed);
  const senders = ['DailyDeals', 'TechGadgets', 'TravelNow', 'FitnessClub'];
  const subjects = [
    'Black Friday Deals Inside!',
    '50% Off Everything This Week',
    'Free Shipping on Orders Over $50',
    'Exclusive Offer For You',
  ];
  const sender = senders[Math.floor(rnd() * senders.length)];
  const sample = Array.from({ length: 3 }, () => subjects[Math.floor(rnd() * subjects.length)]);
  const id = `email-${seed}`;
  return {
    id,
    providerId: 'email_unsub',
    title: `Unsubscribe from ${sender}?`,
    explanation: 'Low engagement in the last 60 days',
    payload: {
      sender: `${sender} Newsletter`,
      last_seen: '2023-10-15',
      example_subjects: sample,
      unsubscribe_link: 'https://example.com/unsubscribe',
    },
    actions: [
      { id: 'accept', label: 'Accept' },
      { id: 'skip', label: 'Skip' },
    ],
    createdAt: Date.now(),
  };
}

function createPhotoDupes(seed: number): Decision {
  const id = `photo-${seed}`;
  return {
    id,
    providerId: 'photo_dupes',
    title: 'Remove Duplicate Photos?',
    explanation: 'Found visually similar images from the same session',
    payload: {
      image: 'https://images.unsplash.com/photo-1622588907467-915ab508ae2a?w=900&auto=format&fit=crop&q=60',
    },
    actions: [
      { id: 'accept', label: 'Accept' },
      { id: 'skip', label: 'Skip' },
    ],
    createdAt: Date.now(),
  };
}

function createWorkout(seed: number): Decision {
  const id = `workout-${seed}`;
  return {
    id,
    providerId: 'workout',
    title: 'Do a 5-min stretch?',
    explanation: 'Quick routine to boost energy',
    payload: {},
    actions: [
      { id: 'accept', label: 'Start' },
      { id: 'skip', label: 'Skip' },
    ],
    createdAt: Date.now(),
  };
}

export const providers: Provider[] = [
  {
    id: 'email_unsub',
    title: 'Email Unsubscribe',
    premium: false,
    isEnabledByDefault: true,
    generateDecision: (seed: number) => createEmailUnsub(seed),
  },
  {
    id: 'photo_dupes',
    title: 'Photo Duplicates',
    premium: false,
    isEnabledByDefault: true,
    generateDecision: (seed: number) => createPhotoDupes(seed),
  },
  {
    id: 'workout',
    title: '5-Min Workout',
    premium: true,
    isEnabledByDefault: true,
    generateDecision: (seed: number) => createWorkout(seed),
  },
];

export function pickNextDecision(seed: number, enabled: ProviderId[], isPremium: boolean): Decision {
  const rng = createRng(seed);
  const candidateProviders = providers.filter((p) => enabled.includes(p.id) && (isPremium || !p.premium));
  if (candidateProviders.length === 0) {
    // Fallback to non-premium
    const freeProviders = providers.filter((p) => !p.premium);
    const chosen = freeProviders[Math.floor(rng() * freeProviders.length)];
    return chosen.generateDecision(seed);
  }
  const chosen = candidateProviders[Math.floor(rng() * candidateProviders.length)];
  return chosen.generateDecision(seed);
}


