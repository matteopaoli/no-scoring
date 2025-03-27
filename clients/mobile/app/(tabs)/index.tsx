import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Search } from 'lucide-react-native';

const CATEGORIES = [
  { id: 1, emoji: '💎', name: 'Gioiellerie' },
  { id: 2, emoji: '🍽️', name: 'Ristoranti Gourmet' },
  { id: 3, emoji: '🚗', name: 'Concessionari Auto' },
  { id: 4, emoji: '🛋️', name: 'Arredamento' },
  { id: 5, emoji: '📱', name: 'Elettronica' },
  { id: 6, emoji: '✈️', name: 'Viaggi' },
];

type Store = {
  id: string;
  name: string;
  category: string;
  rating: number;
  latitude: number;
  longitude: number;
  image_url: string;
};

function StoreList({ stores }: { stores: Store[] }) {
  return (
    <View style={styles.storeListContainer}>
      <Text style={styles.sectionTitle}>Negozi nelle vicinanze</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stores.map((store) => (
          <TouchableOpacity
            key={store.id}
            style={styles.storeListCard}>
            <Image source={{ uri: store.image_url }} style={styles.storeListImage} />
            <View style={styles.storeListInfo}>
              <Text style={styles.storeListName}>{store.name}</Text>
              <Text style={styles.storeListCategory}>{store.category}</Text>
              <View style={styles.storeListStats}>
                <Text style={styles.storeListRating}>★ {store.rating}</Text>
                <Text style={styles.storeListDistance}>{'< 1km'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    })();
  }, []);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      // TODO
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            <Text style={styles.titleBlue}>Pay</Text>
            <Text style={styles.titleOrange}>Tomorrow</Text>
          </Text>
          <Text style={styles.subtitle}>
            <Text style={styles.subtitleBlue}>compra oggi, </Text>
            <Text style={styles.subtitleOrange}>paga domani</Text>
          </Text>
        </View>
        {/* <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/auth')}>
          <Text style={styles.loginButtonText}>Accedi</Text>
        </TouchableOpacity> */}
      </View>

      {/* <View style={styles.accessButtons}>
        <TouchableOpacity
          style={[styles.accessButton, { backgroundColor: '#7B5CC6' }]}
          onPress={() => router.push('/profile')}>
          <Text style={styles.accessButtonText}>Area Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.accessButton, { backgroundColor: '#FF8C00' }]}
          onPress={() => router.push('/partner')}>
          <Text style={styles.accessButtonText}>Area Partner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.accessButton, { backgroundColor: '#28A745' }]}
          onPress={() => router.push('/store')}>
          <Text style={styles.accessButtonText}>Area Negozio</Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cerca negozi vicino a te"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScrollContent}
        style={styles.categoriesContainer}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryButton}>
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text style={styles.categoryText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 41.9028,
            longitude: 12.4964,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {stores.map((store) => (
            <Marker
              key={store.id}
              coordinate={{
                latitude: store.latitude,
                longitude: store.longitude,
              }}
              title={store.name}
            />
          ))}
        </MapView>
      </View>

      <StoreList stores={stores} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9B7EDC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
  },
  titleBlue: {
    color: '#FFFFFF',
  },
  titleOrange: {
    color: '#FFD580',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginTop: 2,
  },
  subtitleBlue: {
    color: '#FFFFFF',
  },
  subtitleOrange: {
    color: '#FFD580',
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#9B7EDC',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  accessButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  accessButton: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accessButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
  },
  categoriesContainer: {
    maxHeight: 75,
    marginBottom: 8,
  },
  categoriesScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 80,
  },
  categoryEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  categoryText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#333',
    textAlign: 'center',
  },
  mapContainer: {
    height: '30%',
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  storeListContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  storeListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 12,
    width: 180,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeListImage: {
    width: '100%',
    height: 100,
  },
  storeListInfo: {
    padding: 10,
  },
  storeListName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#333',
  },
  storeListCategory: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  storeListStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  storeListRating: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: '#FF9800',
  },
  storeListDistance: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#666',
  },
});