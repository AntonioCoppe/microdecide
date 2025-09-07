/**
 * Consistent spacing system based on 8pt grid
 * All spacing values should be multiples of 8 for visual consistency
 */

export const Spacing = {
  // Base unit (8pt)
  xs: 4,    // 0.5x base
  sm: 8,    // 1x base
  md: 16,   // 2x base
  lg: 24,   // 3x base
  xl: 32,   // 4x base
  xxl: 40,  // 5x base
  xxxl: 48, // 6x base
  
  // Specific use cases
  container: 24,     // Standard container padding
  section: 32,       // Section spacing
  card: 24,          // Card internal padding
  button: 16,        // Button padding
  icon: 48,          // Icon container size
  
  // Line heights (consistent text spacing)
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
  
  // Border radius (also follows 8pt grid)
  radius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
} as const;

export type SpacingKey = keyof typeof Spacing;
