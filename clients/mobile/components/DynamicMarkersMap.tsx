import React, { useEffect, useMemo, useState } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { debounce } from 'lodash';
import apiClient from '@/lib/httpClient';
import { useLocation } from '@/contexts/LocationContext';
import { StyleSheet, Text, View } from 'react-native';
import CustomText from './CustomText';
import { useRouter } from 'expo-router';
import { Theme, useAppTheme } from '@/contexts/ThemeContext';

type Marker = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  image: string;
  address: string;
};

const DynamicMarkersMap = (props) => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const { location } = useLocation();
  const router = useRouter();
  const theme = useAppTheme();
  const styles = getStyles(theme)

  const mapCustomStyle = [{ "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] }, { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }]

  // Debounce the marker loading to avoid too many requests
  const loadMarkersForRegion = debounce(async (newRegion) => {
    try {
      // Calculate the bounding box from the region
      const bbox = {
        minLat: newRegion.latitude - newRegion.latitudeDelta / 2,
        maxLat: newRegion.latitude + newRegion.latitudeDelta / 2,
        minLng: newRegion.longitude - newRegion.longitudeDelta / 2,
        maxLng: newRegion.longitude + newRegion.longitudeDelta / 2,
      };

      const newMarkers = await fetchMarkersInBounds(bbox);
      setMarkers(newMarkers);
    } catch (error) {
      console.error('Error loading markers:', error);
    }
  }, 500); // 500ms debounce time

  const onRegionChangeComplete = (newRegion) => {
    loadMarkersForRegion(newRegion);
  };

  const handleCalloutPress = (markerId: Marker['id']) => {
    router.push(`/store/${markerId}`);
  };

  const markersComponents = useMemo(() => {
    return markers.map((marker, index) => (
      <Marker
        key={index}
        coordinate={{
          latitude: marker.latitude,
          longitude: marker.longitude,
        }}
        title={marker.title}
        description={marker.description}
      >
        <Callout tooltip onPress={() => handleCalloutPress(marker.id)}>
          <View style={styles.calloutWrapper}>
            <View style={styles.calloutContainer}>
              <CustomText style={styles.title}>{marker.title}</CustomText>
              <CustomText style={styles.description}>{marker.description}</CustomText>
              <CustomText style={styles.address}>{marker.address}</CustomText>
              <CustomText style={styles.cta}>Visita negozio</CustomText>
            </View>
            <View style={styles.arrow} />
          </View>
        </Callout>
      </Marker>
    ));
  }, [markers]);

  // Mock function - replace with your actual data fetching
  const fetchMarkersInBounds = async (bbox) => {
    const response = await apiClient.get('/maps/markers', {
      params: {
        minLat: bbox.minLat,
        maxLat: bbox.maxLat,
        minLng: bbox.minLng,
        maxLng: bbox.maxLng,
      },
    });

    return response.data.map((store) => ({
      id: store.id,
      latitude: store.latitude, // or store.geodata.lat if using geodata
      longitude: store.longitude, // or store.geodata.lng
      title: store.name,
      description: store.description,
      image: store.image,
      address: store.address,
    }));
  };

  return (
    <MapView
      style={{ flex: 1, ...props.style }}
      region={{
        latitude: location?.latitude ?? 41.9028,
        longitude: location?.longitude ?? 12.4964,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      key={theme.type}
      customMapStyle={theme.type === 'dark' ? mapCustomStyle : undefined}
      onRegionChange={onRegionChangeComplete}
    >
      {markersComponents}
    </MapView>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    calloutWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    calloutContainer: {
      backgroundColor: theme.cardBackgroundColor,
      borderRadius: 8,
      padding: 10,
      maxWidth: 250,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 4,
    },
    arrowBorder: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderTopColor: theme.border,
      borderWidth: 10,
      alignSelf: 'center',
      marginTop: -0.5,
    },
    arrow: {
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderTopWidth: 10,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: theme.cardBackgroundColor,
      alignSelf: 'center',
      marginTop: -1,
    },
    cta: {
      marginTop: 8,
      fontSize: theme.fontSize,
      fontFamily: theme.fontSemiBold,
      color: theme.primary,
    },
    title: {
      fontFamily: theme.fontBold,
      fontSize: theme.fontSizeHeading,
      color: theme.text,
      marginBottom: 4,
    },
    description: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize,
      color: theme.subtext,
    },
    address: {
      fontFamily: theme.fontRegular,
      fontSize: theme.fontSize - 1,
      color: theme.secondary,
      marginTop: 6,
    },
  });


export default DynamicMarkersMap;
