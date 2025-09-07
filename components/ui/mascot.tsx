import React, { useEffect } from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Motion } from '@legendapp/motion';
import { Typography } from '../../constants/Colors';

type MascotMood = 'happy' | 'excited' | 'thinking' | 'celebrating' | 'encouraging' | 'wise';
type MascotSize = 'small' | 'medium' | 'large' | 'hero';

interface MascotProps {
  mood?: MascotMood;
  size?: MascotSize;
  message?: string;
  showBubble?: boolean;
  animated?: boolean;
  className?: string;
  style?: ViewStyle;
  onAnimationComplete?: () => void;
}

interface MoodConfig {
  emoji: string;
  color: string;
  bounce?: boolean;
  pulse?: boolean;
  sparkles?: boolean;
  confetti?: boolean;
}

const MASCOT_CONFIG = {
  moods: {
    happy: { emoji: '😊', color: '#FFD700', bounce: true } as MoodConfig,
    excited: { emoji: '🎉', color: '#FF6B6B', bounce: true, sparkles: true } as MoodConfig,
    thinking: { emoji: '🤔', color: '#4ECDC4', pulse: true } as MoodConfig,
    celebrating: { emoji: '🎊', color: '#FF9500', bounce: true, confetti: true } as MoodConfig,
    encouraging: { emoji: '💪', color: '#32D74B', pulse: true } as MoodConfig,
    wise: { emoji: '🧠', color: '#AF52DE', pulse: true } as MoodConfig,
  },
  sizes: {
    small: { container: 'w-12 h-12', emoji: 'text-2xl', bubble: 'text-xs p-2' },
    medium: { container: 'w-16 h-16', emoji: 'text-3xl', bubble: 'text-sm p-3' },
    large: { container: 'w-24 h-24', emoji: 'text-5xl', bubble: 'text-base p-4' },
    hero: { container: 'w-32 h-32', emoji: 'text-7xl', bubble: 'text-lg p-5' },
  },
};

export function Mascot({
  mood = 'happy',
  size = 'medium',
  message,
  showBubble = true,
  animated = true,
  className = '',
  style,
  onAnimationComplete,
}: MascotProps) {
  const moodConfig = MASCOT_CONFIG.moods[mood];
  const sizeConfig = MASCOT_CONFIG.sizes[size];

  useEffect(() => {
    if (animated && moodConfig.bounce) {
      // Trigger bounce animation
      setTimeout(() => {
        onAnimationComplete?.();
      }, 1000);
    }
  }, [mood, animated]);

  const getAnimationVariants = () => {
    if (!animated) return {};
    
    if (moodConfig.bounce) {
      return {
        initial: { scale: 0.8, y: 0 },
        animate: { 
          scale: 1, 
          y: -4,
        },
          transition: { 
            type: 'timing',
            duration: 600, 
          },
      };
    }
    
    if (moodConfig.pulse) {
      return {
        initial: { scale: 1 },
        animate: { scale: 1.05 },
        transition: { 
          type: 'timing',
          duration: 2000, 
        },
      };
    }
    
    return {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { duration: 0.5 },
    };
  };

  return (
    <View className={className} style={style}>
      {/* Speech Bubble */}
      {message && showBubble && (
        <Motion.View
          className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 relative ${
            size === 'hero' ? 'mb-12' : size === 'large' ? 'mb-10' : 'mb-8'
          }`}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring' }}
        >
          <View className={`${sizeConfig.bubble}`} style={{ paddingHorizontal: size === 'hero' ? 24 : size === 'large' ? 20 : 16, paddingVertical: size === 'hero' ? 20 : size === 'large' ? 16 : 12 }}>
            <Text 
              className="text-gray-700 font-semibold text-center"
              style={[Typography.body, { 
                lineHeight: size === 'hero' ? 28 : size === 'large' ? 24 : 20,
                fontSize: size === 'hero' ? 18 : size === 'large' ? 16 : 14
              }]}
            >
              {message}
            </Text>
          </View>
          {/* Speech bubble tail */}
          <View className="absolute -bottom-1 left-1/2" style={{ marginLeft: -8, zIndex: -1 }}>
            <View 
              className="w-4 h-4 bg-white/95 border-r border-b border-white/20" 
              style={{ transform: [{ rotate: '45deg' }] }}
            />
          </View>
        </Motion.View>
      )}

      {/* Mascot Container */}
      <View className="items-center">
        <Motion.View
          className={`${sizeConfig.container} rounded-full items-center justify-center relative`}
          style={{
            backgroundColor: moodConfig.color + '20',
            borderColor: moodConfig.color,
            borderWidth: 3,
            boxShadow: `0 4px 8px ${moodConfig.color}4D`,
            elevation: 8,
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}
        >
          <Text 
            className={sizeConfig.emoji}
            style={{ 
              textAlign: 'center',
              lineHeight: size === 'hero' ? 128 : size === 'large' ? 96 : size === 'medium' ? 64 : 48,
              textAlignVertical: 'center'
            }}
          >
            {moodConfig.emoji}
          </Text>
          
          {/* Sparkles Effect for Excited/Celebrating - using simple emoji instead of Lottie */}
          {animated && (moodConfig.sparkles || moodConfig.confetti) && (
            <View className="absolute inset-0 pointer-events-none">
              <Motion.Text
                className="absolute -top-2 -right-2 text-yellow-300 text-lg"
                animate={{ 
                  scale: [1, 1.2, 1, 1.2, 1],
                  rotate: [0, 10, -10, 10, 0]
                }}
                transition={{ 
                  type: 'timing',
                  duration: 4000
                }}
              >
                ✨
              </Motion.Text>
              <Motion.Text
                className="absolute -bottom-2 -left-2 text-blue-300 text-lg"
                animate={{ 
                  scale: [1, 1.1, 1, 1.1, 1],
                  rotate: [0, -10, 10, -10, 0]
                }}
                transition={{ 
                  type: 'timing',
                  duration: 4000,
                  delay: 1000
                }}
              >
                💫
              </Motion.Text>
            </View>
          )}
        </Motion.View>
        
        {/* Floating Hearts for Happy Mood */}
        {animated && mood === 'happy' && (
          <View className="absolute -top-2 -right-2">
            <Motion.Text
              className="text-red-400 text-lg"
              initial={{ scale: 0 }}
              animate={{ 
                scale: 0.8, 
                y: -10
              }}
              transition={{ type: 'spring' }}
            >
              💖
            </Motion.Text>
          </View>
        )}
      </View>
    </View>
  );
}

// Preset configurations for common use cases
export const MascotPresets = {
  welcome: {
    mood: 'excited' as MascotMood,
    size: 'hero' as MascotSize,
    message: "Hey there! I'm your decision buddy! 🎯 Ready to make some smart choices together?",
  },
  encouraging: {
    mood: 'encouraging' as MascotMood,
    size: 'medium' as MascotSize,
    message: "You're doing great! Every small decision adds up to big changes! 💪",
  },
  celebrating: {
    mood: 'celebrating' as MascotMood,
    size: 'large' as MascotSize,
    message: "Woohoo! Another win in the books! You're on fire! 🔥",
  },
  thinking: {
    mood: 'thinking' as MascotMood,
    size: 'medium' as MascotSize,
    message: "Hmm, let me find the perfect decision for you... 🤔",
  },
  wise: {
    mood: 'wise' as MascotMood,
    size: 'medium' as MascotSize,
    message: "Pro tip: Small actions create big transformations! 🧠",
  },
};
