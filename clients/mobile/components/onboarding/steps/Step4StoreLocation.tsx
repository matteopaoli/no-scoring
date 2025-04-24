import React, { useCallback } from 'react';
import 'react-native-get-random-values';
import { View, Text, StyleSheet } from 'react-native';
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useOnboarding } from '../OnboardingContext';
import { useAppTheme } from '@/contexts/ThemeContext';  // Assuming you have a useAppTheme hook for theme access
import OnboardingNavigation from '../OnboardingNavigation';

const Step4StoreLocation = () => {
  const { userInfo, dispatch } = useOnboarding();
  const theme = useAppTheme();

  const handleLocationSelect = useCallback((data: GooglePlaceData, details: GooglePlaceDetail | null = null) => {
    if (details) {
      dispatch({
        type: 'SET_USER_INFO',
        payload: {
          ...userInfo,
          storeLocation: {
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
            address: data.description,
          },
          storePlaceId: data.place_id,
        },
      });
    }
  }, [dispatch, userInfo]);

  return (
    <View style={[styles.stepContainer, { backgroundColor: theme.cardBackgroundColor }]}>
      <Text style={[styles.stepTitle, { color: theme.text, fontFamily: theme.fontSemiBold }]}>
        Posizione del Negozio
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.subtext, fontFamily: theme.fontRegular }]}>
        Seleziona la posizione esatta del tuo negozio
      </Text>
      <View style={styles.autocompleteContainer}>
        <GooglePlacesAutocomplete
          placeholder="Cerca..."
          minLength={2}
          fetchDetails={true}
          onPress={handleLocationSelect}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
            language: 'it',
            components: 'country:it',
          }}
        />
      </View>
      <OnboardingNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
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
    fontSize: 18,
    marginBottom: 15,
  },
  stepSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  autocompleteContainer: {
    zIndex: 1, // Ensure it appears above other elements
    width: '100%',
  },
});

export default Step4StoreLocation;
