import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  LogOut,
  Link,
  ShoppingBag,
  Users,
  Activity,
  EuroIcon,
  Package,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Theme, useAppTheme } from '@/contexts/ThemeContext'; // Adjust the import path as needed
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/httpClient';
import useSales from '@/hooks/useSales';
import useSalesStats from '@/hooks/useSalesStats';
import useMyStoreDetails from '@/hooks/useMyStoreDetails';

export default function MerchantProfileScreen() {;
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { isPending, isError, data, error } = useMyStoreDetails();
  const { data: sales } = useSales();

  const handleCreatePaymentLink = () => {
    router.push('./create-payment');
  };

  if (isPending) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ marginTop: 16, color: theme.text }}>
          Caricamento in corso...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri:
                  data?.image ??
                  'https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              }}
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
            <EuroIcon size={24} color={theme.primary} />
            <Text style={styles.statAmount}>
              €{data?.totalRevenue?.toFixed(2)}
            </Text>
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
          onPress={handleCreatePaymentLink}
        >
          <Link size={24} color={theme.cardBackgroundColor} />
          <Text style={styles.paymentLinkButtonText}>
            Crea Link di Pagamento
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vendite Recenti</Text>
          {sales?.length === 0 && (
            <View style={styles.emptyState}>
              <Package
                size={60}
                color={theme.subtext}
                style={styles.emptyIcon}
              />
              <Text style={[styles.emptyText, { color: theme.subtext }]}>
                Nessuna vendita trovata
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.subtext }]}>
                Le vendite effettuate appariranno qui
              </Text>
            </View>
          )}
          {sales?.slice(0, 3).map((sale) => (
            <View key={sale.id} style={styles.saleCard}>
              <View style={styles.saleInfo}>
                <View style={styles.saleAmountAndStatus}>
                  <Text style={styles.saleAmount}>
                    €{sale?.amount} {/* Convert amount to EUR */}
                  </Text>

                  <Text style={styles.saleStatus}>
                    {sale?.stripe?.status === 'succeeded'
                      ? '✓ Completato'
                      : '⋯ In corso'}
                  </Text>
                </View>
                {/* Display Klarna logo if payment method is Klarna */}
                {sale?.stripe?.payment_method_types?.includes('klarna') && (
                  <Image
                    source={{
                      uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Klarna_Logo_black.svg/512px-Klarna_Logo_black.svg.png',
                    }}
                    style={styles.paymentMethodLogo}
                  />
                )}

                {/* Sale Amount and Status */}
              </View>

              {/* Sale Date */}
              <Text style={styles.saleDate}>
                {sale.createdAt
                  ? new Date(sale.createdAt).toLocaleDateString('it-IT', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '--'}
              </Text>
            </View>
          ))}
        </View>

        {/* <View style={styles.analyticsSection}>
          <Text style={styles.sectionTitle}>Analisi</Text>
          <View style={styles.analyticsCard}>
            <Activity size={24} color={theme.primary} />
            <Text style={styles.analyticsText}>Vendite questa settimana: €1,850.00</Text>
            <Text style={styles.analyticsText}>Nuovi clienti: 5</Text>
            <Text style={styles.analyticsText}>Tasso di conversione: 42%</Text>
          </View>
        </View> */}

        {/* <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}>
          <LogOut size={24} color={theme.cardBackgroundColor} />
          <Text style={styles.signOutButtonText}>Esci</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingTop: 100,
      paddingHorizontal: 20,
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
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyIcon: {
      opacity: 0.5,
      marginBottom: 20,
    },
    emptyText: {
      fontFamily: 'DMSans_600SemiBold',
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptySubtext: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 14,
      textAlign: 'center',
      opacity: 0.7,
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
      backgroundColor: theme.cardBackgroundColor,
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
      color: theme.cardBackgroundColor,
      marginLeft: 10,
    },
    section: {
      marginVertical: 30,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontFamily: theme.fontBold,
      fontSize: theme.fontSizeHeading + 4,
      color: theme.text,
      marginBottom: 15,
    },
    saleCard: {
      backgroundColor: '#FFF',
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    customerImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
    },
    saleInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      justifyContent: 'space-between', // Space between Klarna logo and amount/status
    },
    customerName: {
      fontFamily: theme.fontSemiBold,
      fontSize: theme.fontSizeHeading,
      color: theme.text,
    },
    saleAmount: {
      fontFamily: 'DMSans_600SemiBold',
      fontSize: 18,
      color: '#FF8C00', // Payment amount in orange
    },
    saleStatus: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 14,
      color: '#666',
      marginTop: 5, // Add space between amount and status
    },
    saleDate: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 12,
      color: '#999',
      marginTop: 10,
    },
    paymentMethodLogo: {
      width: 70,
      height: '100%',
      marginRight: 15,
      resizeMode: 'contain',
    },
    saleAmountAndStatus: {
      flexDirection: 'column', // Stack amount and status vertically
      alignItems: 'flex-start',
    },
    analyticsSection: {
      padding: 20,
      paddingTop: 0,
    },
    analyticsCard: {
      backgroundColor: theme.cardBackgroundColor,
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
      color: theme.cardBackgroundColor,
      marginLeft: 10,
    },
  });
