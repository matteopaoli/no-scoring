import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Search, Filter, MapPin, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

type Store = {
  id: string;
  name: string;
  category: string;
  rating: number;
  latitude: number;
  longitude: number;
  image_url: string;
};

// Web-specific map implementation
function WebMap({ stores, onSelectStore }: { stores: Store[], onSelectStore: (store: Store) => void }) {
  useEffect(() => {
    if (stores.length > 0) {
      onSelectStore(stores[0]);
    }
  }, [stores]);

  return (
    <View style={styles.webMapContainer}>
      <View style={styles.mapPlaceholder}>
        <MapPin size={48} color="#007BFF" />
        <Text style={styles.mapPlaceholderText}>Mappa interattiva</Text>
      </View>
    </View>
  );
}

function StoreList({ stores, onSelectStore }: { stores: Store[], onSelectStore: (store: Store) => void }) {
  return (
    <View style={styles.storeListContainer}>
      <Text style={styles.sectionTitle}>Negozi nelle vicinanze</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stores.map((store) => (
          <TouchableOpacity
            key={store.id}
            style={styles.storeListCard}
            onPress={() => onSelectStore(store)}>
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

export default function MapScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
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
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/')}>
          <ArrowLeft size={24} color="#007BFF" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <Text style={styles.searchPlaceholder}>Cerca negozi vicino a te</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#007BFF" />
        </TouchableOpacity>
      </View>

      <WebMap stores={stores} onSelectStore={setSelectedStore} />
      
      <StoreList stores={stores} onSelectStore={setSelectedStore} />

      {selectedStore && (
        <View style={styles.storeCard}>
          <Image
            source={{ uri: selectedStore.image_url }}
            style={styles.storeImage}
          />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{selectedStore.name}</Text>
            <Text style={styles.storeCategory}>{selectedStore.category}</Text>
            <View style={styles.storeStats}>
              <Text style={styles.storeRating}>★ {selectedStore.rating}</Text>
              <Text style={styles.storeDivider}>•</Text>
              <Text style={styles.storeDistance}>{'< 1km'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>Vedi</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD580',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    gap: 10,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchPlaceholder: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  webMapContainer: {
    height: 200,
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  mapPlaceholderText: {
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  storeListContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
  storeListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginRight: 15,
    width: 200,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storeListImage: {
    width: '100%',
    height: 120,
  },
  storeListInfo: {
    padding: 12,
  },
  storeListName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#333',
  },
  storeListCategory: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
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
    fontSize: 12,
    color: '#FF9800',
  },
  storeListDistance: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  storeCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  storeImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#333',
  },
  storeCategory: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  storeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  storeRating: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FF9800',
  },
  storeDivider: {
    marginHorizontal: 8,
    color: '#666',
  },
  storeDistance: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  viewButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  viewButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});