import React, { useMemo, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { debounce } from 'lodash';
import apiClient from '@/lib/httpClient';
import { useLocation } from '@/contexts/LocationContext';

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
      />
    ));
  }, [markers]);

  console.log(markersComponents)

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
      onRegionChange={onRegionChangeComplete}
    >
      {markersComponents}
    </MapView>
  );
};

export default DynamicMarkersMap;
