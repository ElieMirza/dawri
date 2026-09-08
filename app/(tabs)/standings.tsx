import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useData } from '@/hooks/useData';

export default function StandingsScreen() {
  const { t } = useTranslation();
  const { standings, getTeam } = useData();

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'champion':
        return (
          <View style={[styles.statusBadge, styles.championBadge]}>
            <Ionicons name="trophy" size={10} color={Colors.dark.gold} style={{ marginRight: 2 }} />
            <Text style={[styles.statusText, styles.championText]}>{t('standings.champion')}</Text>
          </View>
        );
      case 'runner-up':
        return (
          <View style={[styles.statusBadge, styles.runnerUpBadge]}>
            <Text style={styles.statusText}>{t('standings.runnerUp')}</Text>
          </View>
        );
      case 'playoffs':
        return (
          <View style={[styles.statusBadge, styles.playoffsBadge]}>
            <Text style={styles.statusText}>{t('standings.playoffs')}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('standings.title')}</Text>
        <Text style={styles.subtitle}>{t('standings.season')}</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.rankCell]}>{t('standings.rank')}</Text>
          <Text style={[styles.headerCell, styles.teamCell]}>{t('standings.team')}</Text>
          <Text style={[styles.headerCell, styles.statCell]}>{t('standings.played')}</Text>
          <Text style={[styles.headerCell, styles.statCell]}>{t('standings.wins')}</Text>
          <Text style={[styles.headerCell, styles.statCell]}>{t('standings.losses')}</Text>
          <Text style={[styles.headerCell, styles.statCell]}>{t('standings.points')}</Text>
        </View>

        {/* Table Rows */}
        {standings.map((standing) => {
          const team = getTeam(standing.teamId);
          if (!team) return null;

          return (
            <Pressable
              key={standing.teamId}
              style={[
                styles.tableRow,
                standing.status === 'champion' && styles.championRow,
                standing.status === 'runner-up' && styles.runnerUpRow,
              ]}
              onPress={() => router.push(`/team/${team.id}`)}
            >
              <Text style={[styles.cell, styles.rankCell, styles.rankText]}>
                {standing.rank}
              </Text>
              <View style={[styles.teamCell, styles.teamContent]}>
                <View style={{ flexShrink: 1 }}>
                  <Text style={styles.teamNameEn}>{team.nameEn}</Text>
                  <Text style={styles.teamNameAr}>{team.nameAr}</Text>
                </View>
                {standing.status ? getStatusBadge(standing.status) : null}
              </View>
              <Text style={[styles.cell, styles.statCell]}>{standing.played}</Text>
              <Text style={[styles.cell, styles.statCell, styles.winsText]}>{standing.wins}</Text>
              <Text style={[styles.cell, styles.statCell, styles.lossesText]}>
                {standing.losses}
              </Text>
              <Text style={[styles.cell, styles.statCell, styles.pointsText]}>
                {standing.points}
              </Text>
            </Pressable>
          );
        })}
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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  title: {
    color: Colors.dark.text,
    fontSize: FontSizes.xxl,
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  subtitle: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
    marginBottom: Spacing.xs,
  },
  headerCell: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.dark.surface,
    marginBottom: 2,
    borderRadius: BorderRadius.sm,
  },
  championRow: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.dark.gold,
  },
  runnerUpRow: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.dark.textSecondary,
  },
  cell: {
    color: Colors.dark.text,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
  },
  rankCell: {
    width: 28,
    textAlign: 'center',
  },
  rankText: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: FontSizes.md,
  },
  teamCell: {
    flex: 1,
    minWidth: 100,
  },
  teamContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: Spacing.sm,
  },
  teamNameEn: {
    color: Colors.dark.text,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
  },
  teamNameAr: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.xs,
    fontFamily: 'NotoSansArabic_400Regular',
  },
  statCell: {
    width: 36,
    textAlign: 'center',
  },
  winsText: {
    color: Colors.dark.success,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  lossesText: {
    color: Colors.dark.error,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  pointsText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    color: Colors.dark.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  championBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  runnerUpBadge: {
    backgroundColor: Colors.dark.surfaceElevated,
  },
  playoffsBadge: {
    backgroundColor: 'rgba(0, 179, 107, 0.15)',
  },
  statusText: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_500Medium',
  },
  championText: {
    color: Colors.dark.gold,
  },
});
