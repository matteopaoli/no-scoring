import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Define the types for our light and dark themes
export interface Theme {
  type: 'light' | 'dark';
  background: string;
  text: string;
  primary: string;
  secondary: string;
  subtext: string;
  card: string;
  fontRegular: string;
  fontSemiBold: string;
  fontBold: string;
  fontSize: number;
  fontSizeHeading: number;
}

const lightTheme: Theme = {
  type: 'light',
  background: '#F7F7F7',
  text: '#333',
  primary: '#FF8C00',
  secondary: '#FFD580',
  subtext: '#666',
  card: '#FFFFFF',
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
  card: '#333',
  fontRegular: 'DMSans_400Regular',
  fontSemiBold: 'DMSans_600SemiBold',
  fontBold: 'DMSans_700Bold',
  fontSize: 14,
  fontSizeHeading: 16,
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create the ThemeContext
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(
    systemTheme === 'dark' ? darkTheme : lightTheme,
  );

  useEffect(() => {
    setTheme(systemTheme === 'dark' ? darkTheme : lightTheme);
  }, [systemTheme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === lightTheme ? darkTheme : lightTheme,
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to access theme
export const useAppTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context.theme;
};
