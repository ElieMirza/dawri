import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Share, Platform, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Fonts, fontFamily, formatSafeDate } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { useData, Season } from '../../hooks/useData';

export default function MoreScreen() {
  const { t } = useTranslation();
  const { isRTL, language, toggleLanguage, favoriteTeam, setFavoriteTeam, selectedSeason, setSelectedSeason } = useApp();
  const { teams, cedars, availableSeasons, has2425Data } = useData(selectedSeason);
  const [showTeams, setShowTeams] = useState(false);
  const [showSeasons, setShowSeasons] = useState(false);

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

  const formatEventDate = (dateStr: string) => {
    return formatSafeDate(dateStr, language === 'ar' ? 'ar-LB' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getSeasonLabel = (season: Season) => {
    if (season === '2025-26') {
      return language === 'ar' ? '2025-26 (الموسم الحالي)' : '2025-26 (Current)';
    }
    return language === 'ar' ? '2024-25 (أرشيف API)' : '2024-25 (API Archive)';
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

          {/* Cedars National Team Section */}
          {cedars?.team && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, ff('bold'), isRTL && styles.rtlText]}>
                {language === 'ar' ? '🇱🇧 منتخب الأرز' : '🇱🇧 Cedars Corner'}
              </Text>
              
              <View style={styles.cedarsCard}>
                <View style={[styles.cedarsHeader, isRTL && styles.rtl]}>
                  {cedars.team.badge && (
                    <Image 
                      source={{ uri: cedars.team.badge }} 
                      style={styles.cedarsBadge}
                      resizeMode="contain"
                    />
                  )}
                  <View style={[styles.cedarsInfo, isRTL && { alignItems: 'flex-end' }]}>
                    <Text style={[styles.cedarsName, ff('bold'), isRTL && styles.rtlText]}>
                      {language === 'ar' ? 'منتخب لبنان لكرة السلة' : 'Lebanon Basketball'}
                    </Text>
                    <Text style={[styles.cedarsLeague, ff('regular'), isRTL && styles.rtlText]}>
                      {cedars.team.league}
                    </Text>
                  </View>
                </View>

                {cedars.events.upcoming.length > 0 && (
                  <View style={styles.cedarsEventSection}>
                    <Text style={[styles.cedarsEventTitle, ff('semibold'), isRTL && styles.rtlText]}>
                      {language === 'ar' ? 'القادم' : 'Upcoming'}
                    </Text>
                    {cedars.events.upcoming.slice(0, 2).map((event) => (
                      <View key={event.id} style={[styles.cedarsEvent, isRTL && styles.rtl]}>
                        <View style={styles.cedarsEventDate}>
                          <Text style={[styles.cedarsEventDateText, ff('medium')]}>
                            {formatEventDate(event.date)}
                          </Text>
                        </View>
                        <View style={[styles.cedarsEventDetails, isRTL && { alignItems: 'flex-end' }]}>
                          <Text style={[styles.cedarsEventTeams, ff('semibold'), isRTL && styles.rtlText]}>
                            {event.homeTeam} vs {event.awayTeam}
                          </Text>
                          <Text style={[styles.cedarsEventLeague, ff('regular'), isRTL && styles.rtlText]}>
                            {event.league}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {cedars.events.past.length > 0 && (
                  <View style={styles.cedarsEventSection}>
                    <Text style={[styles.cedarsEventTitle, ff('semibold'), isRTL && styles.rtlText]}>
                      {language === 'ar' ? 'النتائج' : 'Recent Results'}
                    </Text>
                    {cedars.events.past.slice(0, 2).map((event) => (
                      <View key={event.id} style={[styles.cedarsEvent, isRTL && styles.rtl]}>
                        <View style={styles.cedarsEventDate}>
                          <Text style={[styles.cedarsEventDateText, ff('medium')]}>
                            {formatEventDate(event.date)}
                          </Text>
                        </View>
                        <View style={[styles.cedarsEventDetails, isRTL && { alignItems: 'flex-end' }]}>
                          <Text style={[styles.cedarsEventTeams, ff('semibold'), isRTL && styles.rtlText]}>
                            {event.homeTeam} {event.homeScore} - {event.awayScore} {event.awayTeam}
                          </Text>
                          <Text style={[styles.cedarsEventLeague, ff('regular'), isRTL && styles.rtlText]}>
                            {event.league}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {cedars.roster.length > 0 && (
                  <View style={styles.cedarsRosterPreview}>
                    <Text style={[styles.cedarsRosterTitle, ff('medium'), isRTL && styles.rtlText]}>
                      {language === 'ar' ? 'لاعب مميز' : 'Featured Player'}
                    </Text>
                    {cedars.roster.slice(0, 1).map((player) => (
                      <View key={player.id} style={[styles.cedarsPlayer, isRTL && styles.rtl]}>
                        {player.thumb && (
                          <Image 
                            source={{ uri: player.thumb }} 
                            style={styles.cedarsPlayerThumb}
                          />
                        )}
                        <View style={[styles.cedarsPlayerInfo, isRTL && { alignItems: 'flex-end' }]}>
                          <Text style={[styles.cedarsPlayerName, ff('semibold'), isRTL && styles.rtlText]}>
                            {player.name}
                          </Text>
                          <Text style={[styles.cedarsPlayerPos, ff('regular'), isRTL && styles.rtlText]}>
                            {player.position} {player.number ? `#${player.number}` : ''}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <Text style={[styles.cedarsNote, ff('regular')]}>
                  {language === 'ar' 
                    ? 'البيانات من TheSportsDB • قد لا تكون قائمة اللاعبين كاملة'
                    : 'Data from TheSportsDB • Roster may be incomplete'}
                </Text>
              </View>
            </View>
          )}

          {/* Season Toggle */}
          {availableSeasons.length > 1 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, ff('bold'), isRTL && styles.rtlText]}>
                {language === 'ar' ? 'بيانات الموسم' : 'Season Data'}
              </Text>
              
              <Pressable
                style={[styles.settingRow, isRTL && styles.rtl]}
                onPress={() => setShowSeasons((v) => !v)}
              >
                <View style={[styles.settingIcon, { backgroundColor: Colors.dark.gold + '22' }]}>
                  <Ionicons name="time" size={20} color={Colors.dark.gold} />
                </View>
                <View style={[styles.settingContent, isRTL && { alignItems: 'flex-end', marginLeft: 0, marginRight: Spacing.md }]}>
                  <Text style={[styles.settingLabel, ff('medium'), isRTL && styles.rtlText]}>
                    {language === 'ar' ? 'الموسم المحدد' : 'Selected Season'}
                  </Text>
                  <Text style={[styles.settingValue, ff('regular'), isRTL && styles.rtlText]}>
                    {getSeasonLabel(selectedSeason)}
                  </Text>
                </View>
                <Ionicons name={showSeasons ? 'chevron-up' : 'chevron-forward'} size={20} color={Colors.dark.textMuted} />
              </Pressable>

              {showSeasons && (
                <View style={styles.teamPicker}>
                  {availableSeasons.map((s) => {
                    const active = selectedSeason === s;
                    return (
                      <Pressable
                        key={s}
                        style={[styles.teamOption, active && styles.teamOptionActive, isRTL && styles.rtl]}
                        onPress={() => {
                          setSelectedSeason(s);
                          setShowSeasons(false);
                        }}
                      >
                        <View style={[styles.teamDot, { backgroundColor: s === '2025-26' ? Colors.dark.primary : Colors.dark.gold }]} />
                        <Text
                          style={[
                            styles.teamOptionText,
                            ff('medium'),
                            active && styles.teamOptionTextActive,
                            { flex: 1 },
                            isRTL && styles.rtlText,
                          ]}
                        >
                          {getSeasonLabel(s)}
                        </Text>
                        {active && <Ionicons name="checkmark" size={18} color={Colors.dark.primary} />}
                      </Pressable>
                    );
                  })}
                </View>
              )}

              <View style={styles.seasonNote}>
                <Ionicons name="information-circle-outline" size={16} color={Colors.dark.textMuted} />
                <Text style={[styles.seasonNoteText, ff('regular'), isRTL && styles.rtlText]}>
                  {language === 'ar' 
                    ? '2025-26 من ملف محلي • 2024-25 من API-Sports'
                    : '2025-26 from seed file • 2024-25 from API-Sports'}
                </Text>
              </View>
            </View>
          )}

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
  // Cedars section styles
  cedarsCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  cedarsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  cedarsBadge: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  cedarsInfo: {
    flex: 1,
  },
  cedarsName: {
    fontSize: FontSizes.lg,
    color: Colors.dark.text,
  },
  cedarsLeague: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  cedarsEventSection: {
    marginBottom: Spacing.md,
  },
  cedarsEventTitle: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  cedarsEvent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  cedarsEventDate: {
    minWidth: 80,
  },
  cedarsEventDateText: {
    fontSize: FontSizes.xs,
    color: Colors.dark.textMuted,
  },
  cedarsEventDetails: {
    flex: 1,
  },
  cedarsEventTeams: {
    fontSize: FontSizes.md,
    color: Colors.dark.text,
  },
  cedarsEventLeague: {
    fontSize: FontSizes.xs,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  cedarsRosterPreview: {
    marginBottom: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  cedarsRosterTitle: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  cedarsPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cedarsPlayerThumb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.surfaceElevated,
  },
  cedarsPlayerInfo: {
    flex: 1,
  },
  cedarsPlayerName: {
    fontSize: FontSizes.md,
    color: Colors.dark.text,
  },
  cedarsPlayerPos: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  cedarsNote: {
    fontSize: FontSizes.xs,
    color: Colors.dark.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  },
  // Season toggle styles
  seasonNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.xs,
  },
  seasonNoteText: {
    fontSize: FontSizes.xs,
    color: Colors.dark.textMuted,
    flex: 1,
  },
});
