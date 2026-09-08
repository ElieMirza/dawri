import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const { isRTL, language } = useApp();

  const sections = language === 'ar' ? [
    {
      title: 'جمع البيانات',
      icon: 'folder-open' as const,
      content: 'يخزّن الدوري تفضيلاتك (الفريق المفضل، اللغة، تسجيلات الحضور) محلياً على جهازك باستخدام AsyncStorage. لا يتم نقل أي بيانات شخصية إلى خوادم خارجية.',
    },
    {
      title: 'الموقع الجغرافي',
      icon: 'location' as const,
      content: 'الوصول إلى الموقع اختياري ويُستخدم فقط للتحقق من تسجيل الحضور في الملعب. لا يتم تخزين أو مشاركة بيانات الموقع. في وضع العرض التجريبي، تسجيل الحضور لا يتطلب موقعاً.',
    },
    {
      title: 'التحليلات',
      icon: 'analytics' as const,
      content: 'لا يجمع هذا التطبيق أي بيانات تحليلية أو تتبعية. جميع البيانات تبقى على جهازك.',
    },
    {
      title: 'خدمات الطرف الثالث',
      icon: 'globe' as const,
      content: 'لا يتصل التطبيق بأي خدمات طرف ثالث. جميع بيانات الموسم مضمنة في التطبيق.',
    },
    {
      title: 'حقوقك',
      icon: 'shield-checkmark' as const,
      content: 'يمكنك حذف جميع بياناتك في أي وقت عن طريق مسح بيانات التطبيق أو إلغاء تثبيته من جهازك.',
    },
  ] : [
    {
      title: 'Data Collection',
      icon: 'folder-open' as const,
      content: 'DAWRI stores your preferences (favorite team, language, check-ins) locally on your device using AsyncStorage. No personal data is transmitted to external servers.',
    },
    {
      title: 'Location',
      icon: 'location' as const,
      content: 'Location access is optional and only used to verify venue check-ins. Location data is not stored or shared. In demo mode, check-ins do not require location.',
    },
    {
      title: 'Analytics',
      icon: 'analytics' as const,
      content: 'This app does not collect any analytics or tracking data. All data remains on your device.',
    },
    {
      title: 'Third-Party Services',
      icon: 'globe' as const,
      content: 'The app does not connect to any third-party services. All season data is bundled within the app.',
    },
    {
      title: 'Your Rights',
      icon: 'shield-checkmark' as const,
      content: 'You can delete all your data at any time by clearing the app data or uninstalling the app from your device.',
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.header, isRTL && styles.rtl]}>
          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={Colors.dark.text} />
          </Pressable>
          <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{t('privacy.title')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Intro */}
          <View style={styles.introSection}>
            <Ionicons name="shield" size={48} color={Colors.dark.primary} />
            <Text style={[styles.introText, isRTL && styles.rtlText]}>
              {t('privacy.intro')}
            </Text>
          </View>

          {/* Sections */}
          {sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <View style={[styles.sectionHeader, isRTL && styles.rtl]}>
                <View style={styles.sectionIcon}>
                  <Ionicons name={section.icon} size={20} color={Colors.dark.primary} />
                </View>
                <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
                  {section.title}
                </Text>
              </View>
              <Text style={[styles.sectionContent, isRTL && styles.rtlText]}>
                {section.content}
              </Text>
            </View>
          ))}

          {/* Contact */}
          <View style={styles.contactSection}>
            <Text style={[styles.contactTitle, isRTL && styles.rtlText]}>
              {t('privacy.contact')}
            </Text>
            <Text style={[styles.contactText, isRTL && styles.rtlText]}>
              {t('privacy.contactText')}
            </Text>
          </View>

          {/* Last Updated */}
          <Text style={styles.lastUpdated}>
            {language === 'ar' ? 'آخر تحديث: سبتمبر 2026' : 'Last updated: September 2026'}
          </Text>
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
  introSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
    marginBottom: Spacing.lg,
  },
  introText: {
    fontSize: FontSizes.lg,
    color: Colors.dark.text,
    fontWeight: FontWeights.medium,
    marginTop: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.dark.text,
  },
  sectionContent: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textSecondary,
    lineHeight: 22,
    marginLeft: 48,
  },
  contactSection: {
    backgroundColor: Colors.dark.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  contactTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
  },
  contactText: {
    fontSize: FontSizes.sm,
    color: Colors.dark.textSecondary,
  },
  lastUpdated: {
    textAlign: 'center',
    fontSize: FontSizes.xs,
    color: Colors.dark.textMuted,
    marginTop: Spacing.md,
  },
});
