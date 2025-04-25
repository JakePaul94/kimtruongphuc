import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '~/store/useAppStore';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '~/navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const login = useAuthStore(state => state.login);
  const loading = useAuthStore(state => state.loading);
  const error = useAuthStore(state => state.error);
  const setFirstLoginHandled = useAuthStore(state => state.setFirstLoginHandled);
  const fetchInitialData = useAppStore((state) => state.fetchInitialData);
  const fetchIniDataLoading = useAppStore((state) => state.fetchIniDataLoading);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);


  useEffect(() => {
    const loadSavedIdentifier = async () => {
      const saved = await SecureStore.getItemAsync('savedIdentifier');
      if (saved) {
        setIdentifier(saved);
        setRememberMe(true);
      }
    };
    loadSavedIdentifier();
  }, []);

  // Log trạng thái từ store để kiểm tra thay đổi


  const handleLogin = async () => {
    setLocalError(null);
    useAuthStore.setState({ error: null });

    if (!identifier || !password) {
      setLocalError('Vui lòng điền đầy đủ Email/SĐT và mật khẩu.');
      return;
    }

    if (rememberMe) {
      await SecureStore.setItemAsync('savedIdentifier', identifier);
    } else {
      await SecureStore.deleteItemAsync('savedIdentifier');
    }

    const loginSuccess = await login(identifier, password);

    if (loginSuccess) {
      console.log('Đăng nhập thủ công thành công.');
      const userNow = useAuthStore.getState().user;
      const firstLoginHandledNow = useAuthStore.getState().firstLoginHandled;

      if (userNow) {
        const fetchDataSuccess = await fetchInitialData();
        if (fetchDataSuccess) {
          if (userNow.firstLogin && !firstLoginHandledNow) {
            console.log('Phát hiện đăng nhập lần đầu, điều hướng đến ChangePassword...');
            setFirstLoginHandled(true);
            navigation.replace('ChangePassword');
          } else {
            console.log('Không phải đăng nhập lần đầu hoặc đã xử lý, điều hướng đến Main...');
            navigation.replace('Main');
          }
        } else {
          console.error('Tải dữ liệu ban đầu thất bại sau khi đăng nhập.');
          useAuthStore.getState().logout();
          setLocalError('Không thể tải dữ liệu cần thiết. Vui lòng thử lại.');
        }
      } else {
        console.error('Login successful but user data is missing.');
        useAuthStore.getState().logout();
        setLocalError('Lỗi dữ liệu người dùng không hợp lệ.');
      }
    } else {
      console.log('Đăng nhập thủ công thất bại.');
    }
  };

  // Log render
  console.log('LoginScreen render');

  const displayError = error || localError;
  const isLoading = loading || fetchIniDataLoading;

  return (
    <View className="flex-1 items-center justify-start gap-4 bg-white px-6 py-10">
      <Image
        source={require('../../assets/adaptive-icon.png')}
        style={{ width: 150, height: 150, marginBottom: 20 }}
      />
      <View className="flex w-full flex-col gap-4">
        <View className="flex-row items-center border-b border-gray-300 pb-2">
          <FontAwesome name="envelope" size={20} color="gray" className="mr-3" />
          <TextInput
            placeholder="Email/Phone Number"
            className="flex-1 py-2 text-base"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="flex-row items-center border-b border-gray-300 pb-2">
          <Ionicons name="lock-closed" size={20} color="gray" className="mr-3" />
          <TextInput
            placeholder="Password"
            className="flex-1 py-2 text-base"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>
      <View className="mt-4 w-full flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => setRememberMe(!rememberMe)}
          className="flex-row items-center py-2"
        >
          <View
            className={`mr-2 h-5 w-5 items-center justify-center rounded border ${rememberMe ? 'border-green-500 bg-green-500' : 'border-gray-400'}`}
          >
            {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
          </View>
          <Text className="text-gray-600">Ghi nhớ đăng nhập</Text>
        </TouchableOpacity>
      </View>

      {displayError && <Text className="mt-2 w-full text-left text-red-500">{displayError}</Text>}

      <TouchableOpacity
        className={`mt-8 w-full items-center rounded-full px-6 py-3 ${isLoading ? 'bg-gray-400' : 'bg-green-500'}`}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-lg font-semibold text-white">Đăng Nhập</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}