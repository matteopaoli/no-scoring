import { Tabs } from 'expo-router';
import { Gift, Map, Search, Settings, User } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const icon =
    (Icon: any) =>
    ({ color, size, focused }: { color: string; size: number; focused: boolean }) =>
      <Icon size={focused ? size + 2 : size} color={color} />;

  return (
    <>
      <StatusBar style={theme.type === 'dark' ? 'light' : 'dark'} backgroundColor={theme.background} />

      <Tabs
        screenOptions={{
          sceneStyle: {
            paddingBottom: 90,
          },
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: true,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.subtext,
          tabBarLabelStyle: {
            fontFamily: theme.fontRegular,
            fontSize: theme.fontSize - 4,
            marginTop: 2,
            color: theme.text,
          },
          tabBarStyle: {
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: insets.bottom + 10,
            height: 72,
            marginHorizontal: 10,
            paddingHorizontal: 3,
            paddingTop: 8,
            borderRadius: 18,
            backgroundColor: theme.cardBackgroundColor,
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: theme.type === 'dark' ? 0.3 : 0.08,
            shadowRadius: 10,
            ...(Platform.OS === 'ios'
              ? { backdropFilter: 'blur(10px)', backgroundColor: `${theme.cardBackgroundColor}DD` }
              : {}),
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Esplora',
            tabBarIcon: icon(Map),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Cerca',
            tabBarIcon: icon(Search),
          }}
        />
        <Tabs.Screen
          name="customer/index"
          options={{
            title: 'Profilo',
            tabBarIcon: icon(User),
            ...(user?.role === 'customer' ? {} : { href: null }),
          }}
        />
        <Tabs.Screen
          name="(auth)"
          options={{
            title: 'Accedi',
            tabBarIcon: icon(User),
            ...(!!user ? { href: null } : {}),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Impostazioni',
            tabBarIcon: icon(Settings),
          }}
        />
        <Tabs.Screen
          name="customer/refer-merchant"
          options={{
            title: 'Invita',
            tabBarIcon: icon(Gift),
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
