import { Slot } from 'expo-router';
import AuthProvider from '../contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

import {
  DMSans_400Regular,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts,
} from '@expo-google-fonts/dm-sans';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { LocationProvider } from '@/contexts/LocationContext';
import ToastManager from 'toastify-react-native'

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient()


SplashScreen.preventAutoHideAsync();

export default function Root() {
  const [loaded, error] = useFonts({
    DMSans_400Regular,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <LocationProvider>
            <SafeAreaProvider>
              <Slot />
              <ToastManager />
            </SafeAreaProvider>
          </LocationProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
