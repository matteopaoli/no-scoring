import axios, { AxiosError } from "axios";
import { setStorageItemAsync } from '@/hooks/useStorageState'; // Adjust import path

let tokenCache = {
  accessToken: null as string | null,
  refreshToken: null as string | null,
  logout: async () => {}, // Will be set by syncAuthTokens
};

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

export const syncAuthTokens = async (params: {
  accessToken?: string | null;
  refreshToken?: string | null;
  logout?: () => Promise<void>;
}) => {
  if (params.accessToken !== undefined) {
    tokenCache.accessToken = params.accessToken;
    await setStorageItemAsync('accessToken', params.accessToken);
  }
  if (params.refreshToken !== undefined) {
    tokenCache.refreshToken = params.refreshToken;
    await setStorageItemAsync('refreshToken', params.refreshToken);
  }
  if (params.logout !== undefined) {
    tokenCache.logout = params.logout;
  }
};

apiClient.interceptors.request.use((config) => {
  if (tokenCache.accessToken) {
    config.headers.Authorization = `Bearer ${tokenCache.accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: (() => void)[] = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.error(error)
    const originalRequest = error.config;
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push(() => resolve(apiClient(originalRequest)));
      });
    }

    isRefreshing = true;

    try {
      if (!tokenCache.refreshToken) throw new Error('No refresh token');
      
      const refreshResponse = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/refresh`, {
        headers: { Authorization: `Bearer ${tokenCache.refreshToken}` },
      });

      const { accessToken, refreshToken } = refreshResponse.data;
      
      await syncAuthTokens({ accessToken, refreshToken });
      refreshQueue.forEach((cb) => cb());
      refreshQueue = [];

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      await syncAuthTokens({ 
        accessToken: null, 
        refreshToken: null 
      });
      await tokenCache.logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;