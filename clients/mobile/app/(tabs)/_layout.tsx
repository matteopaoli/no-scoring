import { Tabs } from 'expo-router';
import { Home, Map, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: '#666',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Esplora',
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
        }}
      />
      {/* Hide these screens from the tab bar but keep them accessible via direct navigation */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profilo',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="partner"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="auth"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}