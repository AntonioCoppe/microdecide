import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Motion } from '@legendapp/motion';
import { Colors, Gradients, Typography } from '../../constants/Colors';

interface DecisionCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon: string;
  gradient?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  className?: string;
  onAccept?: () => void;
  onSkip?: () => void;
  type?: 'email' | 'photos' | 'fitness' | 'general';
  personality?: string; // Playful copy like "🧹 Time to declutter!"
}

export function DecisionCard({
  title,
  subtitle,
  description,
  icon,
  gradient,
  style,
  className = '',
  onAccept,
  onSkip,
  type = 'general',
  personality,
}: DecisionCardProps) {
  // Get gradient based on decision type
  const getGradient = () => {
    if (gradient) return gradient;

    switch (type) {
      case 'email':
        return Gradients.primary;
      case 'photos':
        return Gradients.mint;
      case 'fitness':
        return Gradients.error;
      default:
        return Gradients.premium;
    }
  };

  return (
    <Motion.View
      className={`mx-6 rounded-3xl overflow-hidden shadow-2xl ${className}`}
      style={style}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      <LinearGradient
        colors={getGradient() as readonly [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-8"
      >
        {/* Header with personality */}
        <View className="mb-6">
          <Text
            className="text-4xl mb-2"
            style={Typography.hero}
          >
            {personality || '✨ Your Micro Win'}
          </Text>
          <Text
            className="text-white/90 text-lg"
            style={Typography.body}
          >
            {title}
          </Text>
        </View>

        {/* Large Icon */}
        <View className="items-center mb-6">
          <Text className="text-6xl">
            {icon}
          </Text>
        </View>

        {/* Description */}
        {description && (
          <View className="mb-8">
            <Text
              className="text-white/80 text-center leading-6"
              style={Typography.body}
            >
              {description}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row gap-4">
          <TouchableOpacity
            className="flex-1 bg-white/20 backdrop-blur-sm rounded-2xl py-4 items-center border border-white/30"
            onPress={onSkip}
          >
            <Text
              className="text-white font-semibold text-lg"
              style={Typography.h3}
            >
              Skip
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl py-4 items-center"
            onPress={onAccept}
          >
            <Text
              className="text-indigo-600 font-bold text-lg"
              style={Typography.h3}
            >
              Accept
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Motion.View>
  );
}
