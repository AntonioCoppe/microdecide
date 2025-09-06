import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Calendar, Filter, TrendingUp, CheckCircle, XCircle, Flame } from 'lucide-react-native';

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
  acceptanceRate: 78
};

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
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">Decision History</Text>
          <TouchableOpacity className="p-2">
            <Filter size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-500 mt-1">
          {mockHistory.length} decisions made
        </Text>
      </View>

      {/* Stats Summary */}
      <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
        <View className="flex-row justify-between mb-4">
          <View className="items-center">
            <View className="flex-row items-center bg-blue-50 px-3 py-1 rounded-full">
              <Flame color="#FF6B6B" size={16} />
              <Text className="ml-1 font-bold text-gray-900">{mockStats.streak}</Text>
            </View>
            <Text className="text-gray-500 text-xs mt-1">Day Streak</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">{mockStats.decisionsThisWeek}</Text>
            <Text className="text-gray-500 text-xs mt-1">This Week</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900">{mockStats.acceptanceRate}%</Text>
            <Text className="text-gray-500 text-xs mt-1">Acceptance</Text>
          </View>
        </View>
        
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View 
            className="h-full bg-green-500" 
            style={{ width: `${mockStats.acceptanceRate}%` }}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row mx-4 mt-4 bg-gray-100 rounded-xl p-1">
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-lg items-center ${
            filter === 'all' ? 'bg-white shadow-sm' : ''
          }`}
          onPress={() => setFilter('all')}
        >
          <Text className={filter === 'all' ? 'font-semibold text-gray-900' : 'text-gray-500'}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-lg items-center ${
            filter === 'accepted' ? 'bg-white shadow-sm' : ''
          }`}
          onPress={() => setFilter('accepted')}
        >
          <Text className={filter === 'accepted' ? 'font-semibold text-green-600' : 'text-gray-500'}>
            Accepted
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-lg items-center ${
            filter === 'skipped' ? 'bg-white shadow-sm' : ''
          }`}
          onPress={() => setFilter('skipped')}
        >
          <Text className={filter === 'skipped' ? 'font-semibold text-red-500' : 'text-gray-500'}>
            Skipped
          </Text>
        </TouchableOpacity>
      </View>

      {/* History List */}
      <ScrollView className="flex-1 px-4 py-4">
        {Object.entries(groupedDecisions).map(([date, decisions]) => (
          <View key={date} className="mb-6">
            <View className="flex-row items-center mb-3">
              <Text className="font-bold text-gray-700 mr-2">{date}</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>
            
            {decisions.map((decision) => (
              <View 
                key={decision.id} 
                className="bg-white rounded-xl shadow-sm mb-3 overflow-hidden"
              >
                <View className="flex-row items-center p-4">
                  <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-3">
                    <Text className="text-xl">{decision.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row justify-between">
                      <Text className="font-bold text-gray-900">{decision.title}</Text>
                      {decision.status === 'accepted' ? (
                        <CheckCircle size={20} color="#10B981" />
                      ) : (
                        <XCircle size={20} color="#EF4444" />
                      )}
                    </View>
                    <Text className="text-gray-600 text-sm mt-1">{decision.description}</Text>
                    <View className="flex-row items-center mt-2">
                      <Text className="text-gray-500 text-xs">{decision.provider}</Text>
                      <View className="w-1 h-1 bg-gray-300 rounded-full mx-2" />
                      <View className={`px-2 py-1 rounded-full ${
                        decision.impact === 'High' ? 'bg-red-100' : 
                        decision.impact === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        <Text className={`text-xs ${
                          decision.impact === 'High' ? 'text-red-800' : 
                          decision.impact === 'Medium' ? 'text-yellow-800' : 'text-green-800'
                        }`}>
                          {decision.impact} Impact
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}