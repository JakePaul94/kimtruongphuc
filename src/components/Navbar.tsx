import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity, Platform,StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '~/store/authStore';
import Menu from './Menu'; // Import component Menu


type NavbarProps = {
  onNotificationPress?: () => void;
};

export default function Navbar({ onNotificationPress }: NavbarProps) {
  const user = useAuthStore((state) => state.user);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;
  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setIsMenuVisible(false);
  };

  return (
    <View  className="fixed top-0 h-24 w-full flex-col items-center justify-start bg-transparent border-b border-gray-200 shadow-sm z-10">
      
      <LinearGradient
        colors={['#ffffff', '#ffffff']}
        className="h-24 w-full flex-row items-center justify-between px-4"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <View className="flex-row items-center gap-4">
          <Image
            src={user?.profilePicture || require('../../assets/adaptive-icon.png')}
            className="h-8 w-8 rounded-full"
          />
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
      </LinearGradient>

      <Menu isVisible={isMenuVisible} onClose={handleCloseMenu} />
    </View>
  );
}