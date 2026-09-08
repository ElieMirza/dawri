import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, Link, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useData } from '@/hooks/useData';

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { getGame, getTeamByName } = useData();

  const game = getGame(id);

  if (!game) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Game not found</Text>
      </View>
    );
  }

  const homeTeam = getTeamByName(game.home);
  const awayTeam = getTeamByName(game.away);
  const isFinalsGame = game.type === 'finals';

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: isFinalsGame ? `Finals Game ${game.game}` : t('game.final'),
        }}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Score Card */}
        <View style={styles.scoreCard}>
          {isFinalsGame && (
            <View style={styles.finalsTag}>
              <Ionicons name="trophy" size={14} color={Colors.dark.gold} />
              <Text style={styles.finalsTagText}>FINALS GAME {game.game}</Text>
            </View>
          )}

          <View style={styles.teamsContainer}>
            {/* Home Team */}
            <Link href={homeTeam ? `/team/${homeTeam.id}` : '/(tabs)/standings'} asChild>
              <Pressable style={styles.teamBlock}>
                <View style={styles.teamLogoPlaceholder}>
                  <Text style={styles.teamInitial}>{game.home.charAt(0)}</Text>
                </View>
                <Text style={styles.teamName}>{game.home}</Text>
                <Text
                  style={[styles.score, game.winner === game.home && styles.winnerScore]}
                >
                  {game.homeScore}
                </Text>
              </Pressable>
            </Link>

            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>{t('game.vs')}</Text>
              <Text style={styles.finalLabel}>{t('game.final')}</Text>
            </View>

            {/* Away Team */}
            <Link href={awayTeam ? `/team/${awayTeam.id}` : '/(tabs)/standings'} asChild>
              <Pressable style={styles.teamBlock}>
                <View style={styles.teamLogoPlaceholder}>
                  <Text style={styles.teamInitial}>{game.away.charAt(0)}</Text>
                </View>
                <Text style={styles.teamName}>{game.away}</Text>
                <Text
                  style={[styles.score, game.winner === game.away && styles.winnerScore]}
                >
                  {game.awayScore}
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Game Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={18} color={Colors.dark.textSecondary} />
            <Text style={styles.infoLabel}>{t('game.date')}</Text>
            <Text style={styles.infoValue}>
              {new Date(game.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          {game.venue && (
            <View style={styles.infoRow}>
              <Ionicons name="location" size={18} color={Colors.dark.textSecondary} />
              <Text style={styles.infoLabel}>{t('game.venue')}</Text>
              <Text style={styles.infoValue}>{game.venue}</Text>
            </View>
          )}
        </View>

        {/* Highlights */}
        {game.highlights && (
          <View style={styles.highlightsCard}>
            <Text style={styles.highlightsTitle}>{t('game.highlights')}</Text>
            <Text style={styles.highlightsText}>{game.highlights}</Text>
          </View>
        )}

        {/* Check-in CTA */}
        <Pressable style={styles.checkinCta}>
          <Ionicons name="location" size={20} color={Colors.dark.text} />
          <View style={styles.checkinContent}>
            <Text style={styles.checkinTitle}>{t('game.checkIn')}</Text>
            <Text style={styles.checkinSubtitle}>+1,000 points</Text>
          </View>
          <View style={styles.checkinButton}>
            <Text style={styles.checkinButtonText}>{t('game.checkIn')}</Text>
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
  scoreCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  finalsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  finalsTagText: {
    color: Colors.dark.gold,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamBlock: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  teamInitial: {
    color: Colors.dark.text,
    fontSize: FontSizes.xxl,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  teamName: {
    color: Colors.dark.text,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  score: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.xxxl,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  winnerScore: {
    color: Colors.dark.text,
  },
  vsContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  vsText: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
  },
  finalLabel: {
    color: Colors.dark.primary,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
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
    width: 50,
  },
  infoValue: {
    color: Colors.dark.text,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
    flex: 1,
  },
  highlightsCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  highlightsTitle: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: Spacing.sm,
  },
  highlightsText: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  checkinCta: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  checkinContent: {
    flex: 1,
  },
  checkinTitle: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_600SemiBold',
  },
  checkinSubtitle: {
    color: Colors.dark.primary,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
  },
  checkinButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  checkinButtonText: {
    color: Colors.dark.text,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_600SemiBold',
  },
});
