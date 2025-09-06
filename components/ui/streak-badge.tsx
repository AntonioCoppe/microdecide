import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { Motion } from '@legendapp/motion';
import LottieView from 'lottie-react-native';
import { Colors } from '../../constants/Colors';


interface StreakBadgeProps {
  count: number;
  animated?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function StreakBadge({
  count,
  animated = true,
  size = 'medium',
  className = '',
}: StreakBadgeProps) {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (animated && count > 0) {
      animationRef.current?.play();
    }
  }, [count, animated]);

  const getSize = () => {
    switch (size) {
      case 'small':
        return { container: 'w-16 h-16', text: 'text-lg', icon: 'text-2xl' };
      case 'large':
        return { container: 'w-24 h-24', text: 'text-3xl', icon: 'text-4xl' };
      default:
        return { container: 'w-20 h-20', text: 'text-2xl', icon: 'text-3xl' };
    }
  };

  const sizeStyles = getSize();

  return (
    <Motion.View
      className={`bg-gradient-to-r from-red-500 to-orange-500 rounded-full items-center justify-center shadow-lg ${sizeStyles.container} ${className}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', damping: 15, stiffness: 300 }}
    >
      <Text className={`${sizeStyles.icon} mb-1`}>
        🔥
      </Text>
      <Text
        className={`${sizeStyles.text} font-bold text-white`}
      >
        {count}
      </Text>

      {/* Flame animation overlay */}
      {animated && (
        <View className="absolute inset-0">
          <LottieView
            ref={animationRef}
            source={require('../../assets/animations/flame.json')}
            autoPlay={false}
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      )}
    </Motion.View>
  );
}
