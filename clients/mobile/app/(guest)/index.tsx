import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Text from '@/components/CustomText';
import { Link, Redirect, useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext'; // Import the theme hook
import apiClient from '@/lib/httpClient';
import CategoryItem from '@/components/CategoryItem';

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

type BusinessType = {
  id: string;
  name: string;
  emoji: string;
};

function StoreList({ stores }: { stores: Store[] }) {
  const theme = useAppTheme(); // Get current theme

  return (
    <View
      style={[styles.storeListContainer, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Negozi nelle vicinanze
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stores.map((store) => (
          <TouchableOpacity key={store.id} style={styles.storeListCard}>
            <Image
              source={{ uri: store.image_url }}
              style={styles.storeListImage}
            />
            <View style={styles.storeListInfo}>
              <Text style={[styles.storeListName, { color: theme.text }]}>
                {store.name}
              </Text>
              <Text
                style={[styles.storeListCategory, { color: theme.subtext }]}
              >
                {store.category}
              </Text>
              <View style={styles.storeListStats}>
                <Text
                  style={[styles.storeListRating, { color: theme.primary }]}
                >
                  ★ {store.rating}
                </Text>
                <Text
                  style={[styles.storeListDistance, { color: theme.subtext }]}
                >
                  {'< 1km'}
                </Text>
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
  const [stores, setStores] = useState<Store[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const { user } = useAuth();
  const theme = useAppTheme(); // Get current theme

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
    fetchBusinessTypes();
  }, []);

  const fetchBusinessTypes = async () => {
    try {
      const response = await apiClient.get('/business-type'); // Replace with your API endpoint
      const { data } = response;
      console.log(data);
      setBusinessTypes(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchStores = async () => {
    try {
      // TODO: Fetch store data from your API
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (user?.role === 'user') {
    return <Redirect href="/(merchant)/(tabs)/store" />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>
            Pay<Text style={[{ color: theme.primary }]}>Tomorrow</Text>
          </Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            <Text style={[styles.subtitleBlue, { color: theme.text }]}>
              compra oggi,{' '}
            </Text>
            <Text style={[styles.subtitleOrange, { color: theme.primary }]}>
              paga domani
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.categoriesGrid}>
        {businessTypes.slice(0, 6).map((category) => (
          <CategoryItem key={category.id} category={category} theme={theme} />
        ))}
        {businessTypes.length > 6 && (
          <Link
            href={{
              pathname: '/categories',
              params: { categories: JSON.stringify(businessTypes) },
            }}
            asChild
          >
            <TouchableOpacity
              style={[
                styles.categoryGridItem,
                styles.ghostButton,
                { borderColor: theme.primary },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: theme.primary, fontFamily: theme.fontSemiBold },
                ]}
              >
                Mostra tutti
              </Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 41.9028,
            longitude: 12.4964,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
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
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  subtitleBlue: {
    color: '#FFFFFF',
  },
  subtitleOrange: {
    color: '#FFD580',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoryGridItem: {
    borderRadius: 10,
    padding: 12,
    width: '30%',
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  categoryText: {
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
    fontSize: 16,
    marginBottom: 12,
  },
  storeListCard: {
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
    fontSize: 13,
    fontWeight: '600',
  },
  storeListCategory: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '400',
  },
  storeListStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  storeListRating: {
    fontSize: 11,
    fontWeight: '600',
  },
  storeListDistance: {
    fontSize: 11,
    fontWeight: '400',
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});
