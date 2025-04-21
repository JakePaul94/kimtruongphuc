// src/store/authStore.ts
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { saveTokens, clearTokens } from '../utils/authToken';
import { loginApi, logoutApi, changePasswordApi, getUserInfoApi, autoLoginApi } from '../apis/authApi';
import { getIpAddress, getUserAgent } from '../utils/deviceInfo';
import { UserAttributes } from '~/types/userType';


type AuthState = {
  isAuthenticated: boolean;
  user: UserAttributes | null;
  loading: boolean;
  error: string | null;
  firstLoginHandled: boolean; setFirstLoginHandled: (value: boolean) => void;
  login: (identifier: string, password: string) => Promise<void>;
  tryAutoLogin: () => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  firstLoginHandled: false, setFirstLoginHandled: (value) => set({ firstLoginHandled: value }),
  login: async (identifier, password) => {
    set({ loading: true, error: null });
    try {
      const ipAddress = await getIpAddress();
      const userAgent = getUserAgent();
      const loginTimestamp = new Date();

      const response = await loginApi(identifier, password, ipAddress, userAgent, loginTimestamp);
      const { accessToken, refreshToken, user } = response.data;
      await saveTokens(accessToken, refreshToken);
      set({ loading: false, isAuthenticated: true, user });

      if (user.firstLogin) {
        console.log('First login detected, redirecting to onboarding...');
        // Có thể gắn flag hoặc trigger UI riêng
      }
    } catch (err: any) {
      if (err.response) {
        console.error('Login error response:', err.response.data); // 👉 Chi tiết lỗi từ server
        set({ loading: false, error: err.response.data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.' });
      } else {
        console.error('Login error:', err);
        set({ loading: false, error: 'Lỗi không xác định. Vui lòng thử lại sau.' });
      }
    }
  },

  tryAutoLogin: async () => {
    set({ loading: true, error: null });
    const savedRefreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!savedRefreshToken) {
      set({ loading: false });
      return;
    }
    const ipAddress = await getIpAddress();
    const userAgent = getUserAgent();
    const loginTimestamp = new Date();
    try {
      const response = await autoLoginApi(savedRefreshToken, ipAddress, userAgent, loginTimestamp);
      const { accessToken, refreshToken, user } = response.data;
      await saveTokens(accessToken, refreshToken);
      set({ loading: false, isAuthenticated: true, user });
    } catch (err) {
      console.log('Auto login failed:', err);
      await clearTokens();
      set({ isAuthenticated: false, user: null ,error: String(err)|| 'Lỗi không xác định. Vui lòng thử lại sau.'});
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
      await clearTokens();
      set({ isAuthenticated: false, user: null });
    } catch (err) {
      console.error('Logout error:', err);
      set({ error: 'Lỗi khi đăng xuất.' });
    } finally {
      set({ loading: false });
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    set({ loading: true, error: null });
    try {
      await changePasswordApi(oldPassword, newPassword);
      await clearTokens();
      set({ isAuthenticated: false, user: null });
    } catch (err) {
      console.error('Change password error:', err);
      set({ error: 'Mật khẩu cũ không đúng hoặc có lỗi xảy ra.' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
