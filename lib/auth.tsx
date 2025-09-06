import React, { createContext, useContext, useMemo, useState } from 'react';
import type { User } from './types';

type AuthContextValue = {
  user: User | null;
  signInWithEmail: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Stub auth provider; replace with Supabase in production
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    async signInWithEmail(email: string) {
      setUser({ id: `user-${email}`, email });
    },
    async signInWithGoogle() {
      // TODO: integrate real Google OAuth via Supabase or Expo AuthSession
      setUser({ id: 'google-user', email: 'google@example.com' });
    },
    async signInWithApple() {
      // TODO: integrate real Apple Sign In
      setUser({ id: 'apple-user', email: 'apple@example.com' });
    },
    async signOut() {
      setUser(null);
    },
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


