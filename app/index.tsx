import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { useRouter, useRootNavigationState, Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Motion } from '@legendapp/motion';
import { useAuth } from '../lib/auth';
import { fetchEntitlements } from '../lib/entitlements';
import { loadCounts, canGenerate, incrementGenerated } from '../lib/limits';
import { pickNextDecision } from '../lib/providers';
import { loadQueue, enqueue, accept as acceptAction, skip as skipAction, undoLast } from '../lib/queue';
import type { Decision, ProviderId } from '../lib/types';
import { track } from '../lib/analytics';
import { requestPermissions, scheduleLocalNotification } from '../lib/notifications';
import { DecisionCard } from '../components/ui/decision-card';
import { SwipeableCard } from '../components/ui/swipeable-card';
import { StreakBadge } from '../components/ui/streak-badge';
import { Colors, Gradients, Typography } from '../constants/Colors';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();
  const navState = useRootNavigationState();
  const { user } = useAuth();

  const [streakCount] = useState(7); // stub
  const [decisionsThisWeek] = useState(3); // stub
  const [entitlementsLabel, setEntitlementsLabel] = useState<string>('');
  const [decision, setDecision] = useState<Decision | null>(null);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string } | null>(null);
  const [paywallBlocked, setPaywallBlocked] = useState(false);

  const enabledProviders = useMemo<ProviderId[]>(() => ['email_unsub', 'photo_dupes', 'workout'], []);

  // Wait until the root navigator is mounted
  if (!navState?.key) return null;

  // Declarative redirect (safe before/after mount)
  if (!user) return <Redirect href="/onboarding" />;

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) return; // wait for login
      const ent = await fetchEntitlements(user.id);
      const counts = await loadCounts();
      setEntitlementsLabel(ent.isPremium ? 'Premium' : 'Free');

      if (!canGenerate(ent, counts)) {
        setPaywallBlocked(true);
        track('paywall_shown');
        return;
      }

      // generate a deterministic decision for today
      const seed = Date.now() % 100000; // simple seed; replace with server fn later
      const d = pickNextDecision(seed, enabledProviders, ent.isPremium);
      const queue = await loadQueue();
      await enqueue(queue, [d]);
      await incrementGenerated();
      if (!mounted) return;
      setDecision(d);
      track('decision_generated', { id: d.id, providerId: d.providerId });
    })();
    return () => {
      mounted = false;
    };
  }, [user, enabledProviders]);

  // Schedule a nudge notification (permission gated)
  useEffect(() => {
    (async () => {
      const granted = await requestPermissions();
      if (!granted) return;
      await scheduleLocalNotification({
        title: 'MicroDecide',
        body: 'Generate your next decision',
        secondsFromNow: 60 * 60 * 12, // 12 hours
        deepLinkPath: '/',
      });
    })();
  }, []);

  const handleAccept = async () => {
    if (!decision) return;
    const queue = await loadQueue();
    const next = await acceptAction(queue, decision.id);
    setSnackbar({ visible: true, message: '🎉 Great choice! Another win in your pocket.' });
    setTimeout(() => setSnackbar(null), 7000);
    setDecision(null);
    
    track('decision_accepted', { id: decision.id, providerId: decision.providerId });
  };

  const handleSkip = async () => {
    if (!decision) return;
    const queue = await loadQueue();
    const next = await skipAction(queue, decision.id);
    setSnackbar({ visible: true, message: 'Skipped. Undo?' });
    setTimeout(() => setSnackbar(null), 7000);
    setDecision(null);
    track('decision_skipped', { id: decision.id, providerId: decision.providerId });
  };

  const handleUndo = async () => {
    const queue = await loadQueue();
    const next = await undoLast(queue);
    setDecision(next.pending[0] ?? null);
    setSnackbar(null);
  };

  const handleSwipeAccept = async () => {
    await handleAccept();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSwipeSkip = async () => {
    await handleSkip();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={Gradients.premium as readonly [string, string, ...string[]]}
        className="flex-1"
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >


        <SafeAreaView className="flex-1" style={{ flex: 1 }}>
          {/* Header */}
          <Motion.View
            className="flex-row items-center justify-between px-6 py-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'timing', delay: 0.2, duration: 250 }}
          >
            <View>
              <Text
                className="text-2xl font-bold text-white"
                style={Typography.h1}
              >
                ✨ Your Micro Win
              </Text>
              <Text className="text-white/80 text-sm mt-1">
                Ready to make another smart choice?
              </Text>
            </View>

            <StreakBadge count={streakCount} />
          </Motion.View>

          {/* Progress Bar */}
          <Motion.View
            className="mx-6 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', delay: 0.4, duration: 300 }}
          >
            <View className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
              <Motion.View
                className="bg-white h-full rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(decisionsThisWeek / 5) * 100}%` }}
                transition={{ type: 'spring' }}
              />
            </View>
            <Text className="text-white/90 text-center text-sm mt-2 font-medium">
              💪 You've crushed {decisionsThisWeek} wins this week — keep going!
            </Text>
          </Motion.View>

          {/* Main Decision Card */}
          <View className="flex-1 px-6">
            {decision ? (
              <SwipeableCard
                onSwipeRight={handleSwipeAccept}
                onSwipeLeft={handleSwipeSkip}
                className="flex-1"
              >
                <DecisionCard
                  title={decision.title}
                  description={decision.explanation}
                  icon="📧"
                  type="email"
                  personality="🧹 Time to declutter! Should we kick this out of your inbox?"
                  onAccept={handleAccept}
                  onSkip={handleSkip}
                />
              </SwipeableCard>
            ) : (
              <Motion.View
                className="flex-1 items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', delay: 0.8, duration: 300 }}
              >
                <Text className="text-6xl mb-4">🎉</Text>
                <Text
                  className="text-white text-2xl font-bold text-center mb-2"
                  style={Typography.h1}
                >
                  You're All Caught Up!
                </Text>
                <Text className="text-white/80 text-center text-lg">
                  Come back tomorrow for your next micro-decision
                </Text>
              </Motion.View>
            )}
          </View>

          {/* Paywall Banner */}
          {paywallBlocked && (
            <Motion.View
              className="mx-6 mb-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'timing', delay: 1, duration: 250 }}
            >
              <Text className="text-white font-bold text-lg mb-1">
                🚀 Ready for Unlimited Wins?
              </Text>
              <Text className="text-white/80 text-sm mb-3">
                Unlock premium features and never hit daily limits again
              </Text>
              <TouchableOpacity
                className="bg-white rounded-xl py-3 items-center"
                onPress={() => router.push('/paywall')}
              >
                <Text className="text-indigo-600 font-bold">
                  Upgrade to Premium
                </Text>
              </TouchableOpacity>
            </Motion.View>
          )}

          {/* Navigation */}
          <Motion.View
            className="flex-row justify-center pb-6 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'timing', delay: 1.2, duration: 250 }}
          >
            <TouchableOpacity
              className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30"
              onPress={() => router.push('/decisions-queue')}
            >
              <Text className="text-white font-medium">📋 Queue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30"
              onPress={() => router.push('/history')}
            >
              <Text className="text-white font-medium">📊 History</Text>
            </TouchableOpacity>
          </Motion.View>

          {/* Undo Snackbar */}
          {snackbar?.visible && (
            <Motion.View
              className="absolute bottom-24 left-6 right-6 bg-gray-900/90 backdrop-blur-md rounded-2xl p-4 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'timing', duration: 250 }}
            >
              <Text className="text-white font-medium">{snackbar.message}</Text>
              <TouchableOpacity
                className="mt-3 bg-white/20 rounded-lg py-2 items-center"
                onPress={handleUndo}
              >
                <Text className="text-white font-bold">UNDO</Text>
              </TouchableOpacity>
            </Motion.View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

// Styles removed - now using Tailwind CSS and new design system