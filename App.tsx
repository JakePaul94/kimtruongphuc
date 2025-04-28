import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useAuthStore } from '~/store/authStore';
import { useAppStore } from '~/store/useAppStore';
import './global.css';
import StackNavigator from '~/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const tryAutoLogin = useAuthStore((state) => state.tryAutoLogin);
  const autoLoginLoading = useAuthStore((state) => state.autoLoginLoading);

  useEffect(() => {
    console.log('App useEffect chạy, autoLoginLoading:', autoLoginLoading);
    if (!autoLoginLoading) {
      console.log('Bỏ qua auto-login vì đã hoàn thành.');
      return;
    }

    const attemptAutoLogin = async () => {
      console.log('Bắt đầu attemptAutoLogin');
      try {
        const success = await tryAutoLogin();
        console.log('tryAutoLogin kết quả:', success);
        if (success) {
          console.log('Auto-login thành công, gọi fetchInitialData...');
        } else {
          console.log('Auto-login thất bại, không reset dữ liệu.');
          // Không gọi logout/resetAppData ở đây để tránh vòng lặp
        }
      } catch (error) {
        console.error('Lỗi trong attemptAutoLogin:', error);
        // Không gọi logout/resetAppData ở đây
      }
    };

    attemptAutoLogin();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar translucent backgroundColor="transparent" style="dark" />
    
      {/* <StatusBar hidden /> */}
      <StackNavigator />
    </NavigationContainer>
  );
}