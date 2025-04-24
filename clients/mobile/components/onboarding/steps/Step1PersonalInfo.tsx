import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextStyle,
  ViewStyle,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { User } from 'lucide-react-native';
import { useOnboarding } from '../OnboardingContext';
import { validateStep } from '../validation';
import { useAppTheme, Theme } from '@/contexts/ThemeContext';
import OnboardingNavigation from '../OnboardingNavigation';

interface LabeledInputProps {
  iconColor: string;
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  showError: boolean;
  errorText?: string;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  iconColor,
  placeholder,
  value,
  onChange,
  showError,
  errorText,
}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  return (
    <>
      <View style={styles.inputGroup}>
        <User size={20} color={iconColor} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={iconColor}
          value={value}
          onChangeText={onChange}
        />
      </View>
      {showError && errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : null}
    </>
  );
};

const Step1PersonalInfo = () => {
  const { userInfo, dispatch, shouldValidate } = useOnboarding();
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const validation = validateStep(1, userInfo);

  const onFirstNameChange = useCallback(
    (text: string) =>
      dispatch({
        type: 'SET_USER_INFO',
        payload: { ...userInfo, firstName: text },
      }),
    [userInfo, dispatch],
  );
  const onLastNameChange = useCallback(
    (text: string) =>
      dispatch({
        type: 'SET_USER_INFO',
        payload: { ...userInfo, lastName: text },
      }),
    [userInfo, dispatch],
  );



  return (
    // Wrapping the entire component in KeyboardAvoidingView
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Nome e Cognome</Text>

            <LabeledInput
              iconColor={theme.subtext}
              placeholder="Nome"
              value={userInfo.firstName}
              onChange={onFirstNameChange}
              showError={shouldValidate}
              errorText={validation.errors.firstName}
            />

            <LabeledInput
              iconColor={theme.subtext}
              placeholder="Cognome"
              value={userInfo.lastName}
              onChange={onLastNameChange}
              showError={shouldValidate}
              errorText={validation.errors.lastName}
            />

          <OnboardingNavigation />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create<{
    stepContainer: ViewStyle;
    stepTitle: TextStyle;
    inputGroup: ViewStyle;
    input: TextStyle;
    errorText: TextStyle;
    scrollViewContent: ViewStyle;
    nextButtonContainer: ViewStyle;
    nextButton: TextStyle;
  }>({
    stepContainer: {
      backgroundColor: theme.cardBackgroundColor,
      borderRadius: 20,
      margin: 20,
      marginTop: 50,
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
    input: {
      flex: 1,
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize,
      color: theme.text,
      paddingVertical: theme.fontSize * 0.8,
      paddingHorizontal: theme.fontSize / 2,
    },
    errorText: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize - 2,
      color: theme.primary,
      marginBottom: theme.fontSize,
      textAlign: 'center',
    },
    scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    nextButtonContainer: {
      alignItems: 'center',
      marginTop: theme.fontSize * 2, // Adjust this for spacing
    },
    nextButton: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.primary,
    },
  });

export default Step1PersonalInfo;
