import React, { useRef, useEffect } from 'react'; // Added React import
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
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Import navigation prop type

// Define Navigation Prop Type specifically for Menu
type MenuNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// --- Reusable MenuItem Component (for navigation items) ---
type MenuItemProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  screenName: keyof RootStackParamList; // Target screen name
  navigation: MenuNavigationProp; // Pass navigation prop
  onNavigate: () => void; // Function to call before navigating (e.g., close menu)
};

const MenuItem: React.FC<MenuItemProps> = ({
  iconName,
  label,
  screenName,
  navigation,
  onNavigate,
}) => {
  const handlePress = () => {
    onNavigate(); // Close the menu first
    navigation.navigate(screenName as any);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center text-bold justify-between  border-gray-200 py-4 px-8">
      <View className="flex-row items-center gap-4">
        {/* <Ionicons name={iconName} size={22} color="green" /> */}
        <Text className="font-bold text-lg  text-black">{label}</Text>
      </View>

      <FontAwesome name="chevron-right" size={10} color={"#d0d0d0"}/>
    </TouchableOpacity>
  );
};
// --- End of MenuItem Component ---

type MenuProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function Menu({ isVisible, onClose }: MenuProps) {
  const { logout, user } = useAuthStore();
  // Use the specific navigation prop type
  const navigation = useNavigation<MenuNavigationProp>();
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : -300,
      duration: 250, // Slightly smoother duration
      easing: Easing.out(Easing.ease), // Smoother easing
      useNativeDriver: true,
    }).start();
  }, [isVisible, slideAnim]);

  const handleLogout = async () => {
    // Keep logout logic separate
    await logout();
    onClose();
    navigation.replace('Login');
  };

  // Common handler for menu items before navigation
  const handleNavigate = () => {
    onClose(); // Close the menu when any navigation item is pressed
  };

  return (
    <Modal visible={isVisible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/20" accessible={false}>
          {/* Added accessible={false} to overlay */}
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            {/* Stop propagation to prevent closing when clicking inside menu */}
            <Animated.View
              style={{
                transform: [{ translateX: slideAnim }],
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '75%',
              }}
              className="z-50 bg-white shadow-xl">
              {/* User Info Section */}
              <View className=" flex-row items-center gap-4 my-4 border-b border-gray-200 px-6 py-8">
                <Image
                  src={user?.profilePicture || require('../../assets/adaptive-icon.png')}
                  className="h-12 w-12 rounded-full"
                />
                <Text className="text-lg font-semibold text-black">{user?.fullName}</Text>
              </View>

              {/* Navigation Menu Items using the template */}
              <MenuItem
                iconName="person-outline"
                label="Hồ sơ của tôi"
                screenName="Profile" // Pass screen name
                navigation={navigation} // Pass navigation object
                onNavigate={handleNavigate} // Pass common handler
              />
              <MenuItem
                iconName="notifications-outline"
                label="Thông báo"
                screenName="Notifications" // <<<--- GIẢ SỬ TÊN MÀN HÌNH LÀ 'Notifications'
                navigation={navigation}
                onNavigate={handleNavigate}
              />

              {/* --- Admin Specific Menu Items --- */}
              {user?.role === 'admin' && ( // Kiểm tra vai trò admin
                <>
                  <MenuItem
                    iconName="server-outline" // hoặc flame-outline
                    label="Quản lý lò hơi"
                    screenName="BoilerManagement" // <<<--- GIẢ SỬ TÊN MÀN HÌNH
                    navigation={navigation}
                    onNavigate={handleNavigate}
                  />
                  <MenuItem
                    iconName="people-outline"
                    label="Quản lý nhân viên"
                    screenName="UserManagement" // <<<--- GIẢ SỬ TÊN MÀN HÌNH
                    navigation={navigation}
                    onNavigate={handleNavigate}
                  />
                  <MenuItem
                    iconName="list-outline" // hoặc hardware-chip-outline
                    label="Quản lý thiết bị"
                    screenName="DeviceManagement" // <<<--- GIẢ SỬ TÊN MÀN HÌNH (có thể là 'DeviceList'?)
                    navigation={navigation}
                    onNavigate={handleNavigate}
                  />
                  <MenuItem
                    iconName="briefcase-outline" // hoặc document-text-outline
                    label="Quản lý công việc"
                    screenName="CreateTask" // <<<--- GIẢ SỬ TÊN MÀN HÌNH
                    navigation={navigation}
                    onNavigate={handleNavigate}
                  />
                  <MenuItem
                    iconName="eye-outline" // hoặc analytics-outline
                    label="Theo dõi lò hơi"
                    screenName="BoilerMonitoring" // <<<--- GIẢ SỬ TÊN MÀN HÌNH
                    navigation={navigation}
                    onNavigate={handleNavigate}
                  />
                </>
              )}
              <MenuItem
                iconName="settings-outline"
                label="Cài đặt"
                screenName="Setting" // Pass screen name
                navigation={navigation} // Pass navigation object
                onNavigate={handleNavigate} // Pass common handler
              />

              {/* Logout Button (Kept Separate) */}
              {/* <TouchableOpacity
                onPress={handleLogout}
                className="flex-row items-center gap-4 p-4" // No bottom border
              >
                <Ionicons name="log-out-outline" size={22} color="red" />
                <Text className="text-base font-semibold text-red-500">Đăng xuất</Text>
              </TouchableOpacity> */}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
