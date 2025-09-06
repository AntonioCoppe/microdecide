import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, Dimensions } from 'react-native';
import { Calendar, Filter, TrendingUp, CheckCircle, XCircle, Flame, Trophy, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Motion } from '@legendapp/motion';
import { Gradients, Typography, Colors } from '../constants/Colors';

// Mock data for decision history
const mockHistory = [
  {
    id: '1',
    provider: 'Email Unsubscribe',
    title: 'Unsubscribed from Marketing Newsletter',
    description: 'Weekly marketing emails from FashionHub',
    icon: '📧',
    date: '2023-10-15',
    status: 'accepted',
    impact: 'Low'
  },
  {
    id: '2',
    provider: 'Photo Duplicates',
    title: 'Removed Duplicate Vacation Photos',
    description: '3 similar photos from your Paris trip',
    icon: '🖼️',
    date: '2023-10-14',
    status: 'accepted',
    impact: 'Low'
  },
  {
    id: '3',
    provider: '5-Min Workout',
    title: 'Skipped Morning Stretch Routine',
    description: '5-minute stretching routine',
    icon: '🏃',
    date: '2023-10-14',
    status: 'skipped',
    impact: 'Medium'
  },
  {
    id: '4',
    provider: 'Email Unsubscribe',
    title: 'Unsubscribed from Promotional Emails',
    description: 'Daily promotional emails from TechGadgets',
    icon: '📧',
    date: '2023-10-13',
    status: 'accepted',
    impact: 'Low'
  },
  {
    id: '5',
    provider: 'Photo Duplicates',
    title: 'Cleaned Duplicate Screenshots',
    description: 'Multiple copies of the same screenshot',
    icon: '🖼️',
    date: '2023-10-12',
    status: 'accepted',
    impact: 'Low'
  },
  {
    id: '6',
    provider: '5-Min Workout',
    title: 'Completed Evening Yoga Routine',
    description: '10-minute evening yoga session',
    icon: '🏃',
    date: '2023-10-12',
    status: 'accepted',
    impact: 'High'
  },
];

// Mock statistics data
const mockStats = {
  streak: 7,
  decisionsThisWeek: 5,
  totalDecisions: 42,
  acceptanceRate: 78,
  level: 3,
  xpThisWeek: 1250,
  nextLevelXP: 2000
};

// Achievement badges
const achievements = [
  { id: 'first_win', title: 'First Win', icon: '🎯', earned: true, description: 'Made your first smart decision' },
  { id: 'streak_master', title: 'Streak Master', icon: '🔥', earned: true, description: '7-day decision streak' },
  { id: 'declutter_king', title: 'Declutter King', icon: '🧹', earned: true, description: 'Unsubscribed from 10+ newsletters' },
  { id: 'fitness_warrior', title: 'Fitness Warrior', icon: '💪', earned: false, description: 'Completed 20 workout decisions' },
  { id: 'photo_organizer', title: 'Photo Organizer', icon: '🖼️', earned: false, description: 'Cleaned up 100+ duplicate photos' },
];

