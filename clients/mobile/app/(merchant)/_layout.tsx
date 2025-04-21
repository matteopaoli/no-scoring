import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Stack, Tabs, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Home, Map, PlusCircle, Settings, User } from 'lucide-react-native';

export default function MerchantLayout() {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();

  if (user?.role !== 'user') {
    router.replace('/')
  }

  return <>
    <StatusBar
      style={theme.type === 'dark' ? 'light' : 'dark'}
      backgroundColor={theme.background}
    />
    <Stack screenOptions={{ headerShown: false }} />
  </>
}
