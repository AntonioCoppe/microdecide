import React, { useRef, useState } from 'react';
import { View, Text, PanResponder, Animated, Dimensions, ViewStyle } from 'react-native';
import { Motion } from '@legendapp/motion';
import * as Haptics from 'expo-haptics';
import { DecisionCard } from './decision-card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

// Note: Removed nativewind styled to avoid TS errors in some environments

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  style?: ViewStyle;
  className?: string;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  style,
  className = '',
}: SwipeableCardProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, gestureState) => {
        setIsDragging(false);

        const { dx, dy } = gestureState;

        // Check if swipe is significant enough
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          const direction = dx > 0 ? 'right' : 'left';

          // Trigger haptic feedback
          if (direction === 'right') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onSwipeRight?.();
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            onSwipeLeft?.();
          }

          // Animate card off screen
          Animated.spring(pan, {
            toValue: {
              x: direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH,
              y: dy,
            },
            useNativeDriver: false,
          }).start(() => {
            // Reset position after animation
            pan.setValue({ x: 0, y: 0 });
          });
        } else {
          // Return to original position
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const getCardStyle = () => {
    const rotate = pan.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['-30deg', '0deg', '30deg'],
    });

    return {
      transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
    };
  };

  const getOverlayStyle = () => {
    return {
      opacity: pan.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [0.8, 0, 0.8],
      }),
    };
  };

  return (
    <View className={`relative ${className}`} style={style}>
      {/* Background overlays for swipe feedback */}
      <View className="absolute inset-0 items-center justify-center">
        <Animated.View
          className="absolute inset-0 bg-red-500 rounded-3xl items-center justify-center"
          style={[
            getOverlayStyle(),
            {
              opacity: pan.x.interpolate({
                inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                outputRange: [0.8, 0, 0],
              }),
            },
          ]}
        >
          <Text className="text-6xl text-white" style={{ lineHeight: 72, textAlign: 'center' }}>👎</Text>
        </Animated.View>

        <Animated.View
          className="absolute inset-0 bg-green-500 rounded-3xl items-center justify-center"
          style={[
            getOverlayStyle(),
            {
              opacity: pan.x.interpolate({
                inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
                outputRange: [0, 0, 0.8],
              }),
            },
          ]}
        >
          <Text className="text-6xl text-white" style={{ lineHeight: 72, textAlign: 'center' }}>👍</Text>
        </Animated.View>
      </View>

      {/* Swipeable card */}
      <Animated.View
        {...panResponder.panHandlers}
        style={getCardStyle()}
        className="z-10"
      >
        {children}
      </Animated.View>
    </View>
  );
}
