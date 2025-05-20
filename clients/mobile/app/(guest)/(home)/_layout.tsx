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
      <Stack.Screen name="index" options={{ headerShown: false, title: 'Home' }}  />
      <Stack.Screen name="categories" options={{ title: 'Categorie' }} />
    </Stack>
  );
}
