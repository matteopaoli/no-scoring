import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useOnboarding } from '../OnboardingContext';
import { pickPhoto, takePhoto } from '@/lib/photoUtils';
import { useAppTheme, Theme } from '@/contexts/ThemeContext';
import OnboardingNavigation from '../OnboardingNavigation';

const Step2ProfileImage = () => {
  const { userInfo, dispatch } = useOnboarding();
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  const handleProfilePhoto = useCallback(
    async (action: 'take' | 'pick') => {
      let photo;
      if (action === 'take') {
        photo = await takePhoto();
      } else if (action === 'pick') {
        photo = await pickPhoto();
      }
      if (photo) {
        dispatch({ type: 'SET_USER_INFO', payload: { ...userInfo, profileImage: photo } });
      }
    },
    [dispatch, userInfo]
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Immagine del Profilo</Text>

        {/* Image Preview */}
        <View style={styles.imageContainer}>
          {userInfo.profileImage ? (
            <Image source={{ uri: userInfo.profileImage.uri }} style={styles.previewImage} />
          ) : (
            <Text style={styles.noImageText}>Nessuna immagine selezionata</Text>
          )}
        </View>

        {/* Photo Action Buttons */}
        <View style={styles.photoButtonsContainer}>
          <TouchableOpacity
            style={[styles.photoButton, styles.primaryButton]}
            onPress={() => handleProfilePhoto('take')}
          >
            <Text style={styles.buttonText}>Scatta Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.photoButton, styles.secondaryButton]}
            onPress={() => handleProfilePhoto('pick')}
          >
            <Text style={styles.buttonText}>Scegli dalla Galleria</Text>
          </TouchableOpacity>
        </View>

        <OnboardingNavigation />
      </View>
    </TouchableWithoutFeedback>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    stepContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.cardBackgroundColor,
      borderRadius: 20,
      margin: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    stepTitle: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.text,
      marginBottom: theme.fontSize,
      textAlign: 'center',
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: theme.fontSize * 2,
    },
    previewImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      borderWidth: 4,
      borderColor: theme.primary,
      marginBottom: theme.fontSize,
    },
    noImageText: {
      color: theme.subtext,
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize - 2,
      marginTop: theme.fontSize,
    },
    photoButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: theme.fontSize * 2,
    },
    photoButton: {
      flex: 1,
      paddingVertical: theme.fontSize * 0.8,
      paddingHorizontal: theme.fontSize * 1.5,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: theme.fontSize / 2,
    },
    primaryButton: {
      backgroundColor: theme.primary,
      alignItems: 'center',
    },
    secondaryButton: {
      backgroundColor: theme.secondary,
    },
    buttonText: {
      color: theme.buttonTextColor,
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSize,
    },
    nextButton: {
      backgroundColor: theme.primary,
      paddingVertical: theme.fontSize * 1.2,
      paddingHorizontal: theme.fontSize * 3,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: theme.fontSize * 2,
    },
    nextButtonText: {
      color: theme.buttonTextColor,
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSize,
    },
  });

export default Step2ProfileImage;
