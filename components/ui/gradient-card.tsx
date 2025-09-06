import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientCardProps {
  children: React.ReactNode;
  gradient?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  className?: string;
  glassmorphism?: boolean;
}

export function GradientCard({
  children,
  gradient = ['#6366f1', '#a855f7'] as const,
  style,
  className = '',
  glassmorphism = false,
}: GradientCardProps) {
  if (glassmorphism) {
    return (
      <View
        className={`rounded-3xl overflow-hidden ${className}`}
        style={[
          {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={`rounded-3xl overflow-hidden ${className}`}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}
