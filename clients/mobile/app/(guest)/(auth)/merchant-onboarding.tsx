import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import apiClient from '@/lib/httpClient';
import { WebView } from 'react-native-webview';
import { useAppTheme } from '@/contexts/ThemeContext';

export default function MerchantOnboardingScreen(): JSX.Element {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [onboardingUrl, setOnboardingUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const theme = useAppTheme();
  const styles = getStyles(theme);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post('/users/get-by-invite', { inviteCode });

      if (response.status === 200) {
        setOnboardingUrl(response.data.user.onboardingLink);
        setModalVisible(true);
      }
    } catch (error) {
      Alert.alert('Errore', 'Si è verificato un errore durante la registrazione, assicurati che il codice di invito sia corretto');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setModalVisible(false);

  const handleNavigationStateChange = (navState: any) => {
    if (navState.url?.includes('app.paytomorrow.it/login')) {
      setModalVisible(false);
      Alert.alert(
        'Grazie',
        "A breve riceverai un'email contenente le credenziali per accedere a PayTomorrow"
      );
      router.push('/login');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={80}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={[styles.heading, { color: theme.text }]}>Benvenuto su PayTomorrow</Text>
          <Text style={[styles.subtitle, { color: theme.subtext }]}>
            Se sei stato invitato a unirti a PayTomorrow, dovresti aver ricevuto un'email con un codice.
            Inseriscilo qui sotto per iniziare il processo di onboarding come commerciante.
          </Text>
  
          <View style={[styles.formContainer, { backgroundColor: theme.cardBackgroundColor }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder="Codice di invito"
              value={inviteCode}
              onChangeText={setInviteCode}
              placeholderTextColor={theme.subtext}
            />
  
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: theme.primary },
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={[styles.submitButtonText, { color: theme.cardBackgroundColor }]}>
                {loading ? 'Attendi...' : 'Conferma'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
  
        {/* Modal remains unchanged */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            <View style={[styles.modalHeader, { backgroundColor: theme.primary }]}>
              <TouchableOpacity onPress={closeModal}>
                <ArrowLeft size={24} color={theme.cardBackgroundColor} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.cardBackgroundColor }]}>
                Onboarding
              </Text>
              <View style={{ width: 24 }} />
            </View>
  
            {onboardingUrl && (
              <WebView
                userAgent="Mozilla/5.0"
                source={{ uri: onboardingUrl }}
                style={styles.webview}
                startInLoadingState={true}
                onNavigationStateChange={handleNavigationStateChange}
              />
            )}
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    heading: {
      fontFamily: 'Poppins-Bold',
      fontSize: 24,
      marginBottom: 10,
    },
    subtitle: {
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      marginBottom: 30,
    },
    formContainer: {
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      elevation: 3,
    },
    input: {
      fontFamily: 'Poppins-Regular',
      padding: 15,
      borderRadius: 10,
      fontSize: 16,
      marginBottom: 20,
    },
    submitButton: {
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    submitButtonDisabled: {
      opacity: 0.6,
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
