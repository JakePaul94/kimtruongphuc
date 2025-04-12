import { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useAuthStore } from '~/store/authStore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '~/navigation/AppNavigator';

type MenuProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function Menu({ isVisible, onClose }: MenuProps) {
  const { logout, user } = useAuthStore();
  const navigation = useNavigation<any>();
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -300,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [isVisible, slideAnim]);

  const handleLogout = async () => {
    await logout();
    onClose();
    navigation.replace('Login');
  };

  const navigateToProfile = () => {
    onClose();
    navigation.navigate('Profile');
  };

  const navigateToSettings = () => {
    onClose();
    navigation.navigate('Settings' as keyof RootStackParamList);
  };

  return (
    <Modal visible={isVisible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/20">
          <Animated.View
            style={{
              transform: [{ translateX: slideAnim }],
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '75%',
            }}
            className="bg-white shadow-xl z-50"
          >
            <View className="p-6 border-b border-gray-200 flex-row items-center gap-4">
              <Image
                source={{
                  uri:
                    user?.profilePicture ||
                    'https://photographer.vn/wp-content/uploads/2017/07/chup-anh-the-6.jpg',
                }}
                className="h-12 w-12 rounded-full"
              />
              <Text className="text-lg font-semibold text-black">
                {user?.fullName}
              </Text>
            </View>

            <TouchableOpacity
              onPress={navigateToProfile}
              className="p-4 border-b border-gray-200 flex-row gap-4 items-center"
            >
              <Ionicons name="person-outline" size={22} color="gray" />
              <Text className="text-base text-black">Hồ sơ của tôi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={navigateToSettings}
              className="p-4 border-b border-gray-200 flex-row gap-4 items-center"
            >
              <Ionicons name="settings-outline" size={22} color="gray" />
              <Text className="text-base text-black">Cài đặt</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="p-4 flex-row gap-4 items-center"
            >
              <Ionicons name="log-out-outline" size={22} color="red" />
              <Text className="text-base text-red-500 font-semibold">
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
