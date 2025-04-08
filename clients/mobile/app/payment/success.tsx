import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/contexts/ThemeContext';
import { CheckCircle, ArrowLeft } from 'lucide-react-native';

export default function PaymentSuccess() {
  const theme = useAppTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/')}
      >
        <ArrowLeft size={24} color={theme.primary} />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
          <CheckCircle size={64} color={theme.primary} />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Pagamento completato!</Text>
        
        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          Il tuo pagamento è stato processato con successo.
        </Text>

        {/* Transaction details - you can make these dynamic */}
        <View style={[styles.detailsCard, { backgroundColor: theme.card }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.subtext }]}>Importo:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>€ 50,00</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.subtext }]}>Negozio:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>Lusso Gioielli</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.subtext }]}>Data:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>15/06/2023</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.subtext }]}>ID transazione:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>TX-78945612</Text>
          </View>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/')}
        >
          <Text style={styles.buttonText}>Torna alla home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.primary }]}
          onPress={() => router.push('/receipt')} // Replace with your receipt screen
        >
          <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>
            Visualizza ricevuta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 16,
    borderRadius: 50,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: '80%',
  },
  illustration: {
    width: 200,
    height: 150,
    marginBottom: 32,
  },
  detailsCard: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
  },
  detailValue: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
  },
  buttonContainer: {
    width: '100%',
  },
  primaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 16,
    color: '#FFF',
  },
  secondaryButtonText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 16,
  },
});