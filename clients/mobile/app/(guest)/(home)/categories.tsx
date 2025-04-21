import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Text from '@/components/CustomText';
import { useAppTheme } from '@/contexts/ThemeContext'; // Import the theme hook
import { Link, useRouter } from 'expo-router';
import CategoryItem from '@/components/CategoryItem';
import useBusinessTypes from '@/hooks/useBusinessTypes';

export default function CategoriesScreen() {
  const theme = useAppTheme();
  const { data: businessTypes } = useBusinessTypes();
  const router = useRouter();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.categoriesGrid}>
        {businessTypes?.map((category) => (
            <CategoryItem style={styles.categoryItem} key={category.id} category={category} theme={theme} onPress={() => router.push(`/search?category=${category.id}`)} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
    rowGap: 0,
  },
  categoryItem: {
    width: '48%'
  }
});
