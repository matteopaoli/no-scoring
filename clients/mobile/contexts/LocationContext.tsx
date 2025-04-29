import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import * as Location from 'expo-location';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  location: Coordinates | null;
  loading: boolean;
  error: string | null;
  updateLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const updateLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Permesso di localizzazione negato.');
        setLocation(null);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });
      setError(null);
    } catch (err) {
      console.error('Errore nel recuperare la posizione:', err);
      setError('Errore nel recuperare la posizione.');
      setLocation(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateLocation(); // Fetch location immediately on mount
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading, error, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
