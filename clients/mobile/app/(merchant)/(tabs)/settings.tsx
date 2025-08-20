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
import { useCallback, useRef, useState } from 'react';
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
  Camera,
  GalleryHorizontal,
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
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { openPlatformPaySetup } from '@stripe/stripe-react-native';
import React from 'react';
import { defaultProfilePicture, pickPhoto, takePhoto } from '@/lib/photoUtils';
import useBusinessTypes from '@/hooks/useBusinessTypes';

export default function MerchantSettingsScreen() {
  //TODO
  // [X] Collegare selezione immagine di profilo (settings/change-user-data)
  // [ ] Collegare form in change-user-data ai dati dell'utente e 
  //     eseguire le chiamate user/update e store/update (per business type id) dopo validazione input 
  // [ ] Modificare campo Business Type Id in un dropdown con la lista presa da chiamata ???
  // [X] Collegare pagina cambio password con servizi
  // [ ] Aggiungere dropdown tema in settings (App)
  // [X] Aggiungere checkbox commissioni in settings (Store) 
  // [X] Rimuovere numero di telefono nel header 
  // [ ] Sistemare stile Dropdown di google
  // [ ] Sistemare Bug Liste Dropdown
  // [ ] Collegare risultato  Dropdown di google
  // [ ] Pulizia codicew

  const { user } = useAuth()
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

  const [storeImage, setStoreImage] = useState(store?.image != "" ? store?.image : defaultProfilePicture)
  const [storeCustomerFees, setStroeCustomerFees] = useState(store?.customerPaysFees ?? false)
  const [storePlaceId, setStorePlaceId] = useState("")
  const [storeLocationLat, setStoreLocationLat] = useState(-1)
  const [storeLocationLng, setStoreLocationLng] = useState(-1)

  const [businessType, setBusinessType] = useState<number | null>(null)
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  const [themeMenuVisible, setThemeMenuVisible] = useState(false);

  const {
    data: businessTypes,
  } = useBusinessTypes();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleLocationSelect = useCallback((data: GooglePlaceData, details: GooglePlaceDetail | null = null) => {
    if (details) {
      setStorePlaceId(details.place_id)
      setStoreLocationLat(details.geometry.location.lat)
      setStoreLocationLng(details.geometry.location.lng)
    }
  }, [setStorePlaceId, setStoreLocationLat, setStoreLocationLng, storePlaceId, storeLocationLat, storeLocationLng])

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

  const handleProfilePhoto =
    async (action: 'take' | 'pick') => {
      bottomSheetRef.current?.close()
      let photo;
      if (action === 'take') {
        photo = await takePhoto();
      } else if (action === 'pick') {
        photo = await pickPhoto();
      }
      if (typeof (photo?.uri) == 'string') {
        setStoreImage(photo?.uri as string)
      }
    };

  const handleSaveStoreData = async () => {
    Keyboard.dismiss(); // Dismiss keyboard on submit
    setLoading(true);
    Vibration.vibrate(50);
    try {

      if (isCustomerFeesModified) {
        updateFees(storeCustomerFees)
      }

      if (isStoreDataModified) {

        const { data } = await apiClient.post('/store/update', {
          name: storeName, description: storeDescription, image: storeImage, businessTypeId: businessType,
          locationLat: storeLocationLat,
          locationLng: storeLocationLng,
          placeId: storePlaceId,
        });
        if (data.message == "Store updated successfully") {
          Toast.success('Impostazione aggiornata con successo!', "bottom");
        }
        else {
          setStoreNameError(data.error);
        }
      }
    } catch {
      setStoreNameError("Errore riprova");
    } finally {
      setLoading(false);
    }
  }

  const isStoreDataModified = store?.name != storeName || store?.description != storeDescription || (store?.image != storeImage && storeImage != defaultProfilePicture) || (storeLocationLat != 0 && storeLocationLng != 0 && storePlaceId != "")
  const isCustomerFeesModified = store?.customerPaysFees != storeCustomerFees
  const isDataModified = isStoreDataModified || isCustomerFeesModified


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <SettingsHeadaer
        firstName={user.firstName}
        lastName={user.lastName}
        image={user.image != "" && user.image ? user.image: defaultProfilePicture}
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
        keyboardShouldPersistTaps='always'
      >
        <SettingsSection
          title="Negozio"
          theme={theme}
        >
          <View style={styles.sectionContainer}>

            <TouchableOpacity onPress={() => bottomSheetRef.current?.expand()}>
              <Image
                style={[styles.profileImage]}
                source={{ uri: storeImage }}
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


            <View style={styles.autocompleteWrapper}>
              <Text style={styles.inputLabel}>Location</Text>
              <GooglePlacesAutocomplete
                placeholder="Cerca..."
                enablePoweredByContainer={false}
                minLength={2}
                listUnderlayColor={theme.primary}
                fetchDetails={true}
                listViewDisplayed={false}
                textInputProps={{
                  InputComp: TextInput,
                  activeUnderlineColor: theme.primary,
                  style: styles.input,
                  cursorColor: theme.primary,
                  selectionColor: theme.primary,
                  underlineColorAndroid: theme.primary,
                }}
                styles={{
                  poweredContainer: {
                    color: theme.primary,
                  },
                  textInput: styles.textInput,
                  container: styles.autocompleteContainer,
                  listView: styles.listView,
                  row: styles.autocompleteRow,
                  description: styles.description,
                  predefinedPlacesDescription: styles.predefinedPlacesDescription,
                }}
                onPress={handleLocationSelect}
                onFail={() => console.log(error)}
                query={{
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                  language: 'it',
                  components: 'country:it',
                }}
              />
            </View>

            {/* Tipo di attività */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tipo di attività</Text>
              <Menu
                visible={typeMenuVisible}
                onDismiss={() => setTypeMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setTypeMenuVisible(true)}
                    style={styles.typeDropdownButton}
                    labelStyle={styles.typeDropdownButtonLabel}
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
            <SettingsItem
              icon={<Euro size={20} color={theme.subtext} />}
              label="Commissioni a carico del cliente"
              theme={theme}
              noBorder={true}
              rightElement={
                <>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        'Commissioni a carico del cliente',
                        "Questa impostazione si applica esclusivamente all'app mobile PayTomorrow. Quando crei un link di pagamento sul sito web o tramite POS, ti verrà sempre chiesto di scegliere se le commissioni sono a tuo carico o del cliente.",
                      )
                    }
                  >
                    <HelpCircle
                      style={{ marginLeft: 10 }}
                      size={20}
                      color={theme.primary}
                    />
                  </TouchableOpacity>
                  <Switch
                    value={storeCustomerFees}
                    onValueChange={(value) => setStroeCustomerFees(value)}
                    disabled={isPending}
                    trackColor={{ false: theme.secondary, true: theme.primary }}
                    thumbColor={
                      storeCustomerFees ? theme.primary : theme.background
                    }
                  />
                </>
              }
            />
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

            {/* Tipo di attività */}
            <Text style={styles.dropdownLabel}>Tema</Text>
            <Menu
              visible={themeMenuVisible}
              onDismiss={() => setThemeMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setThemeMenuVisible(true)}
                  style={styles.dropdownButton}
                  labelStyle={styles.dropdownButtonLabel}
                  contentStyle={{ justifyContent: 'flex-start' }}
                >
                  {themePreference ? themePreference == 'dark' ? "Scuro" : "Chiaro" : "Sistema"}
                </Button>
              }
              contentStyle={styles.menuContent}
            >
              <View style={styles.scrollableMenu}>
                <ScrollView>
                  <Menu.Item
                    key={0}
                    onPress={() => {
                      setThemePreference(null)
                      setThemeMenuVisible(false)
                    }}
                    title={"Sistema"}
                  />
                  <Menu.Item
                    key={1}
                    onPress={() => {
                      setThemePreference('light')
                      setThemeMenuVisible(false)

                    }}
                    title={"Chiaro"}
                  />
                  <Menu.Item
                    key={2}
                    onPress={() => {
                      setThemePreference('dark')
                      setThemeMenuVisible(false)

                    }}
                    title={"Scuro"}
                  />
                </ScrollView>
              </View>
            </Menu>
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
      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        backgroundStyle={{
          backgroundColor: theme.cardBackgroundColor
        }}
      >
        <BottomSheetView
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <TouchableOpacity onPress={() => handleProfilePhoto('take')} style={[styles.sectionTextItem, { flexDirection: 'row', alignItems: 'center' }]}>
            <Text style={{ color: theme.subtext, fontSize: 20, flex: 1, paddingVertical: 10 }}>
              Fotocamera
            </Text>
            <Camera
              size={36}
              color={theme.subtext}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleProfilePhoto('pick')} style={[styles.sectionTextItem, { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0 }]}>
            <Text style={{ color: theme.subtext, fontSize: 20, flex: 1, paddingVertical: 10, marginBottom: 20 }}>
              Galleria
            </Text>
            <GalleryHorizontal
              size={36}
              color={theme.subtext}
            />
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
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
      objectFit: 'cover',
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

    dropdownContainer: {
      marginBottom: 20,
    },

    dropdownLabel: {
      fontFamily: theme.fontRegular,
      marginBottom: 8,
      marginTop: 12,
      color: theme.subtext,
      fontSize: 16

    },

    dropdownButton: {
      backgroundColor: theme.background,
      borderRadius: 10,
      justifyContent: 'center',
      marginBottom: 8,
      color: theme.subtext,
      fontSize: 16
    },

    dropdownButtonLabel: {
      fontFamily: theme.fontRegular,
      fontSize: 16,
      textAlign: 'left',
      color: theme.subtext,
    },
    menuContent: {
      borderRadius: 10,
      paddingVertical: 0,
    },

    scrollableMenu: {
      maxHeight: 250,
    },
    profileImage: {
      width: 100,
      height: 100,
      objectFit: 'cover',
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
      backgroundColor: theme.background, // Adjusted input background color
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
    autocompleteWrapper: {
      zIndex: 1, // Ensure it appears above other elements
      width: '100%',
      marginBottom: 18
    },
    autocompleteContainer: {
      flex: 0,
      zIndex: 1, // ensure it's above other content
    },
    autocompleteRow: {
      backgroundColor: theme.cardBackgroundColor,
      borderWidth: 0,
    },
    textInput: {
      height: 50,
      borderRadius: 8,
      paddingHorizontal: 16,
      borderColor: 'red',
      borderWidth: 1,
      fontSize: 16,
      backgroundColor: '#f0f0f0',
    },
    listView: {
      backgroundColor: theme.cardBackgroundColor,
    },
    description: {
      fontWeight: 'bold',
      color: theme.subtext
    },
    predefinedPlacesDescription: {
      color: '#1faadb',
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

    typeDropdownContainer: {
      marginBottom: 20,
    },

    typeDropdownLabel: {
      fontFamily: theme.fontRegular,
      fontSize: 15,
      marginBottom: 6,
      color: theme.subtext,
    },

    typeDropdownButton: {
      backgroundColor: theme.background,
      borderRadius: 10,
      justifyContent: 'center',
      marginBottom: 15,
      marginTop: 8,
      paddingLeft: 13, // Space for Euro symbol
      paddingVertical: 6,
    },

    typeDropdownButtonLabel: {
      fontFamily: theme.fontRegular,
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'left',
      color: theme.subtext,
    },
  });