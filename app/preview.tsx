import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Motion } from '@legendapp/motion';
import { Gradients, Typography } from '../constants/Colors';
import { DecisionCard } from '../components/ui/decision-card';
import { Mascot, MascotPresets } from '../components/ui/mascot';
import { Confetti, ConfettiPresets } from '../components/ui/confetti';
import * as Haptics from 'expo-haptics';

// Sample preview decisions that users can actually complete
const PREVIEW_DECISIONS = [
  {
    id: 'preview-email-1',
    title: 'Unsubscribe from "Daily Deal Digest"',
    description: 'This newsletter lands in your inbox daily but you haven\'t opened it in months. Time to declutter?',
    icon: '📧',
    type: 'email' as const,
    personality: '🧹 Time to declutter! Should we kick this out of your inbox?',
    actionable: true,
  },
  {
    id: 'preview-photo-1', 
    title: 'Delete 3 duplicate photos from last weekend',
    description: 'I found some nearly identical shots taking up space on your device.',
    icon: '🖼️',
    type: 'photos' as const,
    personality: '📸 Let\'s clean up those photo duplicates! Keep the best, ditch the rest?',
    actionable: true,
  },
  {
    id: 'preview-fitness-1',
    title: 'Do a 2-minute desk stretch',
    description: 'Your posture could use a quick reset. A simple stretch will boost your energy!',
    icon: '💪',
    type: 'fitness' as const,
    personality: '💪 Your body is calling for movement! Ready for a quick energy boost?',
    actionable: true,
  },
];

export default function PreviewScreen() {
  const router = useRouter();
  const [currentDecisionIndex, setCurrentDecisionIndex] = useState(0);
  const [completedDecisions, setCompletedDecisions] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mascotMessage, setMascotMessage] = useState(MascotPresets.welcome.message);
  const [mascotMood, setMascotMood] = useState(MascotPresets.welcome.mood);

  const currentDecision = PREVIEW_DECISIONS[currentDecisionIndex];
  const isCompleted = currentDecisionIndex >= PREVIEW_DECISIONS.length;

  const handleAccept = async () => {
    if (!currentDecision) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Mark as completed
    setCompletedDecisions(prev => [...prev, currentDecision.id]);
    
    // Show celebration
    setShowConfetti(true);
    setMascotMood('celebrating');
    setMascotMessage('Awesome! You just made a smart micro-decision! 🎉');
    
    // Move to next decision after celebration
    setTimeout(() => {
      if (currentDecisionIndex < PREVIEW_DECISIONS.length - 1) {
        setCurrentDecisionIndex(prev => prev + 1);
        setMascotMood('encouraging');
        setMascotMessage('Ready for another quick win? Let\'s keep the momentum going! 💪');
      } else {
        // All decisions completed - show sign up prompt
        setMascotMood('excited');
        setMascotMessage('You\'re a decision-making rockstar! Want me to keep helping you? Sign up to unlock unlimited wins! 🚀');
      }
    }, 2000);
  };

  const handleSkip = async () => {
    if (!currentDecision) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Move to next decision
    if (currentDecisionIndex < PREVIEW_DECISIONS.length - 1) {
      setCurrentDecisionIndex(prev => prev + 1);
      setMascotMood('thinking');
      setMascotMessage('No worries! Let\'s try a different type of decision... 🤔');
    } else {
      // All decisions seen - show sign up prompt
      setMascotMood('encouraging');
      setMascotMessage('That\'s okay! Even seeing what\'s possible is a step forward. Ready to unlock your full potential? 💪');
    }
  };

  const handleSignUp = () => {
    // Since users already experienced the preview, skip to the final step
    router.replace('/onboarding?fromPreview=true');
  };

  const handleContinueWithoutSignUp = () => {
    router.replace('/');
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={Gradients.premium as readonly [string, string, ...string[]]}
        className="flex-1"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView className="flex-1">
          {/* Header with Mascot */}
          <Motion.View
            className="px-6 py-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'timing', delay: 0.2, duration: 250 }}
          >
            <Mascot
              mood={mascotMood}
              size="medium"
              message={mascotMessage}
              showBubble={true}
              animated={true}
              className="items-center mb-4"
            />
          </Motion.View>

          {/* Progress Indicator */}
          <Motion.View
            className="mx-6 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', delay: 0.4, duration: 300 }}
          >
            <View className="bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <Motion.View
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentDecisionIndex + 1) / PREVIEW_DECISIONS.length) * 100}%` }}
                transition={{ type: 'spring' }}
              />
            </View>
            <Text className="text-white/90 text-center text-sm mt-2 font-medium">
              Decision {Math.min(currentDecisionIndex + 1, PREVIEW_DECISIONS.length)} of {PREVIEW_DECISIONS.length} • Try it out!
            </Text>
          </Motion.View>

          {/* Main Content */}
          <View className="flex-1 px-6">
            {!isCompleted && currentDecision ? (
              <Motion.View
                key={currentDecision.id}
                className="flex-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                <DecisionCard
                  title={currentDecision.title}
                  description={currentDecision.description}
                  icon={currentDecision.icon}
                  type={currentDecision.type}
                  personality={currentDecision.personality}
                  onAccept={handleAccept}
                  onSkip={handleSkip}
                />
              </Motion.View>
            ) : (
              // Completion Screen
              <Motion.View
                className="flex-1 items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 500 }}
              >
                <Text className="text-6xl mb-4">🎯</Text>
                <Text
                  className="text-white text-3xl font-bold text-center mb-4"
                  style={Typography.hero}
                >
                  You completed {completedDecisions.length} micro-wins!
                </Text>
                <Text className="text-white/80 text-center text-lg mb-8">
                  Imagine what you could accomplish with unlimited smart decisions every day!
                </Text>

                <View className="w-full max-w-sm gap-4">
                  <Motion.View
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'timing', delay: 300, duration: 300 }}
                  >
                    <TouchableOpacity
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl py-4 px-8 items-center shadow-lg"
                      onPress={handleSignUp}
                    >
                      <Text className="text-white font-bold text-xl">
                        🚀 Unlock Unlimited Wins
                      </Text>
                      <Text className="text-white/90 text-sm mt-1">
                        Join thousands making smarter choices
                      </Text>
                    </TouchableOpacity>
                  </Motion.View>

                  <Motion.View
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'timing', delay: 500, duration: 300 }}
                  >
                    <TouchableOpacity
                      className="bg-white/20 backdrop-blur-sm rounded-2xl py-3 px-6 items-center border border-white/30"
                      onPress={handleContinueWithoutSignUp}
                    >
                      <Text className="text-white font-medium">
                        Continue without signing up
                      </Text>
                    </TouchableOpacity>
                  </Motion.View>
                </View>
              </Motion.View>
            )}
          </View>

          {/* Social Proof */}
          <Motion.View
            className="px-6 pb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'timing', delay: 0.8, duration: 250 }}
          >
            <View className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <Text className="text-white/90 text-center font-semibold mb-1">
                📊 Join the movement
              </Text>
              <Text className="text-white/70 text-center text-sm">
                <Text className="font-bold text-yellow-300">12,847</Text> micro-decisions made this week
              </Text>
              <Text className="text-white/70 text-center text-xs mt-1">
                <Text className="font-bold text-green-300">+2,156</Text> users transformed their digital life
              </Text>
            </View>
          </Motion.View>
        </SafeAreaView>

        {/* Confetti Animation */}
        <Confetti
          active={showConfetti}
          onComplete={() => setShowConfetti(false)}
          {...ConfettiPresets.decision}
        />
      </LinearGradient>
    </View>
  );
}
