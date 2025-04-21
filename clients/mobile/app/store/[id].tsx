import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react-native';
import PaymentModal from '@/components/PaymentModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import useStoreDetails from '@/hooks/useStoreDetails';
import { StatusBar } from 'expo-status-bar';

const mockStoreImage = 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892'


const StoreDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useAppTheme();
  const router = useRouter();
  const { data: store, isLoading, isError } = useStoreDetails(id)
  const [showPaymentModal, setShowPaymentModal] = useState(false);


  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (isError || !store) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>{error || 'Negozio non trovato.'}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: theme.primary, marginTop: 10 }}>Torna indietro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        style={theme.type === 'dark' ? 'light' : 'dark'}
        backgroundColor={theme.background}
      />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.cardBackgroundColor }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {store.name}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView>
          <Image source={{ uri: store.image || mockStoreImage }} style={styles.storeImage} />
          <View style={[styles.infoContainer, { backgroundColor: theme.cardBackgroundColor }]}>
            <Text style={[styles.storeName, { color: theme.text }]}>
              {store.name}
            </Text>
            <Text style={[styles.storeCategory, { color: theme.primary }]}>
              {store.category}
            </Text>

            {/* <View style={styles.ratingContainer}>
              <Text style={[styles.ratingText, { color: theme.text }]}>
                ★ {store.rating}
              </Text>
            </View> */}

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
            {/* <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.subtext }]}>
                Telefono:
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {store.phone}
              </Text>
            </View> */}
          </View>
        </ScrollView>

        <View
          style={[styles.payButtonContainer, { backgroundColor: theme.cardBackgroundColor }]}
        >
          <TouchableOpacity
            style={[styles.payButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowPaymentModal(true)}
          >
            <CreditCard size={20} color="#FFF" style={styles.payButtonIcon} />
            <Text style={styles.payButtonText}>Paga questo negozio</Text>
          </TouchableOpacity>
        </View>

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
    </SafeAreaView>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StoreDetailPage;
