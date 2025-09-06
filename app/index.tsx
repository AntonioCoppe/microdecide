import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useRouter, useRootNavigationState, Redirect } from 'expo-router';
import { useAuth } from '../lib/auth';
import { fetchEntitlements } from '../lib/entitlements';
import { loadCounts, canGenerate, incrementGenerated } from '../lib/limits';
import { pickNextDecision } from '../lib/providers';
import { loadQueue, enqueue, accept as acceptAction, skip as skipAction, undoLast } from '../lib/queue';
import type { Decision, ProviderId } from '../lib/types';
import { track } from '../lib/analytics';
import { requestPermissions, scheduleLocalNotification } from '../lib/notifications';

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
    setSnackbar({ visible: true, message: 'Accepted. Undo?' });
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/onboarding')}>
          <Text style={styles.navButtonText}>Onboarding</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/paywall')}>
          <Text style={styles.navButtonText}>Paywall</Text>
        </TouchableOpacity>
      </View>
      {paywallBlocked && (
        <View style={{ backgroundColor: '#FFF8E1', padding: 12, marginHorizontal: 16, borderRadius: 8, marginTop: 12 }}>
          <Text style={{ color: '#8B5E00', fontWeight: '600' }}>Daily limit reached</Text>
          <TouchableOpacity onPress={() => router.push('/paywall')}>
            <Text style={{ color: '#1D4ED8', marginTop: 4 }}>Upgrade to Premium</Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Today's Decision</Text>
            <Text style={styles.headerSubtitle}>Your AI assistant for micro-decisions</Text>
          </View>
          <View style={styles.streakContainer}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakCount}>{streakCount}</Text>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsContent}>
            <View>
              <Text style={styles.statsLabel}>Decisions this week</Text>
              <Text style={styles.statsValue}>{decisionsThisWeek}/5</Text>
            </View>
            <View style={styles.statsIcon}>
              <Text style={styles.infoIcon}>ℹ️</Text>
            </View>
          </View>
        </View>

        {/* Decision Card */}
        <View style={styles.decisionCard}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Text style={styles.emailIcon}>📧</Text>
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>{decision?.title ?? "You're caught up"}</Text>
              <Text style={styles.cardSubtitle}>{decision?.explanation ?? 'Come back later or try enabling more providers.'}</Text>
            </View>
          </View>

          {/* Card Content */}
          <View style={styles.cardContent}>
            <Text style={styles.sectionTitle}>Recent subjects:</Text>
            <View style={styles.subjectsContainer}>
              {decision?.payload?.example_subjects?.length
                ? decision.payload.example_subjects.map((subject, index) => (
                    <Text key={index} style={styles.subjectItem}>• {subject}</Text>
                  ))
                : (
                    <Text style={styles.subjectItem}>No examples available.</Text>
                  )}
            </View>

            <Text style={styles.suggestionTitle}>Why this suggestion?</Text>
            <View style={styles.suggestionContainer}>
              <Text style={styles.suggestionText}>
                {decision?.explanation ?? 'All done for today.'}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip} disabled={!decision}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept} disabled={!decision}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Premium CTA */}
        <View style={styles.premiumCard}>
          <View style={styles.premiumContent}>
            <View style={styles.premiumText}>
              <Text style={styles.premiumTitle}>Unlock Unlimited Decisions</Text>
              <Text style={styles.premiumSubtitle}>Get access to all decision providers and scheduling</Text>
              <TouchableOpacity style={styles.upgradeButton} onPress={() => router.push('/paywall')}>
                <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.chevronIcon}>›</Text>
          </View>
        </View>

        {/* Providers Preview */}
        <View style={styles.providersSection}>
          <Text style={styles.providersTitle}>Decision Providers ({entitlementsLabel})</Text>
          <View style={styles.providersGrid}>
            {[
              { id: 'email_unsub', title: 'Email Unsubscribe', icon: '📧', enabled: true, premium: false },
              { id: 'photo_dupes', title: 'Photo Duplicates', icon: '📷', enabled: true, premium: false },
              { id: 'workout', title: '5-Min Workout', icon: '💪', enabled: true, premium: true },
            ].map((provider) => (
              <View key={provider.id} style={[styles.providerCard, provider.premium && styles.premiumProviderCard]}>
                <View style={styles.providerIcon}>
                  <Text style={styles.providerIconText}>{provider.icon}</Text>
                </View>
                <Text style={styles.providerTitle}>{provider.title}</Text>
                <View style={styles.providerStatus}>
                  {provider.premium && (
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumBadgeText}>Premium</Text>
                    </View>
                  )}
                  <View style={[styles.statusDot, provider.enabled && styles.statusDotActive]} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      {snackbar?.visible && (
        <View style={{ position: 'absolute', bottom: 24, left: 16, right: 16, backgroundColor: '#1F2937', borderRadius: 8, padding: 12 }}>
          <Text style={{ color: 'white' }}>{snackbar.message}</Text>
          <TouchableOpacity onPress={handleUndo} style={{ marginTop: 8 }}>
            <Text style={{ color: '#93C5FD', fontWeight: '600' }}>UNDO</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F9',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 12,
    gap: 12,
  },
  navButton: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  streakIcon: {
    fontSize: 20,
  },
  streakCount: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statsIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#E3F2FD',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: {
    fontSize: 24,
  },
  decisionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  cardHeader: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#BBDEFB',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emailIcon: {
    fontSize: 20,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#2C3E50',
    fontSize: 16,
  },
  cardSubtitle: {
    color: '#7F8C8D',
    fontSize: 14,
    marginTop: 2,
  },
  cardContent: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subjectsContainer: {
    backgroundColor: '#F4F7F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  subjectItem: {
    color: '#2C3E50',
    paddingVertical: 2,
  },
  suggestionTitle: {
    color: '#7F8C8D',
    fontSize: 14,
    marginBottom: 12,
  },
  suggestionContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  suggestionText: {
    color: '#2C3E50',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  skipButtonText: {
    fontWeight: '600',
    color: '#7F8C8D',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  acceptButtonText: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  premiumCard: {
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  premiumContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  premiumSubtitle: {
    color: '#BBDEFB',
    marginBottom: 12,
  },
  upgradeButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  upgradeButtonText: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  chevronIcon: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  providersSection: {
    marginBottom: 24,
  },
  providersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  providersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  providerCard: {
    flex: 1,
    minWidth: '40%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  premiumProviderCard: {
    borderColor: '#FFD700',
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    marginBottom: 12,
  },
  providerIconText: {
    fontSize: 24,
  },
  providerTitle: {
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  providerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  premiumBadge: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 16,
    marginRight: 8,
  },
  premiumBadgeText: {
    color: '#856404',
    fontSize: 12,
    fontWeight: '600',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  statusDotActive: {
    backgroundColor: '#4CAF50',
  },
});