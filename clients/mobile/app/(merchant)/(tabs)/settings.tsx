import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Linking,
  Alert,
  Share,
  Image,
  Modal,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Keyboard,
  Vibration,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ArrowLeft,
  CreditCard,
  HelpCircle,
  LogOut,
  Smartphone,
  Moon,
  Sun,
  Euro,
  SunDimIcon,
  RectangleEllipsis,
  CircleEllipsis,
  EllipsisVertical,
  Pencil,
  Lock,
  Trash,
  Delete,
  Link,
  PanelTopDashedIcon,
  Save,
} from 'lucide-react-native';
import { Theme, useThemeContext } from '@/contexts/ThemeContext';
import DeleteAccountModal from '@/components/delete-account-modal';
import apiClient from '@/lib/httpClient';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import useMyStoreDetails from '@/hooks/useMyStoreDetails';
import { useUpdateCustomerPaysFees } from '@/hooks/useUpdateCustomerPaysFees';
import { Toast } from 'toastify-react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Menu, TextInput } from 'react-native-paper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { openPlatformPaySetup } from '@stripe/stripe-react-native';
import React from 'react';

export default function MerchantSettingsScreen() {
  //TODO
  // [ ] Collegare selezione immagine di profilo (settings/change-user-data)
  // [ ] Collegare form in change-user-data ai dati dell'utente e 
  //     eseguire le chiamate user/update e store/update (per business type id) dopo validazione input 
  // [ ] Modificare campo Business Type Id in un dropdown con la lista presa da chiamata ???
  // [ ] Collegare pagina cambio password con servizi
  // [ ] Aggiungere dropdown tema in settings (App)
  // [ ] Aggiungere checkbox commissioni in settings (Store) 
  // [X] Rimuovere numero di telefono nel header 
  // [ ] Sistemare stile Dropdown di google
  // [ ] Sistemare Bug Liste Dropdown
  // [ ] Collegare risultato  Dropdown di google
  // [ ] Pulizia codicew

  const { logout } = useAuth();
  const router = useRouter();
  const { isPending, isError, data: store, error } = useMyStoreDetails();
  const { theme, themePreference, setThemePreference } = useThemeContext();
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const { mutate: updateFees, isPending: isUpdatingFees } =
    useUpdateCustomerPaysFees();
  const styles = makeStyles(theme);

  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState(store?.name)
  const [storeNameError, setStoreNameError] = useState('');

  const [storeDescription, setStoreDescription] = useState(store?.description)
  const [storeDescriptionError, setStoreDescriptionError] = useState('');

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const confirmDeleteAccount = () => {
    setDeleteModalVisible(false); // Close the modal
    apiClient
      .post('/users/delete')
      .then(() => {
        handleLogout();
        Toast.success(
          'Il tuo account è stato eliminato con successo. Ci dispiace vederti andare via.',
          'bottom',
        );
      })
      .catch((error) => {
        console.error('Error deleting account:', error);
        // Handle the error, e.g., show an alert
      });
  };

  const cancelDeleteAccount = () => {
    setDeleteModalVisible(false); // Just close the modal
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://app.paytomorrow.it/privacy');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://app.paytomorrow.it/terms');
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          'Scarica l’app PayTomorrow!\n\n📱 Android: https://play.google.com/store/apps/details?id=com.matteopaoli.paytomorrowapp&pli=1\n🍏 iOS: https://apps.apple.com/it/app/paytomorrow/id6745253657',
      });
    } catch (error) {
      console.error('Errore condivisione:', error);
    }
  };

  const handleSaveStoreData = async () => {
    Keyboard.dismiss(); // Dismiss keyboard on submit
    setLoading(true);
    Vibration.vibrate(50);
    console.log(storeDescription)
    try {
      const { data } = await apiClient.post('/store/update', { name: storeName, description: storeDescription });
    } catch {
      setStoreNameError("Errore riprova");
    } finally {
      setLoading(false);
    }
  }

  const isDataModified = store?.name != storeName || store?.description != storeDescription


  const isActive = (mode: 'light' | 'dark' | null) => themePreference === mode;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <SettingsHeadaer
        firstName="Davide"
        lastName="Franceschi"
        image={store?.image}
          theme={theme}
        handleMenuSelection={(value: string) => {
          switch (value) {
            case "Modifica dati utente":
              router.push("/(merchant)/(settings)/change-user-data")
              break;
            case "Modifica password":
              router.push("/(merchant)/(settings)/change-password")
              break;
            case "Logout":
              handleLogout();
              break;
            case "Elimina account":
              setDeleteModalVisible(true)
              break;
            default:
              break;
          }
        }
        }
      >

      </SettingsHeadaer>
      <ScrollView
        nestedScrollEnabled={true}
      >
        <SettingsSection
          title="Negozio"
          theme={theme}
        >
          <View style={styles.sectionContainer}>

            <TouchableOpacity onPress={() => bottomSheetRef.current?.expand()}>
              <Image
                style={[styles.profileImage]}
                source={{ uri: store?.image ?? defaultImage }}
              >
              </Image>
              </TouchableOpacity>
            <View style={[styles.inputContainer, { marginTop: 20 }]}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                value={storeName}
                onChangeText={(t) => { setStoreName(t) }}
                placeholder="Mario rossi"
                placeholderTextColor={theme.subtext}
                textColor={theme.text}
                activeUnderlineColor={theme.primary}
                style={[
                  styles.input,
                  storeNameError ? styles.inputError : null,
                ]}
              />
              {storeNameError ? <Text style={styles.error}>{storeNameError}</Text> : null}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Descrizione</Text>
              <TextInput
                value={storeDescription}
                onChangeText={(t) => { setStoreDescription(t) }}
                placeholder="Password123!"
                activeUnderlineColor={theme.primary}
                textColor={theme.text}
                placeholderTextColor={theme.subtext}
          style={[
                  styles.input,
                  storeDescriptionError ? styles.inputError : null
                ]}
              />
              {storeDescriptionError ? <Text style={styles.error}>{storeDescriptionError}</Text> : null}
            </View>
            <View style={styles.autocompleteContainer}>
              <GooglePlacesAutocomplete
                placeholder="Cerca..."
                minLength={2}
                fetchDetails={true}
                styles={{
                  backgroundColor: theme.background
                }}
                onPress={() => { }}
                query={{
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                  language: 'it',
                  components: 'country:it',
                }}
              />
            </View>
            <Pressable onPress={handleSaveStoreData} disabled={!isDataModified} style={styles.button}>
              {loading ? <ActivityIndicator color="#fff" /> : <>
                <Save size={28} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Salva</Text>
              </>}
            </Pressable>

          </View>
        </SettingsSection>
        <View
          style={styles.sectionDivider}
                />
        <SettingsSection
          title="App"
              theme={theme}
        >
          <View style={styles.sectionContainer}>
            <TouchableOpacity onPress={openPlatformPaySetup} style={styles.sectionTextItem}>
              <Text style={{ color: theme.subtext, fontSize: 16 }}>
              Acquista PayTomorrow
            </Text>
          </TouchableOpacity>
            <TouchableOpacity onPress={() => openTermsOfService} style={styles.sectionTextItem}>
              <Text style={{ color: theme.subtext, fontSize: 16 }}>
                Termini e condizioni d'uso
          </Text>
        </TouchableOpacity>
            <TouchableOpacity onPress={openPrivacyPolicy} style={styles.sectionTextItem}>
              <Text style={{ color: theme.subtext, fontSize: 16 }}>
                Privacy policy
          </Text>
        </TouchableOpacity>
            <TouchableOpacity onPress={handleShareApp} style={styles.sectionTextItem}>
              <Text style={{ color: theme.subtext, fontSize: 16 }}>
                Condividi l'app
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
                marginTop: 20,
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://www.facebook.com/people/Pay-Tomorrow/61565769418431/',
              )
            }
          >
            <FontAwesome
              name="facebook-square"
              size={48}
              color="#3b5998"
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://www.instagram.com/pay.tomorrow/')
            }
          >
            <FontAwesome name="instagram" size={48} color="#C13584" />
          </TouchableOpacity>
        </View>
      </View>
        </SettingsSection>
      </ScrollView>
      <DeleteAccountModal
        visible={isDeleteModalVisible}
        onCancel={cancelDeleteAccount}
        onConfirm={confirmDeleteAccount}
      />
    </View>
  );
}

