import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, DollarSign, LogOut, Link, ShoppingBag, Users, Activity } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
// import AuthScreen from '@/app/(tabs)/auth';
// import OnboardingScreen from '../profile-setup';

// Mock data for merchant
const MOCK_MERCHANT = {
  id: '1',
  email: 'merchant@demo.com',
  business_name: 'Fashion Boutique',
  avatar_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
  address: '123 Main St, Milan, Italy',
  total_sales: 12500.00,
  total_transactions: 84,
  repeat_customers: 32,
};

const MOCK_RECENT_SALES = [
  {
    id: '1',
    amount: 250.00,
    customer_name: 'Marco Rossi',
    customer_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    date: '2025-03-15T14:30:00Z',
    status: 'completed',
  },
  {
    id: '2',
    amount: 120.00,
    customer_name: 'Laura Bianchi',
    customer_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    date: '2025-03-15T11:15:00Z',
    status: 'completed',
  },
  {
    id: '3',
    amount: 85.50,
    customer_name: 'Giovanni Verdi',
    customer_image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    date: '2025-03-14T16:45:00Z',
    status: 'completed',
  },
];

export default function MerchantProfileScreen() {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();

  // if (!isAuthenticated) {
  //   return <AuthScreen />;
  // }

  // if (!user?.onboardingCompleted) {
  //   return <OnboardingScreen />;
  // }

  const handleSignOut = async () => {
    await logout();
    router.push('/');
  };

  const handleCreatePaymentLink = () => {
    // Navigate to payment link creation screen
    router.push('./create-payment');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/')}>
          <ArrowLeft size={24} color="#007BFF" />
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          <Image
            source={{ uri: MOCK_MERCHANT.avatar_url }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>{MOCK_MERCHANT.business_name}</Text>
            <Text style={styles.userEmail}>{MOCK_MERCHANT.email}</Text>
            <Text style={styles.storeAddress}>{MOCK_MERCHANT.address}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <DollarSign size={24} color="#007BFF" />
          <Text style={styles.statAmount}>€{MOCK_MERCHANT.total_sales.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Vendite Totali</Text>
        </View>
        
        <View style={styles.statCard}>
          <ShoppingBag size={24} color="#007BFF" />
          <Text style={styles.statAmount}>{MOCK_MERCHANT.total_transactions}</Text>
          <Text style={styles.statLabel}>Transazioni</Text>
        </View>
        
        <View style={styles.statCard}>
          <Users size={24} color="#007BFF" />
          <Text style={styles.statAmount}>{MOCK_MERCHANT.repeat_customers}</Text>
          <Text style={styles.statLabel}>Clienti Fedeli</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.paymentLinkButton}
        onPress={handleCreatePaymentLink}>
        <Link size={24} color="#FFFFFF" />
        <Text style={styles.paymentLinkButtonText}>Crea Link di Pagamento</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vendite Recenti</Text>
        {MOCK_RECENT_SALES.map((sale) => (
          <View key={sale.id} style={styles.saleCard}>
            <Image
              source={{ uri: sale.customer_image }}
              style={styles.customerImage}
            />
            <View style={styles.saleInfo}>
              <Text style={styles.customerName}>{sale.customer_name}</Text>
              <Text style={styles.saleAmount}>€{sale.amount.toFixed(2)}</Text>
              <Text style={styles.saleStatus}>
                {sale.status === 'completed' ? '✓ Completato' : '⋯ In corso'}
              </Text>
            </View>
            <Text style={styles.saleDate}>
              {new Date(sale.date).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.analyticsSection}>
        <Text style={styles.sectionTitle}>Analisi</Text>
        <View style={styles.analyticsCard}>
          <Activity size={24} color="#007BFF" />
          <Text style={styles.analyticsText}>Vendite questa settimana: €1,850.00</Text>
          <Text style={styles.analyticsText}>Nuovi clienti: 5</Text>
          <Text style={styles.analyticsText}>Tasso di conversione: 42%</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}>
        <LogOut size={24} color="#FFFFFF" />
        <Text style={styles.signOutButtonText}>Esci</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD580',
  },
  header: {
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
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  userName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333',
  },
  userEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
  },
  storeAddress: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  paymentLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28A745',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentLinkButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 15,
  },
  saleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  customerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  saleInfo: {
    flex: 1,
  },
  customerName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
  },
  saleAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#28A745',
    marginTop: 4,
  },
  saleStatus: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  saleDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  analyticsSection: {
    padding: 20,
    paddingTop: 0,
  },
  analyticsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analyticsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
    marginTop: 8,
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
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signOutButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
});