import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Filter, Search, DollarSign } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const MOCK_SALES = [
  {
    id: '1',
    customer: 'Marco Rossi',
    amount: 125.50,
    date: '2023-06-15T14:30:00Z',
    items: 3,
    status: 'completed'
  },
  {
    id: '2',
    customer: 'Laura Bianchi',
    amount: 85.00,
    date: '2023-06-15T11:15:00Z',
    items: 2,
    status: 'completed'
  },
  {
    id: '3',
    customer: 'Giovanni Verdi',
    amount: 42.90,
    date: '2023-06-14T16:45:00Z',
    items: 1,
    status: 'refunded'
  },
  {
    id: '4',
    customer: 'Francesca Neri',
    amount: 210.75,
    date: '2023-06-14T10:20:00Z',
    items: 5,
    status: 'completed'
  },
  {
    id: '5',
    customer: 'Alessio Romano',
    amount: 63.20,
    date: '2023-06-13T18:10:00Z',
    items: 2,
    status: 'pending'
  },
];

export default function SalesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#007BFF" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Vendite</Text>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={20} color="#007BFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Filter size={20} color="#007BFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statAmount}>€1,245.35</Text>
          <Text style={styles.statLabel}>Vendite Oggi</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statAmount}>€5,842.90</Text>
          <Text style={styles.statLabel}>Questa Settimana</Text>
        </View>
      </View>

      <ScrollView style={styles.salesList}>
        {MOCK_SALES.map((sale) => (
          <TouchableOpacity 
            key={sale.id} 
            style={styles.saleCard}
            onPress={() => router.push(`./(merchant)/sale-details/${sale.id}`)}
          >
            <View style={styles.saleInfo}>
              <Text style={styles.customerName}>{sale.customer}</Text>
              <Text style={styles.saleDate}>
                {new Date(sale.date).toLocaleDateString('it-IT', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
            
            <View style={styles.saleAmountContainer}>
              <DollarSign size={16} color="#28A745" />
              <Text style={[
                styles.saleAmount,
                sale.status === 'refunded' && styles.refundedAmount,
                sale.status === 'pending' && styles.pendingAmount
              ]}>
                {sale.amount.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD580',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
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
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
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
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
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
    marginBottom: 5,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  salesList: {
    paddingHorizontal: 20,
  },
  saleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  saleInfo: {
    flex: 1,
  },
  customerName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  saleDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  saleAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saleAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#28A745',
    marginLeft: 5,
  },
  refundedAmount: {
    color: '#FF4D4D',
  },
  pendingAmount: {
    color: '#FFA500',
  },
});