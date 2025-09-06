import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { Star, Check, Crown, Sparkles, Users, TrendingUp, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Motion } from '@legendapp/motion';
import { Gradients, Typography, Colors } from '../constants/Colors';

export default function PaywallScreen() {
  const [isYearly, setIsYearly] = useState(true);

  const features = [
    { icon: "🎯", title: "Unlimited Wins", description: "Make smart decisions without limits" },
    { icon: "💪", title: "Premium Workouts", description: "5-min fitness routines that actually work" },
    { icon: "📊", title: "Advanced Analytics", description: "Track your progress and streaks" },
    { icon: "⚡", title: "Priority Processing", description: "Lightning-fast decision generation" },
    { icon: "🎨", title: "Custom Scheduling", description: "Decisions delivered when you want them" },
    { icon: "🚀", title: "Early Access", description: "Be first to try new features" }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Creative Director",
      text: "MicroDecide transformed how I approach my digital life. I've reclaimed 3 hours a week!",
      rating: 5,
      achievement: "47 emails decluttered"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Startup Founder",
      text: "The fitness integration is brilliant. I actually look forward to my 5-min workouts now.",
      rating: 5,
      achievement: "30-day fitness streak"
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "Life Coach",
      text: "My clients love seeing my progress. It's become part of my daily wellness routine.",
      rating: 5,
      achievement: "200+ photos organized"
    }
  ];

  const stats = {
    users: "10,000+",
    satisfaction: "98%",
    avgTimeSaved: "2.5 hrs/week"
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
        <ScrollView className="flex-1">
          <View className="px-6 py-8">
            {/* Hero Section */}
            <Motion.View
              className="items-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'timing', delay: 0.2, duration: 250 }}
            >
              <View className="bg-white/20 backdrop-blur-md p-6 rounded-full mb-6 border border-white/30">
                <Crown size={48} color="white" />
              </View>
              <Text
                className="text-4xl font-bold text-white text-center mb-3"
                style={Typography.hero}
              >
                Unlock Unlimited Wins
              </Text>
              <Text className="text-white/80 text-center text-lg leading-6">
                Join 10,000+ decision-makers who've transformed their digital lives
              </Text>
            </Motion.View>

            {/* Social Proof Stats */}
            <Motion.View
              className="flex-row justify-center mb-8 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'timing', delay: 0.3, duration: 250 }}
            >
              <View className="items-center">
                <View className="flex-row items-center mb-1">
                  <Users size={16} color="white" />
                  <Text className="text-white font-bold text-lg ml-1">{stats.users}</Text>
                </View>
                <Text className="text-white/70 text-xs">Happy Users</Text>
              </View>
              <View className="items-center">
                <Text className="text-white font-bold text-lg mb-1">{stats.satisfaction}</Text>
                <Text className="text-white/70 text-xs">Satisfaction</Text>
              </View>
              <View className="items-center">
                <Text className="text-white font-bold text-lg mb-1">{stats.avgTimeSaved}</Text>
                <Text className="text-white/70 text-xs">Time Saved</Text>
              </View>
            </Motion.View>

            {/* Pricing Toggle */}
            <Motion.View
              className="flex-row items-center justify-center mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', delay: 0.4, duration: 250 }}
            >
              <Text className={`font-medium text-lg ${!isYearly ? "text-white" : "text-white/50"}`}>
                Monthly
              </Text>
              <TouchableOpacity
                className="mx-4 bg-white/20 backdrop-blur-md rounded-full p-1 border border-white/30"
                onPress={() => setIsYearly(!isYearly)}
              >
                <Motion.View
                  className={`bg-white rounded-full p-1 transition-all ${isYearly ? "translate-x-6" : ""}`}
                  animate={{ translateX: isYearly ? 24 : 0 }}
                >
                  <View className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                </Motion.View>
              </TouchableOpacity>
              <Text className={`font-medium text-lg ${isYearly ? "text-white" : "text-white/50"}`}>
                Yearly
              </Text>
              <Motion.View
                className="ml-3 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full border border-yellow-300"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <Text className="text-white text-xs font-bold">SAVE 25%</Text>
              </Motion.View>
            </Motion.View>

            {/* Pricing Card */}
            <Motion.View
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'timing', delay: 0.5, duration: 250 }}
            >
              <LinearGradient
                colors={(isYearly ? Gradients.premium : Gradients.primary) as readonly [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className={`rounded-3xl p-8 border-2 ${
                  isYearly ? 'border-yellow-300 shadow-2xl shadow-yellow-500/20' : 'border-white/30'
                }`}
              >
                <View className="items-center mb-6">
                  <Text className="text-5xl font-bold text-white mb-2">
                    {isYearly ? "$47.88" : "$4.99"}
                  </Text>
                  <Text className="text-white/80">
                    {isYearly ? "per year" : "per month"}
                  </Text>
                  {isYearly && (
                    <Text className="text-yellow-300 text-sm font-medium mt-2">
                      🎉 Best value - save $14.88!
                    </Text>
                  )}
                </View>

                <TouchableOpacity className="bg-white rounded-2xl py-4 mb-4 shadow-lg">
                  <Text className="text-indigo-600 font-bold text-center text-xl">
                    Start Free Trial
                  </Text>
                </TouchableOpacity>

                <Text className="text-white/70 text-center text-sm">
                  7-day free trial • Cancel anytime • No commitments
                </Text>
              </LinearGradient>
            </Motion.View>

            {/* Features Grid */}
            <Motion.View
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'timing', delay: 0.6, duration: 250 }}
            >
              <Text className="text-white font-bold text-xl text-center mb-6">
                Everything You Get
              </Text>
              <View className="flex-row flex-wrap gap-4">
                {features.map((feature, index) => (
                  <Motion.View
                    key={index}
                    className="flex-1 min-w-[45%] bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', delay: 0.7 + (index * 0.1), duration: 250 }}
                  >
                    <Text className="text-2xl mb-2">{feature.icon}</Text>
                    <Text className="text-white font-semibold mb-1">{feature.title}</Text>
                    <Text className="text-white/70 text-sm">{feature.description}</Text>
                  </Motion.View>
                ))}
              </View>
            </Motion.View>

            {/* Testimonials */}
            <Motion.View
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'timing', delay: 0.8, duration: 250 }}
            >
              <Text className="text-white font-bold text-xl text-center mb-6">
                💬 What Our Community Says
              </Text>

              {testimonials.map((testimonial, index) => (
                <Motion.View
                  key={testimonial.id}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-4 border border-white/20"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'timing', delay: 0.9 + (index * 0.1), duration: 250 }}
                >
                  <View className="flex-row items-center mb-3">
                    <View className="flex-row mr-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} color="#FFD700" fill="#FFD700" />
                      ))}
                    </View>
                    <Text className="text-yellow-400 text-sm font-medium">
                      {testimonial.achievement}
                    </Text>
                  </View>
                  <Text className="text-white/90 mb-4 italic leading-5">
                    "{testimonial.text}"
                  </Text>
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full items-center justify-center mr-3">
                      <Text className="text-white font-bold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-white font-semibold">{testimonial.name}</Text>
                      <Text className="text-white/60 text-sm">{testimonial.role}</Text>
                    </View>
                  </View>
                </Motion.View>
              ))}
            </Motion.View>

            {/* Bottom CTA */}
            <Motion.View
              className="items-center pb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'timing', delay: 1, duration: 250 }}
            >
              <TouchableOpacity className="bg-white/20 backdrop-blur-md rounded-xl px-6 py-3 border border-white/30">
                <Text className="text-white font-medium">Restore Purchases</Text>
              </TouchableOpacity>
            </Motion.View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}