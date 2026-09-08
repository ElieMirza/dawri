import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows, Fonts, TierColors, formatSafeDate } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { useData } from '../../hooks/useData';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { favoriteTeam, points, getTier, getTierProgress, isRTL, language } = useApp();
  const { teams, finals, getTeam, allGames } = useData();
  const tier = getTier();
  const tierProgress = getTierProgress();

  const championTeam = getTeam('riyadi');
  const game7 = finals?.games?.[6];
  const favoriteTeamData = favoriteTeam ? getTeam(favoriteTeam) : null;
  const recentGames = (allGames ?? []).slice(0, 5);
  const progressPercent = tier === 'legend' ? 100 : Math.min(100, (tierProgress.current / Math.max(1, tierProgress.next)) * 100);

  const getTeamName = (team: typeof championTeam) => {
    if (!team) return '';
    return language === 'ar' ? team.nameAr : team.nameEn;
  };

  const formatDate = (dateStr: string) => {
    return formatSafeDate(dateStr, language === 'ar' ? 'ar-LB' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const resolveName = (name: string) => {
    const team = teams.find(
      (tm) =>
        tm.nameEn.toLowerCase() === name.toLowerCase() ||
        tm.nameAr === name ||
        tm.altNames?.some((a) => a.toLowerCase() === name.toLowerCase())
    );
    if (!team) return name;
    return language === 'ar' ? team.nameAr : team.nameEn;
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
      <LinearGradient
        colors={[Colors.dark.gradientStart, Colors.dark.gradientMid, Colors.dark.gradientEnd]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]} edges={['top']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, isRTL && styles.rtl]}>
            <View style={{ flex: 1, paddingRight: Spacing.sm }}>
              <Text style={[styles.appName, isRTL && styles.rtlText]}>
                {language === 'ar' ? 'الدوري' : 'DAWRI'}
              </Text>
              <Text style={[styles.tagline, isRTL && styles.rtlText]}>
                {t('app.tagline')}
              </Text>
            </View>
            <Pressable style={styles.pointsChip} onPress={() => router.push('/rewards')}>
              <Ionicons name="star" size={14} color={Colors.dark.primary} />
              <Text style={styles.pointsText}>{points.toLocaleString()}</Text>
              <Text style={styles.pointsPts}>{language === 'ar' ? 'نقطة' : 'pts'}</Text>
            </Pressable>
          </View>

          <Pressable 
            style={styles.championCard}
            onPress={() => router.push('/team/riyadi')}
          >
            <LinearGradient
              colors={['#006633', '#004d26', '#003319']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.championGradient}
            >
              <View style={styles.championContent}>
                <View style={styles.championBadge}>
                  <Ionicons name="trophy" size={24} color={Colors.dark.gold} />
                </View>
                <Text style={styles.championLabel}>{t('home.seasonChampion')}</Text>
                <Text style={styles.championName}>
                  {championTeam ? getTeamName(championTeam) : 'Al Riyadi'}
                </Text>
                <Text style={styles.championSubtitle}>{t('home.championTitle')}</Text>
                <View style={styles.finalsResult}>
                  <Text style={styles.finalsResultText}>{t('home.finalsResult')}</Text>
                </View>
              </View>
              <View style={styles.championDecoration}>
                <Text style={styles.championNumber}>20</Text>
              </View>
            </LinearGradient>
          </Pressable>

          <Pressable 
            style={styles.mvpCard}
            onPress={() => router.push('/game/finals-g7')}
          >
            <View style={styles.mvpContent}>
              <View style={styles.mvpBadge}>
                <Ionicons name="medal" size={20} color={Colors.dark.gold} />
              </View>
              <View style={styles.mvpInfo}>
                <Text style={[styles.mvpLabel, isRTL && styles.rtlText]}>{t('home.finalsMvp')}</Text>
                <Text style={[styles.mvpName, isRTL && styles.rtlText]}>{finals?.mvp ?? '—'}</Text>
                <Text style={[styles.mvpStats, isRTL && styles.rtlText]}>32 pts | Game 7</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={Colors.dark.textMuted} />
            </View>
          </Pressable>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {t('home.finalsHighlight')}
            </Text>
          </View>
          <Pressable 
            style={styles.game7Card}
            onPress={() => router.push('/game/finals-g7')}
          >
            <View style={styles.gameHeader}>
              <View style={styles.liveBadge}>
                <Text style={styles.liveBadgeText}>{t('home.game7')}</Text>
              </View>
              <Text style={styles.gameDate}>Aug 3, 2026</Text>
            </View>
            <View style={styles.gameTeams}>
              <View style={styles.gameTeam}>
                <Text style={styles.gameTeamName}>
                  {language === 'ar' ? 'الرياضي' : 'Al Riyadi'}
                </Text>
                <Text style={styles.gameScore}>100</Text>
              </View>
              <View style={styles.gameTeam}>
                <Text style={styles.gameTeamName}>
                  {language === 'ar' ? 'الحكمة' : 'Sagesse'}
                </Text>
                <Text style={[styles.gameScore, styles.losingScore]}>79</Text>
              </View>
            </View>
            <Text style={[styles.gameHighlight, isRTL && styles.rtlText]}>
              {game7?.highlights || 'Championship Game'}
            </Text>
          </Pressable>

          {/* Recent games */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {language === 'ar' ? 'أحدث المباريات' : 'Recent Games'}
            </Text>
            <Pressable onPress={() => router.push('/schedule')}>
              <Text style={styles.seeAll}>{language === 'ar' ? 'الكل' : 'See all'}</Text>
            </Pressable>
          </View>
          <View style={styles.recentList}>
            {recentGames.map((g) => (
              <Pressable
                key={g.id}
                style={styles.recentCard}
                onPress={() => router.push(`/game/${g.id}`)}
              >
                <Text style={styles.recentMeta}>{formatDate((g as any).displayDate === 'Date TBA' ? '' : g.date)} · {g.type === 'finals' ? (g.game === 7 ? 'G7' : 'Finals') : 'RS'}</Text>
                <View style={[styles.recentRow, isRTL && styles.rtl]}>
                  <Text style={styles.recentTeam} numberOfLines={1}>{resolveName(g.home)}</Text>
                  <Text style={[styles.recentScore, g.winner === g.home && styles.recentScoreWin]}>{g.homeScore}</Text>
                </View>
                <View style={[styles.recentRow, isRTL && styles.rtl]}>
                  <Text style={styles.recentTeam} numberOfLines={1}>{resolveName(g.away)}</Text>
                  <Text style={[styles.recentScore, g.winner === g.away && styles.recentScoreWin]}>{g.awayScore}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Favorite team CTA */}
          {favoriteTeamData ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
                  {t('home.yourTeam')}
                </Text>
              </View>
              <Pressable 
                style={styles.favoriteCard}
                onPress={() => router.push(`/team/${favoriteTeam}`)}
              >
                <View style={[styles.teamColorBar, { backgroundColor: favoriteTeamData.colors[0] }]} />
                <View style={styles.favoriteContent}>
                  <Text style={[styles.favoriteName, isRTL && styles.rtlText]}>
                    {getTeamName(favoriteTeamData)}
                  </Text>
                  <Text style={[styles.favoriteCity, isRTL && styles.rtlText]}>
                    {favoriteTeamData.city} • {favoriteTeamData.arena}
                  </Text>
                </View>
                <Ionicons name="heart" size={24} color={Colors.dark.primary} />
              </Pressable>
            </>
          ) : (
            <Pressable 
              style={styles.selectTeamCard}
              onPress={() => router.push('/more')}
            >
              <Ionicons name="heart-outline" size={32} color={Colors.dark.primary} />
              <Text style={[styles.selectTeamText, isRTL && styles.rtlText]}>
                {t('home.selectTeam')}
              </Text>
              <Text style={styles.selectTeamHint}>
                {language === 'ar' ? 'اختر فريقك من المزيد' : 'Pick your club in More'}
              </Text>
            </Pressable>
          )}

          {/* Tier progress */}
          <View style={styles.tierCard}>
            <View style={[styles.tierBadge, { backgroundColor: TierColors[tier] + '20' }]}>
              <Ionicons 
                name={tier === 'legend' ? 'flame' : tier === 'ultra' ? 'star' : 'person'} 
                size={24} 
                color={TierColors[tier]} 
              />
            </View>
            <View style={styles.tierInfo}>
              <Text style={[styles.tierLabel, isRTL && styles.rtlText]}>{t('home.tier')}</Text>
              <Text style={[styles.tierName, { color: TierColors[tier] }, isRTL && styles.rtlText]}>
                {t(`tiers.${tier}`)}
              </Text>
              <View style={styles.tierBarTrack}>
                <View style={[styles.tierBarFill, { width: `${progressPercent}%` }]} />
              </View>
              {tier !== 'legend' && (
                <Text style={styles.tierHint}>
                  {tierProgress.checkInsToNext} {language === 'ar' ? 'حضور للترقية' : 'check-ins to next'}
                </Text>
              )}
            </View>
            <View style={styles.pointsInfo}>
              <Text style={[styles.pointsLabel, isRTL && styles.rtlText]}>{t('home.pointsBalance')}</Text>
              <Text style={styles.pointsValue}>{points.toLocaleString()}</Text>
            </View>
          </View>

          {/* Attend CTA */}
          <Pressable style={styles.attendCta} onPress={() => router.push('/rewards')}>
            <View style={styles.attendIcon}>
              <Ionicons name="location" size={22} color={Colors.dark.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.attendTitle}>
                {language === 'ar' ? 'سجّل حضورك واكسب نقاط' : 'Attend a game · earn points'}
              </Text>
              <Text style={styles.attendSub}>
                {language === 'ar' ? '+1,000 نقطة لكل حضور' : '+1,000 pts per check-in'}
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </Pressable>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {t('teams.title')}
            </Text>
          </View>
          <View style={styles.teamsGrid}>
            {teams.slice(0, 6).map((team) => (
              <Pressable
                key={team.id}
                style={styles.teamGridItem}
                onPress={() => router.push(`/team/${team.id}`)}
              >
                <View style={[styles.teamGridColor, { backgroundColor: team.colors[0] }]} />
                <Text style={[styles.teamGridName, isRTL && styles.rtlText]} numberOfLines={1}>
                  {getTeamName(team)}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable 
            style={styles.viewAllButton}
            onPress={() => router.push('/standings')}
          >
            <Text style={styles.viewAllText}>
              {language === 'ar' ? 'عرض كل الفرق' : 'View All Teams'}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.dark.primary} />
          </Pressable>

          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  rtl: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
  },
  appName: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.extrabold,
    fontFamily: Fonts.display,
    color: Colors.dark.text,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  pointsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderWidth: 1.5,
    borderColor: Colors.dark.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.dark.primary + '66',
  },
  pointsText: {
    color: Colors.dark.primary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
  },
  pointsPts: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
  },
  championCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadows.lg,
  },
  championGradient: {
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  championContent: {
    flex: 1,
  },
  championBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,215,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  championLabel: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: FontWeights.medium,
  },
  championName: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.extrabold,
    fontFamily: Fonts.display,
    color: Colors.dark.text,
    marginTop: 4,
  },
  championSubtitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semibold,
    color: Colors.dark.gold,
    fontWeight: FontWeights.semibold,
    marginTop: 4,
  },
  finalsResult: {
    marginTop: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  finalsResultText: {
    color: Colors.dark.text,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
    fontWeight: FontWeights.medium,
  },
  championDecoration: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  championNumber: {
    fontSize: 72,
    fontWeight: FontWeights.extrabold,
    fontFamily: Fonts.display,
    color: 'rgba(255,215,0,0.15)',
  },
  mvpCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  mvpContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mvpBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mvpInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  mvpLabel: {
    fontSize: FontSizes.xs,
    color: Colors.dark.textMuted,
    fontWeight: FontWeights.medium,
    fontFamily: Fonts.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mvpName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    color: Colors.dark.text,
    marginTop: 2,
  },
  mvpStats: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.displayMedium,
    color: Colors.dark.text,
  },
  seeAll: {
    color: Colors.dark.primary,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semibold,
  },
  game7Card: {
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  liveBadge: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  liveBadgeText: {
    color: Colors.dark.background,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    textTransform: 'uppercase',
  },
  gameDate: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
  },
  gameTeams: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  gameTeam: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameTeamName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    color: Colors.dark.text,
  },
  gameScore: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.display,
    color: Colors.dark.primary,
  },
  losingScore: {
    color: Colors.dark.textMuted,
  },
  gameHighlight: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.dark.textSecondary,
    fontStyle: 'italic',
  },
  recentList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  recentCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  recentMeta: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
    color: Colors.dark.textMuted,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  recentTeam: {
    flex: 1,
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    color: Colors.dark.text,
    marginRight: Spacing.sm,
  },
  recentScore: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.display,
    color: Colors.dark.textMuted,
    minWidth: 36,
    textAlign: 'right',
  },
  recentScoreWin: {
    color: Colors.dark.primary,
  },
  favoriteCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  teamColorBar: {
    width: 6,
    height: '100%',
    position: 'absolute',
    left: 0,
  },
  favoriteContent: {
    flex: 1,
    padding: Spacing.md,
    paddingLeft: Spacing.lg,
  },
  favoriteName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    color: Colors.dark.text,
  },
  favoriteCity: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  selectTeamCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.dark.primary + '55',
    borderStyle: 'dashed',
  },
  selectTeamText: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: Fonts.semibold,
    marginTop: Spacing.sm,
  },
  selectTeamHint: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
    marginTop: 4,
  },
  tierCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  tierBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  tierLabel: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
    color: Colors.dark.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tierName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    marginTop: 2,
  },
  tierBarTrack: {
    height: 6,
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: 3,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  tierBarFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: 3,
  },
  tierHint: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
    color: Colors.dark.textMuted,
    marginTop: 4,
  },
  pointsInfo: {
    alignItems: 'flex-end',
  },
  pointsLabel: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
    color: Colors.dark.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pointsValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.display,
    color: Colors.dark.primary,
    marginTop: 2,
  },
  attendCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  attendIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendTitle: {
    color: '#ffffff',
    fontSize: FontSizes.md,
    fontFamily: Fonts.bold,
    fontWeight: FontWeights.bold,
  },
  attendSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
    marginTop: 2,
  },
  teamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
    marginBottom: Spacing.sm,
  },
  teamGridItem: {
    width: '33.33%',
    padding: Spacing.xs,
  },
  teamGridColor: {
    aspectRatio: 1.5,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  teamGridName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    fontFamily: Fonts.medium,
    color: Colors.dark.text,
    textAlign: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  viewAllText: {
    color: Colors.dark.primary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
  },
});
