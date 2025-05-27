import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Printer, Mail, Download, ChevronRight } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Theme, useAppTheme } from '@/contexts/ThemeContext';

const MOCK_SALE_DETAILS = {
  id: '1',
  customer: 'Marco Rossi',
  email: 'marco.rossi@example.com',
  phone: '+39 123 456 7890',
  amount: 125.50,
  date: '2023-06-15T14:30:00Z',
  status: 'completed',
  paymentMethod: 'PayTomorrow',
  items: [
    {
      id: '101',
      name: 'Maglione in lana',
      price: 65.00,
      quantity: 1,
      total: 65.00
    },
    {
      id: '102',
      name: 'Jeans Slim Fit',
      price: 45.00,
      quantity: 1,
      total: 45.00
    },
    {
      id: '103',
      name: 'Cintura in pelle',
      price: 15.50,
      quantity: 1,
      total: 15.50
    }
  ],
  shipping: {
    method: 'Standard',
    cost: 0.00,
    address: 'Via Roma 123, Milano, 20100'
  }
};

export default function SaleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const theme = useAppTheme()
  const styles = makeStyles(theme)
  // In a real app, you would fetch the sale details based on the ID
  const sale = MOCK_SALE_DETAILS;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#007BFF" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Dettaglio Vendita</Text>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Printer size={20} color="#007BFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Mail size={20} color="#007BFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Download size={20} color="#007BFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.saleHeader}>
          <Text style={styles.saleId}>Transazione #{id}</Text>
          <Text style={[
            styles.saleStatus,
            sale.status === 'completed' && styles.completedStatus,
            sale.status === 'refunded' && styles.refundedStatus,
            sale.status === 'pending' && styles.pendingStatus
          ]}>
            {sale.status === 'completed' ? 'Completato' : 
             sale.status === 'refunded' ? 'Rimborsato' : 'In attesa'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cliente</Text>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{sale.customer}</Text>
            <Text style={styles.customerDetail}>{sale.email}</Text>
            <Text style={styles.customerDetail}>{sale.phone}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Prodotti</Text>
          {sale.items.map((item) => (
            <View key={item.id} style={styles.productItem}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>€{item.price.toFixed(2)} x {item.quantity}</Text>
              </View>
              <Text style={styles.productTotal}>€{item.total.toFixed(2)}</Text>
            </View>
          ))}
          
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotale</Text>
              <Text style={styles.totalValue}>€{(sale.amount - sale.shipping.cost).toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Spedizione</Text>
              <Text style={styles.totalValue}>€{sale.shipping.cost.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotal]}>
              <Text style={styles.totalLabel}>Totale</Text>
              <Text style={styles.totalValue}>€{sale.amount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spedizione</Text>
          <Text style={styles.shippingMethod}>{sale.shipping.method}</Text>
          <Text style={styles.shippingAddress}>{sale.shipping.address}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pagamento</Text>
          <View style={styles.paymentMethod}>
            <Text style={styles.paymentText}>{sale.paymentMethod}</Text>
            <Text style={styles.paymentAmount}>€{sale.amount.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.viewReceiptButton}>
            <Text style={styles.viewReceiptText}>Visualizza ricevuta</Text>
            <ChevronRight size={20} color="#007BFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {sale.status === 'completed' && (
        <TouchableOpacity style={styles.refundButton}>
          <Text style={styles.refundButtonText}>Processa Rimborso</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
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
    fontFamily: theme.fontBold,
    fontSize: 20,
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  saleId: {
    fontFamily: theme.fontRegular,
    fontSize: 14,
    color: '#666',
  },
  saleStatus: {
    fontFamily: theme.fontSemiBold,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completedStatus: {
    backgroundColor: '#E8F5E9',
    color: '#28A745',
  },
  refundedStatus: {
    backgroundColor: '#FFEBEE',
    color: '#FF4D4D',
  },
  pendingStatus: {
    backgroundColor: '#FFF3E0',
    color: '#FFA500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontFamily: theme.fontBold,
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
  customerInfo: {
    marginBottom: 10,
  },
  customerName: {
    fontFamily: theme.fontSemiBold,
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  customerDetail: {
    fontFamily: theme.fontRegular,
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontFamily: theme.fontRegular,
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontFamily: theme.fontRegular,
    fontSize: 13,
    color: '#666',
  },
  productTotal: {
    fontFamily: theme.fontSemiBold,
    fontSize: 15,
    color: '#333',
  },
  totalsContainer: {
    marginTop: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  grandTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  totalLabel: {
    fontFamily: theme.fontRegular,
    fontSize: 15,
    color: '#666',
  },
  totalValue: {
    fontFamily: theme.fontSemiBold,
    fontSize: 15,
    color: '#333',
  },
  shippingMethod: {
    fontFamily: theme.fontSemiBold,
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
  shippingAddress: {
    fontFamily: theme.fontRegular,
    fontSize: 14,
    color: '#666',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  paymentText: {
    fontFamily: theme.fontSemiBold,
    fontSize: 15,
    color: '#333',
  },
  paymentAmount: {
    fontFamily: theme.fontSemiBold,
    fontSize: 15,
    color: '#28A745',
  },
  viewReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  viewReceiptText: {
    fontFamily: theme.fontSemiBold,
    fontSize: 15,
    color: '#007BFF',
  },
  refundButton: {
    backgroundColor: '#FF4D4D',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  refundButtonText: {
    fontFamily: theme.fontSemiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
})
}