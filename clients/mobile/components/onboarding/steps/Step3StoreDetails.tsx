import React, { useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextStyle,
  ViewStyle,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Store } from 'lucide-react-native';
import { useOnboarding } from '../OnboardingContext';
import { validateStep } from '../validation';
import { useAppTheme, Theme } from '@/contexts/ThemeContext';
import OnboardingNavigation from '../OnboardingNavigation';

const Step3StoreDetails = () => {
  const { userInfo, dispatch, shouldValidate } = useOnboarding();
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const validation = validateStep(3, userInfo);

  const handleStoreNameChange = useCallback(
    (text: string) => {
      dispatch({
        type: 'SET_USER_INFO',
        payload: { ...userInfo, storeName: text },
      });
    },
    [dispatch, userInfo],
  );

  const handleStoreDescriptionChange = useCallback(
    (text: string) => {
      dispatch({
        type: 'SET_USER_INFO',
        payload: { ...userInfo, storeDescription: text },
      });
    },
    [dispatch, userInfo],
  );

  return (
    // Wrapping everything in TouchableWithoutFeedback to dismiss the keyboard
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Dettagli Negozio</Text>

        {/* Store Name Input */}
        <View style={styles.inputGroup}>
          <Store size={20} color={theme.subtext} />
          <TextInput
            style={styles.input}
            placeholder="Nome Negozio"
            placeholderTextColor={theme.subtext}
            value={userInfo.storeName}
            onChangeText={handleStoreNameChange}
          />
        </View>
        {shouldValidate && validation.errors.storeName && (
          <Text style={styles.errorText}>{validation.errors.storeName}</Text>
        )}

        {/* Store Description Input */}
        <View style={[styles.inputGroup, styles.descriptionGroup]}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descrizione del negozio"
            placeholderTextColor={theme.subtext}
            multiline
            numberOfLines={4}
            value={userInfo.storeDescription}
            onChangeText={handleStoreDescriptionChange}
          />
        </View>
        {shouldValidate && validation.errors.storeDescription && (
          <Text style={styles.errorText}>{validation.errors.storeDescription}</Text>
        )}
        {/* Hint Text */}
        <Text style={styles.hintText}>
          Descrivi cosa rende speciale il tuo negozio
        </Text>
        <OnboardingNavigation />
      </View>
    </TouchableWithoutFeedback>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create<{
    stepContainer: ViewStyle;
    stepTitle: TextStyle;
    inputGroup: ViewStyle;
    descriptionGroup: ViewStyle;
    input: TextStyle;
    textArea: TextStyle;
    errorText: TextStyle;
    hintText: TextStyle;
  }>({
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
    inputGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background,
      borderRadius: 10,
      paddingHorizontal: theme.fontSize,
      marginBottom: theme.fontSize,
    },
    descriptionGroup: {
      alignItems: 'flex-start',
    },
    input: {
      flex: 1,
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize,
      color: theme.text,
      paddingVertical: theme.fontSize * 0.8,
      paddingHorizontal: theme.fontSize / 2,
    },
    textArea: {
      height: theme.fontSize * 7,
      textAlignVertical: 'top',
    },
    errorText: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize - 2,
      color: theme.primary,
      marginBottom: theme.fontSize,
      textAlign: 'center',
    },
    hintText: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize - 2,
      color: theme.subtext,
      marginTop: theme.fontSize / 2,
    },
  });

export default Step3StoreDetails;
