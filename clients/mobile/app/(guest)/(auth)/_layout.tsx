import { useAppTheme } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const theme = useAppTheme();
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTitleStyle: {
        color: theme.text,
      },
      headerTintColor: theme.text
    }}>
      <Stack.Screen name="login" options={{ headerShown: false, title: 'Accedi' }}  />
      <Stack.Screen name="customer-signup" options={{  title: 'Registrati' }}  />
      <Stack.Screen name="merchant-onboarding" options={{ title: 'Registrazione Commerciante' }} />
    </Stack>
  );
}
