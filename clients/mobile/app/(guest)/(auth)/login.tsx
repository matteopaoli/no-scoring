import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native'; // Importing the eye icons from lucide-react-native
import { useAuth } from '@/contexts/AuthContext';
import { Theme, useAppTheme } from '@/contexts/ThemeContext'; // Import the theme hook

export default function AuthScreen(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const theme = useAppTheme(); // Access the current theme
  const styles = makeStyles(theme);

  const handleLogin = async (): Promise<void> => {
    try {
      const user = await login(email, password);
      if (user.role === 'user') {
        router.replace('/(merchant)/(tabs)/store');
      } else {
        router.replace('/(guest)/customer');
      }
    } catch (error) {
      Alert.alert('Errore', 'Si è verificato un errore durante il login');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState); // Toggle password visibility
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>
              Accedi al tuo account
            </Text>
            <Text style={styles.subTitle}>Utente o attività?</Text>
            <Text style={styles.subTitle}>Inserisci le tue credenziali</Text>
            <Text style={styles.subTitle}>
              Se sei già un attività di PayTomorrow puoi inserire i dati della
              versione web e creare i link di pagamento direttamente in App!
            </Text>
          </View>

          <View
            style={[
              styles.formContainer,
              { backgroundColor: theme.cardBackgroundColor },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, color: theme.text },
              ]}
              placeholder="Email"
              placeholderTextColor={theme.subtext}
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: theme.background, color: theme.text },
                ]}
                placeholderTextColor={theme.subtext}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={24} color={theme.text} />
                ) : (
                  <Eye size={24} color={theme.text} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
              { backgroundColor: theme.primary },
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.loginButtonText,
                { color: theme.cardBackgroundColor },
              ]}
            >
              {isLoading ? 'Accesso in corso...' : 'Accedi'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registrationLink}
            onPress={() => router.push('/merchant-onboarding')}
          >
            <Text style={[styles.registrationText, { color: theme.text }]}>
              Registrati come attività con il codice invito che hai ricevuto via
              mail
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registrationLink}
            onPress={() => router.push('./customer-signup')}
          >
            <Text
              style={[
                styles.registrationText,
                { color: theme.text, textDecorationLine: 'none' },
              ]}
            >
              Nuovo su PayTomorrow? Guadagna 30 Euro in buoni Amazon per ogni
              attività che si registra!{' '}
            </Text>
            <Text style={styles.cta}>Registrati qui</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.registrationLink}
            onPress={() => router.push('./forgot-password')}
          >
            <Text style={[styles.registrationText, { color: theme.text }]}>
              Ho dimenticato la password
            </Text>
          </TouchableOpacity> */}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
      fontFamily: theme.fontRegular,
      textAlign: 'center',
    },
    subTitle: {
      fontSize: 16,
      textAlign: 'center',
      fontFamily: theme.fontRegular,
      lineHeight: 24,
      color: theme.subtext,
    },
    formContainer: {
      width: '100%',
      padding: 20,
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    input: {
      padding: 15,
      borderRadius: 10,
      fontFamily: theme.fontRegular,
      marginBottom: 15,
    },
    passwordContainer: {
      position: 'relative', // This allows us to position the eye button over the input
    },
    eyeButton: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: [{ translateY: -18 }], // Vertically center the icon within the input
      zIndex: 1, // Ensure the button is above the input field
    },
    loginButton: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      width: '100%',
      marginTop: 20,
    },
    loginButtonDisabled: {
      opacity: 0.7,
    },
    loginButtonText: {
      fontFamily: theme.fontSemiBold,
      fontSize: 16,
    },
    registrationLink: {
      marginTop: 20,
    },
    registrationText: {
      fontFamily: theme.fontRegular,
      fontSize: 14,
      textDecorationLine: 'underline',
      textAlign: 'center',
    },
    cta: {
      fontFamily: theme.fontBold,
      textDecorationLine: 'underline',
      textAlign: 'center',
      fontSize: theme.fontSizeHeading,
      marginTop: 16,
    },
  });
};
