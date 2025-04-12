import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

import { useAuthStore } from '../store/authStore';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { useEffect } from 'react';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login, isAuthenticated, user, firstLoginHandled, error,setFirstLoginHandled } = useAuthStore();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  useEffect(() => {
    console.log('isAuthenticated in useEffect:', isAuthenticated);
    console.log('user in useEffect:', user);
    console.log('firstLoginHandled in useEffect:', firstLoginHandled);
    if (isAuthenticated && user) {
      if (user.firstLogin && !firstLoginHandled) {
        console.log('Navigating to ChangePassword (first login)');
        navigation.replace('ChangePassword');
        setFirstLoginHandled(true); // Cập nhật state trong store
      } else {
        console.log('Navigating to Main (not first login)');
        navigation.replace('Main');
      }
    } else {
      console.log('isAuthenticated hoặc user là false trong useEffect');
    }
  }, [isAuthenticated, user, firstLoginHandled, navigation, setFirstLoginHandled]); 
  const handleLogin = async () => {
    if (!identifier || !password) {
      useAuthStore.setState({ error: 'Vui lòng điền đầy đủ thông tin.' });
      return;
    }

    await login(identifier, password);
  };
  return (
    <View className="flex-1 items-center justify-start gap-4 bg-white px-6 py-2">
      <Image
        source={require('../../assets/adaptive-icon.png')}
        style={{ width: 200, height: 200 }}></Image>
      <View className="flex w-full flex-col gap-6 space-y-2">
        <View className="flex-row items-center border-b border-gray-300 pb-2">
          <FontAwesome name="envelope" size={20} color="gray" className="mr-2" />
          <TextInput
            placeholder="Email/Phone Number"
            className="flex-1 text-base"
            value={identifier}
            onChangeText={setIdentifier}
          />
        </View>

        <View className="flex-row items-center border-b border-gray-300 pb-2">
          <Ionicons name="lock-closed" size={20} color="gray" className="mr-2" />
          <TextInput
            placeholder="Password"
            className="flex-1 text-base"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>
      <View className="mt-4 w-full flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => setRememberMe(!rememberMe)}
          className="flex-row items-center">
          <View className="mr-2 h-5 w-5 items-center justify-center rounded-sm border border-gray-400">
            {rememberMe && <View className="h-3 w-3 rounded-sm bg-green-500" />}
          </View>
          <Text className="text-gray-600">Remember me</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="font-semibold text-red-500">Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      {error && (
        <Text className="mt-2 w-full text-left text-red-500">{error}</Text>
      )}
      <TouchableOpacity
        className="mt-10 w-full items-center rounded-full bg-green-500 px-6 py-3"
        onPress={handleLogin}>
        <Text className="text-lg font-semibold text-white">Đăng Nhập</Text>
      </TouchableOpacity>
    </View>
  );
}
