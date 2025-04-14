import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { ArrowLeft, Filter, Search, DollarSign } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/contexts/ThemeContext';

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
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text, fontFamily: theme.fontBold }]}>Vendite</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={[styles.iconWrapper, { backgroundColor: theme.card }]}>
            <Search size={20} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconWrapper, { backgroundColor: theme.card }]}>
            <Filter size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stat Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statAmount, { color: theme.text, fontFamily: theme.fontBold }]}>€1,245.35</Text>
          <Text style={[styles.statLabel, { color: theme.subtleText, fontFamily: theme.fontRegular }]}>Vendite Oggi</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.statAmount, { color: theme.text, fontFamily: theme.fontBold }]}>€5,842.90</Text>
          <Text style={[styles.statLabel, { color: theme.subtleText, fontFamily: theme.fontRegular }]}>Questa Settimana</Text>
        </View>
      </View>

      {/* Sales List */}
      <ScrollView contentContainerStyle={styles.salesList}>
        {MOCK_SALES.map((sale) => (
          <TouchableOpacity
            key={sale.id}
            style={[styles.saleCard, { backgroundColor: theme.card }]}
            onPress={() => router.push(`./(merchant)/sale-details/${sale.id}`)}
          >
            <View style={styles.saleInfo}>
              <Text style={[styles.customerName, { color: theme.text, fontFamily: theme.fontSemiBold }]}>
                {sale.customer}
              </Text>
              <Text style={[styles.saleDate, { color: theme.subtleText, fontFamily: theme.fontRegular }]}>
                {new Date(sale.date).toLocaleDateString('it-IT', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>

            <View style={styles.saleAmountContainer}>
              <DollarSign size={16} color={getAmountColor(sale.status)} />
              <Text
                style={[
                  styles.saleAmount,
                  {
                    color: getAmountColor(sale.status),
                    fontFamily: theme.fontBold,
                  },
                ]}
              >
                €{sale.amount.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function getAmountColor(status: string) {
  switch (status) {
    case 'refunded':
      return '#FF4D4D';
    case 'pending':
      return '#FFA500';
    default:
      return '#28A745';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  title: {
    fontSize: 24,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  statAmount: {
    fontSize: 18,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
  },
  salesList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  saleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      },
    }),
  },
  saleInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    marginBottom: 5,
  },
  saleDate: {
    fontSize: 12,
  },
  saleAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  saleAmount: {
    fontSize: 16,
    marginLeft: 6,
  },
});
