import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search, Filter, X } from 'lucide-react-native';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useLocation } from '@/contexts/LocationContext';
import useBusinessTypes from '@/hooks/useBusinessTypes';
import useStores from '@/hooks/useStores';
import { Picker } from '@react-native-picker/picker';

export default function SearchScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { category } = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(category as string || '');
  const [filterAnim] = useState(new Animated.Value(0));

  const {
    data: businessCategories,
    isLoading: isCategoriesLoading,
  } = useBusinessTypes();

  const {
    stores: filteredStores,
    isLoading,
    searchStores,
    refetch,
  } = useStores({
    query: searchQuery,
    category: categoryFilter,
  });

  useEffect(() => {
    if (categoryFilter !== '') {
      Animated.timing(filterAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(filterAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [categoryFilter]);

  useEffect(() => {
    if (category) {
      setCategoryFilter(category as string);
    } else {
      setCategoryFilter('');
    }
  }, [category])

  const handleStorePress = (storeId: string) => {
    router.push(`/store/${storeId}`);
  };

  const handleFilterToggle = () => {
    setFiltersVisible(!filtersVisible);
  };

  const handleApplyFilters = async () => {
    setFiltersVisible(false);
    if (searchQuery || categoryFilter) {
      await searchStores();
    } else {
      await refetch();
    }
  };

  const handleClearFilters = async () => {
    setCategoryFilter('');
    if (searchQuery) {
      await searchStores();
    } else {
      await refetch();
    }
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
          <TouchableOpacity onPress={handleFilterToggle}>
            <Filter size={20} color={theme.subtext} />
          </TouchableOpacity>
        </View>

        {categoryFilter !== '' && (
          <Animated.View
            style={[
              styles.activeFilterContainer,
              {
                opacity: filterAnim,
                transform: [
                  {
                    translateY: filterAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.activeFilterText, { color: theme.text }]}>
              {
                businessCategories?.find(
                  (c) => c.id.toString() === categoryFilter
                )?.name || 'Categoria'
              }
            </Text>
            <TouchableOpacity onPress={handleClearFilters}>
              <X size={16} color={theme.primary} />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Filters Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={filtersVisible}
        onRequestClose={handleFilterToggle}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.modalBackground, { backgroundColor: theme.background }]}>
            <View style={[styles.filterModal, { backgroundColor: theme.card }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Filters</Text>

              {/* Category Filter */}
              <View style={styles.filterOption}>
                <Text style={[styles.filterLabel, { color: theme.text }]}>Categoria</Text>
                {isCategoriesLoading ? (
                  <Text style={[styles.filterInput, { color: theme.text }]}>Caricamento...</Text>
                ) : (
                  <Picker
                    selectedValue={categoryFilter}
                    style={[styles.filterInput, { color: theme.text, borderColor: theme.border }]}
                    onValueChange={(itemValue) => setCategoryFilter(itemValue)}
                  >
                    <Picker.Item label="Seleziona una categoria" value="" />
                    {businessCategories?.map((category) => (
                      <Picker.Item key={category.id} label={category.name} value={category.id.toString()} />
                    ))}
                  </Picker>
                )}
              </View>

              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: theme.primary }]}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleClearFilters}>
                <Text style={[styles.cancelButton, { color: theme.subtext }]}>Clear Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleFilterToggle}>
                <Text style={[styles.cancelButton, { color: theme.subtext }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ScrollView contentContainerStyle={styles.resultsContainer}>
        {isLoading ? (
          <Text style={[styles.noResults, { color: theme.subtext }]}>
            Caricamento...
          </Text>
        ) : (
          <>
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
                </View>
              </TouchableOpacity>
            ))}

            {searchQuery && filteredStores?.length === 0 && (
              <Text style={[styles.noResults, { color: theme.subtext }]}>
                Nessun risultato trovato.
              </Text>
            )}
          </>
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
  noResults: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  filterModal: {
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 18,
    marginBottom: 15,
  },
  filterOption: {
    marginBottom: 15,
  },
  filterLabel: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
  },
  filterInput: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    padding: 10,
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
  },
  applyButton: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  applyButtonText: {
    color: 'white',
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 14,
  },
  cancelButton: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
  },
  activeFilterContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  activeFilterText: {
    fontSize: 12,
    fontFamily: 'DMSans_400Regular',
    marginRight: 8,
  },
});
