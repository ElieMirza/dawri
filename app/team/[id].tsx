import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, Link, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useData } from '@/hooks/useData';

export default function TeamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { getTeam, getStanding, getTeamGames, getTeamPlayers } = useData();

  const team = getTeam(id);
  const standing = team ? getStanding(team.id) : null;
  const games = team ? getTeamGames(team.id).slice(0, 5) : [];
  const players = team ? getTeamPlayers(team.id) : [];

  if (!team) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Team not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: team.nameEn }} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Team Header */}
        <View style={styles.headerCard}>
          <View style={styles.teamLogoPlaceholder}>
            <Text style={styles.teamInitial}>{team.nameEn.charAt(0)}</Text>
          </View>
          <Text style={styles.teamNameEn}>{team.nameEn}</Text>
          <Text style={styles.teamNameAr}>{team.nameAr}</Text>
          {team.championships > 0 && (
            <View style={styles.champRow}>
              <Ionicons name="trophy" size={14} color={Colors.dark.gold} />
              <Text style={styles.champText}>
                {team.championships} {t('teams.championships')}
              </Text>
            </View>
          )}
        </View>

        {/* Team Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={18} color={Colors.dark.textSecondary} />
            <Text style={styles.infoLabel}>{t('teams.city')}</Text>
            <Text style={styles.infoValue}>{team.city}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="business" size={18} color={Colors.dark.textSecondary} />
            <Text style={styles.infoLabel}>{t('teams.arena')}</Text>
            <Text style={styles.infoValue}>{team.arena}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="people" size={18} color={Colors.dark.textSecondary} />
            <Text style={styles.infoLabel}>{t('teams.capacity')}</Text>
            <Text style={styles.infoValue}>{team.arenaCapacity?.toLocaleString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={18} color={Colors.dark.textSecondary} />
            <Text style={styles.infoLabel}>{t('teams.coach')}</Text>
            <Text style={styles.infoValue}>{team.coachEn}</Text>
          </View>
        </View>

        {/* Season Record */}
        {standing && (
          <View style={styles.recordCard}>
            <Text style={styles.sectionTitle}>{t('teams.record')}</Text>
            <View style={styles.recordStats}>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{standing.rank}</Text>
                <Text style={styles.statLabel}>{t('standings.rank')}</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={[styles.statValue, styles.winsValue]}>{standing.wins}</Text>
                <Text style={styles.statLabel}>{t('standings.wins')}</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={[styles.statValue, styles.lossesValue]}>{standing.losses}</Text>
                <Text style={styles.statLabel}>{t('standings.losses')}</Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.statValue}>{standing.points}</Text>
                <Text style={styles.statLabel}>{t('standings.points')}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Players */}
        {players.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('teams.roster')}</Text>
            {players.map((player) => (
              <View key={player.id} style={styles.playerCard}>
                <View style={styles.playerNumber}>
                  <Text style={styles.playerNumberText}>{player.number}</Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.nameEn}</Text>
                  <Text style={styles.playerNameAr}>{player.nameAr}</Text>
                </View>
                <View style={styles.playerMeta}>
                  <Text style={styles.playerPosition}>{player.position}</Text>
                  <Text style={styles.playerHeight}>{player.height}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recent Games */}
        {games.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('home.recentResults')}</Text>
            {games.map((game) => (
              <Link key={game.id} href={`/game/${game.id}`} asChild>
                <Pressable style={styles.gameCard}>
                  <View style={styles.gameTeams}>
                    <Text style={styles.gameTeamName}>
                      {game.home} vs {game.away}
                    </Text>
                    <Text style={styles.gameScore}>
                      {game.homeScore} - {game.awayScore}
                    </Text>
                  </View>
                  <Text style={styles.gameDate}>
                    {new Date(game.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </Pressable>
              </Link>
            ))}
          </View>
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  errorText: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
  headerCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  teamLogoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  teamInitial: {
    color: Colors.dark.text,
    fontSize: FontSizes.xxxl,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  teamNameEn: {
    color: Colors.dark.text,
    fontSize: FontSizes.xxl,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  teamNameAr: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.lg,
    fontFamily: 'NotoSansArabic_600SemiBold',
    marginBottom: Spacing.xs,
  },
  champRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  champText: {
    color: Colors.dark.gold,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
  },
  infoCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  infoLabel: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
    width: 70,
  },
  infoValue: {
    color: Colors.dark.text,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
    flex: 1,
  },
  recordCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: FontSizes.lg,
    fontFamily: 'SpaceGrotesk_600SemiBold',
    marginBottom: Spacing.md,
  },
  recordStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBlock: {
    alignItems: 'center',
  },
  statValue: {
    color: Colors.dark.text,
    fontSize: FontSizes.xxl,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  winsValue: {
    color: Colors.dark.success,
  },
  lossesValue: {
    color: Colors.dark.error,
  },
  statLabel: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: Spacing.md,
  },
  playerCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  playerNumber: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  playerNumberText: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_500Medium',
  },
  playerNameAr: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'NotoSansArabic_400Regular',
  },
  playerMeta: {
    alignItems: 'flex-end',
  },
  playerPosition: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_600SemiBold',
  },
  playerHeight: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_400Regular',
  },
  gameCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  gameTeams: {},
  gameTeamName: {
    color: Colors.dark.text,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
  },
  gameScore: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.sm,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  gameDate: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_400Regular',
  },
});
