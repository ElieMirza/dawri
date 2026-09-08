import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows, formatSafeDate } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { useData } from '../../hooks/useData';

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { isRTL, language, addCheckIn, checkIns, points } = useApp();
  const { getGame, getTeamByName, getFinalsGame } = useData();

  const game = getGame(id || '');
  const finalsGame = id?.startsWith('finals-g') ? getFinalsGame(parseInt(id.replace('finals-g', ''))) : null;
  
  const homeTeam = game ? getTeamByName(game.home) : null;
  const awayTeam = game ? getTeamByName(game.away) : null;

  const isCheckedIn = checkIns.some(c => c.gameId === id);

  if (!game) {
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

  const handleCheckIn = () => {
    if (isCheckedIn) {
      Alert.alert(
        language === 'ar' ? 'سبق تسجيل الحضور' : 'Already Checked In',
        language === 'ar' ? 'لقد سجلت حضورك في هذه المباراة' : 'You have already checked in to this game'
      );
      return;
    }
    
    addCheckIn(id!);
    Alert.alert(
      t('rewards.checkInSuccess'),
      t('rewards.pointsEarned')
    );
  };

  const formatDate = (dateStr: string) => {
    return formatSafeDate(dateStr, language === 'ar' ? 'ar-LB' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTeamName = (name: string) => {
    const team = getTeamByName(name);
    if (team) {
      return language === 'ar' ? team.nameAr : team.nameEn;
    }
    return name;
  };

  const isChampionshipGame = finalsGame?.game === 7;
  const homeWon = game.winner === game.home;
  const awayWon = game.winner === game.away;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.dark.primary + '40', Colors.dark.background]}
        style={styles.gradient}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, isRTL && styles.rtl]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={24} color={Colors.dark.text} />
          </Pressable>
          {game.type === 'finals' && (
            <View style={styles.finalsTag}>
              <Ionicons name="trophy" size={14} color={Colors.dark.gold} />
              <Text style={styles.finalsTagText}>
                {t('schedule.finals')} {game.game && `G${game.game}`}
              </Text>
            </View>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Championship Banner */}
          {isChampionshipGame && (
            <View style={styles.championBanner}>
              <Ionicons name="trophy" size={32} color={Colors.dark.gold} />
              <Text style={styles.championText}>
                {language === 'ar' ? 'مباراة البطولة' : 'Championship Game'}
              </Text>
            </View>
          )}

          {/* Score Card */}
          <View style={styles.scoreCard}>
            <View style={styles.dateRow}>
              <Text style={[styles.dateText, isRTL && styles.rtlText]}>{formatDate(game.date)}</Text>
            </View>

            <View style={styles.teamsContainer}>
              {/* Home Team */}
              <Pressable 
                style={styles.teamSide}
                onPress={() => homeTeam && router.push(`/team/${homeTeam.id}`)}
              >
                <View style={[styles.teamLogo, { backgroundColor: homeTeam?.colors[0] || Colors.dark.primary }]}>
                  <Text style={styles.teamInitials}>
                    {game.home.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </Text>
                </View>
                <Text style={[styles.teamName, isRTL && styles.rtlText]} numberOfLines={2}>
                  {getTeamName(game.home)}
                </Text>
                {homeWon && <Text style={styles.winnerLabel}>{language === 'ar' ? 'فائز' : 'WIN'}</Text>}
              </Pressable>

              {/* Score */}
              <View style={styles.scoreContainer}>
                <View style={styles.scoreRow}>
                  <Text style={[styles.score, homeWon && styles.winnerScore]}>{game.homeScore}</Text>
                  <Text style={styles.scoreDivider}>-</Text>
                  <Text style={[styles.score, awayWon && styles.winnerScore]}>{game.awayScore}</Text>
                </View>
                <Text style={styles.finalLabel}>{t('game.final')}</Text>
              </View>

              {/* Away Team */}
              <Pressable 
                style={styles.teamSide}
                onPress={() => awayTeam && router.push(`/team/${awayTeam.id}`)}
              >
                <View style={[styles.teamLogo, { backgroundColor: awayTeam?.colors[0] || Colors.dark.secondary }]}>
                  <Text style={styles.teamInitials}>
                    {game.away.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </Text>
                </View>
                <Text style={[styles.teamName, isRTL && styles.rtlText]} numberOfLines={2}>
                  {getTeamName(game.away)}
                </Text>
                {awayWon && <Text style={styles.winnerLabel}>{language === 'ar' ? 'فائز' : 'WIN'}</Text>}
              </Pressable>
            </View>

            {/* Series Status */}
            {game.type === 'finals' && finalsGame && (
              <View style={styles.seriesStatus}>
                <Text style={styles.seriesText}>
                  {language === 'ar' ? 'السلسلة' : 'Series'}: {game.game === 7 ? 'Al Riyadi 4-3' : `Game ${game.game} of 7`}
                </Text>
              </View>
            )}
          </View>

          {/* Venue Info */}
          {game.venue && (
            <View style={styles.venueCard}>
              <Ionicons name="location" size={20} color={Colors.dark.primary} />
              <Text style={[styles.venueText, isRTL && styles.rtlText]}>{game.venue}</Text>
            </View>
          )}

          {/* Check-In Button */}
          <Pressable 
            style={[styles.checkInButton, isCheckedIn && styles.checkInButtonDone]}
            onPress={handleCheckIn}
          >
            <Ionicons 
              name={isCheckedIn ? 'checkmark-circle' : 'location'} 
              size={24} 
              color={isCheckedIn ? Colors.dark.success : Colors.dark.background} 
            />
            <Text style={[styles.checkInText, isCheckedIn && styles.checkInTextDone]}>
              {isCheckedIn ? t('game.checkedIn') : t('game.checkIn')}
            </Text>
            {!isCheckedIn && (
              <Text style={styles.checkInPoints}>+1,000 {t('rewards.pts')}</Text>
            )}
          </Pressable>

          {/* Highlights */}
          {(game.highlights || finalsGame?.highlights) && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('game.highlights')}</Text>
              <View style={styles.highlightsCard}>
                <Text style={[styles.highlightsText, isRTL && styles.rtlText]}>
                  {game.highlights || finalsGame?.highlights}
                </Text>
              </View>
            </View>
          )}

          {/* Finals MVP */}
          {isChampionshipGame && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('home.finalsMvp')}</Text>
              <View style={styles.mvpCard}>
                <View style={styles.mvpIcon}>
                  <Ionicons name="medal" size={28} color={Colors.dark.gold} />
                </View>
                <View style={styles.mvpInfo}>
                  <Text style={[styles.mvpName, isRTL && styles.rtlText]}>Karim Zeinoun</Text>
                  <Text style={[styles.mvpStats, isRTL && styles.rtlText]}>32 pts, 6 ast, 4 stl</Text>
                  <Text style={[styles.mvpTeam, isRTL && styles.rtlText]}>Al Riyadi</Text>
                </View>
              </View>
            </View>
          )}

          {/* Source Attribution */}
          <View style={styles.sourceSection}>
            <Text style={styles.sourceText}>
              {language === 'ar' ? 'المصدر' : 'Source'}: {game.source || 'riyadi.com'}
            </Text>
          </View>

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
    height: 250,
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
  finalsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.gold + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  finalsTagText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.dark.gold,
  },
  championBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.gold + '20',
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  championText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.dark.gold,
  },
  scoreCard: {
    backgroundColor: Colors.dark.card,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  dateRow: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dateText: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textSecondary,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  teamSide: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  teamInitials: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.extrabold,
    color: '#fff',
  },
  teamName: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: Colors.dark.text,
    textAlign: 'center',
    maxWidth: 80,
  },
  winnerLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.dark.success,
    marginTop: Spacing.xs,
  },
  scoreContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    fontSize: FontSizes.hero,
    fontWeight: FontWeights.extrabold,
    color: Colors.dark.textMuted,
  },
  winnerScore: {
    color: Colors.dark.primary,
  },
  scoreDivider: {
    fontSize: FontSizes.xxl,
    color: Colors.dark.textMuted,
    marginHorizontal: Spacing.sm,
  },
  finalLabel: {
    fontSize: FontSizes.xs,
    color: Colors.dark.textMuted,
    textTransform: 'uppercase',
    marginTop: Spacing.xs,
  },
  seriesStatus: {
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  seriesText: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textSecondary,
  },
  venueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  venueText: {
    fontSize: FontSizes.md,
    color: Colors.dark.text,
    flex: 1,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  checkInButtonDone: {
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.success,
  },
  checkInText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.dark.background,
  },
  checkInTextDone: {
    color: Colors.dark.success,
  },
  checkInPoints: {
    fontSize: FontSizes.sm,
    color: Colors.dark.background,
    opacity: 0.8,
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
  highlightsCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  highlightsText: {
    fontSize: FontSizes.md,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
  },
  mvpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.gold + '40',
  },
  mvpIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.gold + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mvpInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  mvpName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.dark.text,
  },
  mvpStats: {
    fontSize: FontSizes.md,
    color: Colors.dark.primary,
    marginTop: 2,
  },
  mvpTeam: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  sourceSection: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  sourceText: {
    fontSize: FontSizes.xs,
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
