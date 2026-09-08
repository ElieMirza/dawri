import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, DarkTheme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  DMSans_800ExtraBold,
} from '@expo-google-fonts/dm-sans';
import {
  NotoSansArabic_400Regular,
  NotoSansArabic_500Medium,
  NotoSansArabic_700Bold,
} from '@expo-google-fonts/noto-sans-arabic';
import {
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { AppProvider } from '../context/AppContext';
import { Colors, Fonts } from '../constants/theme';
import '../i18n';

SplashScreen.preventAutoHideAsync();

const DawriDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.primary,
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMSans_800ExtraBold,
    NotoSansArabic_400Regular,
    NotoSansArabic_500Medium,
    NotoSansArabic_700Bold,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const id = 'dawri-font-base';
        let style = document.getElementById(id) as HTMLStyleElement | null;
        if (!style) {
          style = document.createElement('style');
          style.id = id;
          document.head.appendChild(style);
        }
        // Ensure Noto Sans Arabic is selectable by family name after useFonts loads
        style.textContent = `
          @font-face {
            font-family: 'NotoSansArabic_400Regular';
            src: local('Noto Sans Arabic'), local('NotoSansArabic');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'NotoSansArabic_500Medium';
            src: local('Noto Sans Arabic Medium'), local('NotoSansArabic');
            font-weight: 500;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'NotoSansArabic_700Bold';
            src: local('Noto Sans Arabic Bold'), local('NotoSansArabic');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
          html, body, #root {
            background-color: ${Colors.dark.background} !important;
            color: ${Colors.dark.text};
            font-family: 'DMSans_400Regular', 'DM Sans', system-ui, sans-serif;
          }
          html[lang="ar"] body, html[lang="ar"] #root, .dawri-ar {
            font-family: 'NotoSansArabic_400Regular', 'Noto Sans Arabic', Tahoma, sans-serif !important;
          }
          * { -webkit-tap-highlight-color: transparent; }
        `;
      }
      const T = Text as typeof Text & { defaultProps?: { style?: object } };
      T.defaultProps = T.defaultProps || {};
      T.defaultProps.style = { fontFamily: Fonts.regular };
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} />
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={DawriDarkTheme}>
        <AppProvider>
          <View style={styles.container}>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.dark.background },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="team/[id]"
                options={{
                  headerShown: false,
                  presentation: 'card',
                }}
              />
              <Stack.Screen
                name="game/[id]"
                options={{
                  headerShown: false,
                  presentation: 'card',
                }}
              />
              <Stack.Screen
                name="privacy"
                options={{
                  headerShown: false,
                  presentation: 'modal',
                }}
              />
              <Stack.Screen
                name="about"
                options={{
                  headerShown: false,
                  presentation: 'modal',
                }}
              />
            </Stack>
          </View>
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
});
