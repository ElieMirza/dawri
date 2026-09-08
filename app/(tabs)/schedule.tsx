import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Fonts, formatSafeDate } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { useData, Game } from '../../hooks/useData';

type FilterType = 'all' | 'finals' | 'regular';

export default function ScheduleScreen() {
  const { t } = useTranslation();
  const { isRTL, language, selectedSeason } = useApp();
  const { allGames, teams, getTeamByName, season } = useData(selectedSeason);
  const [filter, setFilter] = useState<FilterType>('all');
  const [teamFilter, setTeamFilter] = useState<string | null>(null);

  const filteredGames = useMemo(() => {
    let games = allGames;
    
    if (filter === 'finals') {
      games = games.filter(g => g.type === 'finals');
    } else if (filter === 'regular') {
      games = games.filter(g => g.type === 'regular');
    }
    
    if (teamFilter) {
      const team = teams.find(t => t.id === teamFilter);
      if (team) {
        const names = [team.nameEn, team.nameAr, ...(team.altNames || [])];
        games = games.filter(g => 
          names.some(n => g.home === n || g.away === n)
        );
      }
    }
    
    return games;
  }, [allGames, filter, teamFilter, teams]);

  const formatDate = (game: Game) => {
    if (game.displayDate === 'Date TBA' || !game.date || game.date === 'unknown') {
      return language === 'ar' ? 'تاريخ غير معروف' : 'Date TBA';
    }
    return formatSafeDate(game.date, language === 'ar' ? 'ar-LB' : 'en-US');
  };

  const getTeamName = (name: string) => {
    const team = getTeamByName(name);
    if (team) {
      return language === 'ar' ? team.nameAr : team.nameEn;
    }
    return name;
  };

  const renderGameCard = (game: Game) => {
    const isG7 = game.type === 'finals' && game.game === 7;
    const isFinals = game.type === 'finals';

    // Featured strip for finals/G7; compact list row for regular season
    if (!isFinals) {
      return (
        <Pressable
          key={game.id}
          style={[styles.regularRow, isRTL && styles.rtl]}
          onPress={() => router.push(`/game/${game.id}`)}
        >
          <View style={styles.regularDateCol}>
            <Text style={styles.regularDate}>{formatDate(game)}</Text>
          </View>
          <View style={styles.regularTeams}>
            <Text style={[styles.regularTeam, game.winner === game.home && styles.winner]} numberOfLines={1}>
              {getTeamName(game.home)}
            </Text>
            <Text style={styles.regularVs}>
              {game.homeScore != null && game.awayScore != null
                ? `${game.homeScore}–${game.awayScore}`
                : 'vs'}
            </Text>
            <Text style={[styles.regularTeam, game.winner === game.away && styles.winner]} numberOfLines={1}>
              {getTeamName(game.away)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color={Colors.dark.textMuted} />
        </Pressable>
      );
    }

    return (
    <Pressable
      key={game.id}
      style={[
        styles.featuredStrip,
        isG7 && styles.g7Card,
      ]}
      onPress={() => router.push(`/game/${game.id}`)}
    >
      <View style={[styles.featuredAccent, isG7 && styles.g7Accent]} />
      <View style={styles.featuredBody}>
        <View style={styles.gameCardHeader}>
          <View style={[styles.finalsTag, isG7 && styles.g7Tag]}>
            <Text style={styles.finalsTagText}>
              {isG7 ? (language === 'ar' ? 'النهائي G7' : 'FINALS · G7') : `${t('schedule.finals')} ${game.game ? `G${game.game}` : ''}`}
            </Text>
          </View>
          <Text style={styles.gameDate}>{formatDate(game)}</Text>
        </View>

        <View style={styles.gameTeams}>
          <View style={[styles.teamRow, isRTL && styles.rtl]}>
            <Text style={[styles.teamName, game.winner === game.home && styles.winner]}>
              {getTeamName(game.home)}
            </Text>
            <Text style={[styles.score, game.winner === game.home && styles.winnerScore]}>
              {game.homeScore}
            </Text>
          </View>
          <View style={[styles.teamRow, isRTL && styles.rtl]}>
            <Text style={[styles.teamName, game.winner === game.away && styles.winner]}>
              {getTeamName(game.away)}
            </Text>
            <Text style={[styles.score, game.winner === game.away && styles.winnerScore]}>
              {game.awayScore}
            </Text>
          </View>
        </View>

        {game.venue && (
          <View style={[styles.venueRow, isRTL && styles.rtl]}>
            <Ionicons name="location-outline" size={12} color={Colors.dark.textMuted} />
            <Text style={styles.venueText}>{game.venue}</Text>
          </View>
        )}

        {game.notes && (
          <Text style={[styles.gameNote, isRTL && styles.rtlText]}>{game.notes}</Text>
        )}
        {isG7 && (
          <Text style={[styles.g7Note, isRTL && styles.rtlText]}>
            {language === 'ar' ? 'مباراة التتويج' : 'Championship clincher'}
          </Text>
        )}
      </View>
    </Pressable>
  );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors.dark.background }]} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.title, isRTL && styles.rtlText]}>{t('schedule.title')}</Text>
          <View style={[styles.subtitleRow, isRTL && styles.rtl]}>
            <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
              {language === 'ar' ? `موسم ${season.id}` : `${season.id} Season`}
            </Text>
            {season.isArchive && (
              <View style={styles.archiveBadge}>
                <Text style={styles.archiveBadgeText}>
                  {language === 'ar' ? 'API' : 'API'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.filterScroll, isRTL && { flexDirection: 'row-reverse' }]}
            style={isRTL ? { direction: 'rtl' as any } : undefined}
          >
            <Pressable
              style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                {t('schedule.all')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filterTab, filter === 'finals' && styles.filterTabActive]}
              onPress={() => setFilter('finals')}
            >
              <Ionicons 
                name="trophy" 
                size={14} 
                color={filter === 'finals' ? Colors.dark.background : Colors.dark.textSecondary} 
              />
              <Text style={[styles.filterText, filter === 'finals' && styles.filterTextActive]}>
                {t('schedule.finals')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filterTab, filter === 'regular' && styles.filterTabActive]}
              onPress={() => setFilter('regular')}
            >
              <Text style={[styles.filterText, filter === 'regular' && styles.filterTextActive]}>
                {t('schedule.regularSeason')}
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        <View style={styles.teamFilterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.teamFilterScroll, isRTL && { flexDirection: 'row-reverse' }]}
            style={isRTL ? { direction: 'rtl' as any } : undefined}
          >
            <Pressable
              style={[styles.teamChip, !teamFilter && styles.teamChipActive]}
              onPress={() => setTeamFilter(null)}
            >
              <Text style={[styles.teamChipText, !teamFilter && styles.teamChipTextActive]}>
                {language === 'ar' ? 'الكل' : 'All'}
              </Text>
            </Pressable>
            {teams.map((team) => (
              <Pressable
                key={team.id}
                style={[styles.teamChip, teamFilter === team.id && styles.teamChipActive]}
                onPress={() => setTeamFilter(team.id === teamFilter ? null : team.id)}
              >
                <View style={[styles.teamChipDot, { backgroundColor: team.colors[0] }]} />
                <Text style={[styles.teamChipText, teamFilter === team.id && styles.teamChipTextActive]}>
                  {language === 'ar' ? team.nameAr : team.nameEn}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredGames.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={Colors.dark.textMuted} />
              <Text style={styles.emptyText}>{t('schedule.noGames')}</Text>
            </View>
          ) : (
            filteredGames.map((game) => renderGameCard(game))
          )}
          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.display,
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 2,
  },
  archiveBadge: {
    backgroundColor: Colors.dark.gold + '33',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.dark.gold + '55',
  },
  archiveBadgeText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
    color: Colors.dark.gold,
    textTransform: 'uppercase',
  },
  rtlText: {
    textAlign: 'right',
  },
  rtl: {
    flexDirection: 'row-reverse',
  },
  filterContainer: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  filterScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.dark.surface,
    gap: Spacing.xs,
  },
  filterTabActive: {
    backgroundColor: Colors.dark.primary,
  },
  filterText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    fontFamily: Fonts.medium,
    color: Colors.dark.textSecondary,
  },
  filterTextActive: {
    color: Colors.dark.background,
    fontFamily: Fonts.bold,
  },
  teamFilterContainer: {
    paddingVertical: Spacing.sm,
  },
  teamFilterScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  teamChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.dark.surface,
    gap: 4,
  },
  teamChipActive: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  teamChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  teamChipText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.medium,
    color: Colors.dark.textSecondary,
  },
  teamChipTextActive: {
    color: Colors.dark.primary,
  },
  listScroll: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  // Compact list row — regular season (not rounded slabs)
  regularRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.sm,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.dark.border,
    gap: Spacing.sm,
  },
  regularDateCol: {
    width: 72,
  },
  regularDate: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
    color: Colors.dark.textMuted,
  },
  regularTeams: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  regularTeam: {
    flex: 1,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.dark.textSecondary,
  },
  regularVs: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.display,
    color: Colors.dark.text,
    minWidth: 40,
    textAlign: 'center',
  },
  // Featured strip — finals / G7
  featuredStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.cardHighlight,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.primary + '66',
    marginVertical: 4,
  },
  featuredAccent: {
    width: 4,
    backgroundColor: Colors.dark.primary,
  },
  g7Accent: {
    backgroundColor: Colors.dark.gold,
  },
  featuredBody: {
    flex: 1,
    padding: Spacing.md,
  },
  g7Card: {
    borderColor: Colors.dark.gold,
    borderWidth: 1.5,
    backgroundColor: '#1a1410',
  },
  g7Tag: {
    backgroundColor: Colors.dark.gold,
  },
  g7Note: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.xs,
    color: Colors.dark.gold,
    fontFamily: Fonts.semibold,
  },
  gameCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  finalsTag: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  finalsTagText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    color: Colors.dark.background,
    textTransform: 'uppercase',
  },
  gameDate: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.dark.textMuted,
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
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    color: Colors.dark.textSecondary,
  },
  winner: {
    color: Colors.dark.text,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
  },
  score: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.display,
    color: Colors.dark.textMuted,
  },
  winnerScore: {
    color: Colors.dark.primary,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  venueText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
    color: Colors.dark.textMuted,
  },
  gameNote: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
    color: Colors.dark.gold,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.dark.textMuted,
  },
});
