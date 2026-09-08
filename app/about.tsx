import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';

export default function AboutScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="basketball" size={48} color={Colors.dark.primary} />
          </View>
          <Text style={styles.appName}>{t('app.name')}</Text>
          <Text style={styles.tagline}>{t('app.tagline')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.description}>{t('about.description')}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color={Colors.dark.primary} />
            <Text style={styles.infoText}>{t('about.owner')}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.disclaimer}>{t('about.disclaimer')}</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.dark.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  appName: {
    color: Colors.dark.text,
    fontSize: FontSizes.xxxl,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  tagline: {
    color: Colors.dark.textSecondary,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_400Regular',
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  description: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoText: {
    color: Colors.dark.text,
    fontSize: FontSizes.md,
    fontFamily: 'Inter_500Medium',
  },
  disclaimer: {
    color: Colors.dark.textMuted,
    fontSize: FontSizes.sm,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
});
