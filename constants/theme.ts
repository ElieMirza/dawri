import { Platform } from 'react-native';

export const Colors = {
  dark: {
    background: '#0a0a0f',
    surface: '#12121a',
    surfaceElevated: '#1a1a24',
    card: '#1e1e2a',
    cardHighlight: '#252532',
    // Cedar / brick — Lebanese brand primary (not neon emerald)
    primary: '#00B36B',
    primaryLight: '#00D47E',
    secondary: '#ffd700',
    accent: '#4a9eff',
    text: '#ffffff',
    textSecondary: '#b8b8c8',
    textMuted: '#8a8a9a',
    border: '#2a2a3a',
    borderLight: '#3a3a4a',
    // ONE muted green reserved for earned / attended points only
    success: '#00B36B',
    earned: '#00B36B',
    warning: '#ffc107',
    error: '#ff5252',
    riyadi: '#006633',
    sagesse: '#00843D',
    gold: '#ffd700',
    gradientStart: '#0a0a0f',
    gradientMid: '#1a100e',
    gradientEnd: '#0a0a0f',
  },
};

export const Fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
  display: 'SpaceGrotesk_700Bold',
  displayMedium: 'SpaceGrotesk_500Medium',
  arabic: 'NotoSansArabic_400Regular',
  arabicMedium: 'NotoSansArabic_500Medium',
  arabicBold: 'NotoSansArabic_700Bold',
};

/** Pick Inter/SpaceGrotesk or Noto Sans Arabic based on language */
export function fontFamily(
  language: 'en' | 'ar',
  weight: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'display' = 'regular'
): string {
  if (language === 'ar') {
    if (weight === 'bold' || weight === 'extrabold' || weight === 'display' || weight === 'semibold') {
      return Fonts.arabicBold;
    }
    if (weight === 'medium') return Fonts.arabicMedium;
    return Fonts.arabic;
  }
  switch (weight) {
    case 'medium': return Fonts.medium;
    case 'semibold': return Fonts.semibold;
    case 'bold': return Fonts.bold;
    case 'extrabold': return Fonts.extrabold;
    case 'display': return Fonts.display;
    default: return Fonts.regular;
  }
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

const createShadow = (
  color: string,
  offsetY: number,
  opacity: number,
  radius: number,
  elevation: number
) => {
  if (Platform.OS === 'web') {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return {
      boxShadow: `0px ${offsetY}px ${radius}px rgba(${r}, ${g}, ${b}, ${opacity})`,
    };
  }
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
};

export const Shadows = {
  sm: createShadow('#000000', 2, 0.25, 4, 2),
  md: createShadow('#000000', 4, 0.3, 8, 4),
  lg: createShadow('#000000', 8, 0.35, 16, 8),
  glow: createShadow('#A63D2F', 0, 0.45, 12, 6),
};

export const TierColors = {
  fan: '#8a8a9a',
  regular: '#4a9eff',
  ultra: '#ffd700',
  legend: '#ff6b35',
};

export const TierThresholds = {
  fan: 0,
  regular: 3,
  ultra: 10,
  legend: 25,
};

/** Safe date display — never returns "Invalid Date" */
export function formatSafeDate(
  dateStr: string | undefined | null,
  locale: string,
  opts?: Intl.DateTimeFormatOptions
): string {
  if (!dateStr || dateStr === 'unknown' || dateStr === 'TBD' || dateStr === 'n/a') {
    return locale.startsWith('ar') ? 'تاريخ غير معروف' : 'Date TBA';
  }
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    return locale.startsWith('ar') ? 'تاريخ غير معروف' : 'Date TBA';
  }
  return d.toLocaleDateString(
    locale,
    opts ?? { month: 'short', day: 'numeric', year: 'numeric' }
  );
}
