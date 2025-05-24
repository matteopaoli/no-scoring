import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Link } from 'lucide-react-native';
import { router } from 'expo-router';
import useReferredLeads from '@/hooks/useReferredLeads';
import { Theme, useAppTheme } from '@/contexts/ThemeContext';
import { useFocusEffect } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

const ReferredLeadsComponent = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme);
  const { data: referredLeads = [], isLoading, isError, refetch } = useReferredLeads();
  const isFocused = useIsFocused()

  const [visibleCount, setVisibleCount] = useState(5);

  useFocusEffect(() => {
    refetch()
  })

  useEffect(() => {
    if (!isFocused) {
      setVisibleCount(5)
    }
  }, [isFocused])

  const loadMore = () => {
    if (visibleCount < referredLeads.length) {
      setVisibleCount(prev => prev + 5);
    }
  };

  const renderLead = ({ item }: { item: typeof referredLeads[number] }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.refName}</Text>

      <View style={styles.cardDetailsRow}>
        <Text style={styles.cardLabel}>Creato il:</Text>
        <Text style={styles.cardValue}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      {/* <View style={styles.cardDetailsRow}>
        <Text style={styles.cardLabel}>Stato:</Text>
        <Text style={styles.cardValue}>{item.leadStatus}</Text>
      </View> */}
    </View>

  );

  return (
    <FlatList
      ListHeaderComponent={
        <View style={{ paddingHorizontal: 20, }}>
          <TouchableOpacity
            style={[styles.referButton, { flex: 1, marginRight: 8, marginLeft: 0, justifyContent: 'center' }]}
            onPress={() => router.push('/customer/refer-merchant')}
          >
            <Link size={24} color={theme.cardBackgroundColor} />
            <Text style={styles.referButtonText}>Invita un negozio</Text>
          </TouchableOpacity>
          {
            referredLeads.length > 0 ? (
              <Text style={styles.cardTitle}>Utenti presentati:</Text>
            ) : null
          }
        </View>
      }
      data={referredLeads.slice(0, visibleCount)}
      renderItem={renderLead}
      keyExtractor={(_, index) => index.toString()}
      ListEmptyComponent={
        !isLoading && !isError && (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>Non hai ancora presentato nessun negozio.</Text>
            <Text style={styles.emptyStateSubtext}>Invita un negozio per iniziare a guadagnare.</Text>
          </View>
        )
      }
      ListFooterComponent={
        isLoading ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : (
          visibleCount < referredLeads.length && (
            <TouchableOpacity onPress={loadMore} style={{ marginVertical: 16, alignItems: 'center' }}>
              <Text style={styles.pageButton}>Carica di più</Text>
            </TouchableOpacity>
          )
        )
      }
    />
  );
};



const makeStyles = (theme: Theme) => {
  return StyleSheet.create({
    referButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.primary,
      borderRadius: 8,
      margin: 16,
    },
    referButtonText: {
      color: theme.cardBackgroundColor,
      marginLeft: 8,
      fontSize: 16,
      fontWeight: 'bold'
    },
    card: {
      paddingHorizontal: 20,
      paddingVertical: 6,
      marginHorizontal: 16,
      marginBottom: 6,
      borderRadius: 5,
      backgroundColor: theme.cardBackgroundColor,

      // Subtle shadow (iOS)
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,

      // Elevation (Android)
      elevation: 1,

      // Optional: border to enhance dark mode contrast
      borderWidth: 1,
      borderColor: theme.border ?? 'rgba(0,0,0,0.05)',
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 16,
      alignItems: 'center',
    },
    pageButton: {
      color: theme.primary,
      fontSize: 16,
    },
    pageNumber: {
      fontSize: 16,
    },
    emptyStateContainer: {
      padding: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: theme.subtext,
      textAlign: 'center',
    },
    statusText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: theme.text,
    },
    cardTitle: {
      fontWeight: '600',
      fontSize: 18,
      marginBottom: 6,
      color: theme.text,
    },

    cardDetailsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    cardLabel: {
      fontSize: 14,
      color: theme.subtext,
      fontWeight: '500',
    },

    cardValue: {
      fontSize: 14,
      color: theme.text,
    },
  });
}

export default ReferredLeadsComponent;
