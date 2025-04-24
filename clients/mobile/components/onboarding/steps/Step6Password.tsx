import React, { useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Lock } from 'lucide-react-native';
import { useOnboarding } from '../OnboardingContext';
import { validateStep } from '../validation';
import { useAppTheme, Theme } from '@/contexts/ThemeContext';
import OnboardingNavigation from '../OnboardingNavigation';

const Step6Password: React.FC = () => {
  const { userInfo, dispatch, shouldValidate } = useOnboarding();
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  const validation = validateStep(6, userInfo);


  const onPasswordChange = useCallback(
    (text: string) =>
      dispatch({
        type: 'SET_USER_INFO',
        payload: { ...userInfo, password: text },
      }),
    [dispatch, userInfo]
  );

  const onConfirmPasswordChange = useCallback(
    (text: string) =>
      dispatch({
        type: 'SET_USER_INFO',
        payload: { ...userInfo, confirmPassword: text },
      }),
    [dispatch, userInfo]
  );

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Imposta Password</Text>

      <View style={styles.inputGroup}>
        <Lock size={20} color={theme.subtext} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.subtext}
          secureTextEntry
          value={userInfo.password}
          onChangeText={onPasswordChange}
        />
      </View>
      {shouldValidate && validation.errors.password && (
        <Text style={styles.errorText}>{validation.errors.password}</Text>
      )}

      <View style={styles.inputGroup}>
        <Lock size={20} color={theme.subtext} />
        <TextInput
          style={styles.input}
          placeholder="Conferma Password"
          placeholderTextColor={theme.subtext}
          secureTextEntry
          value={userInfo.confirmPassword}
          onChangeText={onConfirmPasswordChange}
        />
      </View>
      {shouldValidate && validation.errors.confirmPassword && (
        <Text style={styles.errorText}>
          {validation.errors.confirmPassword}
        </Text>
      )}
      <OnboardingNavigation />
      {shouldValidate &&
        userInfo.password &&
        userInfo.confirmPassword &&
        userInfo.password !== userInfo.confirmPassword && (
          <Text style={styles.errorText}>
            Le password non corrispondono
          </Text>
        )}
{!validation.errors.password && (
          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementTitle}>
              Requisiti della password:
            </Text>
            <Text
              style={[
                styles.requirement,
                userInfo.password.length >= 8 && styles.requirementMet,
              ]}
            >
              • Almeno 8 caratteri
            </Text>
            <Text
              style={[
                styles.requirement,
                /[a-z]/.test(userInfo.password) && styles.requirementMet,
              ]}
            >
              • Almeno una lettera minuscola
            </Text>
            <Text
              style={[
                styles.requirement,
                /[A-Z]/.test(userInfo.password) && styles.requirementMet,
              ]}
            >
              • Almeno una lettera maiuscola
            </Text>
            <Text
              style={[
                styles.requirement,
                /[0-9]/.test(userInfo.password) && styles.requirementMet,
              ]}
            >
              • Almeno un numero
            </Text>
            <Text
              style={[
                styles.requirement,
                /[!@#$%^&*(),.?":{}|<>]/.test(userInfo.password) &&
                  styles.requirementMet,
              ]}
            >
              • Almeno un simbolo speciale
            </Text>
          </View>
        )}
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create<{
    stepContainer: ViewStyle;
    stepTitle: TextStyle;
    inputGroup: ViewStyle;
    input: TextStyle;
    errorText: TextStyle;
    passwordRequirements: ViewStyle;
    requirementTitle: TextStyle;
    requirement: TextStyle;
    requirementMet: TextStyle;
  }>({
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
      marginTop: 150,
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
      borderRadius: theme.fontSize / 2,
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
    passwordRequirements: {
      marginTop: theme.fontSize,
      padding: theme.fontSize,
      backgroundColor: theme.background,
      borderRadius: theme.fontSize / 2,
    },
    requirementTitle: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSize - 1,
      color: theme.text,
      marginBottom: theme.fontSize / 2,
    },
    requirement: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize - 2,
      color: theme.subtext,
    },
    requirementMet: {
      color: theme.primary,
      textDecorationLine: 'line-through',
    },
  });

export default Step6Password;
