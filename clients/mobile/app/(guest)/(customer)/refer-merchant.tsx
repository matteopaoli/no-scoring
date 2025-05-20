// app/(user)/refer-merchant.tsx
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppTheme, Theme } from '@/contexts/ThemeContext';
import apiClient from '@/lib/httpClient';
import useRegions from '@/hooks/useRegions';
import useBusinessTypes from '@/hooks/useBusinessTypes';
import { Button, Menu } from 'react-native-paper';

export default function ReferMerchantScreen() {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const router = useRouter();
  const { data: regions } = useRegions();
  const { data: businessTypes } = useBusinessTypes();

  const [merchantName, setMerchantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [region, setRegion] = useState<number | null>(null)
  const [businessType, setBusinessType] = useState<number | null>(null)
  const [regionMenuVisible, setRegionMenuVisible] = useState(false);
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);

  const referMerchantMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.post('/customer/refer', {
        refName: merchantName,
        email,
        phone,
        notes,
        regionId: region,
        businessTypeId: businessType
      });
    },
    onSuccess: (m) => {
      console.log(m)
      Alert.alert('Successo', 'Il commerciante è stato segnalato con successo!');
      router.back();
    },
    onError: (e) => {
      console.log(e)
      Alert.alert('Errore', 'Si è verificato un errore. Riprova più tardi.');
    },
  });

  const handleSubmit = () => {
    if (!merchantName || !email) {
      Alert.alert('Attenzione', 'Nome e email sono obbligatori.');
      return;
    }
    referMerchantMutation.mutate();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HERO SECTION */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroEmoji}>🎁</Text>
          <Text style={styles.heroTitle}>Invita un'attività a usare PayTomorrow, Ricevi 30€</Text>
          <Text style={styles.heroSubtitle}>
            Presentaci un'attività che ami. Se viene accettata, ti regaliamo una Gift Card Amazon da 30€!
          </Text>
        </View>

        {/* HOW IT WORKS */}
        <View style={styles.howItWorks}>
          <Text style={styles.sectionLabel}>Come funziona</Text>
          <Text style={styles.bullet}>• Compila il modulo con i dati dell’attività</Text>
          <Text style={styles.bullet}>• Il nostro team la contatterà</Text>
          <Text style={styles.bullet}>• Se entra in PayTomorrow, ricevi 30€ su Amazon</Text>
          <Text style={styles.linkText} onPress={() => Linking.openURL('https://app.paytomorrow.it/amazon-regolamento')}>
            Leggi il regolamento completo →
          </Text>
        </View>

        {/* FORM CARD */}
        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>Segnala ora</Text>

          <TextInput
            placeholder="Nome dell’attività*"
            value={merchantName}
            onChangeText={setMerchantName}
            style={styles.input}
            placeholderTextColor={theme.subtext}
          />
          <TextInput
            placeholder="Email*"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor={theme.subtext}
          />
          <TextInput
            placeholder="Telefono (opzionale)"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            placeholderTextColor={theme.subtext}
          />
          <TextInput
            placeholder="Note aggiuntive (opzionale)"
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            placeholderTextColor={theme.subtext}
          />
          <View style={styles.dropdownContainer}>
            {/* Regione */}
            <Text style={styles.dropdownLabel}>Regione*</Text>
            <Menu
              visible={regionMenuVisible}
              onDismiss={() => setRegionMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setRegionMenuVisible(true)}
                  style={styles.dropdownButton}
                  labelStyle={styles.dropdownButtonLabel}
                  contentStyle={{ justifyContent: 'flex-start' }}
                >
                  {regions?.find(r => r.id === region)?.name || 'Seleziona una regione'}
                </Button>
              }
              contentStyle={styles.menuContent}
            >
              <View style={styles.scrollableMenu}>
                <ScrollView>
                  {regions?.map(r => (
                    <Menu.Item
                      key={r.id}
                      onPress={() => {
                        setRegion(r.id);
                        setRegionMenuVisible(false);
                      }}
                      title={r.name}
                    />
                  ))}
                </ScrollView>
              </View>
            </Menu>



            {/* Tipo di attività */}
            <Text style={styles.dropdownLabel}>Tipo di attività*</Text>
            <Menu
              visible={typeMenuVisible}
              onDismiss={() => setTypeMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setTypeMenuVisible(true)}
                  style={styles.dropdownButton}
                  labelStyle={styles.dropdownButtonLabel}
                  contentStyle={{ justifyContent: 'flex-start' }}
                >
                  {businessTypes?.find(b => b.id === businessType)?.name || 'Seleziona un tipo di attività'}
                </Button>
              }
              contentStyle={styles.menuContent}
            >
              <View style={styles.scrollableMenu}>
                <ScrollView>
                  {businessTypes?.map(r => (
                    <Menu.Item
                      key={r.id}
                      onPress={() => {
                        setBusinessType(r.id);
                        setTypeMenuVisible(false);
                      }}
                      title={r.name}
                    />
                  ))}
                </ScrollView>
              </View>
            </Menu>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, referMerchantMutation.isPending && { opacity: 0.5 }]}
            onPress={handleSubmit}
            disabled={referMerchantMutation.isPending}>
            <Text style={styles.submitButtonText}>Invia segnalazione</Text>
          </TouchableOpacity>
        </View>

        {/* TRUST SIGNAL / CLOSING */}
        <Text style={styles.footerNote}>
          💬 Il nostro team contatterà il commerciante con tatto e professionalità.
        </Text>
      </ScrollView>
      {referMerchantMutation.isPending && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    container: {
      padding: 20,
    },
    scrollContent: {
      padding: 20,
    },

    heroSection: {
      marginBottom: 30,
    },

    formCard: {
      backgroundColor: theme.cardBackgroundColor,
      padding: 20,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 2,
    },

    sectionLabel: {
      fontFamily: theme.fontSemiBold,
      fontSize: 16,
      marginBottom: 10,
      color: theme.text,
    },

    submitButton: {
      backgroundColor: '#28A745',
      padding: 16,
      borderRadius: 20,
      alignItems: 'center',
      marginTop: 10,
      shadowColor: '#28A745',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      elevation: 3,
    },

    description: {
      fontFamily: theme.fontRegular,
      fontSize: 16,
      color: theme.text,
      marginBottom: 10,
    },

    bold: {
      fontFamily: theme.fontSemiBold,
      color: theme.text,
    },

    linkText: {
      fontFamily: theme.fontRegular,
      fontSize: 14,
      color: '#007BFF',
      marginBottom: 20,
      textDecorationLine: 'underline',
    },
    title: {
      fontFamily: theme.fontBold,
      fontSize: theme.fontSizeHeading + 4,
      marginBottom: 20,
      color: theme.text,
    },
    input: {
      backgroundColor: theme.background,
      padding: 15,
      borderRadius: 10,
      fontSize: 16,
      fontFamily: theme.fontRegular,
      marginBottom: 15,
      color: theme.text,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    heroBanner: {
      alignItems: 'center',
      marginBottom: 30,
    },

    heroEmoji: {
      fontSize: 48,
      marginBottom: 10,
    },

    heroTitle: {
      fontFamily: theme.fontBold,
      fontSize: 24,
      color: theme.text,
      textAlign: 'center',
      marginBottom: 8,
    },

    heroSubtitle: {
      fontFamily: theme.fontRegular,
      fontSize: 16,
      color: theme.subtext,
      textAlign: 'center',
      paddingHorizontal: 20,
    },

    howItWorks: {
      marginBottom: 30,
      paddingHorizontal: 10,
    },

    bullet: {
      fontFamily: theme.fontRegular,
      fontSize: 15,
      color: theme.text,
      marginBottom: 5,
    },

    footerNote: {
      textAlign: 'center',
      fontSize: 14,
      color: theme.subtext,
      marginTop: 20,
      fontFamily: theme.fontRegular,
      paddingHorizontal: 30,
    },
    submitButtonText: {
      color: theme.cardBackgroundColor,
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
    },
    dropdownContainer: {
      marginBottom: 20,
    },

    dropdownLabel: {
      fontFamily: theme.fontRegular,
      fontSize: 15,
      marginBottom: 6,
      color: theme.text,
    },

    dropdownButton: {
      backgroundColor: theme.background,
      borderRadius: 10,
      justifyContent: 'center',
      marginBottom: 15,
    },

    dropdownButtonLabel: {
      fontFamily: theme.fontRegular,
      fontSize: 16,
      textAlign: 'left',
      color: theme.text,
    },
    menuContent: {
      borderRadius: 10,
      paddingVertical: 0,
    },

    scrollableMenu: {
      maxHeight: 250,
    }
  });
