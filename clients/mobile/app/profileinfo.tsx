import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { CreditCard, Store, Building2, ArrowRight, Bell, LogOut, ArrowLeft } from 'lucide-react-native';

type Profile = {
  id: string;
  role: 'customer' | 'partner' | 'store';
  email: string;
  full_name: string;
  avatar_url: string;
};

type CustomerProfile = {
  shipping_address: string;
  billing_address: string;
  preferred_payment_method: string;
  total_purchases: number;
  loyalty_points: number;
};

type PartnerProfile = {
  company_name: string;
  vat_number: string;
  business_type: string;
  commission_rate: number;
  total_transactions: number;
  rating: number;
};

type StoreProfile = {
  store_name: string;
  store_type: string;
  vat_number: string;
  business_address: string;
  opening_hours: Record<string, string>;
  website: string;
  social_media: Record<string, string>;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // KEEP??
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    // router.replace('/auth');
  };

  if (!profile) {
    return null;
  }

  const renderCustomerProfile = () => (
    <>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <CreditCard size={24} color="#007BFF" />
          <Text style={styles.statAmount}>€{customerProfile?.total_purchases.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Totale Acquisti</Text>
        </View>
        <View style={styles.statCard}>
          <Store size={24} color="#007BFF" />
          <Text style={styles.statAmount}>{customerProfile?.loyalty_points}</Text>
          <Text style={styles.statLabel}>Punti Fedeltà</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informazioni Personali</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Indirizzo di Spedizione</Text>
          <Text style={styles.infoValue}>{customerProfile?.shipping_address}</Text>
          <Text style={styles.infoLabel}>Metodo di Pagamento</Text>
          <Text style={styles.infoValue}>{customerProfile?.preferred_payment_method}</Text>
        </View>
      </View>
    </>
  );

  const renderPartnerProfile = () => (
    <>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <CreditCard size={24} color="#007BFF" />
          <Text style={styles.statAmount}>€{partnerProfile?.total_transactions.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Transazioni Totali</Text>
        </View>
        <View style={styles.statCard}>
          <Store size={24} color="#007BFF" />
          <Text style={styles.statAmount}>{partnerProfile?.commission_rate}%</Text>
          <Text style={styles.statLabel}>Commissione</Text>
        </View>
        <View style={styles.statCard}>
          <Building2 size={24} color="#007BFF" />
          <Text style={styles.statAmount}>★ {partnerProfile?.rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informazioni Aziendali</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Azienda</Text>
          <Text style={styles.infoValue}>{partnerProfile?.company_name}</Text>
          <Text style={styles.infoLabel}>P.IVA</Text>
          <Text style={styles.infoValue}>{partnerProfile?.vat_number}</Text>
          <Text style={styles.infoLabel}>Tipo Attività</Text>
          <Text style={styles.infoValue}>{partnerProfile?.business_type}</Text>
        </View>
      </View>
    </>
  );

  const renderStoreProfile = () => (
    <>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Store size={24} color="#007BFF" />
          <Text style={styles.statAmount}>{storeProfile?.store_name}</Text>
          <Text style={styles.statLabel}>Nome Negozio</Text>
        </View>
        <View style={styles.statCard}>
          <Building2 size={24} color="#007BFF" />
          <Text style={styles.statAmount}>{storeProfile?.store_type}</Text>
          <Text style={styles.statLabel}>Categoria</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informazioni Negozio</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Indirizzo</Text>
          <Text style={styles.infoValue}>{storeProfile?.business_address}</Text>
          <Text style={styles.infoLabel}>P.IVA</Text>
          <Text style={styles.infoValue}>{storeProfile?.vat_number}</Text>
          <Text style={styles.infoLabel}>Sito Web</Text>
          <Text style={styles.infoValue}>{storeProfile?.website}</Text>
          <Text style={styles.infoLabel}>Social Media</Text>
          <Text style={styles.infoValue}>
            Instagram: {storeProfile?.social_media.instagram}
            {'\n'}
            Facebook: {storeProfile?.social_media.facebook}
          </Text>
        </View>
      </View>
    </>
  );

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
            source={{ uri: profile.avatar_url }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>{profile.full_name}</Text>
            <Text style={styles.userEmail}>{profile.email}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color="#007BFF" />
        </TouchableOpacity>
      </View>

      {profile.role === 'customer' && renderCustomerProfile()}
      {profile.role === 'partner' && renderPartnerProfile()}
      {profile.role === 'store' && renderStoreProfile()}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Logout</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#333',
  },
  userEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  notificationButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: 10,
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
    marginTop: 5,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    marginBottom: 5,
  },
  infoValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 10,
  },
});