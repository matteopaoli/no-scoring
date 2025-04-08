import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Building2, TrendingUp, Plus } from 'lucide-react-native';

// Mock data for Style Hub store
const MOCK_STORE = {
  id: '1',
  name: 'Style Hub',
  email: 'negozio@demo.com',
  avatar_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
  store_type: 'Abbigliamento',
  total_transactions: 25000.00,
  monthly_transactions: 4500.00,
  transaction_count: 45,
};

const MOCK_TRANSACTIONS = [
  {
    id: '1',
    customer_name: 'Sofia Bianchi',
    amount: 450.00,
    date: '2025-03-14T10:30:00Z',
    status: 'completed',
    payment_method: 'PayTomorrow',
  },
  {
    id: '2',
    customer_name: 'Marco Verdi',
    amount: 780.00,
    date: '2025-03-13T15:45:00Z',
    status: 'completed',
    payment_method: 'PayTomorrow',
  },
  {
    id: '3',
    customer_name: 'Laura Rossi',
    amount: 320.00,
    date: '2025-03-12T09:15:00Z',
    status: 'completed',
    payment_method: 'PayTomorrow',
  },
];

export default function StoreProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/')}>
          <ArrowLeft size={24} color="#007BFF" />
        </TouchableOpacity>
        
        <View style={styles.storeInfo}>
          <Image
            source={{ uri: MOCK_STORE.avatar_url }}
            style={styles.storeImage}
          />
          <View>
            <Text style={styles.storeName}>{MOCK_STORE.name}</Text>
            <Text style={styles.storeEmail}>{MOCK_STORE.email}</Text>
            <Text style={styles.storeType}>{MOCK_STORE.store_type}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <CreditCard size={24} color="#007BFF" />
          <Text style={styles.statAmount}>€{MOCK_STORE.monthly_transactions.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Incasso Mensile</Text>
        </View>
        <View style={styles.statCard}>
          <Building2 size={24} color="#007BFF" />
          <Text style={styles.statAmount}>{MOCK_STORE.transaction_count}</Text>
          <Text style={styles.statLabel}>Transazioni</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={24} color="#007BFF" />
          <Text style={styles.statAmount}>€{MOCK_STORE.total_transactions.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Totale Incassi</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.newPaymentButton}>
        <Plus size={24} color="#FFFFFF" />
        <Text style={styles.newPaymentButtonText}>Nuovo Pagamento</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ultime Transazioni</Text>
        {MOCK_TRANSACTIONS.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionInfo}>
              <Text style={styles.customerName}>{transaction.customer_name}</Text>
              <Text style={styles.transactionAmount}>€{transaction.amount.toFixed(2)}</Text>
              <Text style={styles.paymentMethod}>{transaction.payment_method}</Text>
            </View>
            <View style={styles.transactionMeta}>
              <Text style={styles.transactionStatus}>
                {transaction.status === 'completed' ? '✓ Completato' : '⋯ In corso'}
              </Text>
              <Text style={styles.transactionDate}>
                {new Date(transaction.date).toLocaleDateString()}
              </Text>
            </View>
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
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  storeName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333',
  },
  storeEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
  },
  storeType: {
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
  newPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newPaymentButtonText: {
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
  transactionCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  transactionAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#28A745',
  },
  paymentMethod: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#007BFF',
    marginTop: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  transactionStatus: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#28A745',
  },
  transactionDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
});