import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useOnboarding } from '../OnboardingContext';
import { pickPhoto, takePhoto } from '@/lib/photoUtils';
import { useAppTheme, Theme } from '@/contexts/ThemeContext';
import OnboardingNavigation from '../OnboardingNavigation';

const Step5StoreImage: React.FC = () => {
  const { userInfo, dispatch } = useOnboarding();
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  const handlePhoto = useCallback(
    async (action: 'take' | 'pick') => {
      const photo = action === 'take' ? await takePhoto() : await pickPhoto();
      if (photo) {
        dispatch({
          type: 'SET_USER_INFO',
          payload: { ...userInfo, storeImage: photo },
        });
      }
    },
    [dispatch, userInfo]
  );

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Immagine Negozio</Text>

      {userInfo.storeImage && (
        <Image
          source={{ uri: userInfo.storeImage.uri }}
          style={styles.previewImage}
        />
      )}

      <View style={styles.photoButtonsContainer}>
        <TouchableOpacity
          style={[styles.photoButton, { backgroundColor: theme.primary }]}
          onPress={() => handlePhoto('take')}
        >
          <Text style={styles.photoButtonText}>Scatta Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.photoButton, { backgroundColor: theme.secondary }]}
          onPress={() => handlePhoto('pick')}
        >
          <Text style={styles.photoButtonText}>Scegli dalla Galleria</Text>
        </TouchableOpacity>
      </View>
      <OnboardingNavigation />

    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    stepContainer: {
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
    },
    previewImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      alignSelf: 'center',
      marginVertical: theme.fontSize,
    },
    photoButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.fontSize,
    },
    photoButton: {
      flex: 1,
      padding: theme.fontSize,
      borderRadius: theme.fontSize,
      alignItems: 'center',
      marginHorizontal: theme.fontSize / 2,
    },
    photoButtonText: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSize,
      color: theme.buttonTextColor,
    },
  });

export default Step5StoreImage;
