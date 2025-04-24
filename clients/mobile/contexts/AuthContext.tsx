import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import apiClient, { syncAuthTokens } from '@/lib/httpClient';
import { useStorageState } from '@/hooks/useStorageState'; // Adjust the import path

type User = any; // Replace with your actual user type

type AuthContextType = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [[isAccessTokenLoading, accessToken], setAccessToken] =
    useStorageState('accessToken');
  const [[isRefreshTokenLoading, refreshToken], setRefreshToken] =
    useStorageState('refreshToken');
  const [user, setUser] = useState<User | null>(null);

  const isTokensLoading = isAccessTokenLoading || isRefreshTokenLoading;
  const isLoading = isTokensLoading;
  const isAuthenticated = !!user && !!accessToken && !!refreshToken;

  useEffect(() => {
    syncAuthTokens({
      accessToken: accessToken,
      refreshToken: refreshToken,
      logout: logout,
    }).then(() => {
      if (accessToken && refreshToken) refreshUser();
    })
  }, [accessToken, refreshToken]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = response.data;

      // Update storage through custom hook setters
      console.log(accessToken, refreshToken)
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  const refreshUser = async () => {
    try {
      const response = await apiClient.get('/users/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      await logout();
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user,
        isAuthenticated,
        isLoading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
