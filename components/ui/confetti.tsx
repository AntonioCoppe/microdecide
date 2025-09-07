import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { Motion } from '@legendapp/motion';

interface ConfettiPiece {
  id: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  emoji?: string;
}

interface ConfettiProps {
  active?: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  emojis?: string[];
  onComplete?: () => void;
  style?: 'celebration' | 'success' | 'burst' | 'rain';
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const DEFAULT_COLORS = [
  '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'
];

const SUCCESS_EMOJIS = ['🎉', '🎊', '⭐', '✨', '💫', '🌟', '🎆', '🎯'];

export function Confetti({
  active = false,
  duration = 3000,
  particleCount = 50,
  colors = DEFAULT_COLORS,
  emojis = SUCCESS_EMOJIS,
  onComplete,
  style = 'celebration',
}: ConfettiProps) {
  const [particles, setParticles] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (active && !isActive) {
      setIsActive(true);
      generateParticles();
      
      const timeout = setTimeout(() => {
        setIsActive(false);
        setParticles([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [active]);

  const generateParticles = () => {
    const newParticles: ConfettiPiece[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: `particle-${i}`,
        x: getInitialX(style),
        y: getInitialY(style),
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        emoji: Math.random() > 0.7 ? emojis[Math.floor(Math.random() * emojis.length)] : undefined,
      });
    }
    
    setParticles(newParticles);
  };

  const getInitialX = (animationStyle: string) => {
    switch (animationStyle) {
      case 'burst':
        return screenWidth / 2;
      case 'rain':
        return Math.random() * screenWidth;
      default:
        return Math.random() * screenWidth;
    }
  };

  const getInitialY = (animationStyle: string) => {
    switch (animationStyle) {
      case 'burst':
        return screenHeight / 2;
      case 'rain':
        return -50;
      default:
        return -50;
    }
  };

  const getAnimationConfig = (particle: ConfettiPiece, index: number) => {
    const delay = (index * 50) / particleCount; // Stagger the animations
    
    switch (style) {
      case 'burst':
        const angle = (index / particleCount) * Math.PI * 2;
        const distance = 150 + Math.random() * 100;
        return {
          initial: { 
            x: particle.x, 
            y: particle.y, 
            scale: 0, 
            rotate: 0,
            opacity: 1 
          },
          animate: {
            x: particle.x + Math.cos(angle) * distance,
            y: particle.y + Math.sin(angle) * distance + 200,
            scale: [0, 1, 0.8, 0],
            rotate: particle.rotation + 720,
            opacity: [1, 1, 0.5, 0],
          },
          transition: {
            type: 'spring',
          },
        };
        
      case 'rain':
        return {
          initial: { 
            x: particle.x, 
            y: particle.y, 
            scale: 0, 
            rotate: 0,
            opacity: 1 
          },
          animate: {
            x: particle.x + (Math.random() - 0.5) * 100,
            y: screenHeight + 50,
            scale: [0, 1, 1],
            rotate: particle.rotation + 360,
            opacity: [0, 1, 0],
          },
          transition: {
            type: 'spring',
          },
        };
        
      default: // celebration
        return {
          initial: { 
            x: particle.x, 
            y: particle.y, 
            scale: 0, 
            rotate: 0,
            opacity: 1 
          },
          animate: {
            x: particle.x + (Math.random() - 0.5) * 200,
            y: screenHeight + 50,
            scale: [0, 1, 1, 0],
            rotate: particle.rotation + (Math.random() > 0.5 ? 360 : -360),
            opacity: [0, 1, 1, 0],
          },
          transition: {
            type: 'spring',
          },
        };
    }
  };

  if (!isActive) return null;

  return (
    <View 
      className="absolute inset-0 z-50"
      style={{ 
        width: screenWidth, 
        height: screenHeight,
        pointerEvents: 'none'
      }}
    >
      {particles.map((particle, index) => (
        <Motion.View
          key={particle.id}
          className="absolute"
          initial={{ 
            x: particle.x, 
            y: particle.y, 
            scale: 0, 
            opacity: 1 
          }}
          animate={{
            y: screenHeight + 50,
            scale: 0.8,
            opacity: 0,
          }}
          transition={{ type: 'spring' }}
        >
          {particle.emoji ? (
            <Motion.Text 
              className="text-2xl"
              style={{ fontSize: particle.size + 8 }}
            >
              {particle.emoji}
            </Motion.Text>
          ) : (
            <View
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                borderRadius: particle.size / 2,
              }}
            />
          )}
        </Motion.View>
      ))}
    </View>
  );
}

// Preset configurations
export const ConfettiPresets = {
  success: {
    style: 'celebration' as const,
    colors: ['#32D74B', '#30D158', '#34C759'],
    emojis: ['🎉', '✅', '💚', '🌟'],
    duration: 2000,
  },
  decision: {
    style: 'burst' as const,
    colors: ['#FFD700', '#FFA500', '#FF6B6B'],
    emojis: ['🎯', '⚡', '✨', '🔥'],
    duration: 1500,
  },
  milestone: {
    style: 'rain' as const,
    colors: ['#AF52DE', '#BF5AF2', '#9D50E0'],
    emojis: ['🏆', '👑', '💎', '🎖️'],
    duration: 3000,
    particleCount: 30,
  },
};
