import { useAppTheme } from '@/contexts/ThemeContext';
import { Tabs } from 'expo-router';
import { Home, Map, PlusCircle, Settings, ShoppingBag, User } from 'lucide-react-native';

export default function TabLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: theme.type === 'dark' ? 0.3 : 0.1,
          shadowRadius: 4,
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
        name="store"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create-payment"
        options={{
          title: 'Nuovo',
          tabBarIcon: ({ color, size }) => (
            <PlusCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: 'Vendite',
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag size={size} color={color} />
          ),
        }}
      />
      {/* Hide these screens from the tab bar but keep them accessible via direct navigation */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Impostazioni',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
