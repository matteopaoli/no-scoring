import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Alert,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { useOnboarding } from '../OnboardingContext';
import { useAppTheme, Theme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/httpClient';
import { ImageManipulator } from 'expo-image-manipulator';
import OnboardingNavigation from '../OnboardingNavigation';
import { validateStep } from '../validation';

const Step8TOS: React.FC = () => {
  const { userInfo, dispatch, } = useOnboarding();
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { refreshUser } = useAuth();
    const validation = validateStep(7, userInfo);
  

  const handleSubmit = async () => {
    const convertImageToBase64 = async (uri: string): Promise<string> => {
      try {
        const resizedImage = await ImageManipulator.manipulate(uri)
          .resize({
            width: 512,
          })
          .renderAsync()
          .then((v) => v.saveAsync());

        const response = await fetch(resizedImage.uri);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              const base64Prefix = '  ';
              resolve(base64Prefix + reader.result.split(',')[1]);
            } else {
              reject(new Error('Failed to convert image to Base64'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        throw new Error('Error resizing image: ' + error);
      }
    };

    try {
      // Convert images to base64
      const profileImageBase64 = userInfo.profileImage
        ? await convertImageToBase64(userInfo.profileImage.uri)
        : undefined;

      const storeImageBase64 = userInfo.storeImage
        ? await convertImageToBase64(userInfo.storeImage.uri)
        : undefined;

      // Prepare the payload according to your DTO
      const payload = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        storeName: userInfo.storeName,
        storeDescription: userInfo.storeDescription,
        storePlaceId: userInfo.storePlaceId,
        storeLocationLat: userInfo.storeLocation?.lat.toString() || '',
        storeLocationLng: userInfo.storeLocation?.lng.toString() || '',
        customerPaysFees: userInfo.customerPaysFees,
        password: userInfo.password,
        profileImage: profileImageBase64,
        storeImage: storeImageBase64,
      };
      await apiClient.post('/users/setup-profile', payload);
      await refreshUser();
      dispatch({ type: 'SET_STEP', payload: 9 });
    } catch (error) {
      Alert.alert(
        'Errore',
        error.response?.data?.message ||
          'Qualcosa è andato storto. Per favore riprova.',
      );
    }
  };

  const toggleTOS = useCallback(() => {
    dispatch({
      type: 'SET_USER_INFO',
      payload: { ...userInfo, acceptedTOS: !userInfo.acceptedTOS },
    });
  }, [dispatch, userInfo]);

  const openLink = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Termini e Condizioni</Text>
      <Text style={styles.tosText}>
        Per favore leggi e accetta i nostri Termini di Servizio e l'Informativa sulla Privacy
      </Text>

      <TouchableOpacity onPress={() => openLink('https://app.paytomorrow.it/terms')}>
        <Text style={styles.linkText}>Leggi i Termini di Servizio</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openLink('https://app.paytomorrow.it/privacy')}>
        <Text style={styles.linkText}>Leggi l'Informativa sulla Privacy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.checkboxContainer} onPress={toggleTOS}>
        <View
          style={[
            styles.checkbox,
            userInfo.acceptedTOS && styles.checkboxChecked,
          ]}
        >
          {userInfo.acceptedTOS && (
            <Check size={theme.fontSizeHeading} color={theme.buttonTextColor} />
          )}
        </View>
        <Text style={styles.checkboxLabel}>
          Accetto i Termini di Servizio{'\n'}e l'Informativa sulla Privacy
        </Text>
      </TouchableOpacity>
      <OnboardingNavigation onSubmit={handleSubmit} />
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create<{
    stepContainer: ViewStyle;
    stepTitle: TextStyle;
    tosText: TextStyle;
    linkText: TextStyle;
    checkboxContainer: ViewStyle;
    checkbox: ViewStyle;
    checkboxChecked: ViewStyle;
    checkboxLabel: TextStyle;
  }>({
    stepContainer: {
      backgroundColor: theme.cardBackgroundColor,
      borderRadius: 20,
      margin: 20,
      marginTop: 150,
      padding: 20,
    },
    stepTitle: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.text,
      marginBottom: theme.fontSize,
    },
    tosText: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize,
      color: theme.text,
      textAlign: 'center',
      marginBottom: theme.fontSize * 1.5,
    },
    linkText: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize,
      color: theme.primary,
      textDecorationLine: 'underline',
      marginBottom: theme.fontSize,
      textAlign: 'center',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.fontSize * 2,
    },
    checkbox: {
      width: theme.fontSizeHeading,
      height: theme.fontSizeHeading,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme.subtext,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.fontSize,
    },
    checkboxChecked: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    checkboxLabel: {
      flex: 1,
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize,
      color: theme.text,
      lineHeight: theme.fontSize * 1.4,
    },
  });

export default Step8TOS;
