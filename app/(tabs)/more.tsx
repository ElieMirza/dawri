import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Share, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Fonts, fontFamily } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { useData } from '../../hooks/useData';

export default function MoreScreen() {
  const { t } = useTranslation();
  const { isRTL, language, toggleLanguage, favoriteTeam, setFavoriteTeam } = useApp();
  const { teams } = useData();
  const [showTeams, setShowTeams] = useState(false);

  const ff = (w: 'regular' | 'medium' | 'semibold' | 'bold' | 'display' = 'regular') => ({
    fontFamily: fontFamily(language, w),
  });

  const getTeamName = (teamId: string) => {
    const team = teams.find((tm) => tm.id === teamId);
    if (!team) return '';
    return language === 'ar' ? team.nameAr : team.nameEn;
  };

  const shareApp = async () => {
    const url = 'https://dawri-expo.vercel.app';
    const message =
      language === 'ar'
        ? `تابع الدوري اللبناني لكرة السلة — DAWRI\n${url}`
        : `Follow the Lebanese Basketball League — DAWRI\n${url}`;
    try {
      await Share.share(
        Platform.OS === 'ios'
          ? { message, url, title: 'DAWRI' }
          : { message, title: 'DAWRI' }
      );
    } catch {
      /* user cancelled */
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors.dark.background }]} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.title, ff('display'), isRTL && styles.rtlText]}>{t('more.title')}</Text>
        </View>

        <ScrollView
          style={{ flex: 1, backgroundColor: Colors.dark.background }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Spacing.xxl }}
        >
          {/* Language EN / AR */}
          <View style={styles.langBanner}>
            <Text style={[styles.langBannerLabel, ff('semibold'), isRTL && styles.rtlText]}>
              Language / {t('more.language')} / العربية
            </Text>
            <View style={[styles.langToggleRow, isRTL && styles.rtl]}>
              <Pressable
                style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
                onPress={() => {
                  if (language !== 'en') toggleLanguage();
                }}
              >
                <Text style={[styles.langBtnText, ff('semibold'), language === 'en' && styles.langBtnTextActive]}>
                  English
                </Text>
              </Pressable>
              <Pressable
                style={[styles.langBtn, language === 'ar' && styles.langBtnActive]}
                onPress={() => {
                  if (language !== 'ar') toggleLanguage();
                }}
              >
                <Text
                  style={[
                    styles.langBtnText,
                    { fontFamily: Fonts.arabicBold },
                    language === 'ar' && styles.langBtnTextActive,
                  ]}
                >
                  العربية
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.brandSection}>
            <View style={styles.brandLogo}>
              <Ionicons name="basketball" size={28} color={Colors.dark.primary} />
            </View>
            <Text style={[styles.brandName, ff('display')]}>{language === 'ar' ? 'الدوري' : 'DAWRI'}</Text>
            <Text style={[styles.brandTagline, ff('regular')]}>{t('app.tagline')}</Text>
            <Text style={[styles.version, ff('regular')]}>{t('more.version')} 1.0.0</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, ff('bold'), isRTL && styles.rtlText]}>
              {language === 'ar' ? 'الإعدادات' : 'Settings'}
            </Text>

            {/* Favorite club — inline list (no Alert on web) */}
            <Pressable
              style={[styles.settingRow, isRTL && styles.rtl]}
              onPress={() => setShowTeams((v) => !v)}
            >
              <View style={[styles.settingIcon, { backgroundColor: Colors.dark.primary + '22' }]}>
                <Ionicons name="heart" size={20} color={Colors.dark.primary} />
              </View>
              <View style={[styles.settingContent, isRTL && { alignItems: 'flex-end', marginLeft: 0, marginRight: Spacing.md }]}>
                <Text style={[styles.settingLabel, ff('medium'), isRTL && styles.rtlText]}>{t('more.favoriteTeam')}</Text>
                <Text style={[styles.settingValue, ff('regular'), !favoriteTeam && styles.pickCta, isRTL && styles.rtlText]}>
                  {favoriteTeam ? getTeamName(favoriteTeam) : t('more.pickFavorite')}
                </Text>
              </View>
              <Ionicons name={showTeams ? 'chevron-up' : 'chevron-forward'} size={20} color={Colors.dark.textMuted} />
            </Pressable>

            {showTeams && (
              <View style={styles.teamPicker}>
                <Pressable
                  style={[styles.teamOption, !favoriteTeam && styles.teamOptionActive, isRTL && styles.rtl]}
                  onPress={() => {
                    setFavoriteTeam(null);
                    setShowTeams(false);
                  }}
                >
                  <Text style={[styles.teamOptionText, ff('medium'), !favoriteTeam && styles.teamOptionTextActive]}>
                    {language === 'ar' ? 'لا يوجد' : 'None'}
                  </Text>
                  {!favoriteTeam && <Ionicons name="checkmark" size={18} color={Colors.dark.primary} />}
                </Pressable>
                {teams.map((tm) => {
                  const active = favoriteTeam === tm.id;
                  return (
                    <Pressable
                      key={tm.id}
                      style={[styles.teamOption, active && styles.teamOptionActive, isRTL && styles.rtl]}
                      onPress={() => {
                        setFavoriteTeam(tm.id);
                        setShowTeams(false);
                      }}
                    >
                      <View style={[styles.teamDot, { backgroundColor: tm.colors[0] }]} />
                      <Text
                        style={[
                          styles.teamOptionText,
                          ff('medium'),
                          active && styles.teamOptionTextActive,
                          { flex: 1 },
                          isRTL && styles.rtlText,
                        ]}
                      >
                        {language === 'ar' ? tm.nameAr : tm.nameEn}
                      </Text>
                      {active && <Ionicons name="checkmark" size={18} color={Colors.dark.primary} />}
                    </Pressable>
                  );
                })}
              </View>
            )}

            <View style={[styles.settingRow, isRTL && styles.rtl]}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.dark.warning + '22' }]}>
                <Ionicons name="notifications" size={20} color={Colors.dark.warning} />
              </View>
              <View style={[styles.settingContent, isRTL && { alignItems: 'flex-end', marginLeft: 0, marginRight: Spacing.md }]}>
                <Text style={[styles.settingLabel, ff('medium'), isRTL && styles.rtlText]}>{t('more.notifications')}</Text>
                <Text style={[styles.settingValue, ff('regular'), isRTL && styles.rtlText]}>{t('more.comingSoon')}</Text>
              </View>
              <Switch
                value={false}
                disabled
                trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
              />
            </View>

            <Pressable style={[styles.settingRow, isRTL && styles.rtl]} onPress={shareApp}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.dark.accent + '22' }]}>
                <Ionicons name="share-outline" size={20} color={Colors.dark.accent} />
              </View>
              <View style={[styles.settingContent, isRTL && { alignItems: 'flex-end', marginLeft: 0, marginRight: Spacing.md }]}>
                <Text style={[styles.settingLabel, ff('medium'), isRTL && styles.rtlText]}>{t('more.share')}</Text>
                <Text style={[styles.settingValue, ff('regular'), isRTL && styles.rtlText]}>{t('more.shareHint')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.dark.textMuted} />
            </Pressable>

            <View style={[styles.settingRow, isRTL && styles.rtl]}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.dark.gold + '22' }]}>
                <Ionicons name="calendar-outline" size={20} color={Colors.dark.gold} />
              </View>
              <View style={[styles.settingContent, isRTL && { alignItems: 'flex-end', marginLeft: 0, marginRight: Spacing.md }]}>
                <Text style={[styles.settingLabel, ff('medium'), isRTL && styles.rtlText]}>{t('more.season')}</Text>
                <Text style={[styles.settingValue, ff('regular'), isRTL && styles.rtlText]}>{t('more.dataSource')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, ff('bold'), isRTL && styles.rtlText]}>
              {language === 'ar' ? 'معلومات' : 'Information'}
            </Text>

            <Pressable style={[styles.settingRow, isRTL && styles.rtl]} onPress={() => router.push('/about')}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.dark.primary + '22' }]}>
                <Ionicons name="information-circle" size={20} color={Colors.dark.primary} />
              </View>
              <View style={[styles.settingContent, isRTL && { alignItems: 'flex-end', marginLeft: 0, marginRight: Spacing.md }]}>
                <Text style={[styles.settingLabel, ff('medium'), isRTL && styles.rtlText]}>{t('more.about')}</Text>
                <Text style={[styles.settingValue, ff('regular'), isRTL && styles.rtlText]}>
                  {language === 'ar' ? 'عن الدوري' : 'About DAWRI'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.dark.textMuted} />
            </Pressable>

            <Pressable style={[styles.settingRow, isRTL && styles.rtl]} onPress={() => router.push('/privacy')}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.dark.textMuted + '22' }]}>
                <Ionicons name="shield-checkmark" size={20} color={Colors.dark.textMuted} />
              </View>
              <View style={[styles.settingContent, isRTL && { alignItems: 'flex-end', marginLeft: 0, marginRight: Spacing.md }]}>
                <Text style={[styles.settingLabel, ff('medium'), isRTL && styles.rtlText]}>{t('more.privacy')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.dark.textMuted} />
            </Pressable>

            <View style={[styles.settingRow, isRTL && styles.rtl]}>
              <View style={[styles.settingIcon, { backgroundColor: Colors.dark.gold + '22' }]}>
                <Ionicons name="document-text" size={20} color={Colors.dark.gold} />
              </View>
              <View style={[styles.settingContent, isRTL && { alignItems: 'flex-end', marginLeft: 0, marginRight: Spacing.md }]}>
                <Text style={[styles.settingLabel, ff('medium'), isRTL && styles.rtlText]}>{t('more.dataAttribution')}</Text>
                <Text style={[styles.settingValue, ff('regular'), isRTL && styles.rtlText]}>{t('more.seasonData')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, ff('medium')]}>
              {language === 'ar' ? 'صنع بواسطة إيلي ميرزا' : 'Created by Elie Mirza'}
            </Text>
            <Text style={[styles.footerDisclaimer, ff('regular')]}>
              {language === 'ar'
                ? 'تطبيق للمشجعين. غير تابع للاتحاد اللبناني لكرة السلة.'
                : 'Fan app. Not affiliated with the Lebanese Basketball Federation.'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.dark.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.dark.text,
  },
  rtlText: { textAlign: 'right' },
  rtl: { flexDirection: 'row-reverse' },
  langBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.primary + '55',
  },
  langBannerLabel: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  langToggleRow: { flexDirection: 'row', gap: Spacing.sm },
  langBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  langBtnActive: { backgroundColor: Colors.dark.primary, borderColor: Colors.dark.primary },
  langBtnText: { fontSize: FontSizes.lg, color: Colors.dark.textSecondary },
  langBtnTextActive: { color: '#fff', fontWeight: FontWeights.bold },
  brandSection: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  brandLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  brandName: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.extrabold,
    color: Colors.dark.text,
    letterSpacing: 2,
  },
  brandTagline: { fontSize: FontSizes.sm, color: Colors.dark.textSecondary, marginTop: 4 },
  version: { fontSize: FontSizes.xs, color: Colors.dark.textMuted, marginTop: Spacing.sm },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.dark.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  pickCta: {
    color: Colors.dark.primary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: { flex: 1, marginLeft: Spacing.md },
  settingLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.dark.text },
  settingValue: { fontSize: FontSizes.sm, color: Colors.dark.textSecondary, marginTop: 2 },
  teamPicker: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  teamOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  teamOptionActive: { backgroundColor: Colors.dark.primary + '18' },
  teamOptionText: { fontSize: FontSizes.md, color: Colors.dark.textSecondary },
  teamOptionTextActive: { color: Colors.dark.text, fontWeight: FontWeights.semibold },
  teamDot: { width: 10, height: 10, borderRadius: 5 },
  footer: { alignItems: 'center', paddingVertical: Spacing.xl, paddingHorizontal: Spacing.lg },
  footerText: { fontSize: FontSizes.sm, color: Colors.dark.textSecondary, fontWeight: FontWeights.medium },
  footerDisclaimer: {
    fontSize: FontSizes.xs,
    color: Colors.dark.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 18,
  },
});
