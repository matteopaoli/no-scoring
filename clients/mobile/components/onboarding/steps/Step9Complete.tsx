import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Import the router
import { useAppTheme, Theme } from '@/contexts/ThemeContext';

const Step9Complete: React.FC = () => {
  const router = useRouter(); // Initialize the router
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  const handleGoToStore = () => {
    // Navigate to the store page
    router.replace('/(merchant)/(tabs)/store');
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Profilo Configurato</Text>
      <Text style={styles.stepDescription}>
        Il tuo profilo è stato configurato con successo! Ora puoi iniziare a usare
        l'app.
      </Text>
      
      {/* Button to navigate to the store */}
      <TouchableOpacity style={styles.button} onPress={handleGoToStore}>
        <Text style={styles.buttonText}>Vai al negozio</Text>
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    stepContainer: {
      backgroundColor: theme.cardBackgroundColor,
      borderRadius: 20,
      margin: theme.fontSize,
      padding: theme.fontSize,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      alignItems: 'center',
      marginTop: '50%',
    },
    stepTitle: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.text,
      textAlign: 'center',
      marginBottom: theme.fontSize,
    },
    stepDescription: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize,
      color: theme.subtext,
      textAlign: 'center',
      lineHeight: theme.fontSize * 1.4,
      marginBottom: theme.fontSize * 2, // Add space before the button
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 10,
      width: '100%',
      maxWidth: 250, // Button max width
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSize,
      color: theme.buttonTextColor,
      textAlign: 'center',
    },
  });

export default Step9Complete;
