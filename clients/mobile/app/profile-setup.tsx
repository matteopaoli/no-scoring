// OnboardingScreen.tsx
import React, { useCallback } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingProvider, useOnboarding } from '@/components/onboarding/OnboardingContext';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import { Theme, useAppTheme } from '@/contexts/ThemeContext';
import {
  Step0Welcome,
  Step1PersonalInfo,
  Step2ProfileImage,
  Step3StoreDetails,
  Step4StoreLocation,
  Step5StoreImage,
  Step6Password,
  Step7Fees,
  Step8TOS,
  Step9Complete
} from '@/components/onboarding/steps'; // Import all steps from a single file

const OnboardingScreen = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { step } = useOnboarding();  // Track the current step of the onboarding process

  return (
    <OnboardingProvider>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.contentContainer}
        >
          <Header />
          <OnboardingProgress />
          <StepContent />
        </ScrollView>
      </View>
    </OnboardingProvider>
  );
};

const Header: React.FC = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  const handleExit = useCallback(() => {
    Alert.alert(
      'Attenzione',
      'Stai per uscire dalla configurazione del profilo e verrai disconnesso. Continuare?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Esci',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  }, [logout, router]);

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
        <Text style={styles.exitText}>Esci</Text>
      </TouchableOpacity>
    </View>
  );
};

type StepContentProps = {};

const StepContent: React.FC<StepContentProps> = () => {
  const { step } = useOnboarding();

  switch (step) {
    case 0:
      return <Step0Welcome />;
    case 1:
      return <Step1PersonalInfo />;
    case 2:
      return <Step2ProfileImage />;
    case 3:
      return <Step3StoreDetails />;
    case 4:
      return <Step4StoreLocation />;
    case 5:
      return <Step5StoreImage />;
    case 6:
      return <Step6Password />;
    case 7:
      return <Step7Fees />;
    case 8:
      return <Step8TOS />;
    case 9:
      return <Step9Complete />;
    default:
      return null;
  }
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      flex: 1,
    },
    contentContainer: {
      paddingBottom: 20,
    },
    header: {
      width: '100%',
      padding: theme.fontSize,
      alignItems: 'flex-end',
      backgroundColor: theme.background,
      marginTop: 40,
    },
    exitButton: {
      paddingVertical: theme.fontSize / 2,
      paddingHorizontal: theme.fontSize,
      borderRadius: theme.fontSize / 2,
      backgroundColor: theme.primary,
    },
    exitText: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSize,
      color: theme.buttonTextColor,
    },
  });

export default OnboardingScreen;