export default function HistoryScreen() {
  const [filter, setFilter] = useState('all'); // all, accepted, skipped
  const [timeRange, setTimeRange] = useState('week'); // week, month, all

  // Filter decisions based on selected filter
  const filteredDecisions = mockHistory.filter(decision => {
    if (filter === 'all') return true;
    return decision.status === filter;
  });

  // Group decisions by date
  const groupedDecisions = filteredDecisions.reduce((groups, decision) => {
    const date = decision.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(decision);
    return groups;
  }, {} as Record<string, typeof mockHistory>);

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
                  🏆 Your Journey
                </Text>
                <Text className="text-white/80 text-sm mt-1">
                  {mockStats.totalDecisions} wins and counting
                </Text>
              </View>
              <TouchableOpacity className="bg-white/20 backdrop-blur-md rounded-xl p-3">
                <Filter size={20} color="white" />
              </TouchableOpacity>
            </View>
          </Motion.View>

          <ScrollView className="flex-1 px-6">
            {/* Level Progress Card */}
            <Motion.View
              className="mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', delay: 0.3, duration: 250 }}
            >
              <LinearGradient
                colors={Gradients.ocean as readonly [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-3xl p-6"
              >
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <Trophy size={24} color="white" />
                    <Text className="text-white font-bold text-lg ml-2">
                      Level {mockStats.level}
                    </Text>
                  </View>
                  <Text className="text-white/80 text-sm">
                    {mockStats.xpThisWeek}/{mockStats.nextLevelXP} XP
                  </Text>
                </View>

                <View className="h-3 bg-white/20 rounded-full overflow-hidden mb-2">
                  <Motion.View
                    className="h-full bg-white rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(mockStats.xpThisWeek / mockStats.nextLevelXP) * 100}%` }}
                    transition={{ type: 'spring' }}
                  />
                </View>
                <Text className="text-white/80 text-sm text-center">
                  {mockStats.nextLevelXP - mockStats.xpThisWeek} XP to next level
                </Text>
              </LinearGradient>
            </Motion.View>

            {/* Stats Grid */}
            <Motion.View
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'timing', delay: 0.4, duration: 250 }}
            >
              <View className="flex-row gap-4">
                <View className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <View className="flex-row items-center mb-2">
                    <Flame size={20} color="#ef4444" />
                    <Text className="text-white font-bold text-lg ml-2">{mockStats.streak}</Text>
                  </View>
                  <Text className="text-white/80 text-sm">Day Streak</Text>
                </View>

                <View className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <Text className="text-white font-bold text-2xl mb-1">{mockStats.decisionsThisWeek}</Text>
                  <Text className="text-white/80 text-sm">This Week</Text>
                </View>
              </View>

              <View className="mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white font-bold">Success Rate</Text>
                  <Text className="text-white font-bold text-lg">{mockStats.acceptanceRate}%</Text>
                </View>
                <View className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-green-400 rounded-full"
                    style={{ width: `${mockStats.acceptanceRate}%` }}
                  />
                </View>
              </View>
            </Motion.View>

            {/* Achievement Badges */}
            <Motion.View
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'timing', delay: 0.5, duration: 250 }}
            >
              <Text className="text-white font-bold text-lg mb-4">🏅 Achievements</Text>
              <View className="flex-row flex-wrap gap-3">
                {achievements.map((achievement, index) => (
                  <Motion.View
                    key={achievement.id}
                    className={`items-center p-3 rounded-2xl border ${
                      achievement.earned
                        ? 'bg-white/20 border-white/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', delay: 0.6 + (index * 0.1), duration: 250 }}
                  >
                    <Text className="text-2xl mb-1">{achievement.icon}</Text>
                    <Text className={`text-xs font-medium text-center ${
                      achievement.earned ? 'text-white' : 'text-white/50'
                    }`}>
                      {achievement.title}
                    </Text>
                  </Motion.View>
                ))}
              </View>
            </Motion.View>

            {/* Timeline */}
            <Motion.View
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'timing', delay: 0.7, duration: 250 }}
            >
              <Text className="text-white font-bold text-lg mb-4">📅 Recent Activity</Text>

              {Object.entries(groupedDecisions).map(([date, decisions], dateIndex) => (
                <Motion.View
                  key={date}
                  className="mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'timing', delay: 0.8 + (dateIndex * 0.1), duration: 250 }}
                >
                  <Text className="text-white/80 font-medium mb-3">{date}</Text>

                  {decisions.map((decision, decisionIndex) => (
                    <Motion.View
                      key={decision.id}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-3 border border-white/20"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'timing', delay: 0.9 + (dateIndex * 0.1) + (decisionIndex * 0.05), duration: 250 }}
                    >
                      <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
                          <Text className="text-lg">{decision.icon}</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-white font-medium">{decision.title}</Text>
                          <Text className="text-white/70 text-sm mt-1">{decision.description}</Text>
                        </View>
                        {decision.status === 'accepted' ? (
                          <CheckCircle size={20} color="#10b981" />
                        ) : (
                          <XCircle size={20} color="#ef4444" />
                        )}
                      </View>
                    </Motion.View>
                  ))}
                </Motion.View>
              ))}
            </Motion.View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}