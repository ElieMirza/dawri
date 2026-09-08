import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useData } from '@/hooks/useData';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { season, finals, allGames, getTeam } = useData();

  const championTeam = getTeam('riyadi');
  const recentGames = allGames.slice(0, 3);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Champion Banner */}
        <View style={styles.championBanner}>
          <View style={styles.championHeader}>
            <Text style={styles.seasonLabel}>{t('home.seasonChampion')}</Text>
            <View style={styles.championBadge}>
              <Ionicons name="trophy" size={20} color={Colors.dark.gold} />
            </View>
          </View>
          <Text style={styles.championName}>{championTeam?.nameEn}</Text>
          <Text style={styles.championNameAr}>{championTeam?.nameAr}</Text>
          <Text style={styles.championTitle}>{t('home.championTitle')}</Text>
          <Text style={styles.finalsResult}>{t('home.finalsResult')}</Text>
          <View style={styles.mvpRow}>
            <Ionicons name="star" size={14} color={Colors.dark.gold} />
            <Text style={styles.mvpText}>
              {t('home.finalsMvp')}: {finals.mvp.nameEn}
            </Text>
          </View>
        </View>

        {/* Points Chip (CTA to rewards) */}
        <Link href="/(tabs)/rewards" asChild>
          <Pressable style={styles.pointsChip}>
            <View style={styles.pointsChipContent}>
              <Ionicons name="gift" size={18} color={Colors.dark.text} />
              <Text style={styles.pointsChipText}>1,250 pts</Text>
            </View>
            <Text style={styles.pointsChipCta}>Earn More →</Text>
          </Pressable>
        </Link>

        {/* Favorite Team CTA */}
        <View style={styles.favoriteCard}>
          <Ionicons name="heart-outline" size={24} color={Colors.dark.textSecondary} />
          <View style={styles.favoriteContent}>
            <Text style={styles.favoriteTitle}>{t('home.yourTeam')}</Text>
            <Text style={styles.favoriteSubtitle}>{t('home.selectTeam')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.dark.textMuted} />
        </View>

        {/* Tier Progress */}
        <View style={styles.tierCard}>
          <View style={styles.tierHeader}>
            <Text style={styles.tierTitle}>{t('rewards.tierProgress')}</Text>
            <View style={styles.tierBadge}>
              <Text style={styles.tierBadgeText}>Regular</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '40%' }]} />
          </View>
          <Text style={styles.tierProgressText}>4 of 10 check-ins to Ultra</Text>
        </View>

        {/* Recent Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.recentResults')}</Text>
          {recentGames.map((game) => {
            const homeTeam = getTeam(game.home.toLowerCase().replace(/\s+/g, '-'));
            const awayTeam = getTeam(game.away.toLowerCase().replace(/\s+/g, '-'));
            const isFinalsGame = game.type === 'finals';
            return (
              <Link key={game.id} href={`/game/${game.id}`} asChild>
                <Pressable style={styles.gameCard}>
                  {isFinalsGame && (
                    <View style={styles.liveTag}>
                      <Text style={styles.liveTagText}>FINALS G{game.game}</Text>
                    </View>
                  )}
                  <View style={styles.gameTeams}>
                    <View style={styles.teamRow}>
                      <Text style={styles.teamName}>{game.home}</Text>
                      <Text style={[styles.score, game.winner === game.home && styles.winnerScore]}>
                        {game.homeScore}
                      </Text>
                    </View>
                    <View style={styles.teamRow}>
                      <Text style={styles.teamName}>{game.away}</Text>
                      <Text style={[styles.score, game.winner === game.away && styles.winnerScore]}>
                        {game.awayScore}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.gameDate}>
                    {new Date(game.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </Pressable>
              </Link>
            );
          })}
        </View>

        {/* Attend CTA */}
        <Pressable style={styles.attendCta}>
          <Ionicons name="location" size={20} color={Colors.dark.text} />
          <View style={styles.attendContent}>
            <Text style={styles.attendTitle}>{t('rewards.checkInGame')}</Text>
            <Text style={styles.attendSubtitle}>{t('rewards.earnPerGame')}</Text>
          </View>
          <View style={styles.attendButton}>
            <Text style={styles.attendButtonText}>{t('game.checkIn')}</Text>
          </View>
        </Pressable>
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
  championBanner: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.riyadi,
  },
  championHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  seasonLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  championBadge: {
    backgroundColor: Colors.dark.surfaceElevated,
    padding: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  championName: {
    color: Colors.dark.text,
    fontSize: FontSizes.xxxl,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  championNameAr: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.xl,
    fontFamily: 'NotoSansArabic_600SemiBold',
    marginBottom: Spacing.xs,
  },
  championTitle: {
    color: Colors.dark.gold,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_600SemiBold',
  },
  finalsResult: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
    marginTop: Spacing.xs,
  },
  mvpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  mvpText: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
  },
  pointsChip: {
    backgroundColor: Colors.dark.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  pointsChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  pointsChipText: {
    color: Colors.dark.text,
    fontSize: FontSizes.lg,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  pointsChipCta: {
    color: Colors.dark.text,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
  },
  favoriteCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  favoriteContent: {
    flex: 1,
  },
  favoriteTitle: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_600SemiBold',
  },
  favoriteSubtitle: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
  },
  tierCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tierTitle: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_600SemiBold',
  },
  tierBadge: {
    backgroundColor: Colors.dark.accent,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  tierBadgeText: {
    color: Colors.dark.text,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: BorderRadius.full,
  },
  tierProgressText: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: FontSizes.lg,
    fontFamily: 'SpaceGrotesk_600SemiBold',
    marginBottom: Spacing.md,
  },
  gameCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  liveTag: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  liveTagText: {
    color: Colors.dark.text,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
  },
  gameTeams: {
    gap: Spacing.xs,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_500Medium',
  },
  score: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.lg,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  winnerScore: {
    color: Colors.dark.text,
  },
  gameDate: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_400Regular',
    marginTop: Spacing.xs,
  },
  attendCta: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  attendContent: {
    flex: 1,
  },
  attendTitle: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_600SemiBold',
  },
  attendSubtitle: {
    color: Colors.dark.primary,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
  },
  attendButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  attendButtonText: {
    color: Colors.dark.text,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_600SemiBold',
  },
});
