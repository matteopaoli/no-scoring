// LocationContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as Location from 'expo-location';

interface LocationContextType {
  location: { latitude: number; longitude: number } | null;
  updateLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
}) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const updateLocation = async () => {
    const currentLocation = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = currentLocation.coords;
    setLocation({ latitude, longitude });
  };

  useEffect(() => {
    const checkPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setPermissionDenied(true);
            return;
        }
    }
    checkPermission();
  }, []);
  useEffect(() => {
    if (!permissionDenied) {
        updateLocation();
    }
  }, [permissionDenied]);

  return (
    <LocationContext.Provider value={{ location, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use location context
export const useLocation = (): LocationContextType => {
  const context = React.useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