function SettingsSection({ title, children, theme }) {
  const styles = makeStyles(theme);
  return (
    <View
      style={[styles.section, { backgroundColor: theme.cardBackgroundColor }]}
    >
      <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function SettingsItem({
  icon,
  label,
  theme,
  rightElement = null,
  noBorder = false,
}) {
  const styles = makeStyles(theme);
  return (
    <View
      style={[
        styles.settingItem,
        {
          borderBottomWidth: noBorder ? 0 : 0.5,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <Text style={[styles.settingText, { color: theme.text }]}>{label}</Text>
      {rightElement}
    </View>
  );
}

function ThemeOption({ icon, label, active, onPress, theme }) {
  const styles = makeStyles(theme);
  return (
    <TouchableOpacity
      style={[
        styles.themeButton,
        {
          backgroundColor: active ? theme.primary : theme.background,
          borderColor: theme.border,
        },
      ]}
      onPress={onPress}
    >
      {icon}
      <Text
        style={[
          styles.themeButtonText,
          {
            color: active ? theme.background : theme.text,
            fontFamily: theme.fontSemiBold,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingTop: 60,
    },
    title: {
      fontFamily: theme.fontBold,
      fontSize: 24,
      marginBottom: 30,
    },
    section: {
      marginBottom: 20,
      borderRadius: 15,
      padding: 15,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    sectionTitle: {
      fontFamily: theme.fontSemiBold,
      fontSize: 18,
      marginBottom: 15,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    settingIcon: {
      marginRight: 15,
    },
    settingText: {
      fontFamily: theme.fontRegular,
      fontSize: 16,
      flex: 1,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      borderRadius: 15,
      marginTop: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    logoutText: {
      fontFamily: theme.fontSemiBold,
      fontSize: 16,
      marginLeft: 10,
    },
    themeButtonsContainer: {
      flexDirection: 'row',
      marginLeft: 10,
      width: '100%',
      justifyContent: 'center',
    },
    themeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: 1,
      marginLeft: 5,
    },
    themeButtonText: {
      fontSize: 14,
      marginLeft: 6,
    },
    footerLinks: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 20,
    },
    footerLinkText: {
      fontFamily: theme.fontRegular,
      fontSize: 14,
    },
    footerLinkSeparator: {
      marginHorizontal: 10,
    },
    signOutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FF4D4D',
      marginHorizontal: 20,
      padding: 15,
      borderRadius: 15,
      marginTop: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    signOutButtonText: {
      fontFamily: theme.fontSemiBold,
      fontSize: 16,
      color: '#FFFFFF',
      marginLeft: 10,
    },
    shareButton: {
      backgroundColor: '#1E90FF',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 20,
      marginTop: 10,
    },
    shareButtonText: {
      fontFamily: theme.fontSemiBold,
      fontSize: 16,
      color: '#FFFFFF',
    },
    socialText: {
      color: theme.subtext,
      textAlign: 'center',
    },
  });
