import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity,Image } from 'react-native';

import { useAuthStore } from '../store/authStore';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { useEffect } from 'react';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Main'); // Điều hướng khi đã đăng nhập
    }
  }, [isAuthenticated]);

  return (
    <View className="flex-1 bg-white px-6 py-12 items-center justify-center">
      {/* Logo */}
      <Image  source={require('../../assets/adaptive-icon.png')} style={{ width: 200, height: 200 }}></Image>

      {/* Input Fields */}
      <View className="w-full space-y-4">
        <View className="border-b border-gray-300 flex-row items-center pb-2">
          <FontAwesome name="envelope" size={20} color="gray" className="mr-2" />
          <TextInput
            placeholder="Email/Phone Number"
            className="flex-1 text-base"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        
        <View className="border-b border-gray-300 flex-row items-center pb-2">
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

      {/* Remember Me & Forgot Password */}
      <View className="w-full flex-row justify-between items-center mt-4">
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} className="flex-row items-center">
          <View className={`w-5 h-5 border rounded-sm mr-2 ${rememberMe ? 'bg-red-500' : 'border-gray-400'}`} />
          <Text className="text-gray-600">Remember me</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-red-500 font-semibold">Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity className="bg-green-500 py-3 px-6 rounded-full mt-6 w-full items-center" onPress={()=>{login()}}>
        <Text className="text-white text-lg font-semibold">Login</Text>
      </TouchableOpacity>

     

     
    </View>
  );
}
