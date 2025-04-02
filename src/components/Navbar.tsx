import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity,PixelRatio ,StyleSheet} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
type NavbarProps = {
  title?: string;
  onNotificationPress?: () => void;
  onMenuPress?: () => void;
};

export default function Navbar({
  title = 'Xin chào, User!',
  onNotificationPress,
  onMenuPress,
}: NavbarProps) {
  return (
    <View
      className="fixed top-0 h-32  border-b-1 w-full flex-col items-center justify-start bg-transparent "
      style={styles.navbar}>
      <LinearGradient
        colors={['#f9fbfd', '#f7fdff']}
        className="h-8 w-full flex-row items-center justify-between px-4"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <LinearGradient
        colors={['#ffffff', '#f3f3fc']}
        className="h-24 w-full flex-row items-center justify-between px-4"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <View className="flex-row items-center gap-4">
          <Image
            src="https://photographer.vn/wp-content/uploads/2017/07/chup-anh-the-6.jpg"
            className="h-8 w-8 rounded-full"
          />
          <Text className="text-lg font-bold text-black">{title}</Text>
        </View>
        <View className="flex-row items-center  " style={styles.navbarFooter}>
          <TouchableOpacity onPress={onNotificationPress}>
            <Ionicons name="notifications-outline" size={24} color="black" className="mr-4" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onMenuPress}>
            <Ionicons name="menu-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
const styles = StyleSheet.create({
  navbar: {
    borderBottomWidth: 1 / PixelRatio.get(), 
    borderBottomColor: '#e5e7eb', 
    elevation: 1
  },navbarFooter :{
    borderBottomWidth: 1 / PixelRatio.get(), 
    borderBottomColor: '#e5e7eb', 
  }
});