import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

type TabIconName = 'home' | 'calendar' | 'trophy' | 'gift' | 'ellipsis-horizontal';

export default function TabLayout() {
  const { t } = useTranslation();

  const getTabIcon = (name: TabIconName, focused: boolean) => {
    const iconName = focused ? name : (`${name}-outline` as const);
    return (props: { color: string; size: number }) => (
      <Ionicons name={iconName as any} size={props.size} color={props.color} />
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.dark.primary,
        tabBarInactiveTintColor: Colors.dark.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.dark.surface,
          borderTopColor: Colors.dark.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 11,
        },
        sceneStyle: {
          backgroundColor: Colors.dark.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: getTabIcon('home', false),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: t('tabs.schedule'),
          tabBarIcon: getTabIcon('calendar', false),
        }}
      />
      <Tabs.Screen
        name="standings"
        options={{
          title: t('tabs.standings'),
          tabBarIcon: getTabIcon('trophy', false),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: t('tabs.rewards'),
          tabBarIcon: getTabIcon('gift', false),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: t('tabs.more'),
          tabBarIcon: getTabIcon('ellipsis-horizontal', false),
        }}
      />
    </Tabs>
  );
}
