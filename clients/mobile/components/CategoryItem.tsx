import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type BusinessCategory = {
  id: number;
  name: string;
};

// Emoji mapping remains the same
const CATEGORY_EMOJIS: Record<number, string> = {
    2: '🏢',  // Generico
    3: '🍝',  // Ristorazione
    4: '🛠️',  // Artigianato
    5: '🏨',  // Hotellerie
    6: '💇',  // Estetica e parrucchieri
    7: '📦',  // E-Commerce e vendita online
    9: '💊',  // Farmacie
    10: '🚗', // Concessionari e carrozzerie
    11: '📑', // Broker e prodotti assicurativi
    12: '👕', // Abbigliamento e calzature
    13: '🛵', // Attività con servizio di consegna
    14: '💼', // Società di consulenza
    15: '🦷', // Studi dentistici
    16: '🛋️',  // Negozi di arredamento e utensileria
  };

const CategoryItem = ({ category, theme }: { category: BusinessCategory; theme: any }) => (
  <TouchableOpacity
    style={[
      styles.categoryItem,
      {
        backgroundColor: theme.card,
        borderColor: theme.primary + '20',
        borderWidth: 1,
      },
    ]}
  >
    <Text style={[styles.emoji, { color: theme.primary }]}>
      {CATEGORY_EMOJIS[category.id] || '🏢'}
    </Text>
    <Text
      style={[
        styles.categoryText,
        { 
          color: theme.text, 
          fontFamily: theme.fontSemiBold 
        }
      ]}
      numberOfLines={2} // Allow text to wrap
    >
      {category.name}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // Individual category item
  categoryItem: {
    width: '30%', // 3 columns (100%/3 - margin)
    aspectRatio: 1, // Square items
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16, // Space between rows
  },
  emoji: {
    fontSize: 32, // Larger emoji
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    textAlign: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
  },
});

export default CategoryItem;