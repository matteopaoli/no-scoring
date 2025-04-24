import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Text from '@/components/CustomText';
import { Link, Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/contexts/ThemeContext'; // Import the theme hook
import CategoryItem from '@/components/CategoryItem';
import { useLocation } from '@/contexts/LocationContext';
import DynamicMarkersMap from '@/components/DynamicMarkersMap';
import useBusinessTypes from '@/hooks/useBusinessTypes';
import StoreCard from '@/components/StoreCard';
import useStores from '@/hooks/useStores';


function StoreList() {
  const theme = useAppTheme();
  const { stores, isLoading } = useStores({ limit: 5 });
  const { location } = useLocation();

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

  if (isLoading) {
    return (
      <View style={styles.storeListContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Caricamento negozi...
        </Text>
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
        {stores.map(({ id, name, category, distance, image }) => (
          <StoreCard key={id} id={id} name={name} category={category} distance={distance} image={image} />
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
              Pay<Text style={[styles.title, { color: theme.primary }]}>Tomorrow</Text>
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
            <CategoryItem key={category.id} category={category} onPress={() => void router.push(`/search?category=${category.id}`)} />
          ))}
          {businessTypes?.length && businessTypes.length > 6 && (
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
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
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
    flexBasis: '48%',
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
