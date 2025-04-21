import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useAuthStore } from '~/store/authStore';
import './global.css';
import StackNavigator from '~/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
export default function App() {
  const tryAutoLogin = useAuthStore((state) => state.tryAutoLogin);
  useEffect(() => {
    tryAutoLogin(); // Khởi động auto-login khi ứng dụng bắt đầu
  }, [tryAutoLogin]);

  return (
    <NavigationContainer>
      <StatusBar translucent backgroundColor="transparent" />
      <StackNavigator />
    </NavigationContainer>
  );
}