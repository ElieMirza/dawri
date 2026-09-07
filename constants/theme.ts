export const Colors = {
  dark: {
    background: '#0a0a0f',
    surface: '#12121a',
    surfaceElevated: '#1a1a24',
    card: '#1e1e2a',
    cardHighlight: '#252532',
    primary: '#00b36b',
    primaryLight: '#00d47e',
    secondary: '#ffd700',
    accent: '#4a9eff',
    text: '#ffffff',
    textSecondary: '#a0a0b0',
    textMuted: '#6b6b7b',
    border: '#2a2a3a',
    borderLight: '#3a3a4a',
    success: '#00c853',
    warning: '#ffc107',
    error: '#ff5252',
    riyadi: '#006633',
    sagesse: '#00843D',
    gold: '#ffd700',
    gradientStart: '#0a0a0f',
    gradientMid: '#0d1a12',
    gradientEnd: '#0a0a0f',
  },
};

export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const BorderRadius = { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 };
export const FontSizes = { xs: 10, sm: 12, md: 14, lg: 16, xl: 20, xxl: 24, xxxl: 32, hero: 40 };
export const FontWeights = { regular: '400' as const, medium: '500' as const, semibold: '600' as const, bold: '700' as const, extrabold: '800' as const };

import { Platform } from 'react-native';
const createShadow = (color: string, offsetY: number, opacity: number, radius: number, elevation: number) => {
  if (Platform.OS === 'web') {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return { boxShadow: `0px ${offsetY}px ${radius}px rgba(${r}, ${g}, ${b}, ${opacity})` };
  }
  return { shadowColor: color, shadowOffset: { width: 0, height: offsetY }, shadowOpacity: opacity, shadowRadius: radius, elevation };
};
export const Shadows = {
  sm: createShadow('#000000', 2, 0.25, 4, 2),
  md: createShadow('#000000', 4, 0.3, 8, 4),
  lg: createShadow('#000000', 8, 0.35, 16, 8),
  glow: createShadow('#00b36b', 0, 0.5, 12, 6),
};
export const TierColors = { fan: '#6b6b7b', regular: '#4a9eff', ultra: '#ffd700', legend: '#ff6b35' };
export const TierThresholds = { fan: 0, regular: 3, ultra: 10, legend: 25 };
