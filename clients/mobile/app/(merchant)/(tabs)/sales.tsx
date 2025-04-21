import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { ArrowLeft, Filter, Search, DollarSign } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/contexts/ThemeContext';
import useSales from '@/hooks/useSales';
import { useState, useEffect, useRef } from 'react';
import useSalesStats from '@/hooks/useSalesStats';

const PAGE_LIMIT = 10;

export default function SalesScreen() {
  const router = useRouter();
  const theme = useAppTheme();

  const [offset, setOffset] = useState(0);
  const [allSales, setAllSales] = useState<any[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { data: stats, isLoading: statsLoading } = useSalesStats();

  const {
    data: sales,
    isLoading,
    isError,
    refetch,
  } = useSales(PAGE_LIMIT, offset);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (sales?.length) {
      setAllSales((prev) => [...prev, ...sales]);
      if (sales.length < PAGE_LIMIT) setHasMore(false);
    } else {
      setHasMore(false);
    }
    setIsFetchingMore(false);
  }, [sales]);

  const handleLoadMore = () => {
    if (hasMore && !isFetchingMore) {
      setIsFetchingMore(true);
      setOffset((prev) => prev + PAGE_LIMIT);
    }
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - (layoutMeasurement.height + contentOffset.y);

    if (distanceFromBottom < 100) {
      handleLoadMore();
    }
  };

  if (isLoading && offset === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Errore durante il caricamento delle vendite.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text, fontFamily: theme.fontBold }]}>Vendite</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={[styles.iconWrapper, { backgroundColor: theme.cardBackgroundColor }]}>
            <Search size={20} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconWrapper, { backgroundColor: theme.cardBackgroundColor }]}>
            <Filter size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stat Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackgroundColor }]}>
          <Text style={[styles.statAmount, { color: theme.text, fontFamily: theme.fontBold }]}>
            €{stats?.today.toFixed(2) ?? '0.00'}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext, fontFamily: theme.fontRegular }]}>
            Vendite Oggi
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.cardBackgroundColor }]}>
          <Text style={[styles.statAmount, { color: theme.text, fontFamily: theme.fontBold }]}>
            €{stats?.week.toFixed(2) ?? '0.00'}
          </Text>
          <Text style={[styles.statLabel, { color: theme.subtext, fontFamily: theme.fontRegular }]}>
            Questa Settimana
          </Text>
        </View>
      </View>

      {/* Sales List */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.salesList}
        onScroll={handleScroll}
        scrollEventThrottle={200}
      >
        {allSales.map((sale) => (
          <TouchableOpacity
            key={sale.id}
            style={[styles.saleCard, { backgroundColor: theme.cardBackgroundColor }]}
            onPress={() => router.push(`./(merchant)/sale-details/${sale.id}`)}
          >
            <View style={styles.saleInfo}>
              <Text style={[styles.customerName, { color: theme.text, fontFamily: theme.fontSemiBold }]}>
                {sale.stripe?.charges?.data?.[0]?.billing_details?.name || 'Cliente'}
              </Text>
              <Text style={[styles.saleDate, { color: theme.subtext, fontFamily: theme.fontRegular }]}>
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

            <View style={styles.saleAmountContainer}>
              <Text
                style={[
                  styles.saleAmount,
                  {
                    color: getAmountColor('completed'),
                    fontFamily: theme.fontBold,
                  },
                ]}
              >
                €{parseFloat(sale.amount).toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {isFetchingMore && (
          <ActivityIndicator size="small" color={theme.primary} style={{ marginVertical: 16 }} />
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
