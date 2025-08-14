import { useAppTheme } from '@/contexts/ThemeContext';
import { Tabs } from 'expo-router';
import { Home, PlusCircle, Settings, ShoppingBag } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export default function TabLayout() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const icon =
    (Icon: any) =>
    ({ color, size, focused }: { color: string; size: number; focused: boolean }) =>
      <Icon size={focused ? size + 2 : size} color={color} />;

  return (
    <>
      <StatusBar style={theme.type === 'dark' ? 'light' : 'dark'} backgroundColor={theme.background} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: true,
          tabBarActiveTintColor: theme.primary,   // icon color
          tabBarInactiveTintColor: theme.subtext, // icon color inactive
          tabBarLabelStyle: {
            fontFamily: theme.fontRegular,
            fontSize: theme.fontSize - 3,
            marginTop: 2,
            color: theme.text,
          },
          tabBarStyle: {
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: insets.bottom + 10,
            height: 72,
            paddingHorizontal: 0,
            marginHorizontal: 10,
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
          name="store"
          options={{
            title: 'Home',
            tabBarIcon: icon(Home),
          }}
        />
        <Tabs.Screen
          name="create-payment"
          options={{
            title: 'Nuovo',
            tabBarIcon: icon(PlusCircle),
          }}
        />
        <Tabs.Screen
          name="sales"
          options={{
            title: 'Vendite',
            tabBarIcon: icon(ShoppingBag),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Impostazioni',
            tabBarIcon: icon(Settings),
          }}
        />
      </Tabs>
    </>
  );
}
