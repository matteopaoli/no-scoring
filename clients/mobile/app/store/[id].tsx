import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { ArrowLeft, Euro, CreditCard } from 'lucide-react-native';
import PaymentModal from '@/components/PaymentModal';
import { StripeProvider } from '@stripe/stripe-react-native';

const StoreDetailPage = () => {
  const { id } = useLocalSearchParams();
  const theme = useAppTheme();
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mock store data - in a real app you'd fetch this based on the ID
  const store = {
    id: '3cd2c097-4794-4c1c-aee1-c56954c985fb',
    stripeUserId: 'acct_1QKex6PC49cZVUwv',
    name: 'Lusso Gioielli',
    category: 'Gioiellerie',
    rating: 4.8,
    image_url: 'https://via.placeholder.com/400x300',
    description:
      'Gioielli artigianali di alta qualità realizzati a mano in Italia.',
    address: 'Via Roma 123, Milano',
    phone: '+39 02 1234567',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {store.name}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <ScrollView>
        <Image source={{ uri: store.image_url }} style={styles.storeImage} />

        <View style={[styles.infoContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.storeName, { color: theme.text }]}>
            {store.name}
          </Text>
          <Text style={[styles.storeCategory, { color: theme.primary }]}>
            {store.category}
          </Text>

          <View style={styles.ratingContainer}>
            <Text style={[styles.ratingText, { color: theme.text }]}>
              ★ {store.rating}
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Descrizione
          </Text>
          <Text style={[styles.description, { color: theme.text }]}>
            {store.description}
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Informazioni
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.subtext }]}>
              Indirizzo:
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {store.address}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.subtext }]}>
              Telefono:
            </Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {store.phone}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[styles.payButtonContainer, { backgroundColor: theme.card }]}
      >
        <TouchableOpacity
          style={[styles.payButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowPaymentModal(true)}
        >
          <CreditCard size={20} color="#FFF" style={styles.payButtonIcon} />
          <Text style={styles.payButtonText}>Paga questo negozio</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          store={store}
          theme={theme}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={() => {
            setShowPaymentModal(false);
            router.push('/payment/success');
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 18,
  },
  storeImage: {
    width: '100%',
    height: 250,
  },
  infoContainer: {
    padding: 20,
    marginBottom: 80, // Space for pay button
  },
  storeName: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  storeCategory: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
    marginLeft: 4,
  },
  sectionTitle: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
    width: 80,
  },
  infoValue: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    flex: 1,
  },
  payButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  payButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  payButtonIcon: {
    marginRight: 8,
  },
  payButtonText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
});

export default StoreDetailPage;
