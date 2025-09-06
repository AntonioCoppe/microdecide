import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { Check, X, RefreshCw } from 'lucide-react-native';

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
    impact: 'Low'
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
    impact: 'Low'
  },
  {
    id: '3',
    provider: '5-Min Workout',
    title: 'Morning Stretch Routine',
    description: '5-minute stretching routine to start your day with energy',
    icon: '🏃',
    image: 'https://images.unsplash.com/photo-1597452573811-85e7383195a6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8QXRobGV0ZSUyMHNwb3J0c21hbiUyMGZpdG5lc3MlMjBneW18ZW58MHx8MHx8fDA%3D',
    providerIcon: '🏃',
    confidence: 'High',
    impact: 'Medium'
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
    impact: 'Low'
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
    impact: 'Low'
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

  const handleAccept = (id: string) => {
    setDecisions(decisions.filter(decision => decision.id !== id));
  };

  const handleSkip = (id: string) => {
    // Move to end of queue
    const decision = decisions.find(d => d.id === id);
    if (decision) {
      setDecisions([...decisions.filter(d => d.id !== id), decision]);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">Decision Queue</Text>
          <TouchableOpacity className="p-2">
            <RefreshCw size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-500 mt-1">
          {decisions.length} decisions in queue
        </Text>
      </View>

      {/* Decision Cards */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {decisions.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-20">
            <Text className="text-xl font-semibold text-gray-700">Queue is empty!</Text>
            <Text className="text-gray-500 mt-2">Pull to refresh for new decisions</Text>
          </View>
        ) : (
          decisions.map((decision) => (
            <View 
              key={decision.id} 
              className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
            >
              {/* Provider Header */}
              <View className="flex-row items-center p-4 bg-blue-50">
                <Text className="text-2xl mr-2">{decision.providerIcon}</Text>
                <Text className="text-lg font-semibold text-gray-800">{decision.provider}</Text>
                <View className="flex-row ml-auto">
                  <View className="bg-green-100 px-2 py-1 rounded-full mr-2">
                    <Text className="text-green-800 text-xs font-medium">{decision.confidence}</Text>
                  </View>
                  <View className="bg-blue-100 px-2 py-1 rounded-full">
                    <Text className="text-blue-800 text-xs font-medium">{decision.impact} Impact</Text>
                  </View>
                </View>
              </View>

              {/* Decision Content */}
              <View className="p-4">
                <Text className="text-xl font-bold text-gray-900 mb-2">{decision.title}</Text>
                <Text className="text-gray-600 mb-4">{decision.description}</Text>
                
                {decision.image && (
                  <Image 
                    source={{ uri: decision.image }} 
                    className="w-full h-40 rounded-lg mb-4"
                    resizeMode="cover"
                  />
                )}

                {/* Action Buttons */}
                <View className="flex-row justify-between mt-4">
                  <TouchableOpacity 
                    className="flex-row items-center justify-center bg-red-500 px-6 py-3 rounded-lg flex-1 mr-2"
                    onPress={() => handleSkip(decision.id)}
                  >
                    <X size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">Skip</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex-row items-center justify-center bg-green-500 px-6 py-3 rounded-lg flex-1 ml-2"
                    onPress={() => handleAccept(decision.id)}
                  >
                    <Check size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Empty state illustration */}
      {decisions.length === 0 && (
        <View className="absolute bottom-20 left-0 right-0 items-center">
          <Text className="text-gray-400 text-center px-8">
            When you have decisions in your queue, they'll appear here. Pull down to refresh.
          </Text>
        </View>
      )}
    </View>
  );
}