import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import apiClient from '@/lib/httpClient';
import { WebView } from 'react-native-webview';
import { useAppTheme } from '@/contexts/ThemeContext'; // Import the theme hook

export default function MerchantOnboardingScreen(): JSX.Element {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [onboardingUrl, setOnboardingUrl] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const theme = useAppTheme(); // Access the current theme

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiClient.post('/users/get-by-invite', {
        inviteCode,
      });

      if (response.status === 200) {
        setOnboardingUrl(response.data.user.onboardingLink);
        setModalVisible(true); // Show the modal when we get the URL
      }
    } catch (error) {
      Alert.alert(
        'Errore',
        'Si è verificato un errore durante la registrazione',
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModal = (): void => {
    setModalVisible(false);
  };

  const handleNavigationStateChange = (navState: any) => {
    if (navState.url && navState.url.includes('app.paytomorrow.it')) {
      setModalVisible(false);
      Alert.alert(
        'Grazie',
        "A breve riceverai un' email contenente le credenziali per accedere a PayTomorrow",
      );
      router.push('/login');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Back button */}
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.primary }]}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={theme.card} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.text }]}>Registrazione Commerciante</Text>

      <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.background }]}
          placeholder="Codice di invito"
          value={inviteCode}
          onChangeText={setInviteCode}
          placeholderTextColor={theme.subtext}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled, { backgroundColor: theme.primary }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={[styles.submitButtonText, { color: theme.card }]}>
          {loading ? 'Attendi...' : 'Conferma'}
        </Text>
      </TouchableOpacity>

      {/* Modal with WebView */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          {/* Modal header with close button */}
          <View style={[styles.modalHeader, { backgroundColor: theme.primary }]}>
            <TouchableOpacity onPress={closeModal}>
              <ArrowLeft size={24} color={theme.card} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.card }]}>Onboarding</Text>
            <View style={{ width: 24 }} /> {/* Spacer for layout balance */}
          </View>

          {/* WebView content */}
          {onboardingUrl ? (
            <WebView
              userAgent="Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36"
              source={{ uri: onboardingUrl }}
              style={styles.webview}
              startInLoadingState={true}
              onNavigationStateChange={handleNavigationStateChange}
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  submitButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  modalTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
  },
  webview: {
    flex: 1,
  },
});
