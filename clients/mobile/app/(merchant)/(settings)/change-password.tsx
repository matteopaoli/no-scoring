import { useAppTheme } from "@/contexts/ThemeContext";
import apiClient from "@/lib/httpClient";
import { PaymentSheet } from "@stripe/stripe-react-native";
import { router, useRouter } from "expo-router";
import { HelpCircle, Link } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Keyboard, StyleSheet, Pressable, Switch, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Text, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePasswordForm() {

  const router = useRouter();
  const theme = useAppTheme();
  const styles = createStyles(theme);


  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")

  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');

  const [loading, setLoading] = useState(false)

  const validate = (): boolean => {
    if (newPassword !== confirmNewPassword) {
      setNewPasswordError("Le password non combaciano")
      setConfirmNewPasswordError("Le password non combaciano")
      return false;
    }

    //If there are no validation problem this are set to ""
    const newPasswordValidation = validateaPassword(newPassword)
    const confirmNewPasswordValidation = validateaPassword(confirmNewPassword)

    setNewPasswordError(newPasswordValidation)
    setConfirmNewPasswordError(confirmNewPasswordValidation)

    if (newPasswordValidation !== "" || confirmNewPasswordValidation !== "")
      return false;


    return true;
  }

  const validateaPassword = (password: string): string => {
    console.log("Testing password :"+password)
    switch (true) {
      case password.length < 8:
        return "La password deve essere di alemno 8 caratteri"
      case !/[a-z]/.test(password):
        return "La password deve contere almeno una lettera minuscola"
      case !/[A-Z]/.test(password):
        return "La password deve contere almeno una lettera maiuscola"
      case !/[0-9]/.test(password):
        return "La password deve contere almeno un numero"
      case !/[!@#$%^&*(),.?":{}|<>]/.test(password):
        return "La password deve contere almeno un carattere speciale"
      default:
        return ""
    }
  }

  const handleUpdateUser = async () => {
    if (!validate())
      return;
    try {
      const { data } = await apiClient.post('/users/update', { password: newPassword });
      if(data.message == "User updated successfully"){
        router.back();
      }else{
        setConfirmNewPasswordError(data.message)
      }

    } catch {
      setConfirmNewPasswordError("Errore riprova");
    } finally {
      setLoading(false);
    }

  }

  return <SafeAreaView style={styles.safe}>
    <ScrollView>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Text style={styles.title}>Modifica Password</Text>

          {/* Input for New password */}
          <View style={[styles.inputContainer,{marginTop:'40%', marginBottom:40}]}>
            <Text style={styles.inputLabel}>Nuova password</Text>
            <TextInput
              value={newPassword}
              onChangeText={(t) => { setNewPassword(t) }}
              placeholder="Password123!"
              placeholderTextColor={theme.subtext}
              style={[
                styles.input,
                newPasswordError ? styles.inputError : null
              ]}
            />
            {newPasswordError ? <Text style={styles.error}>{newPasswordError}</Text> : null}

          </View>

          {/* Input for Confirm new password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confemra password</Text>
            <TextInput
              value={confirmNewPassword}
              onChangeText={(t) => { setConfirmNewPassword(t) }}
              placeholder="Password123!"
              placeholderTextColor={theme.subtext}
              style={[
                styles.input,
                confirmNewPasswordError ? styles.inputError : null
              ]}
            />
            {confirmNewPasswordError ? <Text style={styles.error}>{confirmNewPasswordError}</Text> : null}
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
    </ScrollView>
  </SafeAreaView >

}


const createStyles = (theme) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background }, // Set background color to theme's background
  container: { flex: 1, alignItems: 'center', padding: 20 },
  title: { fontSize: 30, fontFamily: theme.fontBold, marginVertical: 24, color: theme.text, textAlign: 'center', },
  inputContainer: { width: '90%', marginBottom: 40, position: 'relative', },
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
    marginTop: 24,
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
  }
});
