import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  ToastAndroid,
  Vibration,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { useRouter } from 'expo-router';
import { Link } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { useAppTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaymentSheet from '@/components/payment-link-sheet'; // Separate component for the sheet
import apiClient from '@/lib/httpClient';

export default function CreatePaymentLinkScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [showSheet, setShowSheet] = useState(false);

  const isValid = () => /^\d+(\.\d{1,2})?$/.test(amount) && parseFloat(amount) > 0;

  const handleCreateLink = async () => {
    if (!isValid()) return setError('Inserisci un importo valido');
    Keyboard.dismiss(); // Dismiss keyboard on submit
    setLoading(true);
    Vibration.vibrate(50);
    try {
      const { data } = await apiClient.post('/payment/create', { price: parseFloat(amount), note: note });
      setPaymentLink(data.paymentLink.url);
      setQrCode(data.qrCode);
      setShowSheet(true);
    } catch {
      setError('Errore, riprova');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(paymentLink);
    Vibration.vibrate(30);
    ToastAndroid.show('Link copiato!', ToastAndroid.SHORT);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Text style={styles.title}>Genera un Link di Pagamento</Text>

          {/* Input for Amount */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Importo</Text>
            <TextInput
              value={amount}
              onChangeText={(t) => { setAmount(t.replace(',', '.')); setError(''); }}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={theme.subtext}
              style={[
                styles.input, 
                error ? styles.inputError : isValid() ? styles.inputValid : null
              ]}
            />
            {/* Euro Symbol */}
            <Text style={styles.euroSymbol}>€</Text>
          </View>
        
           {/* Input for Note */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Note</Text>
            <TextInput
              value={note}
              onChangeText={(t) => { setNote(t); setError(''); }}
              placeholderTextColor={theme.subtext}
              placeholder="Note..."
              multiline={true}
              numberOfLines={4}
              style={[
                styles.multiLineInput, 
              ]}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Generate Link Button */}
          <Pressable onPress={handleCreateLink} disabled={loading} style={styles.button}>
            {loading ? <ActivityIndicator color="#fff" /> : <>
              <Link size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Genera Link</Text>
            </>}
          </Pressable>
        </View>
      </TouchableWithoutFeedback>

      {/* Display Payment Sheet when showSheet is true */}
      {showSheet && <PaymentSheet
        paymentLink={paymentLink}
        qrCode={qrCode}
        amount={amount}
        onCopy={handleCopy}
        onClose={() => setShowSheet(false)}
        theme={theme}
        router={router}
      />}
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background }, // Set background color to theme's background
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 30, fontFamily: theme.fontBold, marginBottom: 24, color: theme.text, textAlign: 'center' },
  inputContainer: { width: '60%', marginBottom: 20, position: 'relative' },
  inputLabel: {
    fontSize: 16,
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
    fontSize: 32,
    textAlign: 'left',
    fontFamily: theme.fontBold,
    color: theme.text,
    marginTop: 8,
    backgroundColor: theme.inputBackground, // Adjusted input background color
  },
  multiLineInput:{
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
});
