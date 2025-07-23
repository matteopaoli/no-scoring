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
    </SafeAreaView>
  );
}

function SettingsSection({ title, children, theme }) {
  const styles = makeStyles(theme);
  return (
    <View
      style={[styles.section]}
    >
      <Text style={[styles.sectionTitle, { color: theme.subtext }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function SettingsHeadaer({ firstName, lastName, image, theme, handleMenuSelection }) {
  const styles = makeStyles(theme);
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const options: Array<DropdownMenuItem> = [
    {
      id: 0,
      text: "Modifica dati utente",
      icon: "pencil"

    },
    {
      id: 1,
      text: "Modifica password",
      icon: "lock"
    },
    {
      id: 2,
      text: "Logout",
      icon: "logout",
      color: 'orange'
    },
    {
      id: 3,
      text: "Elimina Account",
      icon: "delete",
      color: 'red'
    }
  ]
  return (
    <View
      style={[styles.header, { backgroundColor: theme.cardBackgroundColor }]}
    >
      <Image
        style={[styles.headerImage]}
        source={{ uri: image }}
      >
      </Image>

      <View
        style={[styles.headerTextContainer, { backgroundColor: theme.cardBackgroundColor }]}
      >
        <Text
          style={[styles.headerTextTitle]}>
          {firstName + " " + lastName}
        </Text>
      </View>
      <Menu
        visible={isDropDownVisible}
        onDismiss={() => setIsDropDownVisible(false)}
        anchor={
          <Button
            onPress={() => setIsDropDownVisible(true)}
            style={styles.dropdownThreeDots}
          >
            <EllipsisVertical
              size={30}
              color={theme.subtext}
            />
          </Button>
        }
        contentStyle={styles.dropdownList}
      >

        <View style={styles.dropdownScrollableArea}>
          <ScrollView>
            {options?.map(r => (
              <Menu.Item
                key={r.id}
                onPress={() => {
                  handleMenuSelection(r.text);
                  setIsDropDownVisible(false);
                }}
                title={r.text}
                leadingIcon={r.icon}
                style={[styles.dropdownItem, {}]}
              />
            ))}
          </ScrollView>
        </View>
      </Menu>
    </View>
  );
}

type DropdownMenuItem = {
  id: number,
  text: string;
  icon?: string;
  color?: string;
};

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
      {icon}share
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
      height: '100%',
      backgroundColor: theme.background
    },
    title: {
      fontSize: 24,
      marginBottom: 30,
    },
    header: {
      width: "100%",
      height: "12%",
      position: 'relative',
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    headerImage: {
      width: 50,
      height: 50,
      objectFit: 'contain',
      backgroundColor: "red",
      borderRadius: 50,
      margin: 20,
    },
    headerTextContainer: {
      marginLeft: 8,
      flexDirection: 'column',
      justifyContent: 'center',
      flex: 1
    },
    headerTextTitle: {
      color: theme.text,
      fontWeight: 700,
      fontSize: 16,
    },
    headerTextSubTitle: {
      color: theme.text,
      fontWeight: 400,
      fontSize: 12,
    },
    dropdown: {
      marginRight: 20
    },
    dropdownThreeDots: {
      borderRadius: 50
    },
    dropdownList: {
      backgroundColor: theme.cardBackgroundColor,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    dropdownScrollableArea: {
      maxHeight: 250
    },
    dropdownItem: {
      padding: 12,
      backgroundColor: theme.cardBackgroundColor
    },
    dropdownItemText: {
      fontSize: 16,
    },
    profileImage: {
      width: 100,
      height: 100,
      objectFit: 'contain',
      alignSelf: 'center',
      borderRadius: 50,
      marginTop: 50,
    },

    inputContainer: { marginBottom: 20, position: 'relative', },
    inputLabel: {
      fontSize: 12,
      fontFamily: theme.fontRegular,
      color: theme.subtext,
      marginBottom: 4,
    },
    inputError: {},
    error: {},
    input: {
      width: '100%',
      borderWidth: 1, // Adjusted border width
      borderColor: theme.subtext,
      borderRadius: 10,
      paddingLeft: 10, // Space for Euro symbol
      fontSize: 16,
      textAlign: 'left',
      fontFamily: theme.fontBold,
      color: theme.text,
      marginTop: 8,
      backgroundColor: theme.inputBackground, // Adjusted input background color
    },
    section: {
      marginBottom: 20,
      borderRadius: 15,
      position: 'relative',
      marginHorizontal: 10,
      marginVertical: 10,
      padding: 15,
    },
    sectionTitle: {
      fontFamily: theme.fontSemiBold,
      fontSize: 24,
      marginBottom: 15,
    },
    sectionContainer: {
      flexDirection: 'column',
      alignItems: 'stretch'
    },
    sectionDivider: {
      width: '90%',
      borderBottomWidth: 1,
      alignSelf: 'center',
      borderColor: theme.subtext,
      marginTop: 30,
    },
    sectionTextItem: {
      paddingHorizontal: 4,
      paddingVertical: 14,
      borderBottomColor: theme.subtext,
      borderBottomWidth: 0.5,
      fontSize: 16,
      color: 'white'
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
    autocompleteContainer: {
      zIndex: 1, // Ensure it appears above other elements
      width: '100%',
    },
    button: {
      flexDirection: 'row',
      backgroundColor: theme.primary,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 20,
      marginTop: 40,
      marginHorizontal: 40,
      alignItems: 'center',
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonText: { flex: 1, color: '#fff', fontFamily: theme.fontSemiBold, fontSize: 24, textAlign: 'center' },

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

const defaultImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QBWRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAAAAAEsAAAAAQAAASwAAAAB/+0ALFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAPHAFaAAMbJUccAQAAAgAEAP/hDW5odHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nIHg6eG1wdGs9J0ltYWdlOjpFeGlmVG9vbCAxMS44OCc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczp0aWZmPSdodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyc+CiAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICA8dGlmZjpYUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpYUmVzb2x1dGlvbj4KICA8dGlmZjpZUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpZUmVzb2x1dGlvbj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJz4KICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIFN0b2NrIFBsYXRmb3JtPC94bXA6Q3JlYXRvclRvb2w+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnhtcE1NPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vJz4KICA8eG1wTU06RG9jdW1lbnRJRD54bXAuaWlkOmQ1NmE3NDMzLWFiYjctNDIyZC1iZjVhLTI4ZjQzNTVhMjU5NDwveG1wTU06RG9jdW1lbnRJRD4KICA8eG1wTU06SW5zdGFuY2VJRD5hZG9iZTpkb2NpZDpzdG9jazpjNTdhMmFjYy02ZTRkLTQwODEtYjIwNi1iYjU0MWE0ZGZlZWQ8L3htcE1NOkluc3RhbmNlSUQ+CiAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpzdG9jazo1ODk5MzI3ODI8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KIDwvcmRmOkRlc2NyaXB0aW9uPgo8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSd3Jz8+/9sAQwAF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"
