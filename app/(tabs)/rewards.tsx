import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Fonts, Shadows, fontFamily } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

interface Reward {
  id: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  points: number;
  partner: { en: string; ar: string };
  icon: keyof typeof Ionicons.glyphMap;
  category: 'merchandise' | 'food' | 'experience' | 'discount';
}

const rewards: Reward[] = [
  {
    id: 'r1',
    name: { en: 'Team Jersey 10% Off', ar: 'خصم 10% على قميص الفريق' },
    description: { en: 'Discount on official LBL team jerseys', ar: 'خصم على قمصان فرق الدوري الرسمية' },
    points: 2000,
    partner: { en: 'Sports Zone Lebanon', ar: 'سبورتس زون لبنان' },
    icon: 'shirt',
    category: 'merchandise',
  },
  {
    id: 'r2',
    name: { en: 'Free Coffee', ar: 'قهوة مجانية' },
    description: { en: 'Any size at Café Younes', ar: 'أي حجم في مقهى يونس' },
    points: 1500,
    partner: { en: 'Café Younes', ar: 'مقهى يونس' },
    icon: 'cafe',
    category: 'food',
  },
  {
    id: 'r3',
    name: { en: 'Courtside Experience', ar: 'تجربة جانب الملعب' },
    description: { en: 'Watch warm-ups courtside before a game', ar: 'شاهد الإحماء جانب الملعب قبل المباراة' },
    points: 10000,
    partner: { en: 'DAWRI Exclusive', ar: 'حصري من الدوري' },
    icon: 'basketball',
    category: 'experience',
  },
  {
    id: 'r4',
    name: { en: 'Basketball Keychain', ar: 'ميدالية كرة سلة' },
    description: { en: 'Official LBL branded keychain', ar: 'ميدالية رسمية من الدوري' },
    points: 500,
    partner: { en: 'LBL Store', ar: 'متجر الدوري' },
    icon: 'key',
    category: 'merchandise',
  },
  {
    id: 'r5',
    name: { en: 'Manoushe Combo', ar: 'كومبو مناقيش' },
    description: { en: 'Zaatar + cheese + drink', ar: 'زعتر + جبنة + مشروب' },
    points: 1000,
    partner: { en: 'Furn El Sabaya', ar: 'فرن الصبايا' },
    icon: 'pizza',
    category: 'food',
  },
  {
    id: 'r6',
    name: { en: 'Meet & Greet Entry', ar: 'لقاء مع اللاعبين' },
    description: { en: 'Entry to post-season meet & greet', ar: 'دخول لحدث لقاء ما بعد الموسم' },
    points: 15000,
    partner: { en: 'DAWRI Exclusive', ar: 'حصري من الدوري' },
    icon: 'people',
    category: 'experience',
  },
];

const checkInGames = [
  { id: 'ci-1', name: { en: 'Finals Game 7 Replay Screening', ar: 'عرض إعادة المباراة السابعة' }, venue: { en: 'Saeb Salam Arena', ar: 'ملعب صائب سلام' }, date: '2026-09-15' },
  { id: 'ci-2', name: { en: 'Season Opener 2026-27', ar: 'افتتاح موسم 2026-27' }, venue: { en: 'Various Arenas', ar: 'ملاعب متعددة' }, date: '2026-10-18' },
  { id: 'ci-3', name: { en: 'All-Star Weekend', ar: 'عطلة كل النجوم' }, venue: { en: 'Ghazir Stadium', ar: 'ملعب غزير' }, date: '2027-02-14' },
];

