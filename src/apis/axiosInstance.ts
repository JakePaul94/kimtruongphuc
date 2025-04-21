import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
  isTokenExpired,
} from '../utils/authToken';
import { API_BASE_URL } from '../config/apiConfig';
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  let token = await getAccessToken();

  if (token && isTokenExpired(token)) {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });
        token = response.data.accessToken;
        await saveTokens(response.data.accessToken, response.data.refreshToken);
      } catch (error) {
        console.error('Failed to refresh token', error);
        await clearTokens();
        throw error;
      }
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
