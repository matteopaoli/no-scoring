import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, DollarSign, LogOut, Link, ShoppingBag, Users, Activity } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Theme, useAppTheme } from '@/contexts/ThemeContext'; // Adjust the import path as needed
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/httpClient';

type MerchantStoreDetails = {
  id: string,
  name: string,
  image: string,
  address: string,
  totalRevenue: number,
  salesCount: number,
}

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
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { isPending, isError, data, error } = useQuery<MerchantStoreDetails>({
    queryKey: ['myStore'],
    queryFn: async () => (await apiClient.get('/store/me')).data
  })

  const handleSignOut = async () => {
    await logout();
    router.push('/');
  };

  const handleCreatePaymentLink = () => {
    router.push('./create-payment');
  };

  if (isPending) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ marginTop: 16, color: theme.text }}>Caricamento in corso...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: data?.image ?? 'https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>{data?.name}</Text>
              <Text style={styles.storeAddress}>{data?.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <DollarSign size={24} color={theme.primary} />
            <Text style={styles.statAmount}>€{data?.totalRevenue?.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Vendite Totali</Text>
          </View>
          
          <View style={styles.statCard}>
            <ShoppingBag size={24} color={theme.primary} />
            <Text style={styles.statAmount}>{data?.salesCount}</Text>
            <Text style={styles.statLabel}>Transazioni</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.paymentLinkButton}
          onPress={handleCreatePaymentLink}>
          <Link size={24} color={theme.card} />
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
            <Activity size={24} color={theme.primary} />
            <Text style={styles.analyticsText}>Vendite questa settimana: €1,850.00</Text>
            <Text style={styles.analyticsText}>Nuovi clienti: 5</Text>
            <Text style={styles.analyticsText}>Tasso di conversione: 42%</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}>
          <LogOut size={24} color={theme.card} />
          <Text style={styles.signOutButtonText}>Esci</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: 20,
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
    fontFamily: theme.fontBold,
    fontSize: theme.fontSizeHeading + 8,
    color: theme.text,
  },
  userEmail: {
    fontFamily: theme.fontRegular,
    fontSize: theme.fontSize,
    color: theme.subtext,
  },
  storeAddress: {
    fontFamily: theme.fontRegular,
    fontSize: theme.fontSize - 2,
    color: theme.subtext,
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
    backgroundColor: theme.card,
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
    fontFamily: theme.fontBold,
    fontSize: 12,
    color: theme.text,
    marginTop: 8,
  },
  statLabel: {
    fontFamily: theme.fontRegular,
    fontSize: theme.fontSize - 2,
    color: theme.subtext,
    marginTop: 4,
    textAlign: 'center',
  },
  paymentLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28A745', // Consider adding to theme if used frequently
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
    fontFamily: theme.fontSemiBold,
    fontSize: theme.fontSizeHeading,
    color: theme.card,
    marginLeft: 10,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: theme.fontBold,
    fontSize: theme.fontSizeHeading + 4,
    color: theme.text,
    marginBottom: 15,
  },
  saleCard: {
    flexDirection: 'row',
    backgroundColor: theme.card,
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
    fontFamily: theme.fontSemiBold,
    fontSize: theme.fontSizeHeading,
    color: theme.text,
  },
  saleAmount: {
    fontFamily: theme.fontBold,
    fontSize: theme.fontSize,
    color: '#28A745', // Consider adding to theme
    marginTop: 4,
  },
  saleStatus: {
    fontFamily: theme.fontRegular,
    fontSize: theme.fontSize - 2,
    color: theme.subtext,
    marginTop: 2,
  },
  saleDate: {
    fontFamily: theme.fontRegular,
    fontSize: theme.fontSize - 2,
    color: theme.subtext,
    marginLeft: 10,
  },
  analyticsSection: {
    padding: 20,
    paddingTop: 0,
  },
  analyticsCard: {
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analyticsText: {
    fontFamily: theme.fontRegular,
    fontSize: theme.fontSize,
    color: theme.text,
    marginTop: 8,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4D4D', // Consider adding to theme
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
    fontFamily: theme.fontSemiBold,
    fontSize: theme.fontSizeHeading,
    color: theme.card,
    marginLeft: 10,
  },
});