export default function RewardsScreen() {
  const { t } = useTranslation();
  const { isRTL, language, points, getTier, getTierProgress, addCheckIn, redeemReward, checkIns } = useApp();
  const tier = getTier();
  const tierProgress = getTierProgress();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const ff = (w: 'regular' | 'medium' | 'semibold' | 'bold' | 'display' = 'regular') => ({
    fontFamily: fontFamily(language, w),
  });

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleCheckIn = (gameId: string) => {
    if (checkIns.some((c) => c.gameId === gameId)) {
      flash(language === 'ar' ? 'سبق تسجيل الحضور' : 'Already checked in');
      return;
    }
    addCheckIn(gameId);
    flash(t('rewards.pointsEarned') || (language === 'ar' ? '+1,000 نقطة!' : '+1,000 points earned!'));
    setShowCheckIn(false);
  };

  const handleRedeem = (reward: Reward) => {
    if (points < reward.points) {
      flash(
        language === 'ar'
          ? `تحتاج ${reward.points - points} نقطة إضافية`
          : `Need ${reward.points - points} more points`
      );
      return;
    }
    if (confirmId !== reward.id) {
      setConfirmId(reward.id);
      return;
    }
    const ok = redeemReward(reward.points);
    setConfirmId(null);
    if (ok) {
      flash(language === 'ar' ? 'تم الاستبدال — استمتع!' : 'Redeemed — enjoy your reward!');
    }
  };

  const nextTierName = tier === 'fan' ? 'regular' : tier === 'regular' ? 'ultra' : tier === 'ultra' ? 'legend' : 'legend';
  const progressPercent = tier === 'legend' ? 100 : (tierProgress.current / Math.max(1, tierProgress.next)) * 100;

  const tierBg =
    tier === 'legend' ? '#ff6b35' : tier === 'ultra' ? '#c9a227' : tier === 'regular' ? '#3a7acc' : '#5a5a6a';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors.dark.background }]} edges={['top']}>
        <ScrollView
          style={{ flex: 1, backgroundColor: Colors.dark.background }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Spacing.xxl }}
        >
          <View style={styles.header}>
            <Text style={[styles.title, ff('display'), isRTL && styles.rtlText]}>{t('rewards.title')}</Text>
            <Text style={[styles.subtitle, ff('regular'), isRTL && styles.rtlText]}>
              {language === 'ar' ? 'اكسب · استبدل · احتفل' : 'Earn · Redeem · Celebrate'}
            </Text>
          </View>

          {toast ? (
            <View style={styles.toast}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.dark.earned} />
              <Text style={[styles.toastText, ff('medium')]}>{toast}</Text>
            </View>
          ) : null}

          {/* Points & Tier */}
          <View style={[styles.pointsCard, { backgroundColor: tierBg }]}>
            <View style={[styles.pointsHeader, isRTL && styles.rtl]}>
              <View>
                <Text style={[styles.pointsLabel, ff('medium')]}>{t('rewards.pointsBalance')}</Text>
                <Text style={[styles.pointsValue, ff('display')]}>{points.toLocaleString()}</Text>
              </View>
              <View style={styles.tierBadge}>
                <Ionicons
                  name={tier === 'legend' ? 'flame' : tier === 'ultra' ? 'star' : 'person'}
                  size={28}
                  color="#fff"
                />
              </View>
            </View>
            <View style={styles.tierSection}>
              <View style={[styles.tierInfo, isRTL && styles.rtl]}>
                <Text style={[styles.tierName, ff('bold')]}>{t(`tiers.${tier}`)}</Text>
                {tier !== 'legend' && (
                  <Text style={[styles.tierNext, ff('regular')]}>
                    {tierProgress.checkInsToNext} {t('rewards.checkInsAway')} → {t(`tiers.${nextTierName}`)}
                  </Text>
                )}
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>
            </View>
          </View>

          {/* Attend CTA */}
          <Pressable style={[styles.checkInButton, isRTL && styles.rtl]} onPress={() => setShowCheckIn((v) => !v)}>
            <View style={styles.checkInIcon}>
              <Ionicons name="location" size={24} color={Colors.dark.primary} />
            </View>
            <View style={[styles.checkInContent, isRTL && { alignItems: 'flex-end', marginLeft: 0, marginRight: Spacing.md }]}>
              <Text style={[styles.checkInTitle, ff('semibold'), isRTL && styles.rtlText]}>{t('rewards.checkInGame')}</Text>
              <Text style={[styles.checkInSubtitle, ff('regular'), isRTL && styles.rtlText]}>
                {t('rewards.earnPerGame') || (language === 'ar' ? '+1,000 نقطة لكل حضور' : '+1,000 pts per attend')}
              </Text>
            </View>
            <Ionicons name={showCheckIn ? 'chevron-up' : 'chevron-forward'} size={24} color={Colors.dark.textMuted} />
          </Pressable>

          {showCheckIn && (
            <View style={styles.checkInList}>
              {checkInGames.map((game) => {
                const isCheckedIn = checkIns.some((c) => c.gameId === game.id);
                return (
                  <Pressable
                    key={game.id}
                    style={[styles.checkInItem, isCheckedIn && styles.checkInItemDone, isRTL && styles.rtl]}
                    onPress={() => handleCheckIn(game.id)}
                    disabled={isCheckedIn}
                  >
                    <View style={[styles.checkInItemContent, isRTL && { alignItems: 'flex-end' }]}>
                      <Text style={[styles.checkInItemName, ff('semibold'), isRTL && styles.rtlText]}>
                        {language === 'ar' ? game.name.ar : game.name.en}
                      </Text>
                      <Text style={[styles.checkInItemVenue, ff('regular'), isRTL && styles.rtlText]}>
                        {language === 'ar' ? game.venue.ar : game.venue.en} · {game.date}
                      </Text>
                    </View>
                    {isCheckedIn ? (
                      <Ionicons name="checkmark-circle" size={24} color={Colors.dark.earned} />
                    ) : (
                      <View style={styles.checkInItemButton}>
                        <Text style={[styles.checkInItemButtonText, ff('bold')]}>+1,000</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Redeem catalog — at least 3 cards */}
          <View style={styles.catalogSection}>
            <Text style={[styles.sectionTitle, ff('bold'), isRTL && styles.rtlText]}>{t('rewards.catalog')}</Text>
            {rewards.map((reward) => {
              const canAfford = points >= reward.points;
              const confirming = confirmId === reward.id;
              return (
                <Pressable
                  key={reward.id}
                  style={[styles.rewardCard, !canAfford && styles.rewardCardDisabled, isRTL && styles.rtl]}
                  onPress={() => handleRedeem(reward)}
                >
                  <View style={[styles.rewardIcon, { backgroundColor: getCategoryColor(reward.category) + '22' }]}>
                    <Ionicons name={reward.icon} size={24} color={getCategoryColor(reward.category)} />
                  </View>
                  <View style={[styles.rewardInfo, isRTL && { alignItems: 'flex-end', marginLeft: 0, marginRight: Spacing.md }]}>
                    <Text style={[styles.rewardName, ff('semibold'), isRTL && styles.rtlText]}>
                      {language === 'ar' ? reward.name.ar : reward.name.en}
                    </Text>
                    <Text style={[styles.rewardPartner, ff('regular'), isRTL && styles.rtlText]}>
                      {language === 'ar' ? reward.partner.ar : reward.partner.en}
                    </Text>
                    <Text style={[styles.rewardDesc, ff('regular'), isRTL && styles.rtlText]}>
                      {confirming
                        ? language === 'ar'
                          ? 'اضغط مجدداً للتأكيد'
                          : 'Tap again to confirm redeem'
                        : language === 'ar'
                          ? reward.description.ar
                          : reward.description.en}
                    </Text>
                  </View>
                  <View style={styles.rewardPoints}>
                    <Text style={[styles.rewardPointsValue, ff('bold'), !canAfford && styles.rewardPointsDisabled]}>
                      {reward.points.toLocaleString()}
                    </Text>
                    <Text style={[styles.rewardPointsLabel, ff('regular')]}>{t('rewards.pts')}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'merchandise':
      return Colors.dark.primary;
    case 'food':
      return Colors.dark.warning;
    case 'experience':
      return Colors.dark.gold;
    case 'discount':
      return Colors.dark.accent;
    default:
      return Colors.dark.primary;
  }
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  rtlText: { textAlign: 'right' },
  rtl: { flexDirection: 'row-reverse' },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.dark.earned + '22',
    borderColor: Colors.dark.earned + '66',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  toastText: { color: Colors.dark.text, fontSize: FontSizes.sm, flex: 1 },
  pointsCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.lg,
  },
  pointsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pointsLabel: { fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.85)', fontWeight: FontWeights.medium },
  pointsValue: { fontSize: FontSizes.hero, fontWeight: FontWeights.extrabold, color: '#fff', marginTop: 4 },
  tierBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierSection: { marginTop: Spacing.lg },
  tierInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  tierName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tierNext: { fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.75)' },
  progressBar: { height: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 4 },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  checkInIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInContent: { flex: 1, marginLeft: Spacing.md },
  checkInTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.dark.text },
  checkInSubtitle: { fontSize: FontSizes.sm, color: Colors.dark.earned, marginTop: 2 },
  checkInList: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md, gap: Spacing.sm },
  checkInItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  checkInItemDone: { opacity: 0.65 },
  checkInItemContent: { flex: 1 },
  checkInItemName: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.dark.text },
  checkInItemVenue: { fontSize: FontSizes.sm, color: Colors.dark.textSecondary, marginTop: 2 },
  checkInItemButton: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  checkInItemButtonText: { fontSize: FontSizes.sm, fontWeight: FontWeights.bold, color: '#fff' },
  catalogSection: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  rewardCardDisabled: { opacity: 0.55 },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardInfo: { flex: 1, marginLeft: Spacing.md },
  rewardName: { fontSize: FontSizes.md, fontWeight: FontWeights.semibold, color: Colors.dark.text },
  rewardPartner: { fontSize: FontSizes.xs, color: Colors.dark.primary, marginTop: 2 },
  rewardDesc: { fontSize: FontSizes.xs, color: Colors.dark.textMuted, marginTop: 2 },
  rewardPoints: { alignItems: 'flex-end' },
  rewardPointsValue: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.dark.text },
  rewardPointsDisabled: { color: Colors.dark.textMuted },
  rewardPointsLabel: { fontSize: FontSizes.xs, color: Colors.dark.textMuted },
});
