import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Building2, CreditCard, TrendingUp, Store } from 'lucide-react-native';

// Mock data
const MOCK_PROFILE = {
  id: '1',
  email: 'partner@demo.com',
  full_name: 'Luigi Bianchi',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  company_name: 'FinTech Solutions',
  commission_rate: 2.5,
  total_transactions: 150000,
};

const MOCK_TRANSACTIONS = [
  {
    id: '1',
    amount: 1250.00,
    commission_amount: 31.25,
    created_at: '2025-03-14T10:30:00Z',
    store: {
      name: 'Style Hub',
      image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    },
  },
  {
    id: '2',
    amount: 890.50,
    commission_amount: 22.26,
    created_at: '2025-03-13T15:45:00Z',
    store: {
      name: 'Time Elegance',
      image_url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49',
    },
  },
  {
    id: '3',
    amount: 2100.75,
    commission_amount: 52.52,
    created_at: '2025-03-12T09:15:00Z',
    store: {
      name: 'Fast Repair',
      image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3',
    },
  },
];

const MOCK_MONTHLY_STATS = {
  totalTransactions: 45,
  totalCommissions: 1250.75,
};

export default function PartnerProfileScreen() {
  const router = useRouter();

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
            source={{ uri: MOCK_PROFILE.avatar_url }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>{MOCK_PROFILE.full_name}</Text>
            <Text style={styles.userEmail}>{MOCK_PROFILE.email}</Text>
            <Text style={styles.companyName}>{MOCK_PROFILE.company_name}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Store size={24} color="#007BFF" />
          <Text style={styles.statAmount}>{MOCK_TRANSACTIONS.length}</Text>
          <Text style={styles.statLabel}>Negozi Attivi</Text>
        </View>
        <View style={styles.statCard}>
          <CreditCard size={24} color="#007BFF" />
          <Text style={styles.statAmount}>{MOCK_MONTHLY_STATS.totalTransactions}</Text>
          <Text style={styles.statLabel}>Trans. Mensili</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={24} color="#007BFF" />
          <Text style={styles.statAmount}>€{MOCK_MONTHLY_STATS.totalCommissions.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Comm. Mensili</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ultime Transazioni</Text>
        {MOCK_TRANSACTIONS.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <Image
              source={{ uri: transaction.store.image_url }}
              style={styles.storeImage}
            />
            <View style={styles.transactionInfo}>
              <Text style={styles.storeName}>{transaction.store.name}</Text>
              <Text style={styles.transactionAmount}>€{transaction.amount.toFixed(2)}</Text>
              <Text style={styles.commissionAmount}>
                Commissione: €{transaction.commission_amount.toFixed(2)}
              </Text>
            </View>
            <Text style={styles.transactionDate}>
              {new Date(transaction.created_at).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
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
  companyName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#007BFF',
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
    fontSize: 16,
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 15,
  },
  transactionCard: {
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
  storeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  storeName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
  },
  transactionAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#28A745',
    marginTop: 4,
  },
  commissionAmount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
});