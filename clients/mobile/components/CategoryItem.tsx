import { useAppTheme } from '@/contexts/ThemeContext';
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

const CategoryItem = ({ category, style, onPress }: { category: BusinessCategory; style?: Record<string, any>; onPress: () => void; }) => {
  const theme = useAppTheme();
  return (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        {
          backgroundColor: theme.cardBackgroundColor,
          borderColor: theme.primary + '20',
        },
      ]}
      onPress={onPress}
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
};

const styles = StyleSheet.create({
  // Individual category item
  categoryItem: {
    width: '48%',                   // Each item takes up 48% of the width, leaving space between them
    marginBottom: 12,               // Space between rows
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  emoji: {
    fontSize: 20,
    marginBottom: 4,
  },

  categoryText: {
    fontSize: 14,
    textAlign: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
  },
});

export default CategoryItem;
