import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '~/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/AppNavigator';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export default function ChangePasswordScreen() {
  const changePassword = useAuthStore(state => state.changePassword);
  const logout = useAuthStore(state => state.logout);
  const navigation = useNavigation<NavigationProp>();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp.');
      return;
    }

    try {
      setLoading(true);
      await changePassword(oldPassword, newPassword);
      await logout()
      Alert.alert('Thành công', 'Mật khẩu đã được thay đổi. Vui lòng đăng nhập lại.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Lỗi', 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-6">
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Lock Icon and Title */}
      <View className="items-center mb-8">
        <View className="bg-yellow-200 rounded-full p-4">
          <Ionicons name="lock-closed" size={48} color="orange" />
        </View>
        <Text className="text-xl font-bold mt-4">Đổi mật khẩu</Text>
        <Text className="text-center text-gray-500 mt-2 text-sm">
          Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn.
        </Text>
      </View>

      {/* Old Password Input */}
      <View className="mb-4 rounded-md bg-white border border-gray-300 flex-row items-center">
        <TextInput
          placeholder="Mật khẩu hiện tại"
          secureTextEntry={showOldPassword}
          value={oldPassword}
          onChangeText={setOldPassword}
          className="flex-1 p-3"
        />
        <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} className="pr-3">
          <Ionicons name={showOldPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* New Password Input */}
      <View className="mb-4 rounded-md bg-white border border-gray-300 flex-row items-center">
        <TextInput
          placeholder="Mật khẩu mới"
          secureTextEntry={showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
          className="flex-1 p-3"
        />
        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} className="pr-3">
          <Ionicons name={showNewPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Confirm New Password Input */}
      <View className="mb-6 rounded-md bg-white border border-gray-300 flex-row items-center">
        <TextInput
          placeholder="Xác nhận mật khẩu mới"
          secureTextEntry={showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          className="flex-1 p-3"
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="pr-3">
          <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Confirm Change Button */}
      <TouchableOpacity
        className="mt-8 items-center justify-center rounded-md bg-red-500 py-3"
        onPress={handleChangePassword}
        disabled={loading}>
        <Text className="text-white font-bold text-lg">
          {loading ? 'Đang xử lý...' : 'Xác nhận thay đổi'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}