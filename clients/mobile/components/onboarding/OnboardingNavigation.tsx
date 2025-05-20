import React, { useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useOnboarding } from './OnboardingContext';
import { validateStep } from './validation';
import { useAppTheme, Theme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

type Props = {
  onSubmit?: () => Promise<void>;
};

const OnboardingNavigation: React.FC<Props> = ({ onSubmit }) => {
  const { step, userInfo, dispatch } = useOnboarding();
  const { logout } = useAuth();
  const router = useRouter();
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  const goBack = useCallback(() => {
    if (step > 1) {
      dispatch({ type: 'SET_VALIDATE', payload: false });
      dispatch({ type: 'SET_STEP', payload: step - 1 });
    } else {
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
              router.replace('/');
            },
          },
        ]
      );
    }
  }, [step, dispatch, logout, router]);

  const goNext = useCallback(async () => {
    dispatch({ type: 'SET_VALIDATE', payload: true });
    const { isValid, errors } = validateStep(step, userInfo);
    if (!isValid) {
      Alert.alert('Errore', Object.values(errors)[0]);
      return;
    }

    if (step === 8) {
      await onSubmit?.();
    } else if (step < 9) {
      dispatch({ type: 'SET_VALIDATE', payload: false });
      dispatch({ type: 'SET_STEP', payload: step + 1 });
    } else {
      router.back();
    }
  }, [step, userInfo, dispatch, onSubmit, router]);

  return (
    <View style={styles.container}>
      <NavButton
        label="Precedente"
        onPress={goBack}
        variant="secondary"
        theme={theme}
        show={step > 1}
      />
      <NavButton
        label={step === 9 ? 'Chiudi' : 'Avanti'}
        onPress={goNext}
        variant="primary"
        theme={theme}
      />
    </View>
  );
};

type NavButtonProps = {
  label: string;
  onPress: () => void;
  variant: 'primary' | 'secondary';
  theme: Theme;
  show?: boolean;
};

const NavButton: React.FC<NavButtonProps> = ({
  label,
  onPress,
  variant,
  theme,
  show = true,
}) => {
  if (!show) return null;
  const styles = StyleSheet.create({
    button: {
      flex: 1,
      padding: theme.fontSize,
      borderRadius: theme.fontSize / 2,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor:
        variant === 'primary' ? theme.primary : theme.cardBackgroundColor,
      marginHorizontal: theme.fontSize / 4,
    },
    text: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSize,
      color:
        variant === 'primary' ? theme.cardBackgroundColor : theme.primary,
    },
  });

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      padding: theme.fontSize,
    },
  });

export default OnboardingNavigation;
