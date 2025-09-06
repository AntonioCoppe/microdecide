import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Star, Check, Crown, Sparkles } from 'lucide-react-native';

export default function PaywallScreen() {
  const [isYearly, setIsYearly] = useState(true);

  const features = [
    "Unlimited micro-decisions",
    "All decision providers (Email, Photos, Fitness)",
    "Priority processing",
    "Advanced analytics & streak tracking",
    "Custom scheduling",
    "Early access to new features"
  ];

  const testimonials = [
    {
      id: 1,
      name: "Alex T.",
      role: "Product Manager",
      text: "MicroDecide helped me unsubscribe from 47 unwanted emails in a week!",
      rating: 5
    },
    {
      id: 2,
      name: "Sam K.",
      role: "Photographer",
      text: "Found and deleted over 200 duplicate photos I didn't know I had.",
      rating: 5
    },
    {
      id: 3,
      name: "Jordan M.",
      role: "Busy Parent",
      text: "The 5-min workouts actually fit into my schedule. Game changer!",
      rating: 5
    }
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="items-center mb-8 mt-4">
          <View className="bg-blue-100 p-4 rounded-full mb-4">
            <Crown size={48} color="#4A90E2" />
          </View>
          <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
            Upgrade to Premium
          </Text>
          <Text className="text-gray-600 text-center">
            Unlock the full potential of MicroDecide
          </Text>
        </View>

        {/* Pricing Toggle */}
        <View className="flex-row items-center justify-center mb-8">
          <Text className={`font-medium ${!isYearly ? "text-gray-800" : "text-gray-400"}`}>
            Monthly
          </Text>
          <TouchableOpacity
            className="mx-4 bg-gray-200 rounded-full p-1"
            onPress={() => setIsYearly(!isYearly)}
          >
            <View className={`bg-white rounded-full p-1 ${isYearly ? "translate-x-6" : ""} transition-transform`}>
              <View className="w-6 h-6 rounded-full bg-blue-500" />
            </View>
          </TouchableOpacity>
          <Text className={`font-medium ${isYearly ? "text-gray-800" : "text-gray-400"}`}>
            Yearly
          </Text>
          <View className="ml-2 bg-blue-100 px-2 py-1 rounded-full">
            <Text className="text-blue-700 text-xs font-bold">SAVE 25%</Text>
          </View>
        </View>

        {/* Pricing Cards */}
        <View className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <View className="items-center mb-6">
            <Text className="text-4xl font-bold text-gray-800">
              {isYearly ? "$47.88" : "$4.99"}
            </Text>
            <Text className="text-gray-600">
              {isYearly ? "per year" : "per month"}
            </Text>
          </View>

          <TouchableOpacity className="bg-blue-500 p-4 rounded-xl mb-4">
            <Text className="text-white font-bold text-center text-lg">
              Start Free Trial
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-500 text-center text-sm">
            7-day free trial • Cancel anytime
          </Text>
        </View>

        {/* Features List */}
        <View className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Everything included in Premium
          </Text>

          {features.map((feature, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <Check size={20} color="#4A90E2" className="mr-3" />
              <Text className="text-gray-700">{feature}</Text>
            </View>
          ))}
        </View>

        {/* Testimonials */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
            Loved by busy professionals
          </Text>

          {testimonials.map((testimonial) => (
            <View key={testimonial.id} className="bg-white rounded-2xl shadow-sm p-5 mb-4">
              <View className="flex-row items-center mb-3">
                <View className="flex-row">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} color="#FFD700" fill="#FFD700" />
                  ))}
                </View>
              </View>
              <Text className="text-gray-700 mb-3 italic">
                "{testimonial.text}"
              </Text>
              <Text className="font-bold text-gray-800">{testimonial.name}</Text>
              <Text className="text-gray-500 text-sm">{testimonial.role}</Text>
            </View>
          ))}
        </View>

        {/* Restore Purchases */}
        <TouchableOpacity className="mb-8">
          <Text className="text-blue-500 font-medium text-center">
            Restore Purchases
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}