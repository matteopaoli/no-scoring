import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function MerchantLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();

  // Only redirect once loading finishes
  useEffect(() => {
    if (isLoading) return;

    if (user?.role !== 'user') {
      router.replace('/');
    } else if (!user.onboardingCompleted) {
      router.replace('/profile-setup');
    }
  }, [isLoading, user, router]);

  // Show spinner while auth is initializing
  if (isLoading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        style={theme.type === 'dark' ? 'light' : 'dark'}
        backgroundColor={theme.background}
      />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
