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
import { useMutation } from '@tanstack/react-query';
import { useAppTheme } from '@/contexts/ThemeContext';
import apiClient from '@/lib/httpClient';

export default function ForgotPasswordScreen(): JSX.Element {
  const theme = useAppTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      return await apiClient.post('/auth/forgot-password', { email });
    },
    onSuccess: () => {
      Alert.alert('Successo', 'Ti abbiamo inviato un’email con le istruzioni per reimpostare la password.');
      router.replace('/(guest)/(auth)/login');
    },
    onError: () => {
      Alert.alert('Errore', 'Non siamo riusciti a inviare l’email. Verifica l’indirizzo e riprova.');
    },
  });

  const handleSubmit = () => {
    if (!email.includes('@')) {
      Alert.alert('Errore', 'Inserisci un’email valida.');
      return;
    }

    forgotPasswordMutation.mutate(email);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>Password dimenticata</Text>

          <View style={[styles.formContainer, { backgroundColor: theme.cardBackgroundColor }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder="Inserisci la tua email"
              placeholderTextColor={theme.subtext}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.primary }]}
            onPress={handleSubmit}
            disabled={forgotPasswordMutation.isPending}
          >
            <Text style={[styles.submitButtonText, { color: theme.cardBackgroundColor }]}>
              {forgotPasswordMutation.isPending ? 'Invio...' : 'Invia istruzioni'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/(guest)/(auth)/login')}>
            <Text style={[styles.loginText, { color: theme.text }]}>Torna al login</Text>
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
    fontSize: 28,
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
    marginBottom: 20,
  },
  input: {
    padding: 15,
    borderRadius: 10,
    fontFamily: 'Poppins-Regular',
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
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
