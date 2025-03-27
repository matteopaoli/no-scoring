import axios, { AxiosError } from "axios";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
const apiClient = axios.create({
  baseURL: backendUrl, 
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthTokens = (getAuthTokens: () => { accessToken: string | null; refreshToken: string | null; logout: () => void; setTokens: (newAccessToken: string, newRefreshToken: string) => void }) => {
  apiClient.interceptors.request.use(
    async (config) => {
      const { accessToken } = getAuthTokens();
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const { response } = error;
      console.log(JSON.stringify(error, null, 2));
      if (response?.status === 401) {
        const { refreshToken, logout, setTokens } = getAuthTokens();
        try {
          const refreshResponse = await axios.post(
            `${backendUrl}/auth/refresh`,
            {},
            {
              headers: {
                "Authorization": `Bearer ${refreshToken}`,
              },
            }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
          setTokens(newAccessToken, newRefreshToken);

          error.config!.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(error.config!);
        } catch (refreshError) {
          console.error("Token refresh failed, logging out...");
          logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;
