import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { setStoredLanguage } from '@/i18n';

export default function MoreScreen() {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const toggleLanguage = useCallback(async () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    await setStoredLanguage(newLang);
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
  }, [currentLang, i18n]);

  const setLanguage = useCallback(async (lang: string) => {
    await setStoredLanguage(lang);
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
  }, [i18n]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('more.title')}</Text>

        {/* Language Toggle Banner - TOP OF SCREEN */}
        <View style={styles.languageBanner}>
          <View style={styles.languageHeader}>
            <Ionicons name="language" size={24} color={Colors.dark.primary} />
            <Text style={styles.languageTitle}>{t('more.language')}</Text>
          </View>
          <View style={styles.languageToggle}>
            <Pressable
              style={[styles.langButton, currentLang === 'en' && styles.langButtonActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.langButtonText, currentLang === 'en' && styles.langButtonTextActive]}>
                English
              </Text>
            </Pressable>
            <Pressable
              style={[styles.langButton, currentLang === 'ar' && styles.langButtonActive]}
              onPress={() => setLanguage('ar')}
            >
              <Text style={[styles.langButtonText, styles.langButtonTextAr, currentLang === 'ar' && styles.langButtonTextActive]}>
                العربية
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={styles.sectionTitle}>{t('more.title')}</Text>

        <Link href="/(tabs)/standings" asChild>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="heart" size={20} color={Colors.dark.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{t('more.favoriteTeam')}</Text>
              <Text style={styles.menuSubtitle}>{t('home.selectTeam')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.dark.textMuted} />
          </Pressable>
        </Link>

        <Pressable style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Ionicons name="notifications" size={20} color={Colors.dark.accent} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>{t('more.notifications')}</Text>
            <Text style={styles.menuSubtitle}>{t('more.comingSoon')}</Text>
          </View>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Soon</Text>
          </View>
        </Pressable>

        {/* Info Section */}
        <Text style={styles.sectionTitle}>Info</Text>

        <Link href="/about" asChild>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="information-circle" size={20} color={Colors.dark.textSecondary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{t('more.about')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.dark.textMuted} />
          </Pressable>
        </Link>

        <Link href="/privacy" asChild>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.dark.textSecondary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{t('more.privacy')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.dark.textMuted} />
          </Pressable>
        </Link>

        <Pressable style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Ionicons name="document-text" size={20} color={Colors.dark.textSecondary} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>{t('more.dataAttribution')}</Text>
            <Text style={styles.menuSubtitle}>{t('more.seasonData')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.dark.textMuted} />
        </Pressable>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionLabel}>{t('more.version')}</Text>
          <Text style={styles.versionValue}>1.0.0</Text>
        </View>

        <Text style={styles.attribution}>{t('about.disclaimer')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  title: {
    color: Colors.dark.text,
    fontSize: FontSizes.xxl,
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: Spacing.lg,
  },
  languageBanner: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  languageTitle: {
    color: Colors.dark.text,
    fontSize: FontSizes.lg,
    fontFamily: 'Inter_600SemiBold',
  },
  languageToggle: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  langButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  langButtonActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primaryLight,
  },
  langButtonText: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_600SemiBold',
  },
  langButtonTextAr: {
    fontFamily: 'NotoSansArabic_600SemiBold',
  },
  langButtonTextActive: {
    color: Colors.dark.text,
  },
  sectionTitle: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  menuItem: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_500Medium',
  },
  menuSubtitle: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
  },
  comingSoonBadge: {
    backgroundColor: Colors.dark.surfaceElevated,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  comingSoonText: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_500Medium',
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginTop: Spacing.md,
  },
  versionLabel: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
  },
  versionValue: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
  },
  attribution: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
});
