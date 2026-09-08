import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import {
  NotoSansArabic_400Regular,
  NotoSansArabic_500Medium,
  NotoSansArabic_600SemiBold,
  NotoSansArabic_700Bold,
} from '@expo-google-fonts/noto-sans-arabic';
import { Colors } from '@/constants/theme';
import '@/i18n';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    NotoSansArabic_400Regular,
    NotoSansArabic_500Medium,
    NotoSansArabic_600SemiBold,
    NotoSansArabic_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.dark.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="game/[id]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: Colors.dark.surface },
            headerTintColor: Colors.dark.text,
            headerTitle: 'Game Details',
          }}
        />
        <Stack.Screen
          name="team/[id]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: Colors.dark.surface },
            headerTintColor: Colors.dark.text,
            headerTitle: 'Team',
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: Colors.dark.surface },
            headerTintColor: Colors.dark.text,
            headerTitle: 'About',
          }}
        />
        <Stack.Screen
          name="privacy"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: Colors.dark.surface },
            headerTintColor: Colors.dark.text,
            headerTitle: 'Privacy Policy',
          }}
        />
      </Stack>
    </>
  );
}
