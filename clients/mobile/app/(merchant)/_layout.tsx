import { useAuth } from '@/contexts/AuthContext';
import { Stack, Tabs, useRouter } from 'expo-router';
import { Home, Map, PlusCircle, Settings, User } from 'lucide-react-native';

export default function MerchantLayout() {
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role !== 'user') {
    router.replace('/')
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
