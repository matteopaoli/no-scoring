import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

export default function AuthScreen(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, isLoading, isAuthenticated } = useAuth();

  const handleLogin = async (): Promise<void> => {
    try {
      await login(email, password);
      if (isAuthenticated) {
        Alert.alert('Login Success', `Logged in as ${email}`);
        router.push('/(tabs)/profile');
      }
    } catch (error) {
      Alert.alert('Errore', 'Si è verificato un errore durante il login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accedi</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? 'Accesso in corso...' : 'Accedi'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registrationLink}
        onPress={() => router.push('/merchant-onboarding')}
      >
        <Text style={styles.registrationText}>
          Sei un commerciante che accede per la prima volta? Clicca qui
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9B7EDC',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    fontFamily: 'Poppins-Regular',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#7B5CC6',
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
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
  },
  debugButton: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 5,
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  registrationLink: {
    marginTop: 20,
  },
  registrationText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
