import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Link, Share2, Check } from 'lucide-react-native';
import apiClient from '@/lib/httpClient';

export default function CreatePaymentLinkScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [paymentLink, setPaymentLink] = useState(
    'https://paytomorrow.com/pay/merchant123',
  );

  const handleCreatePaymentLink = async () => {
    if (!amount) return;

    try {
      const response = await apiClient.post('/payment/create', {
        price: parseFloat(amount),
      });

      const { data } = response;
      setPaymentLink(data.paymentLink.url);
      setQrCode(data.qrCode);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error creating payment link:', error);
    }
  };

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `Pay €${amount} to my store: ${paymentLink}`,
        title: 'Payment Link',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#007BFF" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Crea un Link di Pagamento</Text>

        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>€</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            autoFocus
          />
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, !amount && styles.disabledButton]}
          onPress={handleCreatePaymentLink}
          disabled={!amount}
        >
          <Text style={styles.confirmButtonText}>Genera Link di Pagamento</Text>
          <Link size={20} color="#FFFFFF" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successHeader}>
              <View style={styles.successIcon}>
                <Check size={32} color="#28A745" />
              </View>
              <Text style={styles.successTitle}>Link Creato!</Text>
            </View>

            <Text style={styles.amountText}>€{amount}</Text>

            <Image
              source={{ uri: qrCode }}
              style={styles.qrCode}
              resizeMode="contain"
            />

            <Text
              style={styles.linkText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {paymentLink}
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.visitButton}
                onPress={() => {
                  // In a real app, you might open the link in a browser
                  setIsModalVisible(false);
                  //   router.push('/merchant/payment-link-details');
                }}
              >
                <Text style={styles.visitButtonText}>Visualizza Link</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShareLink}
              >
                <Share2 size={20} color="#007BFF" />
                <Text style={styles.shareButtonText}>Condividi</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD580',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  currencySymbol: {
    fontFamily: 'Poppins-Bold',
    fontSize: 48,
    color: '#333',
    marginRight: 10,
  },
  amountInput: {
    fontFamily: 'Poppins-Bold',
    fontSize: 48,
    color: '#333',
    minWidth: 200,
    borderBottomWidth: 2,
    borderBottomColor: '#007BFF',
    paddingBottom: 5,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    backgroundColor: '#E8F5E9',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  successTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#28A745',
  },
  amountText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#333',
    marginBottom: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  linkText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
    maxWidth: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  visitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  visitButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
  },
  shareButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 8,
  },
  closeButton: {
    width: '100%',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#666',
  },
});
