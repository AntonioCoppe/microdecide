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
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        damping: 18, 
        stiffness: 200,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <LinearGradient
        colors={getGradient() as readonly [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-8 py-8"
      >
        {/* Header with personality */}
        <View className="mb-8">
          <Text
            className="text-4xl mb-3"
            style={[Typography.hero, { lineHeight: 48, textAlign: 'center' }]}
          >
            {personality || '✨ Your Micro Win'}
          </Text>
          <Text
            className="text-white/90 text-lg text-center"
            style={[Typography.body, { lineHeight: 24 }]}
          >
            {title}
          </Text>
        </View>

        {/* Large Icon with floating animation */}
        <Motion.View 
          className="items-center mb-8"
          animate={{ 
            y: [0, -8, 0]
          }}
          transition={{ 
            type: 'timing',
            duration: 3000,
          }}
        >
          <Motion.Text 
            className="text-6xl"
            style={{ lineHeight: 72, textAlign: 'center', textAlignVertical: 'center' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: 'spring',
              damping: 15,
              stiffness: 200
            }}
          >
            {icon}
          </Motion.Text>
          
          {/* Sparkle effects around icon */}
          <View className="absolute inset-0">
            <Motion.Text
              className="absolute top-2 right-2 text-yellow-300 text-lg"
              animate={{ 
                scale: 1,
                opacity: 0.8
              }}
              transition={{ 
                type: 'timing',
                duration: 2000
              }}
            >
              ✨
            </Motion.Text>
            <Motion.Text
              className="absolute bottom-2 left-2 text-blue-300 text-lg"
              animate={{ 
                scale: 1,
                opacity: 0.8
              }}
              transition={{ 
                type: 'timing',
                duration: 2000
              }}
            >
              💫
            </Motion.Text>
          </View>
        </Motion.View>

        {/* Description */}
        {description && (
          <View className="mb-8">
            <Text
              className="text-white/80 text-center"
              style={[Typography.body, { lineHeight: 24 }]}
            >
              {description}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row gap-4">
          <Motion.View
            className="flex-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TouchableOpacity
              className="bg-white/20 backdrop-blur-sm rounded-2xl py-4 items-center border border-white/30"
              onPress={onSkip}
            >
              <Text
                className="text-white font-semibold text-lg"
                style={[Typography.h3, { lineHeight: 24 }]}
              >
                Skip
              </Text>
            </TouchableOpacity>
          </Motion.View>

          <Motion.View
            className="flex-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TouchableOpacity
              className="bg-white rounded-2xl py-4 items-center shadow-lg"
              onPress={onAccept}
              style={{
                boxShadow: '0 4px 8px rgba(255, 255, 255, 0.3)',
                elevation: 8,
              }}
            >
              <View className="flex-row items-center">
                <Text
                  className="text-indigo-600 font-bold text-lg mr-2"
                  style={[Typography.h3, { lineHeight: 24 }]}
                >
                  Accept
                </Text>
                <Motion.Text
                  className="text-green-500 text-lg"
                  style={{ lineHeight: 24, textAlign: 'center' }}
                  animate={{ 
                    scale: 1.1
                  }}
                  transition={{ 
                    type: 'timing',
                    duration: 2000
                  }}
                >
                  🎯
                </Motion.Text>
              </View>
            </TouchableOpacity>
          </Motion.View>
        </View>
      </LinearGradient>
    </Motion.View>
  );
}
