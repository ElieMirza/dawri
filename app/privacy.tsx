import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';

export default function PrivacyScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.intro}>{t('privacy.intro')}</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="server" size={20} color={Colors.dark.primary} />
            <Text style={styles.sectionTitle}>{t('privacy.dataCollection')}</Text>
          </View>
          <Text style={styles.sectionText}>{t('privacy.dataCollectionText')}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color={Colors.dark.primary} />
            <Text style={styles.sectionTitle}>{t('privacy.location')}</Text>
          </View>
          <Text style={styles.sectionText}>{t('privacy.locationText')}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="mail" size={20} color={Colors.dark.primary} />
            <Text style={styles.sectionTitle}>{t('privacy.contact')}</Text>
          </View>
          <Text style={styles.sectionText}>{t('privacy.contactText')}</Text>
        </View>
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
  intro: {
    color: Colors.dark.text,
    fontSize: FontSizes.lg,
    fontFamily: 'Inter_500Medium',
    marginBottom: Spacing.xl,
  },
  section: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_600SemiBold',
  },
  sectionText: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
});
