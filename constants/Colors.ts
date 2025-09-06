/**
 * Modern MicroDecide Design System
 * Premium lifestyle aesthetic with gradients and glassmorphism
 */

const tintColorLight = '#6366f1'; // Indigo
const tintColorDark = '#a855f7'; // Purple

export const Colors = {
  // Modern gradient palette
  primary: {
    deepBlue: '#1e293b',
    neonPurple: '#a855f7',
    brightMint: '#06d6a0',
    electricBlue: '#3b82f6',
    coralPink: '#f87171',
  },

  // Glassmorphism colors
  glass: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  // Decision type colors
  decisions: {
    email: '#6366f1', // Indigo
    photos: '#06d6a0', // Mint
    fitness: '#f87171', // Coral
    general: '#8b5cf6', // Purple
  },

  // Gamification colors
  gamification: {
    streak: '#ef4444', // Red
    achievement: '#fbbf24', // Yellow
    progress: '#10b981', // Green
    confetti: '#ec4899', // Pink
  },

  // Theme variants
  light: {
    text: '#1e293b',
    textSecondary: '#64748b',
    background: '#f8fafc',
    backgroundSecondary: '#ffffff',
    tint: tintColorLight,
    icon: '#64748b',
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorLight,

    // Card colors
    cardBackground: '#ffffff',
    cardBorder: '#e2e8f0',
    cardShadow: 'rgba(0, 0, 0, 0.05)',

    // Button colors
    buttonPrimary: '#6366f1',
    buttonSecondary: '#f1f5f9',
    buttonAccent: '#06d6a0',
  },
  dark: {
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    tint: tintColorDark,
    icon: '#94a3b8',
    tabIconDefault: '#64748b',
    tabIconSelected: tintColorDark,

    // Card colors
    cardBackground: '#1e293b',
    cardBorder: '#334155',
    cardShadow: 'rgba(0, 0, 0, 0.3)',

    // Button colors
    buttonPrimary: '#a855f7',
    buttonSecondary: '#334155',
    buttonAccent: '#06d6a0',
  },
};

// Gradient definitions
export const Gradients = {
  primary: ['#6366f1', '#a855f7'],
  success: ['#06d6a0', '#10b981'],
  warning: ['#f59e0b', '#fbbf24'],
  error: ['#ef4444', '#f87171'],
  ocean: ['#3b82f6', '#06d6a0'],
  sunset: ['#f87171', '#a855f7'],
  mint: ['#06d6a0', '#3b82f6'],
  premium: ['#a855f7', '#6366f1', '#06d6a0'],
} as const;

// Typography scale
export const Typography = {
  hero: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h1: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 18,
  },
};
