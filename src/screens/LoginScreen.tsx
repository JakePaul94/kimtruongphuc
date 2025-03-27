import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

import { useAuthStore } from '../store/authStore';

import { RootStackParamList } from '~/navigation/AppNavigator';
import { useEffect } from 'react';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login, isAuthenticated } = useAuthStore();
  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Main'); // Điều hướng khi đã đăng nhập
    }
  }, [isAuthenticated]);

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-6">
      <Text className="mb-6 text-2xl font-bold">Đăng nhập</Text>
      <TextInput placeholder="Email" className="mb-4 w-full rounded-md border p-3" />
      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry
        className="mb-4 w-full rounded-md border p-3"
      />
      <TouchableOpacity onPress={login} className="w-full rounded-md bg-blue-500 p-3">
        <Text className="text-center font-bold text-white underline">Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}
