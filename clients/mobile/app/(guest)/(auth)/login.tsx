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
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Theme, useAppTheme } from '@/contexts/ThemeContext';

export default function AuthScreen(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwdFocused, setPwdFocused] = useState(false);
  const { login, isLoading } = useAuth();
  const theme = useAppTheme();
  const styles = makeStyles(theme);

  const handleLogin = async (): Promise<void> => {
    try {
      const user = await login(email, password);
      if (user.role === 'user') {
        router.replace('/(merchant)/(tabs)/store');
      } else {
        router.replace('/(guest)/customer');
      }
    } catch {
      Alert.alert('Errore', 'Si è verificato un errore durante il login');
    }
  };

  const togglePasswordVisibility = () => setShowPassword((p) => !p);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            {/* Ambient accents */}
            <View pointerEvents="none" style={styles.accentA} />
            <View pointerEvents="none" style={styles.accentB} />

            <ScrollView
              contentContainerStyle={styles.scroll}
              keyboardShouldPersistTaps="handled"
              bounces
            >
              {/* Brand / Hero */}
              <View style={styles.brandWrap}>
                <View
                  style={[styles.logoBadge, { borderColor: theme.secondary }]}
                >
                  <Text style={[styles.logoText, { color: theme.secondary }]}>
                    PT
                  </Text>
                </View>
                <Text style={[styles.title, { color: theme.text }]}>
                  Accedi al tuo account
                </Text>
                <Text style={styles.subTitle}>
                  Utente o attività? Inserisci le tue credenziali.
                </Text>
              </View>

              {/* Card */}
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.cardBackgroundColor,
                    borderColor: theme.border,
                  },
                ]}
              >
                {/* Email */}
                <View style={styles.fieldBlock}>
                  <Text style={[styles.label, { color: theme.subtext }]}>
                    Email
                  </Text>
                  <View
                    style={[
                      styles.inputWrap,
                      {
                        backgroundColor: theme.background,
                        borderColor: emailFocused
                          ? theme.primary
                          : theme.border,
                      },
                    ]}
                  >
                    <Mail
                      size={18}
                      color={emailFocused ? theme.primary : theme.subtext}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.text }]}
                      placeholder="nome@esempio.com"
                      placeholderTextColor={theme.subtext}
                      autoCorrect={false}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      textContentType="emailAddress"
                      returnKeyType="next"
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={styles.fieldBlock}>
                  <Text style={[styles.label, { color: theme.subtext }]}>
                    Password
                  </Text>
                  <View
                    style={[
                      styles.inputWrap,
                      {
                        backgroundColor: theme.background,
                        borderColor: pwdFocused ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Lock
                      size={18}
                      color={pwdFocused ? theme.primary : theme.subtext}
                    />
                    <TextInput
                      style={[styles.input, { color: theme.text }]}
                      placeholder="••••••••"
                      placeholderTextColor={theme.subtext}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      textContentType="password"
                      returnKeyType="done"
                      onFocus={() => setPwdFocused(true)}
                      onBlur={() => setPwdFocused(false)}
                    />
                    <TouchableOpacity
                      onPress={togglePasswordVisibility}
                      style={styles.eyeButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      accessibilityRole="button"
                      accessibilityLabel={
                        showPassword ? 'Nascondi password' : 'Mostra password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={20} color={theme.text} />
                      ) : (
                        <Eye size={20} color={theme.text} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Submit */}
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    { backgroundColor: theme.primary },
                    isLoading && styles.loginButtonDisabled,
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.9}
                  accessibilityRole="button"
                  accessibilityLabel="Accedi"
                >
                  {isLoading ? (
                    <ActivityIndicator color={theme.buttonTextColor} />
                  ) : (
                    <Text
                      style={[
                        styles.loginButtonText,
                        { color: theme.buttonTextColor },
                      ]}
                    >
                      Accedi
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Secondary CTA */}
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => router.push('./customer-signup')}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[styles.secondaryButtonText, { color: theme.text }]}
                  >
                    Nuovo su PayTomorrow?
                  </Text>
                  <Text
                    style={[styles.secondaryButtonSub, styles.linkButtonText]}
                  >
                    Guadagna 30€ in buoni Amazon → Registrati qui
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => router.push('/merchant-onboarding')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.linkButtonText}>
                    Registrati come attività con il codice invito ricevuto via
                    mail
                  </Text>
                </TouchableOpacity>

                {/* Password reset ready to re-enable */}
                {/* <TouchableOpacity onPress={() => router.push('./forgot-password')} activeOpacity={0.85}>
                  <Text style={[styles.linkMuted, { color: theme.subtext }]}>Ho dimenticato la password</Text>
                </TouchableOpacity> */}
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    // Ambient blobs for depth (no extra deps)
    accentA: {
      position: 'absolute',
      width: 280,
      height: 280,
      borderRadius: 280,
      backgroundColor: theme.primary,
      opacity: 0.08,
      top: -40,
      right: -60,
      filter: 'blur(40px)' as any, // RN Web; native just uses opacity/size
    },
    accentB: {
      position: 'absolute',
      width: 320,
      height: 320,
      borderRadius: 320,
      backgroundColor: theme.secondary,
      opacity: 0.06,
      bottom: -60,
      left: -80,
      filter: 'blur(40px)' as any,
    },

    scroll: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingVertical: 24,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18,
    },

    brandWrap: {
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
      backgroundColor: '#1A1A1A',
    },
    logoText: {
      fontFamily: theme.fontBold,
      fontSize: 18,
      letterSpacing: 1,
    },
    title: {
      fontSize: 26,
      fontFamily: theme.fontBold,
      textAlign: 'center',
    },
    subTitle: {
      fontSize: 15,
      textAlign: 'center',
      fontFamily: theme.fontRegular,
      lineHeight: 22,
      color: theme.subtext,
      maxWidth: 440,
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
      backdropFilter: 'blur(6px)' as any, // RN Web fallback
    },

    fieldBlock: {
      width: '100%',
      gap: 8,
    },
    label: {
      fontFamily: theme.fontSemiBold,
      fontSize: 12.5,
      letterSpacing: 0.3,
      textTransform: 'uppercase',
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
    eyeButton: {
      padding: 4,
    },

    loginButton: {
      marginTop: 4,
      height: 50,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginButtonDisabled: {
      opacity: 0.9,
    },
    loginButtonText: {
      fontFamily: theme.fontSemiBold,
      fontSize: 16,
      letterSpacing: 0.2,
    },

    secondaryButton: {
      marginTop: 6,
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surfaceSecondary,
      alignItems: 'center',
      gap: 4,
      shadowColor: '#000',
      shadowOpacity: theme.type === 'dark' ? 0.3 : 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    secondaryButtonText: {
      fontFamily: theme.fontSemiBold,
      fontSize: 15,
    },
    secondaryButtonSub: {
      fontFamily: theme.fontRegular,
      fontSize: 13.5,
    },
    linkButtonText: {
      fontFamily: theme.fontRegular,
      fontSize: 14,
      color: theme.surfaceSecondaryText,
      textAlign: 'center',
    },

    linksWrap: {
      width: '100%',
      maxWidth: 520,
      alignItems: 'center',
      gap: 10,
      paddingBottom: 8,
    },
    linkText: {
      fontFamily: theme.fontRegular,
      fontSize: 14,
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
    linkMuted: {
      fontFamily: theme.fontRegular,
      fontSize: 13,
      textAlign: 'center',
    },
  });
