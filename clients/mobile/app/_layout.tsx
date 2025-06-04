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
import ToastManager from 'toastify-react-native';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

import WelcomeCarousel from '@/components/welcome-carousel';
import { useStorageState } from '@/hooks/useStorageState';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function Root() {
  const [loaded, error] = useFonts({
    DMSans_400Regular,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  const [[loading, hasLaunched], setHasLaunched] = useStorageState('hasLaunched');

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <LocationProvider>
            <SafeAreaProvider>
              <PaperProvider>
                <Slot />
                {!loading && !hasLaunched && (
                  <WelcomeCarousel onClose={() => setHasLaunched('true')} />
                )}
              </PaperProvider>
              <ToastManager />
            </SafeAreaProvider>
          </LocationProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
