import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, DollarSign, LogOut } from 'lucide-react-native'; // Import LogOut icon
import { useAuth } from '@/contexts/AuthContext';
// import AuthScreen from '@/app/(tabs)/auth';
// import OnboardingScreen from '../profile-setup';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data
const MOCK_PROFILE = {
  id: '1',
  email: 'cliente@demo.com',
  full_name: 'Marco Rossi',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  total_purchases: 2850.00,
  loyalty_points: 285,
};

const MOCK_TRANSACTIONS = [
  {
    id: '1',
    amount: 850.00,
    store_name: 'Style Hub',
    store_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    date: '2025-03-14T10:30:00Z',
    status: 'completed',
  },
  {
    id: '2',
    amount: 1200.00,
    store_name: 'Time Elegance',
    store_image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49',
    date: '2025-03-13T15:45:00Z',
    status: 'completed',
  },
  {
    id: '3',
    amount: 800.00,
    store_name: 'Fast Repair',
    store_image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3',
    date: '2025-03-12T09:15:00Z',
    status: 'completed',
  },
];

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();

  // if (!isAuthenticated) {
  //   return <AuthScreen />;
  // }


  // if (!user?.onboardingCompleted) {
  //   return <OnboardingScreen />
  // }

  const handleSignOut = async () => {
    await logout();  // Call the logout function from context
    router.push('/'); // Redirect to the home or login screen after logout
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
            source={{ uri: MOCK_PROFILE.avatar_url }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>{MOCK_PROFILE.full_name}</Text>
            <Text style={styles.userEmail}>{MOCK_PROFILE.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <CreditCard size={24} color="#007BFF" />
          <Text style={styles.statAmount}>€{MOCK_PROFILE.total_purchases.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Totale Acquisti</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.reportButton}>
        <DollarSign size={24} color="#FFFFFF" />
        <Text style={styles.reportButtonText}>Presenta un negozio e guadagna con PayTomorrow</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>I tuoi acquisti</Text>
        {MOCK_TRANSACTIONS.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <Image
              source={{ uri: transaction.store_image }}
              style={styles.storeImage}
            />
            <View style={styles.transactionInfo}>
              <Text style={styles.storeName}>{transaction.store_name}</Text>
              <Text style={styles.transactionAmount}>€{transaction.amount.toFixed(2)}</Text>
              <Text style={styles.transactionStatus}>
                {transaction.status === 'completed' ? '✓ Completato' : '⋯ In corso'}
              </Text>
            </View>
            <Text style={styles.transactionDate}>
              {new Date(transaction.date).toLocaleDateString()}
            </Text>
          </View>
        ))}
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
  reportButton: {
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
  reportButtonText: {
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
  transactionStatus: {
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
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4D4D',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
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
