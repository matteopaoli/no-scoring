import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Euro } from 'lucide-react-native';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { useState } from 'react';
import apiClient from '@/lib/httpClient';
import { Theme } from '@/contexts/ThemeContext';

type PaymentModalProps = {
    store: {
        stripeUserId: string,
        [key: string]: string
    },
    theme: Theme,
    onClose: () => void,
    onPaymentSuccess: () => void,
}

const PaymentModal = ({ store, theme, onClose, onPaymentSuccess }: PaymentModalProps) => {
  const [amount, setAmount] = useState('');
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handlePayment = async () => {
    const response = await apiClient.post('/payment/create-payment-intent', {
        price: parseFloat(amount),
        storeId: store.id,
    })

    const { paymentIntent, ephemeralKey, customer } = response.data

    // 2. Initialize the payment sheet
    const { error } = await initPaymentSheet({
      merchantDisplayName: store.name,
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      returnURL: `paytomorrow://store/${store.id}`
    });

    if (!error) {
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert('Errore', 'Il pagamento non è andato a buon fine. Riprova.')
      } else {
        onPaymentSuccess();
      }
    }
  };

  return (
    <StripeProvider
      stripeAccountId={store.stripeUserId}
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
    > 
      <Modal transparent visible={true} animationType="slide">
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.background + 'cc' },
          ]}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackgroundColor }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Paga {store.name}
            </Text>

            <View style={styles.amountInputContainer}>
              <Euro
                size={24}
                color={theme.primary}
                style={styles.currencyIcon}
              />
              <TextInput
                style={[
                  styles.amountInput,
                  { color: theme.text, borderColor: theme.primary },
                ]}
                placeholder="0.00"
                placeholderTextColor={theme.subtext}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  { borderColor: theme.primary },
                ]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, { color: theme.primary }]}>
                  Annulla
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.payButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={handlePayment}
                disabled={!amount || isNaN(parseFloat(amount))}
              >
                <Text style={styles.buttonText}>Paga ora</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  currencyIcon: {
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 24,
    borderBottomWidth: 2,
    paddingVertical: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  payButton: {},
  buttonText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
});

export default PaymentModal;
