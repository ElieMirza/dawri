import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function AboutScreen() {
  const { t } = useTranslation();
  const { isRTL, language } = useApp();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.header, isRTL && styles.rtl]}>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={Colors.dark.text} />
          </Pressable>
          <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{t('about.title')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logo}>
              <Ionicons name="basketball" size={48} color={Colors.dark.primary} />
            </View>
            <Text style={styles.appName}>{language === 'ar' ? 'الدوري' : 'DAWRI'}</Text>
            <Text style={[styles.tagline, isRTL && styles.rtlText]}>{t('app.tagline')}</Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.description, isRTL && styles.rtlText]}>
              {t('about.description')}
            </Text>
          </View>

          {/* Owner */}
          <View style={styles.ownerCard}>
            <Ionicons name="person" size={20} color={Colors.dark.primary} />
            <Text style={[styles.ownerText, isRTL && styles.rtlText]}>
              {t('about.owner')}
            </Text>
          </View>

          {/* Data Sources */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {language === 'ar' ? 'مصادر البيانات' : 'Data Sources'}
            </Text>
            <View style={styles.sourcesList}>
              <SourceItem 
                url="https://en.wikipedia.org/wiki/2025–26_Lebanese_Basketball_League"
                label="Wikipedia - 2025-26 LBL"
              />
              <SourceItem 
                url="https://www.asia-basket.com/Lebanon/Decathlon-Lebanese-Basketball-League_2025-2026.aspx"
                label="Asia-Basket.com"
              />
              <SourceItem 
                url="https://www.riyadi.com/calendar/fixtures-list/"
                label="Riyadi.com"
              />
            </View>
          </View>

          {/* Season Info */}
          <View style={styles.infoCard}>
            <View style={[styles.infoRow, isRTL && styles.rtl]}>
              <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
                {language === 'ar' ? 'الموسم' : 'Season'}
              </Text>
              <Text style={styles.infoValue}>2025-26</Text>
            </View>
            <View style={[styles.infoRow, isRTL && styles.rtl]}>
              <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
                {language === 'ar' ? 'الحالة' : 'Status'}
              </Text>
              <Text style={styles.infoValue}>
                {language === 'ar' ? 'مكتمل' : 'Completed'}
              </Text>
            </View>
            <View style={[styles.infoRow, isRTL && styles.rtl]}>
              <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
                {language === 'ar' ? 'البطل' : 'Champion'}
              </Text>
              <Text style={[styles.infoValue, styles.highlight]}>
                {language === 'ar' ? 'الرياضي' : 'Al Riyadi'}
              </Text>
            </View>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimerSection}>
            <Ionicons name="information-circle" size={20} color={Colors.dark.textMuted} />
            <Text style={[styles.disclaimer, isRTL && styles.rtlText]}>
              {t('about.disclaimer')}
            </Text>
          </View>

          {/* Version */}
          <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const SourceItem = ({ url, label }: { url: string; label: string }) => (
  <Pressable 
    style={styles.sourceItem}
    onPress={() => Linking.openURL(url)}
  >
    <Ionicons name="link" size={16} color={Colors.dark.accent} />
    <Text style={styles.sourceLabel}>{label}</Text>
    <Ionicons name="open-outline" size={14} color={Colors.dark.textMuted} />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  rtl: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.dark.text,
  },
  content: {
    padding: Spacing.md,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.dark.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.extrabold,
    color: Colors.dark.text,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.dark.text,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  ownerText: {
    fontSize: FontSizes.md,
    color: Colors.dark.text,
    fontWeight: FontWeights.medium,
  },
  sourcesList: {
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  sourceLabel: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.dark.accent,
  },
  infoCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  infoLabel: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textMuted,
  },
  infoValue: {
    fontSize: FontSizes.sm,
    color: Colors.dark.text,
    fontWeight: FontWeights.medium,
  },
  highlight: {
    color: Colors.dark.primary,
  },
  disclaimerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  disclaimer: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.dark.textMuted,
    lineHeight: 20,
  },
  version: {
    textAlign: 'center',
    fontSize: FontSizes.sm,
    color: Colors.dark.textMuted,
  },
});
