import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useData, Game } from '@/hooks/useData';

type FilterType = 'all' | 'finals' | 'regular';

export default function ScheduleScreen() {
  const { t } = useTranslation();
  const { allGames, teams } = useData();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const filteredGames = allGames.filter((game) => {
    if (filter !== 'all' && game.type !== filter) return false;
    if (selectedTeam) {
      const teamNames = teams
        .filter((t) => t.id === selectedTeam)
        .flatMap((t) => [t.nameEn, t.nameAr, ...(t.altNames || [])]);
      return teamNames.some((name) => game.home === name || game.away === name);
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('schedule.title')}</Text>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {(['all', 'finals', 'regular'] as FilterType[]).map((f) => (
            <Pressable
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                {f === 'all'
                  ? t('schedule.all')
                  : f === 'finals'
                    ? t('schedule.finals')
                    : t('schedule.regularSeason')}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Team Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.teamFilterRow}
          contentContainerStyle={styles.teamFilterContent}
        >
          <Pressable
            style={[styles.teamChip, !selectedTeam && styles.teamChipActive]}
            onPress={() => setSelectedTeam(null)}
          >
            <Text style={[styles.teamChipText, !selectedTeam && styles.teamChipTextActive]}>
              All Teams
            </Text>
          </Pressable>
          {teams.slice(0, 6).map((team) => (
            <Pressable
              key={team.id}
              style={[styles.teamChip, selectedTeam === team.id && styles.teamChipActive]}
              onPress={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}
            >
              <Text
                style={[styles.teamChipText, selectedTeam === team.id && styles.teamChipTextActive]}
              >
                {team.nameEn}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Games List */}
        {filteredGames.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={Colors.dark.textMuted} />
            <Text style={styles.emptyText}>{t('schedule.noGames')}</Text>
          </View>
        ) : (
          filteredGames.map((game) => (
            <Link key={game.id} href={`/game/${game.id}`} asChild>
              <Pressable style={styles.gameCard}>
                <View style={styles.gameHeader}>
                  <Text style={styles.gameDate}>
                    {new Date(game.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  {game.type === 'finals' && (
                    <View style={styles.finalsTag}>
                      <Text style={styles.finalsTagText}>FINALS G{game.game}</Text>
                    </View>
                  )}
                </View>
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
                {game.venue && <Text style={styles.venue}>{game.venue}</Text>}
              </Pressable>
            </Link>
          ))
        )}
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
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterTab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.dark.surface,
  },
  filterTabActive: {
    backgroundColor: Colors.dark.primary,
  },
  filterTabText: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
  },
  filterTabTextActive: {
    color: Colors.dark.text,
  },
  teamFilterRow: {
    marginBottom: Spacing.lg,
  },
  teamFilterContent: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  teamChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  teamChipActive: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.surfaceElevated,
  },
  teamChipText: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
  },
  teamChipTextActive: {
    color: Colors.dark.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_400Regular',
    marginTop: Spacing.md,
  },
  gameCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  gameDate: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
  },
  finalsTag: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  finalsTagText: {
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
    fontSize: FontSizes.xl,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  winnerScore: {
    color: Colors.dark.text,
  },
  venue: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_400Regular',
    marginTop: Spacing.sm,
  },
});
