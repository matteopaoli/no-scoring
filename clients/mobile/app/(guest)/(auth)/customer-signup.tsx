import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext';
import apiClient from '@/lib/httpClient';
import { useMutation } from '@tanstack/react-query';

type SignupDTO = {
  firstName: string;
  lastName: string;
  password: string;
  repeatPassword: string;
  phoneNumber: string;
  email: string;
}

export default function CustomerSignupScreen(): JSX.Element {
  const router = useRouter();
    const signupMutation = useMutation({
      mutationFn: async (newCustomerData: SignupDTO) => {
        return await apiClient.post('/customer/signup', newCustomerData)
      },
      onSuccess: () => {
        Alert.alert('Successo', 'Registrazione completata');
        router.replace('/(guest)/(home)');
      },
      onError: () => {
        Alert.alert('Errore', 'Si è verificato un errore durante la registrazione');
      },
    });
  
  const theme = useAppTheme();

  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handleNext = () => {
    if (step === 1 && (!firstName || !lastName)) {
      Alert.alert('Errore', 'Nome e cognome sono obbligatori');
      return;
    }
    if (step === 2) {
      if (!email.includes('@')) {
        Alert.alert('Errore', 'Email non valida');
        return;
      }
      if (!/^\d{10}$/.test(phone)) {
        Alert.alert('Errore', 'Numero di telefono non valido');
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSignup = async () => {
    if (password !== repeatPassword) {
      Alert.alert('Errore', 'Le password non corrispondono');
      return;
    }

    try {
      await signupMutation.mutate({ 
        firstName,
        lastName,
        email,
        password,
        repeatPassword,
        phoneNumber: phone
       })
      Alert.alert('Successo', 'Registrazione completata');
      router.replace('/(guest)/(home)');
    } catch (error) {
      Alert.alert('Errore', 'Si è verificato un errore durante la registrazione');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder="Nome"
              placeholderTextColor={theme.subtext}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder="Cognome"
              placeholderTextColor={theme.subtext}
              value={lastName}
              onChangeText={setLastName}
            />
          </>
        );
      case 2:
        return (
          <>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder="Email"
              placeholderTextColor={theme.subtext}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder="Numero di telefono"
              placeholderTextColor={theme.subtext}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </>
        );
      case 3:
        return (
          <>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={theme.subtext}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={24} color={theme.text} /> : <Eye size={24} color={theme.text} />}
              </TouchableOpacity>
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                placeholder="Ripeti Password"
                placeholderTextColor={theme.subtext}
                secureTextEntry={!showRepeatPassword}
                value={repeatPassword}
                onChangeText={setRepeatPassword}
              />
              <TouchableOpacity
                onPress={() => setShowRepeatPassword((prev) => !prev)}
                style={styles.eyeButton}
              >
                {showRepeatPassword ? <EyeOff size={24} color={theme.text} /> : <Eye size={24} color={theme.text} />}
              </TouchableOpacity>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>Registrati</Text>

          <View style={[styles.formContainer, { backgroundColor: theme.cardBackgroundColor }]}>
            {renderStep()}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 }}>
            {step > 1 && (
              <TouchableOpacity style={[styles.signupButton, { backgroundColor: '#aaa' }]} onPress={handleBack}>
                <Text style={[styles.signupButtonText, { color: theme.cardBackgroundColor }]}>Indietro</Text>
              </TouchableOpacity>
            )}

            {step < 3 ? (
              <TouchableOpacity style={[styles.signupButton, { backgroundColor: theme.primary }]} onPress={handleNext}>
                <Text style={[styles.signupButtonText, { color: theme.cardBackgroundColor }]}>Avanti</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.signupButton,
                  signupMutation.isPending && styles.signupButtonDisabled,
                  { backgroundColor: theme.primary },
                ]}
                onPress={handleSignup}
              >
                <Text style={[styles.signupButtonText, { color: theme.cardBackgroundColor }]}>
                  {signupMutation.isPending ? 'Registrazione...' : 'Registrati'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/')}>
            <Text style={[styles.loginText, { color: theme.text }]}>Hai già un account? Accedi</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    marginBottom: 30,
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
    fontFamily: 'Poppins-Regular',
    marginBottom: 15,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -18 }],
    zIndex: 1,
  },
  signupButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
