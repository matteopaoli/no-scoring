import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import apiClient from '@/lib/httpClient';
import { useLocation } from '@/contexts/LocationContext';

type Store = {
  id: string;
  name: string;
  category: string;
  rating: number;
  image_url: string;
};

export default function SearchScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { location } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);

  const fetchStores = async (query?: string) => {
    if (!location) return;

    try {
      let response;

      if (query) {
        response = await apiClient.get('/store/search', {
          params: {
            q: query,
            lat: location.latitude,
            lng: location.longitude,
            limit: 20,
          },
        });
      } else {
        response = await apiClient.get('/store/nearby', {
          params: {
            lat: location.latitude,
            lng: location.longitude,
            limit: 20,
          },
        });
      }

      setFilteredStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [location]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredStores([]);
    } else {
      const query = searchQuery.toLowerCase();
      const results = allStores.filter(
        (store) =>
          store.name.toLowerCase().includes(query) ||
          store.category.toLowerCase().includes(query),
      );
      setFilteredStores(results);
    }
  }, [searchQuery, allStores]);

  const handleStorePress = (storeId: string) => {
    router.push(`/store/${storeId}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.searchHeader, { backgroundColor: theme.card }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.background }]}>
          <Search size={20} color={theme.subtext} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Cerca negozi..."
            placeholderTextColor={theme.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.resultsContainer}>
        {filteredStores.map((store) => (
          <TouchableOpacity
            key={store.id}
            style={[styles.storeCard, { backgroundColor: theme.card }]}
            onPress={() => handleStorePress(store.id)}
          >
            <Image
              source={{ uri: store.image_url }}
              style={styles.storeImage}
            />
            <View style={styles.storeInfo}>
              <Text style={[styles.storeName, { color: theme.text }]}>
                {store.name}
              </Text>
              <Text style={[styles.storeCategory, { color: theme.subtext }]}>
                {store.category}
              </Text>
              <Text style={[styles.storeRating, { color: theme.primary }]}>
                ★ {store.rating}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {searchQuery && filteredStores.length === 0 && (
          <Text style={[styles.noResults, { color: theme.subtext }]}>
            Nessun risultato trovato.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
  },
  resultsContainer: {
    padding: 20,
  },
  storeCard: {
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  storeImage: {
    width: '100%',
    height: 120,
  },
  storeInfo: {
    padding: 12,
  },
  storeName: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
  },
  storeCategory: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    marginTop: 4,
  },
  storeRating: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 12,
    marginTop: 4,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
  },
});
