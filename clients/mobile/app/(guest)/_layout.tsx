import { useAppTheme } from '@/contexts/ThemeContext';
import { Tabs } from 'expo-router';
import { Gift, Home, Map, Search, Settings, User } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets()
  const { user } = useAuth()

  return (
    <>
      <StatusBar
        style={theme.type === 'dark' ? 'light' : 'dark'}
        backgroundColor={theme.background}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.cardBackgroundColor,
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: theme.type === 'dark' ? 0.3 : 0.1,
            shadowRadius: 4,
            height: 60 + insets.bottom,
            paddingTop: 10
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.subtext,
          tabBarLabelStyle: {
            fontFamily: theme.fontRegular,
            fontSize: theme.fontSize - 2, // Slightly smaller than body text
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Esplora',
            tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Cerca',
            tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="customer/index"
          options={{
            title: 'Profilo',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            ...(user?.role === 'customer' ? {} : { href: null })
          }}
        />
        <Tabs.Screen
          name="(auth)"
          options={{
            title: 'Accedi',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            ...(!!user ? { href: null } : {})
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Impostazioni',
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="customer/refer-merchant"
          options={{
            title: 'Invita un negozio',
            tabBarIcon: ({ color, size }) => <Gift size={size} color={color} />,
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
