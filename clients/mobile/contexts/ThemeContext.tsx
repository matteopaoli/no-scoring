import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  type: 'light' | 'dark';
  background: string;
  text: string;
  primary: string;
  secondary: string;
  subtext: string;
  border: string;
  fontRegular: string;
  fontSemiBold: string;
  fontBold: string;
  fontSize: number;
  fontSizeHeading: number;
  cardBackgroundColor: string;
}

const lightTheme: Theme = {
  type: 'light',
  background: '#F7F7F7',
  text: '#333',
  primary: '#FF8C00',
  secondary: '#FFD580',
  subtext: '#666',
  cardBackgroundColor: '#FFFFFF',
  border: '#D1D1D1',
  fontRegular: 'DMSans_400Regular',
  fontSemiBold: 'DMSans_600SemiBold',
  fontBold: 'DMSans_700Bold',
  fontSize: 14,
  fontSizeHeading: 16,
};

const darkTheme: Theme = {
  type: 'dark',
  background: '#121212',
  text: '#E1E1E1',
  primary: '#FF8C00',
  secondary: '#FFD580',
  subtext: '#999',
  cardBackgroundColor: '#333',
  border: '#555',
  fontRegular: 'DMSans_400Regular',
  fontSemiBold: 'DMSans_600SemiBold',
  fontBold: 'DMSans_700Bold',
  fontSize: 14,
  fontSizeHeading: 16,
};

type ThemePreference = 'light' | 'dark' | null;

interface ThemeContextType {
  theme: Theme;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(null);
  const [theme, setTheme] = useState<Theme>(lightTheme); // Default theme

  // Load persisted preference
  useEffect(() => {
    const loadPreference = async () => {
      const storedPref = await AsyncStorage.getItem('themePreference');
      if (storedPref === 'light' || storedPref === 'dark') {
        setThemePreferenceState(storedPref);
      }
    };
    loadPreference();
  }, []);

  // Resolve active theme
  useEffect(() => {
    const resolved =
      themePreference === 'dark'
        ? darkTheme
        : themePreference === 'light'
        ? lightTheme
        : systemScheme === 'dark'
        ? darkTheme
        : lightTheme;

    setTheme(resolved);
  }, [systemScheme, themePreference]);

  // Save preference and update state
  const setThemePreference = async (preference: ThemePreference) => {
    setThemePreferenceState(preference);
    if (preference === null) {
      await AsyncStorage.removeItem('themePreference');
    } else {
      await AsyncStorage.setItem('themePreference', preference);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, themePreference, setThemePreference }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used within a ThemeProvider');
  return context.theme;
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within a ThemeProvider');
  return context;
};
