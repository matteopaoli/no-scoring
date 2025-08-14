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
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, KeyRound } from 'lucide-react-native';
import apiClient from '@/lib/httpClient';
import { WebView } from 'react-native-webview';
import { Theme, useAppTheme } from '@/contexts/ThemeContext';

export default function MerchantOnboardingScreen(): JSX.Element {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [onboardingUrl, setOnboardingUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const theme = useAppTheme();
  const surfaceSecondary =
    (theme as any).surfaceSecondary ??
    (theme.type === 'dark' ? '#1a1a1a88' : `${theme.secondary}33`);
  const styles = getStyles(theme, surfaceSecondary);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post('/users/get-by-invite', { inviteCode });
      if (response.status === 200) {
        setOnboardingUrl(response.data.user.onboardingLink);
        setModalVisible(true);
      }
    } catch {
      Alert.alert(
        'Errore',
        'Si è verificato un errore durante la registrazione, assicurati che il codice di invito sia corretto'
      );
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            bounces
          >
            {/* Ambient accents */}
            <View pointerEvents="none" style={styles.accentA} />
            <View pointerEvents="none" style={styles.accentB} />

            {/* Header */}
            <View style={styles.headerWrap}>
              <View style={[styles.logoBadge, { borderColor: theme.secondary }]}>
                <Text style={[styles.logoText, { color: theme.secondary }]}>PT</Text>
              </View>
              <Text style={[styles.heading, { color: theme.text }]}>Benvenuto su PayTomorrow</Text>
              <Text style={styles.subtitle}>
                Se sei stato invitato, inserisci il codice per iniziare l’onboarding come
                commerciante.
              </Text>
            </View>

            {/* Card */}
            <View
              style={[
                styles.card,
                { backgroundColor: theme.cardBackgroundColor, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.label, { color: theme.subtext }]}>Codice di invito</Text>

              {/* Input with icon */}
              <View
                style={[
                  styles.inputWrap,
                  {
                    backgroundColor: theme.background,
                    borderColor: focused ? theme.primary : theme.border,
                  },
                ]}
              >
                <KeyRound size={18} color={focused ? theme.primary : theme.subtext} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Es: INVITO-1234"
                  placeholderTextColor={theme.subtext}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  value={inviteCode}
                  onChangeText={setInviteCode}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  returnKeyType="done"
                />
              </View>

              {/* Primary CTA */}
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.primary }, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={theme.buttonTextColor ?? theme.cardBackgroundColor} />
                ) : (
                  <Text
                    style={[
                      styles.submitButtonText,
                      { color: theme.buttonTextColor ?? theme.cardBackgroundColor },
                    ]}
                  >
                    Conferma
                  </Text>
                )}
              </TouchableOpacity>

              {/* Secondary tip block (pressable look but not a button) */}
              <View style={styles.tipBlock}>
                <Text style={styles.tipTitle}>Non hai il codice?</Text>
                <Text style={styles.tipText}>
                  Contatta il tuo referente PayTomorrow oppure richiedi un nuovo invito dal
                  portale.
                </Text>
              </View>
            </View>

            {/* Support link-style buttons (no underlines, tactile) */}
            <View style={styles.linksWrap}>
              <TouchableOpacity
                style={styles.linkButton}
                activeOpacity={0.85}
                onPress={() => router.back()}
              >
                <Text style={styles.linkButtonText}>Torna indietro</Text>
              </TouchableOpacity>
            </View>

            {/* Modal */}
            <Modal animationType="slide" transparent={false} visible={modalVisible} onRequestClose={closeModal}>
              <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
                <View style={[styles.modalHeader, { backgroundColor: theme.primary }]}>
                  <TouchableOpacity onPress={closeModal} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <ArrowLeft size={24} color={theme.buttonTextColor ?? theme.cardBackgroundColor} />
                  </TouchableOpacity>
                  <Text style={[styles.modalTitle, { color: theme.buttonTextColor ?? theme.cardBackgroundColor }]}>
                    Onboarding
                  </Text>
                  <View style={{ width: 24 }} />
                </View>

                {onboardingUrl ? (
                  <WebView
                    userAgent="Mozilla/5.0"
                    source={{ uri: onboardingUrl }}
                    style={styles.webview}
                    startInLoadingState
                    onNavigationStateChange={handleNavigationStateChange}
                  />
                ) : null}
              </View>
            </Modal>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (theme: Theme, surfaceSecondary: string) =>
  StyleSheet.create({
    scroll: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingVertical: 24,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18,
      backgroundColor: theme.background,
    },

    // Ambient blobs
    accentA: {
      position: 'absolute',
      width: 260,
      height: 260,
      borderRadius: 260,
      backgroundColor: theme.primary,
      opacity: 0.08,
      top: -30,
      right: -70,
      filter: 'blur(40px)' as any,
    },
    accentB: {
      position: 'absolute',
      width: 300,
      height: 300,
      borderRadius: 300,
      backgroundColor: theme.secondary,
      opacity: 0.06,
      bottom: -80,
      left: -90,
      filter: 'blur(40px)' as any,
    },

    headerWrap: {
      alignItems: 'center',
      gap: 10,
      maxWidth: 520,
      width: '100%',
    },
    logoBadge: {
      width: 64,
      height: 64,
      borderRadius: 40,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.type === 'dark' ? '#1A1A1A' : '#FFF',
    },
    logoText: {
      fontFamily: theme.fontBold,
      fontSize: 18,
      letterSpacing: 1,
    },
    heading: {
      fontFamily: theme.fontBold,
      fontSize: 26,
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: theme.fontRegular,
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
      color: theme.subtext,
      maxWidth: 520,
    },

    card: {
      width: '100%',
      maxWidth: 520,
      padding: 18,
      borderRadius: 18,
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
      gap: 14,
    },

    label: {
      fontFamily: theme.fontSemiBold,
      fontSize: 12.5,
      letterSpacing: 0.3,
      textTransform: 'uppercase',
      color: theme.subtext,
    },
    inputWrap: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      height: 48,
    },
    input: {
      flex: 1,
      height: '100%',
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize,
    },

    submitButton: {
      marginTop: 2,
      height: 50,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitButtonDisabled: {
      opacity: 0.9,
    },
    submitButtonText: {
      fontFamily: theme.fontSemiBold,
      fontSize: 16,
      letterSpacing: 0.2,
    },

    tipBlock: {
      marginTop: 6,
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: surfaceSecondary,
      alignItems: 'center',
      gap: 6,
      shadowColor: '#000',
      shadowOpacity: theme.type === 'dark' ? 0.3 : 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    tipTitle: {
      fontFamily: theme.fontSemiBold,
      fontSize: 15,
      color: theme.text,
      textAlign: 'center',
    },
    tipText: {
      fontFamily: theme.fontRegular,
      fontSize: 13.5,
      color: theme.subtext,
      textAlign: 'center',
    },

    linksWrap: {
      width: '100%',
      maxWidth: 520,
      alignItems: 'center',
      gap: 10,
    },
    linkButton: {
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 10,
      backgroundColor: surfaceSecondary,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: theme.type === 'dark' ? 0.25 : 0.08,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.border,
    },
    linkButtonText: {
      fontFamily: theme.fontRegular,
      fontSize: 14,
      color: theme.text,
      textAlign: 'center',
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
      fontFamily: theme.fontBold,
      fontSize: 20,
    },
    webview: {
      flex: 1,
    },
  });
