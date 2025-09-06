import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Check, X, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Motion } from '@legendapp/motion';
import { DecisionCard } from '../components/ui/decision-card';
import { SwipeableCard } from '../components/ui/swipeable-card';
import { Gradients, Typography, Colors } from '../constants/Colors';
import * as Haptics from 'expo-haptics';

// Mock data for decisions
const mockDecisions = [
  {
    id: '1',
    provider: 'Email Unsubscribe',
    title: 'Unsubscribe from Marketing Newsletter',
    description: 'Weekly marketing emails from FashionHub with 23% open rate',
    icon: '📧',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D',
    providerIcon: '📧',
    confidence: 'High',
    impact: 'Low',
    type: 'email' as const,
    personality: '🧹 Time to declutter! Should we kick FashionHub out of your inbox?'
  },
  {
    id: '2',
    provider: 'Photo Duplicates',
    title: 'Remove Duplicate Vacation Photos',
    description: '3 similar photos from your Paris trip taken within 2 minutes',
    icon: '🖼️',
    image: 'https://images.unsplash.com/photo-1622588907467-915ab508ae2a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UmVtb3RlJTIwd29yayUyMGhvbWUlMjBvZmZpY2V8ZW58MHx8MHx8fDA%3D',
    providerIcon: '🖼️',
    confidence: 'Medium',
    impact: 'Low',
    type: 'photos' as const,
    personality: '🧹 Spring cleaning time! These Paris duplicates are taking up space.'
  },
  {
    id: '3',
    provider: '5-Min Workout',
    title: 'Morning Stretch Routine',
    description: '5-minute stretching routine to start your day with energy',
    icon: '💪',
    image: 'https://images.unsplash.com/photo-1597452573811-85e7383195a6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8QXRobGV0ZSUyMHNwb3J0c21hbiUyMGZpdG5lc3MlMjBneW18ZW58MHx8MHx8fDA%3D',
    providerIcon: '💪',
    confidence: 'High',
    impact: 'Medium',
    type: 'fitness' as const,
    personality: '🏃‍♂️ Ready to crush this quick win? 5 minutes to feel amazing!'
  },
  {
    id: '4',
    provider: 'Email Unsubscribe',
    title: 'Unsubscribe from Promotional Emails',
    description: 'Daily promotional emails from TechGadgets with 12% open rate',
    icon: '📧',
    image: 'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D',
    providerIcon: '📧',
    confidence: 'High',
    impact: 'Low',
    type: 'email' as const,
    personality: '📧 TechGadgets is spamming you daily. Time for some peace?'
  },
  {
    id: '5',
    provider: 'Photo Duplicates',
    title: 'Clean Duplicate Screenshots',
    description: 'Multiple copies of the same screenshot saved accidentally',
    icon: '🖼️',
    image: 'https://images.unsplash.com/photo-1692158961713-73690ef06e6e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuYWdlbWVudCUyMHRhc2tzfGVufDB8fDB8fHww',
    providerIcon: '🖼️',
    confidence: 'High',
    impact: 'Low',
    type: 'photos' as const,
    personality: '🖼️ Screenshot city! Let\'s clean up this digital mess.'
  }
];

export default function DecisionsQueueScreen() {
  const [decisions, setDecisions] = useState(mockDecisions);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleAccept = async (id: string) => {
    setDecisions(decisions.filter(decision => decision.id !== id));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSkip = async (id: string) => {
    // Move to end of queue
    const decision = decisions.find(d => d.id === id);
    if (decision) {
      setDecisions([...decisions.filter(d => d.id !== id), decision]);
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
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
        {/* Header */}
        <Motion.View
          className="pt-12 pb-4 px-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'timing', delay: 0.2, duration: 250 }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text
                className="text-2xl font-bold text-white"
                style={Typography.h1}
              >
                🎯 Decision Deck
              </Text>
              <Text className="text-white/80 text-sm mt-1">
                {decisions.length} smart choices waiting
              </Text>
            </View>
            <TouchableOpacity
              className="bg-white/20 backdrop-blur-md rounded-xl p-3"
              onPress={onRefresh}
            >
              <RefreshCw size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Motion.View>

        {/* Stacked Card Deck */}
        <View className="flex-1 px-6">
          {decisions.length === 0 ? (
            <Motion.View
              className="flex-1 items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', delay: 0.4, duration: 300 }}
            >
              <Text className="text-6xl mb-4">🎉</Text>
              <Text
                className="text-white text-2xl font-bold text-center mb-2"
                style={Typography.h1}
              >
                All Caught Up!
              </Text>
              <Text className="text-white/80 text-center text-lg">
                No decisions in your queue right now
              </Text>
              <TouchableOpacity
                className="mt-6 bg-white/20 backdrop-blur-md rounded-xl px-6 py-3"
                onPress={onRefresh}
              >
                <Text className="text-white font-medium">Refresh for new decisions</Text>
              </TouchableOpacity>
            </Motion.View>
          ) : (
            <View className="flex-1">
              {decisions.map((decision, index) => (
                <Motion.View
                  key={decision.id}
                  className="absolute inset-0"
                  style={{
                    zIndex: decisions.length - index,
                    transform: [
                      { scale: 1 - (index * 0.05) },
                      { translateY: index * 20 }
                    ]
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 - (index * 0.05) }}
                  transition={{ type: 'timing', delay: index * 0.1, duration: 200 }}
                >
                  {index === 0 ? (
                    <SwipeableCard
                      onSwipeRight={() => handleAccept(decision.id)}
                      onSwipeLeft={() => handleSkip(decision.id)}
                      className="flex-1"
                    >
                      <DecisionCard
                        title={decision.title}
                        description={decision.description}
                        icon={decision.icon}
                        type={decision.type}
                        personality={decision.personality}
                        onAccept={() => handleAccept(decision.id)}
                        onSkip={() => handleSkip(decision.id)}
                      />
                    </SwipeableCard>
                  ) : (
                    <DecisionCard
                      title={decision.title}
                      description={decision.description}
                      icon={decision.icon}
                      type={decision.type}
                      personality={decision.personality}
                    />
                  )}
                </Motion.View>
              ))}
            </View>
          )}
        </View>

        {/* Progress indicator */}
        {decisions.length > 0 && (
          <Motion.View
            className="pb-6 px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'timing', delay: 0.6, duration: 250 }}
          >
            <View className="flex-row justify-center">
              {decisions.slice(0, 5).map((_, index) => (
                <View
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === 0 ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
              {decisions.length > 5 && (
                <Text className="text-white/60 text-sm ml-2">
                  +{decisions.length - 5} more
                </Text>
              )}
            </View>
          </Motion.View>
        )}
      </LinearGradient>
    </View>
  );
}