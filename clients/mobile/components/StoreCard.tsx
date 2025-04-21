import { useAppTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";

type StoreCardProps = {
  image: string,
  id: string,
  name: string,
  category: string,
  distance: number
}


export default function StoreCard({ image, id, name, category, distance }: StoreCardProps) {
  const mockStoreImage = 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images.jpg?v=1603109892'
  const router = useRouter()
  const theme = useAppTheme()

  const formatDistance = (distance: number) => {
    // If distance is less than 1000 meters, display in meters
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      // Otherwise, convert to kilometers
      const km = (distance / 1000).toFixed(1); // Format to 1 decimal place
      return `${km}km`;
    }
  };

  return (
    <TouchableOpacity key={id} style={[styles.card, { backgroundColor: theme.cardBackgroundColor }]} onPress={() => router.push(`/store/${id}`)}>
      <Image
        source={{ uri: image || mockStoreImage }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]}>
          {name}
        </Text>
        <Text
          style={[styles.category, { color: theme.subtext }]}
        >
          {category}
        </Text>
        <View style={styles.stats}>
          {/* <Text
                          style={[styles.storeListRating, { color: theme.primary }]}
                        >
                          ★ {store.rating}
                        </Text> */}
          <Text
            style={[styles.storeListDistance, { color: theme.subtext }]}
          >
            {formatDistance(distance)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginRight: 12,
    width: '100%',
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 100,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 13,
    fontFamily: 'DMSans_700Bold',
  },
  category: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '400',
  },
  stats: {
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
})