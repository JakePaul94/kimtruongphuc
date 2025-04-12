import { View, Text, TouchableOpacity, ScrollView ,Image} from 'react-native';
import { useAuthStore } from '~/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { StackScreenProps } from '@react-navigation/stack';

type MyProfileScreenProps = StackScreenProps<RootStackParamList, 'Profile'>;

const ProfileItem = ({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string | undefined | null;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="mb-2 flex-row items-center justify-between rounded-md border border-gray-200 bg-white p-4">
    <Text className="text-lg text-gray-800">{label}</Text>
    <View className="flex-row items-center">
      <Text className="mr-2 text-lg font-semibold text-gray-800">{value || '-'}</Text>
      <Ionicons name="chevron-forward-outline" size={20} color="gray" />
    </View>
  </TouchableOpacity>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Text className="mb-2 mt-6 text-sm font-semibold uppercase text-gray-500">{title}</Text>
);

export default function MyProfileScreen({ navigation }: MyProfileScreenProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navigateToChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View className="flex h-32 w-full flex-row justify-center">
        <Image
          src="https://photographer.vn/wp-content/uploads/2017/07/chup-anh-the-6.jpg"
          className="h-24 w-24 rounded-full"
        />
      </View>

      <SectionTitle title="Thông tin cá nhân" />
      <ProfileItem label="Họ và tên" value={user?.fullName} />
      <ProfileItem label="Email" value={user?.email} />
      <ProfileItem label="Số điện thoại" value={user?.phoneNumber} />
      <ProfileItem label="Vai trò" value={user?.role} />
      {/* Thêm các thông tin cá nhân khác mà bạn muốn hiển thị */}

      <SectionTitle title="Tài khoản" />
      <ProfileItem label="Đổi mật khẩu" value={undefined} onPress={navigateToChangePassword} />
      {/* Thêm các tùy chọn tài khoản khác nếu cần */}

      <TouchableOpacity
        className="mt-8 items-center justify-center rounded-md bg-red-500 py-3"
        onPress={handleLogout}>
        <Text className="text-lg font-semibold text-white">Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
