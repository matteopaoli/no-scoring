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
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Theme, useAppTheme } from '@/contexts/ThemeContext';
import apiClient from '@/lib/httpClient';
import { useMutation } from '@tanstack/react-query';
import { useIsFocused } from '@react-navigation/native';
import { Linking } from 'react-native';

type SignupDTO = {
  firstName: string;
  lastName: string;
  password: string;
  repeatPassword: string;
  phoneNumber: string;
  email: string;
};

export default function CustomerSignupScreen(): JSX.Element {
  const router = useRouter();
  const theme = useAppTheme();
  const isFocused = useIsFocused();
  const surfaceSecondary =
    (theme as any).surfaceSecondary ??
    (theme.type === 'dark' ? '#1a1a1a88' : `${theme.secondary}33`);
  const styles = makeStyles(theme, surfaceSecondary);

  const signupMutation = useMutation({
    mutationFn: async (newCustomerData: SignupDTO) =>
      apiClient.post('/customer/signup', newCustomerData),
    onSuccess: () => {
      Alert.alert('Successo', 'Registrazione completata');
      login(email, password).then(() => {
        router.replace('/(guest)/customer');
      });
    },
    onError: () => {
      Alert.alert('Errore', 'Si è verificato un errore durante la registrazione');
    },
  });

  const { login } = useAuth();

  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [password, setPassword]   = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // focus states for borders/icons
  const [focus, setFocus] = useState<{[k: string]: boolean}>({});

  useEffect(() => {
    if (!isFocused) {
      setFirstName('');
      setLastName('');
      setPassword('');
      setRepeatPassword('');
      setShowPassword(false);
      setShowRepeatPassword(false);
      setStep(1);
    }
  }, [isFocused]);

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
    if (!password || !repeatPassword || password !== repeatPassword) {
      Alert.alert('Errore', 'Le password non corrispondono');
      return;
    }
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      Alert.alert(
        'Errore',
        'La password deve contenere almeno 8 caratteri, una lettera minuscola, una maiuscola, un numero e un simbolo speciale'
      );
      return;
    }
    if (!acceptedTerms) {
      Alert.alert('Errore', 'Devi accettare i Termini e Condizioni');
      return;
    }
    try {
      await signupMutation.mutate({
        firstName,
        lastName,
        email,
        password,
        repeatPassword,
        phoneNumber: phone,
      } as SignupDTO);
    } catch {
      Alert.alert('Errore', 'Si è verificato un errore durante la registrazione');
    }
  };

  const StepPill = ({index, label}:{index:number; label:string}) => (
    <View style={[
      styles.stepPill,
      index === step && styles.stepPillActive,
    ]}>
      <Text style={[
        styles.stepPillText,
        index === step && styles.stepPillTextActive,
      ]}>
        {label}
      </Text>
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.label}>Dati personali</Text>
            <View style={[
              styles.inputWrap,
              { borderColor: focus.firstName ? theme.primary : theme.border, backgroundColor: theme.background },
            ]}>
              <User size={18} color={focus.firstName ? theme.primary : theme.subtext} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Nome"
                placeholderTextColor={theme.subtext}
                value={firstName}
                onChangeText={setFirstName}
                onFocus={() => setFocus({...focus, firstName: true})}
                onBlur={() => setFocus({...focus, firstName: false})}
                returnKeyType="next"
              />
            </View>

            <View style={[
              styles.inputWrap,
              { borderColor: focus.lastName ? theme.primary : theme.border, backgroundColor: theme.background },
            ]}>
              <User size={18} color={focus.lastName ? theme.primary : theme.subtext} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Cognome"
                placeholderTextColor={theme.subtext}
                value={lastName}
                onChangeText={setLastName}
                onFocus={() => setFocus({...focus, lastName: true})}
                onBlur={() => setFocus({...focus, lastName: false})}
                returnKeyType="next"
              />
            </View>
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.label}>Contatti</Text>
            <View style={[
              styles.inputWrap,
              { borderColor: focus.email ? theme.primary : theme.border, backgroundColor: theme.background },
            ]}>
              <Mail size={18} color={focus.email ? theme.primary : theme.subtext} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Email"
                placeholderTextColor={theme.subtext}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocus({...focus, email: true})}
                onBlur={() => setFocus({...focus, email: false})}
                returnKeyType="next"
              />
            </View>

            <View style={[
              styles.inputWrap,
              { borderColor: focus.phone ? theme.primary : theme.border, backgroundColor: theme.background },
            ]}>
              <Phone size={18} color={focus.phone ? theme.primary : theme.subtext} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Numero di telefono"
                placeholderTextColor={theme.subtext}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
                onFocus={() => setFocus({...focus, phone: true})}
                onBlur={() => setFocus({...focus, phone: false})}
                returnKeyType="next"
              />
            </View>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.label}>Sicurezza</Text>

            <View style={[
              styles.inputWrap,
              { borderColor: focus.password ? theme.primary : theme.border, backgroundColor: theme.background },
            ]}>
              <Lock size={18} color={focus.password ? theme.primary : theme.subtext} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={theme.subtext}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocus({...focus, password: true})}
                onBlur={() => setFocus({...focus, password: false})}
                returnKeyType="next"
              />
              <TouchableOpacity onPress={() => setShowPassword((p) => !p)} hitSlop={{top:8,bottom:8,left:8,right:8}}>
                {showPassword ? <EyeOff size={20} color={theme.text} /> : <Eye size={20} color={theme.text} />}
              </TouchableOpacity>
            </View>

            <View style={[
              styles.inputWrap,
              { borderColor: focus.repeat ? theme.primary : theme.border, backgroundColor: theme.background },
            ]}>
              <Lock size={18} color={focus.repeat ? theme.primary : theme.subtext} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Ripeti Password"
                placeholderTextColor={theme.subtext}
                secureTextEntry={!showRepeatPassword}
                value={repeatPassword}
                onChangeText={setRepeatPassword}
                onFocus={() => setFocus({...focus, repeat: true})}
                onBlur={() => setFocus({...focus, repeat: false})}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={() => setShowRepeatPassword((p) => !p)} hitSlop={{top:8,bottom:8,left:8,right:8}}>
                {showRepeatPassword ? <EyeOff size={20} color={theme.text} /> : <Eye size={20} color={theme.text} />}
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxRow}>
              <TouchableOpacity
                onPress={() => setAcceptedTerms((prev) => !prev)}
                style={[
                  styles.checkbox,
                  {
                    borderColor: theme.border,
                    backgroundColor: acceptedTerms ? theme.primary : 'transparent',
                  },
                ]}
              >
                {acceptedTerms && <Text style={styles.checkboxTick}>✓</Text>}
              </TouchableOpacity>
              <Text style={[styles.termsText, { color: theme.text }]}>
                Accetto i{' '}
                <Text
                  style={[styles.termsLink, { color: theme.primary }]}
                  onPress={() => Linking.openURL('https://app.paytomorrow.it/customer-terms')}
                >
                  Termini e Condizioni
                </Text>
              </Text>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            bounces
          >
            {/* Ambient accents */}
            <View pointerEvents="none" style={styles.accentA} />
            <View pointerEvents="none" style={styles.accentB} />

            {/* Header */}
            <View style={styles.headerWrap}>
              <Text style={[styles.title, { color: theme.text }]}>Registrati</Text>
              <View style={styles.steps}>
                <StepPill index={1} label="Dati" />
                <StepPill index={2} label="Contatti" />
                <StepPill index={3} label="Sicurezza" />
              </View>
            </View>

            {/* Card */}
            <View style={[styles.card, { backgroundColor: theme.cardBackgroundColor, borderColor: theme.border }]}>
              {renderStep()}

              {/* Nav buttons */}
              <View style={styles.navRow}>
                {step > 1 ? (
                  <TouchableOpacity
                    style={[styles.navButton, styles.navGhost]}
                    onPress={handleBack}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.navGhostText, { color: theme.text }]}>Indietro</Text>
                  </TouchableOpacity>
                ) : <View style={{ flex: 1 }} />}

                {step < 3 ? (
                  <TouchableOpacity
                    style={[styles.navButton, { backgroundColor: theme.primary }]}
                    onPress={handleNext}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.navPrimaryText, { color: theme.buttonTextColor ?? theme.cardBackgroundColor }]}>
                      Avanti
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.navButton,
                      { backgroundColor: theme.primary },
                      signupMutation.isPending && styles.navDisabled,
                    ]}
                    onPress={handleSignup}
                    activeOpacity={0.85}
                    disabled={signupMutation.isPending}
                  >
                    {signupMutation.isPending ? (
                      <ActivityIndicator color={theme.buttonTextColor ?? theme.cardBackgroundColor} />
                    ) : (
                      <Text style={[styles.navPrimaryText, { color: theme.buttonTextColor ?? theme.cardBackgroundColor }]}>
                        Registrati
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Login link as tactile pill (no underline) */}
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.replace('/(guest)/(auth)/login')}
              activeOpacity={0.85}
            >
              <Text style={styles.linkButtonText}>Hai già un account? Accedi</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (theme: Theme, surfaceSecondary: string) =>
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
      top: -40,
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
      maxWidth: 560,
      width: '100%',
    },
    title: {
      fontFamily: theme.fontBold,
      fontSize: 28,
      textAlign: 'center',
    },

    steps: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 6,
    },
    stepPill: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: surfaceSecondary,
      borderWidth: 1,
      borderColor: theme.border,
    },
    stepPillActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    stepPillText: {
      fontFamily: theme.fontRegular,
      fontSize: 12.5,
      color: theme.text,
    },
    stepPillTextActive: {
      color: theme.buttonTextColor ?? theme.cardBackgroundColor,
      fontFamily: theme.fontSemiBold,
    },

    card: {
      width: '100%',
      maxWidth: 560,
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

    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 8,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 1,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxTick: {
      color: '#fff',
      fontSize: 16,
      lineHeight: 16,
    },
    termsText: {
      flex: 1,
      fontFamily: theme.fontRegular,
      fontSize: 13.5,
    },
    termsLink: {
      textDecorationLine: 'none',
      fontFamily: theme.fontSemiBold,
    },

    navRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 6,
    },
    navButton: {
      flex: 1,
      height: 50,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: theme.type === 'dark' ? 0.25 : 0.08,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    navDisabled: {
      opacity: 0.9,
    },
    navGhost: {
      backgroundColor: surfaceSecondary,
      borderWidth: 1,
      borderColor: theme.border,
    },
    navGhostText: {
      fontFamily: theme.fontSemiBold,
      fontSize: 15,
    },
    navPrimaryText: {
      fontFamily: theme.fontSemiBold,
      fontSize: 16,
      letterSpacing: 0.2,
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
      maxWidth: 560,
      width: '100%',
    },
    linkButtonText: {
      fontFamily: theme.fontRegular,
      fontSize: 14,
      color: theme.text,
      textAlign: 'center',
    },
  });
