import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes, TierColors } from '@/constants/theme';

type Tier = 'fan' | 'regular' | 'ultra' | 'legend';

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: keyof typeof Ionicons.glyphMap;
}

const rewards: Reward[] = [
  { id: '1', name: '10% Team Shop', description: 'Discount at any team store', points: 2000, icon: 'pricetag' },
  { id: '2', name: 'Free Popcorn', description: 'At any arena concession', points: 500, icon: 'fast-food' },
  { id: '3', name: 'Meet & Greet Entry', description: 'Enter a player meet & greet raffle', points: 5000, icon: 'people' },
  { id: '4', name: 'VIP Upgrade', description: 'Upgrade to VIP seating (subject to availability)', points: 10000, icon: 'star' },
  { id: '5', name: 'Team Jersey', description: 'Official team jersey of your choice', points: 25000, icon: 'shirt' },
];

export default function RewardsScreen() {
  const { t } = useTranslation();
  const [points] = useState(1250);
  const [checkIns] = useState(4);
  const tier: Tier = 'regular';
  const nextTierCheckIns = 10;

  const getTierColor = (tier: Tier) => TierColors[tier];

  const handleRedeem = (reward: Reward) => {
    if (points >= reward.points) {
      Alert.alert(t('rewards.redeemed'), `${reward.name}`);
    } else {
      Alert.alert(t('rewards.notEnoughPoints'));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('rewards.title')}</Text>

        {/* Points Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>{t('rewards.pointsBalance')}</Text>
            <View style={[styles.tierBadge, { backgroundColor: getTierColor(tier) }]}>
              <Text style={styles.tierBadgeText}>{t(`tiers.${tier}`)}</Text>
            </View>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceValue}>{points.toLocaleString()}</Text>
            <Text style={styles.balancePts}>{t('rewards.pts')}</Text>
          </View>
        </View>

        {/* Tier Progress */}
        <View style={styles.tierCard}>
          <View style={styles.tierHeader}>
            <Text style={styles.tierTitle}>{t('rewards.tierProgress')}</Text>
            <Text style={styles.tierNext}>
              {t('rewards.nextTier')}: {t('tiers.ultra')}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${(checkIns / nextTierCheckIns) * 100}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {checkIns}/{nextTierCheckIns} check-ins • {nextTierCheckIns - checkIns}{' '}
            {t('rewards.checkInsAway')}
          </Text>

          {/* Tier Legend */}
          <View style={styles.tierLegend}>
            {(['fan', 'regular', 'ultra', 'legend'] as Tier[]).map((t, i) => (
              <View key={t} style={styles.tierLegendItem}>
                <View style={[styles.tierDot, { backgroundColor: TierColors[t] }]} />
                <Text
                  style={[styles.tierLegendText, tier === t && { color: Colors.dark.text }]}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Earn Points */}
        <Pressable style={styles.earnCard}>
          <Ionicons name="location" size={24} color={Colors.dark.primary} />
          <View style={styles.earnContent}>
            <Text style={styles.earnTitle}>{t('rewards.earnPoints')}</Text>
            <Text style={styles.earnSubtitle}>{t('rewards.checkInGame')}</Text>
          </View>
          <View style={styles.earnBadge}>
            <Text style={styles.earnBadgeText}>{t('rewards.earnPerGame')}</Text>
          </View>
        </Pressable>

        {/* Rewards Catalog */}
        <Text style={styles.sectionTitle}>{t('rewards.catalog')}</Text>
        {rewards.map((reward) => {
          const canRedeem = points >= reward.points;
          return (
            <Pressable
              key={reward.id}
              style={[styles.rewardCard, !canRedeem && styles.rewardCardDisabled]}
              onPress={() => handleRedeem(reward)}
            >
              <View style={styles.rewardIcon}>
                <Ionicons
                  name={reward.icon}
                  size={24}
                  color={canRedeem ? Colors.dark.primary : Colors.dark.textMuted}
                />
              </View>
              <View style={styles.rewardContent}>
                <Text style={[styles.rewardName, !canRedeem && styles.rewardNameDisabled]}>
                  {reward.name}
                </Text>
                <Text style={styles.rewardDescription}>{reward.description}</Text>
              </View>
              <View style={styles.rewardPoints}>
                <Text style={[styles.rewardPointsValue, canRedeem && styles.rewardPointsActive]}>
                  {reward.points.toLocaleString()}
                </Text>
                <Text style={styles.rewardPointsLabel}>{t('rewards.pts')}</Text>
              </View>
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
  balanceCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  balanceLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_500Medium',
  },
  tierBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  tierBadgeText: {
    color: Colors.dark.text,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  balanceValue: {
    color: Colors.dark.text,
    fontSize: FontSizes.hero,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  balancePts: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.lg,
    fontFamily: 'Inter_500Medium',
  },
  tierCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
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
  tierNext: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_400Regular',
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
    marginBottom: Spacing.md,
  },
  tierLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tierLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  tierDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tierLegendText: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_500Medium',
  },
  earnCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  earnContent: {
    flex: 1,
  },
  earnTitle: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_600SemiBold',
  },
  earnSubtitle: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
  },
  earnBadge: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  earnBadgeText: {
    color: Colors.dark.text,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_600SemiBold',
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: FontSizes.lg,
    fontFamily: 'SpaceGrotesk_600SemiBold',
    marginBottom: Spacing.md,
  },
  rewardCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  rewardCardDisabled: {
    opacity: 0.6,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardContent: {
    flex: 1,
  },
  rewardName: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_600SemiBold',
  },
  rewardNameDisabled: {
    color: Colors.dark.textSecondary,
  },
  rewardDescription: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
  },
  rewardPoints: {
    alignItems: 'flex-end',
  },
  rewardPointsValue: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.lg,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  rewardPointsActive: {
    color: Colors.dark.primary,
  },
  rewardPointsLabel: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.xs,
    fontFamily: 'Inter_400Regular',
  },
});
