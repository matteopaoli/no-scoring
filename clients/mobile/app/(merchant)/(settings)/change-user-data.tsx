import { useAppTheme } from "@/contexts/ThemeContext";
import useBusinessTypes from "@/hooks/useBusinessTypes";
import apiClient from "@/lib/httpClient";
import { pickPhoto, takePhoto } from "@/lib/photoUtils";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { PaymentSheet } from "@stripe/stripe-react-native";
import { router, useRouter } from "expo-router";
import { Bold, Camera, GalleryHorizontal, HelpCircle, Link } from "lucide-react-native";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Keyboard, StyleSheet, Pressable, Switch, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Text, Image, ScrollView } from "react-native";
import { Button, Menu } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangeUserDataForm() {

  const router = useRouter();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const {
    data: businessTypes,
    isLoading: isBusinessTypesLoading,
    isError: isBusinessTypesError,
  } = useBusinessTypes();

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [profileImage, setProfileImage] = useState("")
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const [businessType, setBusinessType] = useState<number | null>(null)
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false)

  const bottomSheetRef = useRef<BottomSheet>(null);


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
        setProfileImage(photo?.uri as string)
      }
    };


  const handleUpdateUser = async () => {
    try {
      const { data } = await apiClient.post('/users/update', {
        firstName: firstName,
        lastName: lastName,
        image: profileImage
      });
      if (data.message == "User updated successfully") {
        router.back();
      }
    } catch {
      setFirstNameError("Errore riprova");
    } finally {
      setLoading(false);
    }
  }



  return <SafeAreaView style={styles.safe}>
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>Modifica Dati Utente</Text>

        <TouchableOpacity onPress={() => bottomSheetRef.current?.expand()}>
          <Image
            style={[styles.profileImage]}
            source={{ uri: profileImage }}
          >
          </Image>
        </TouchableOpacity>
        {/* Input for First Name */}
        <View style={[styles.inputContainer, { marginTop: 20 }]}>
          <Text style={styles.inputLabel}>Nome</Text>
          <TextInput
            value={firstName}
            onChangeText={(t) => { setFirstName(t) }}
            placeholder="Mario"
            placeholderTextColor={theme.subtext}
            style={[
              styles.input,
              firstNameError ? styles.inputError : null
            ]}
          />
          {firstNameError ? <Text style={styles.error}>{firstNameError}</Text> : null}
        </View>

        {/* Input for Last Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Cognome</Text>
          <TextInput
            value={lastName}
            onChangeText={(t) => { setLastName(t) }}
            placeholder="Rossi"
            placeholderTextColor={theme.subtext}
            style={[
              styles.input,
              lastNameError ? styles.inputError : null
            ]}
          />
          {lastNameError ? <Text style={styles.error}>{lastNameError}</Text> : null}

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
        {/* Generate Link Button */}
        <Pressable onPress={handleUpdateUser} disabled={loading} style={styles.button}>
          {loading ? <ActivityIndicator color="#fff" /> : <>
            <Link size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Salva</Text>
          </>}
        </Pressable>
      </View>

    </TouchableWithoutFeedback>
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
        <TouchableOpacity onPress={() => handleProfilePhoto('take')} style={[styles.bottomSheetItem, { flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={{ color: theme.subtext, fontSize: 20, flex: 1, paddingVertical: 10 }}>
            Fotocamera
          </Text>
          <Camera
            size={36}
            color={theme.subtext}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleProfilePhoto('pick')} style={[styles.bottomSheetItem, { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0 }]}>
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
  </SafeAreaView >

}


const createStyles = (theme) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background }, // Set background color to theme's background
  container: { flex: 1, alignItems: 'center', padding: 20 },
  title: { fontSize: 30, fontFamily: theme.fontBold, marginVertical: 24, color: theme.text, textAlign: 'center' },
  inputContainer: { width: '90%', marginBottom: 20, position: 'relative', },
  inputLabel: {
    fontSize: 14,
    fontFamily: theme.fontRegular,
    color: theme.subtext,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1, // Adjusted border width
    borderColor: theme.subtext,
    borderRadius: 10,
    paddingLeft: 40, // Space for Euro symbol
    paddingVertical: 12,
    fontSize: 18,
    textAlign: 'left',
    fontFamily: theme.fontBold,
    color: theme.text,
    marginTop: 8,
    backgroundColor: theme.inputBackground, // Adjusted input background color
  },
  multiLineInput: {
    width: '100%',
    borderWidth: 1, // Adjusted border width
    borderColor: theme.subtext,
    verticalAlign: 'top',
    borderRadius: 10,
    padding: 20,
    fontSize: 14,
    textAlign: 'left',
    fontFamily: theme.fontBold,
    color: theme.text,
    marginTop: 8,
    backgroundColor: theme.inputBackground, // Adjusted input background color
  },
  inputValid: { borderColor: 'green' },
  inputError: { borderColor: 'red' },
  euroSymbol: {
    position: 'absolute',
    left: 10,
    top: '50%',
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text, // Euro symbol color
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleIcon: {
    marginRight: 15,
  },
  toggleText: {
    fontFamily: theme.fontRegular,
    fontSize: 12,
    flex: 1,
  },
  error: { color: 'red', marginTop: 8 },
  button: {
    flexDirection: 'row',
    backgroundColor: theme.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 40,
    alignItems: 'center',
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: { color: '#fff', fontFamily: theme.fontSemiBold, fontSize: 18 },
  profileImage: {
    width: 100,
    height: 100,
    objectFit: 'contain',
    backgroundColor: "red",
    borderRadius: 50,
    marginTop: 50,
  },
  bottomSheetItem: {
    paddingHorizontal: 4,
    paddingVertical: 14,
    borderBottomColor: theme.subtext,
    borderBottomWidth: 0.5,
    fontSize: 16,
    color: 'white'
  },
  dropdownContainer: {
    marginBottom: 20,
  },

  dropdownLabel: {
    fontFamily: theme.fontRegular,
    fontSize: 15,
    marginBottom: 6,
    color: theme.subtext,
  },

  dropdownButton: {
    backgroundColor: theme.background,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 15,
    marginTop:8,
    paddingLeft: 13, // Space for Euro symbol
    paddingVertical: 6,
  },

  dropdownButtonLabel: {
    fontFamily: theme.fontRegular,
    fontSize: 15,
    fontWeight:'bold',
    textAlign: 'left',
    color: theme.subtext,
  },
  menuContent: {
    borderRadius: 10,
    paddingVertical: 0,
  },

  scrollableMenu: {
    maxHeight: 250,
  }
});
