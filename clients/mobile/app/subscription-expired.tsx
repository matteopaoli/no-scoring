import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertTriangle } from 'lucide-react-native';

export default function SubscriptionExpired() {
  const router = useRouter();

  const handlePaymentRedirect = () => {
    router.push('https://secureprivacy.thrivecart.com/paytomorrow-abbonamento');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AlertTriangle size={48} color="#FF9900" style={styles.icon} />
        <Text style={styles.title}>Abbonamento Scaduto</Text>
        <Text style={styles.description}>
          Il tuo abbonamento a PayTomorrow è scaduto. Per continuare a utilizzare il servizio, ti
          chiediamo di rinnovare l’abbonamento effettuando il pagamento.
        </Text>
        <TouchableOpacity style={styles.ctaButton} onPress={handlePaymentRedirect}>
          <Text style={styles.ctaText}>Paga ora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD580',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
  },
  ctaButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
