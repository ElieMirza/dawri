import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows, formatSafeDate } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { useData } from '../../hooks/useData';

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { isRTL, language, favoriteTeam, setFavoriteTeam } = useApp();
  const { getTeam, getStanding, getTeamPlayers, getTeamGames } = useData();

  const team = getTeam(id || '');
  const standing = getStanding(id || '');
  const players = getTeamPlayers(id || '');
  const games = getTeamGames(id || '').slice(0, 5);

  if (!team) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.errorText}>{t('common.error')}</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backLink}>{t('common.back')}</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  const isFavorite = favoriteTeam === team.id;
  const teamName = language === 'ar' ? team.nameAr : team.nameEn;

  const toggleFavorite = () => {
    setFavoriteTeam(isFavorite ? null : team.id);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[team.colors[0] + 'CC', team.colors[0] + '40', Colors.dark.background]}
        style={styles.gradient}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, isRTL && styles.rtl]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={24} color={Colors.dark.text} />
          </Pressable>
          <Pressable style={styles.favoriteButton} onPress={toggleFavorite}>
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? Colors.dark.error : Colors.dark.text} 
            />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Team Hero */}
          <View style={styles.heroSection}>
            <View style={[styles.teamLogo, { backgroundColor: team.colors[0] }]}>
              <Text style={styles.teamInitials}>
                {team.nameEn.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </Text>
            </View>
            <Text style={[styles.teamName, isRTL && styles.rtlText]}>{teamName}</Text>
            <Text style={[styles.teamCity, isRTL && styles.rtlText]}>{team.city}</Text>
            
            {/* Quick Stats */}
            {standing && (
              <View style={styles.quickStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>#{standing.rank}</Text>
                  <Text style={styles.statLabel}>{language === 'ar' ? 'الترتيب' : 'Rank'}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{standing.wins}-{standing.losses}</Text>
                  <Text style={styles.statLabel}>{t('teams.record')}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{standing.points}</Text>
                  <Text style={styles.statLabel}>{language === 'ar' ? 'نقاط' : 'Pts'}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Team Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {language === 'ar' ? 'معلومات الفريق' : 'Team Info'}
            </Text>
            
            <View style={styles.infoCard}>
              <View style={[styles.infoRow, isRTL && styles.rtl]}>
                <Ionicons name="location" size={18} color={Colors.dark.textMuted} />
                <View style={[styles.infoContent, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>{t('teams.arena')}</Text>
                  <Text style={[styles.infoValue, isRTL && styles.rtlText]}>{team.arena}</Text>
                </View>
              </View>
              
              {team.capacity && (
                <View style={[styles.infoRow, isRTL && styles.rtl]}>
                  <Ionicons name="people" size={18} color={Colors.dark.textMuted} />
                  <View style={[styles.infoContent, isRTL && { alignItems: 'flex-end' }]}>
                    <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>{t('teams.capacity')}</Text>
                    <Text style={[styles.infoValue, isRTL && styles.rtlText]}>{team.capacity.toLocaleString()}</Text>
                  </View>
                </View>
              )}
              
              {team.coach && (
                <View style={[styles.infoRow, isRTL && styles.rtl]}>
                  <Ionicons name="person" size={18} color={Colors.dark.textMuted} />
                  <View style={[styles.infoContent, isRTL && { alignItems: 'flex-end' }]}>
                    <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>{t('teams.coach')}</Text>
                    <Text style={[styles.infoValue, isRTL && styles.rtlText]}>{team.coach}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Key Players */}
          {players.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
                {language === 'ar' ? 'اللاعبون الرئيسيون' : 'Key Players'}
              </Text>
              
              {players.map((player) => (
                <View key={player.id} style={styles.playerCard}>
                  <View style={[styles.playerAvatar, { backgroundColor: team.colors[0] + '40' }]}>
                    <Text style={[styles.playerInitial, { color: team.colors[0] }]}>
                      {player.name[0]}
                    </Text>
                  </View>
                  <View style={[styles.playerInfo, isRTL && { alignItems: 'flex-end' }]}>
                    <Text style={[styles.playerName, isRTL && styles.rtlText]}>
                      {player.nameAr && language === 'ar' ? player.nameAr : player.name}
                    </Text>
                    {player.notes && (
                      <Text style={[styles.playerNotes, isRTL && styles.rtlText]}>{player.notes}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Recent Games */}
          {games.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
                {language === 'ar' ? 'آخر المباريات' : 'Recent Games'}
              </Text>
              
              {games.map((game) => {
                const isHome = game.home.includes(team.nameEn) || game.home === team.nameAr;
                const isWinner = game.winner.includes(team.nameEn) || game.winner === team.nameAr;
                
                return (
                  <Pressable 
                    key={game.id} 
                    style={styles.gameCard}
                    onPress={() => router.push(`/game/${game.id}`)}
                  >
                    <View style={[styles.gameResult, { backgroundColor: isWinner ? Colors.dark.success + '20' : Colors.dark.error + '20' }]}>
                      <Text style={[styles.gameResultText, { color: isWinner ? Colors.dark.success : Colors.dark.error }]}>
                        {isWinner ? 'W' : 'L'}
                      </Text>
                    </View>
                    <View style={[styles.gameInfo, isRTL && { alignItems: 'flex-end' }]}>
                      <Text style={[styles.gameOpponent, isRTL && styles.rtlText]}>
                        {isHome ? `vs ${game.away}` : `@ ${game.home}`}
                      </Text>
                      <Text style={[styles.gameScore, isRTL && styles.rtlText]}>
                        {game.homeScore} - {game.awayScore}
                      </Text>
                    </View>
                    <Text style={styles.gameDate}>
                      {formatSafeDate(game.date, language === 'ar' ? 'ar-LB' : 'en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  rtl: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.surface + 'CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.surface + 'CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  teamLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.lg,
  },
  teamInitials: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.extrabold,
    color: '#fff',
  },
  teamName: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.dark.text,
  },
  teamCity: {
    fontSize: FontSizes.md,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.md,
    ...Shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.dark.text,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.dark.border,
  },
  section: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },
  infoCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSizes.xs,
    color: Colors.dark.textMuted,
  },
  infoValue: {
    fontSize: FontSizes.md,
    color: Colors.dark.text,
    fontWeight: FontWeights.medium,
    marginTop: 2,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInitial: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
  playerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  playerName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.dark.text,
  },
  playerNotes: {
    fontSize: FontSizes.sm,
    color: Colors.dark.primary,
    marginTop: 2,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  gameResult: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameResultText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  gameInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  gameOpponent: {
    fontSize: FontSizes.md,
    color: Colors.dark.text,
    fontWeight: FontWeights.medium,
  },
  gameScore: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  gameDate: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textMuted,
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: FontSizes.lg,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
  backLink: {
    color: Colors.dark.primary,
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
