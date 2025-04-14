import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Text from '@/components/CustomText';
import { Link, Redirect, useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext'; // Import the theme hook
import apiClient from '@/lib/httpClient';
import CategoryItem from '@/components/CategoryItem';
import { useLocation } from '@/contexts/LocationContext';
import DynamicMarkersMap from '@/components/DynamicMarkersMap';
import useBusinessTypes from '@/hooks/useBusinessTypes';

const mockStoreImages = [
  'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=2076&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1464869372688-a93d806be852?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571974448718-ac26a9af7d8b?q=80&w=2069&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580554430120-94cfcb3adf25?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1535401991746-da3d9055713e?q=80&w=2063&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542581542-0d526913eb3e?q=80&w=2070&auto=format&fit=crop'
]

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

function StoreList() {
  const theme = useAppTheme();
  const [stores, setStores] = useState<Store[]>([]);
  const { location } = useLocation();
  const router = useRouter();

  const formatDistance = (distance) => {
    // If distance is less than 1000 meters, display in meters
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      // Otherwise, convert to kilometers
      const km = (distance / 1000).toFixed(1); // Format to 1 decimal place
      return `${km}km`;
    }
  };

  const fetchStores = async () => {
    if (location !== null) {
      try {
        const response = await apiClient.get('/store/nearby', {
          params: {
            lat: location?.latitude,
            lng: location?.longitude,
            limit: 5,
          },
        });
        setStores(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  useEffect(() => {
    if (location) {
      fetchStores();
    }
  }, [location]);

  if (!location) {
    return (
      <View
        style={[
          styles.permissionContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <TouchableOpacity
          style={[styles.permissionButton, { borderColor: theme.primary }]}
        >
          <Text style={[styles.permissionText, { color: theme.text }]}>
            Per vedere i negozi vicini, abilita la localizzazione
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.storeListContainer, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Negozi nelle vicinanze
      </Text>
      <View>
        {stores.map((store) => (
          <TouchableOpacity key={store.id} style={styles.storeListCard} onPress={() => router.push(`/store/${store.id}`)}>
            <Image
              source={{ uri: store.image_url || mockStoreImages[Math.floor(Math.random() * mockStoreImages.length)] }}
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
                {/* <Text
                  style={[styles.storeListRating, { color: theme.primary }]}
                >
                  ★ {store.rating}
                </Text> */}
                <Text
                  style={[styles.storeListDistance, { color: theme.subtext }]}
                >
                  {formatDistance(store.distance)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const theme = useAppTheme();
  const { data: businessTypes } = useBusinessTypes()
  const router = useRouter();

  if (user?.role === 'user') {
    return <Redirect href="/(merchant)/(tabs)/store" />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
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
        {businessTypes?.slice(0, 6).map((category) => (
          <CategoryItem style={styles.categoryGridItem} key={category.id} category={category} theme={theme} onPress={() => void router.push('/')} />
        ))}
        {businessTypes?.length > 6 && (
          <Link
            href={{
              pathname: '/categories',
              params: { categories: JSON.stringify(businessTypes) },
            }}
            asChild
          >
            <TouchableOpacity
              style={[
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
                Mostra tutte le categorie
              </Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>

      <View style={styles.mapContainer}>
        <DynamicMarkersMap style={styles.map} />
      </View>
      <StoreList />
    </ScrollView>
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
    columnGap: 10,
  },
  categoryGridItem: {
    width: '48%',
  },
  categoryText: {
    textAlign: 'center',
  },
  mapContainer: {
    height: 300,
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
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 12,
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
    fontFamily: 'DMSans_700Bold',
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
  permissionContainer: {
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  permissionButton: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionText: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  permissionSubtext: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
