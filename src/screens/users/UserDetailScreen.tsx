import { View, Text, Image, ScrollView } from 'react-native';
import AppHeader from '~/components/AppHeader';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'UserDetail'>;
const ProfileItem = ({ label, value }: { label: string; value?: string | null }) => (
  <View className="mb-2 flex-row items-center justify-between rounded-md border border-gray-200 bg-white p-4">
    <Text className="text-base text-gray-800">{label}</Text>
    <Text className="text-base font-medium text-gray-800">{value || 'Chưa cập nhật'}</Text>
  </View>
);
const SectionTitle = ({ title }: { title: string }) => (
  <Text className="mb-2 mt-6 text-sm font-semibold uppercase text-gray-500">{title}</Text>
);
const UserDetailScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { user } = route.params;

  const formatDate = (date: string | undefined) => {
    if (!date) return 'Chưa cập nhật';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader title="Chi tiết nhân viên" onBackPress={navigation.goBack} />

      <ScrollView className="flex-1">
        {/* Profile Section */}
        <View className="mx-4 mt-4 items-center rounded-xl bg-white p-6 shadow-sm">
          <Image
            source={{
              uri: user.profilePicture || 'https://via.placeholder.com/150',
            }}
            className="mb-4 h-32 w-32 rounded-full border-2 border-gray-200"
            defaultSource={{ uri: 'https://via.placeholder.com/150' }}
          />
          <Text className="text-2xl font-bold text-gray-800">
            {user.fullName || 'Chưa cập nhật'}
          </Text>
          <Text className="mt-1 text-base text-gray-500">{user.email || 'Chưa cập nhật'}</Text>
        </View>

        <View className='p-4'>
            <SectionTitle title="Thông tin chi tiết" />
            <ProfileItem label="📞 SĐT" value={user.phoneNumber?.trim()} />
            <ProfileItem label="🏢 Phòng ban" value={user.department} />
            <ProfileItem label="👤 Vai trò" value={user.role} />
            <ProfileItem label="📅 Ngày đăng ký" value={formatDate(user.registrationDate)} />
            <ProfileItem label="📍 Địa chỉ" value={user.address} />
            <ProfileItem label="🌍 Quốc gia" value={user.country} />
            <ProfileItem label="👫 Giới tính" value={user.gender} />
            <ProfileItem
              label="🎂 Ngày sinh"
              value={user.dateOfBirth && formatDate(user.dateOfBirth)}
            />
        </View>
      </ScrollView>
    </View>
  );
};

export default UserDetailScreen;
