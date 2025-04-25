import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '~/store/authStore';
import Menu from './Menu'; // Import component Menu

type NavbarProps = {
  onNotificationPress?: () => void;
};

export default function Navbar({ onNotificationPress }: NavbarProps) {
  const user = useAuthStore((state) => state.user);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setIsMenuVisible(false);
  };
  const profileSource = user?.profilePicture
    ? { uri: user.profilePicture }
    : require('../assets/default-avatar.png');

  return (
    <View className="fixed top-0 z-10 h-32 w-full flex-col items-center justify-start bg-transparent shadow-sm">
      <View className="h-8 w-full bg-white"></View>
      <View className="h-24 w-full flex-row items-center justify-between bg-white px-4">
        <View className="flex-row items-center gap-4">
          <Image source={profileSource} className="h-8 w-8 rounded-full" />
          <Text className="text-lg font-bold text-black">{user?.fullName}</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onNotificationPress} className="mr-4">
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMenuPress}>
            <Ionicons name="menu-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Menu isVisible={isMenuVisible} onClose={handleCloseMenu} />
    </View>
  );
}
