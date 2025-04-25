import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { saveTokens, clearTokens, getRefreshToken } from '../utils/authToken';
import { loginApi, logoutApi, changePasswordApi, getUserInfoApi, autoLoginApi } from '../apis/authApi';
import { getIpAddress, getUserAgent } from '../utils/deviceInfo';
import { UserAttributes } from '~/types/userType';
import { useAppStore } from './useAppStore';


type AuthState = {
  isAuthenticated: boolean;
  user: UserAttributes | null;
  loading: boolean; // Loading chung cho các action login, logout, changePassword
  autoLoginLoading: boolean; // Loading riêng cho autoLogin
  error: string | null;
  firstLoginHandled: boolean; setFirstLoginHandled: (value: boolean) => void;
  login: (identifier: string, password: string) => Promise<boolean>; // Trả về boolean thành công/thất bại
  tryAutoLogin: () => Promise<boolean>; // Trả về boolean thành công/thất bại
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>; // Trả về boolean thành công/thất bại
};

export const useAuthStore = create<AuthState>((set, get) => ({ // Thêm get để truy cập state hiện tại nếu cần
  isAuthenticated: false,
  user: null,
  loading: false,
  autoLoginLoading: true, // Bắt đầu là true khi app khởi động
  error: null,
  firstLoginHandled: false,
  setFirstLoginHandled: (value) => set({ firstLoginHandled: value }),

  login: async (identifier, password) => {
    set({ loading: true, error: null });
    try {
      const ipAddress = await getIpAddress();
      const userAgent = getUserAgent();
      const loginTimestamp = new Date();

      const response = await loginApi(identifier, password, ipAddress, userAgent, loginTimestamp);
      const success = await useAppStore.getState().fetchInitialData();
      const { accessToken, refreshToken, user } = response.data;
      await saveTokens(accessToken, refreshToken);

      set({ isAuthenticated: true, user, error: null, firstLoginHandled: false });
      if (!success) console.warn('Không tải được dữ liệu ban đầu sau khi login.');

      return true;
    } catch (err: any) {
      let errorMessage = 'Lỗi không xác định. Vui lòng thử lại sau.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
        console.error('Login error response:', err.response.data);
      } else {
        console.error('Login error:', err);
      }
      set({ isAuthenticated: false, user: null, error: errorMessage });
      return false; // Đăng nhập thất bại
    } finally {
      set({ loading: false });
    }
  },

  tryAutoLogin: async () => {
    const savedRefreshToken = await getRefreshToken();
    if (!savedRefreshToken) {
      console.log('No refresh token found for auto-login.');
      set({ autoLoginLoading: false, isAuthenticated: false, user: null });
      return false;
    }

    console.log('Attempting auto-login...');
    const ipAddress = await getIpAddress();
    const userAgent = getUserAgent();
    const loginTimestamp = new Date();

    try {
      return autoLoginApi(savedRefreshToken, ipAddress, userAgent, loginTimestamp)
        .then((response) => {
          const { accessToken, refreshToken, user } = response.data;
          return saveTokens(accessToken, refreshToken).then(() => ({ user }));
        })
        .then(async ({ user }) => {
          console.log('Auto-login successful.');
          const success = await useAppStore.getState().fetchInitialData();
          set({ isAuthenticated: true, user, error: null, firstLoginHandled: false });
          if (!success) console.warn('Không tải được dữ liệu ban đầu sau khi login.');
          return true;
        })
        .catch(async (err) => {
          console.error('Auto-login failed', err);
          await clearTokens();
          set({
            isAuthenticated: false,
            user: null,
            error: 'Phiên đăng nhập hết hạn hoặc không hợp lệ.',
          });
          return false;
        });
    } finally {
      set({ autoLoginLoading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (refreshToken) {
        await logoutApi(refreshToken); // Cố gắng gọi API logout
      }
    } catch (err) {
      console.error('Logout API error (ignoring):', err); // Vẫn tiếp tục logout phía client
    } finally {
      await useAppStore.getState().resetAppData()

      await clearTokens();

      set({ isAuthenticated: false, user: null, loading: false, firstLoginHandled: false, error: null }); // Reset state
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    set({ loading: true, error: null });
    try {
      await changePasswordApi(oldPassword, newPassword);
      console.log('Password changed successfully, logging out.');
      // Không cần clearTokens hay set state ở đây, sẽ logout ngay sau đó
      return true; // Thành công
    } catch (err: any) {
      let errorMessage = 'Mật khẩu cũ không đúng hoặc có lỗi xảy ra.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
        console.error('Change password error response:', err.response.data);
      } else {
        console.error('Change password error:', err);
      }
      set({ error: errorMessage });
      return false; // Thất bại
    } finally {
      set({ loading: false });
    }
  },
}));