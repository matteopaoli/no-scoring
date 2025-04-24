// WelcomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/contexts/ThemeContext';
import OnboardingNavigation from '../OnboardingNavigation';

const WelcomeScreen: React.FC = () => {
  const theme = useAppTheme();
  const router = useRouter();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Benvenuto!</Text>
        <Text style={styles.text}>
          Ciao! Siamo felici che tu sia qui. Iniziamo con qualche informazione
          per aiutarti a configurare il tuo profilo. Ti chiederemo di inviarci
          alcuni dettagli, ma non preoccuparti, tutto è facile e veloce!
        </Text>
        <OnboardingNavigation />
      </View>
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginTop: 50,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
    },
    card: {
      width: '100%',
      maxWidth: 400, // Card width limit for larger screens
      padding: 20,
      backgroundColor: theme.cardBackgroundColor,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      alignItems: 'center', // Center the text and button horizontally
    },
    title: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.text,
      marginBottom: 15,
      textAlign: 'center',
    },
    text: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize,
      color: theme.text,
      marginBottom: 30,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 10,
      width: '100%', // Make the button full-width for better tap area
      maxWidth: 250, // Add a max width for button on larger screens
    },
    buttonText: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSize,
      color: theme.buttonTextColor,
      textAlign: 'center',
    },
  });

export default WelcomeScreen;
