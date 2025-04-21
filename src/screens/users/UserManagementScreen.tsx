import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '~/components/AppHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '~/store/useAppStore';
import { useEffect, useState, useCallback } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const UserManagementScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { users, boilers, boilerUsers } = useAppStore();

  const [selectedBoiler, setSelectedBoiler] = useState<string>('all');
  const [filteredUsers, setFilteredUsers] = useState(users);

  const [open, setOpen] = useState(false);
  const [boilerOptions, setBoilerOptions] = useState<any[]>([]);

  useEffect(() => {
    // Chuyển boilers thành danh sách DropDown options
    const options = [
      { label: 'Tất cả', value: 'all' },
      { label: 'Không thuộc lò hơi', value: 'unassigned' },
      ...boilers.map((b) => ({
        label: b.name,
        value: b.id.toString(),
      })),
    ];
    setBoilerOptions(options);
  }, [boilers]);

  const filterUsers = useCallback(() => {
    if (selectedBoiler === 'all') {
      setFilteredUsers(users);
    } else if (selectedBoiler === 'unassigned') {
      const assignedUserIds = boilerUsers.map((bu) => bu.userId);
      setFilteredUsers(users.filter((u) => !assignedUserIds.includes(u.id)));
    } else {
      setFilteredUsers(
        users.filter((user) =>
          boilerUsers.some(
            (bu) =>
              bu.userId === user.id && bu.boilerId === Number(selectedBoiler)
          )
        )
      );
    }
  }, [selectedBoiler, users, boilerUsers]);

  useEffect(() => {
    filterUsers();
  }, [selectedBoiler, users, boilerUsers]);

  return (
    <View className="flex-1 bg-gray-50">
      <AppHeader title="Quản lý nhân viên" onBackPress={navigation.goBack} />

      {/* Bộ lọc Boiler */}
      <View className="px-4 py-4 bg-white z-10">
        <Text className="mb-2 text-base font-semibold text-gray-700">
          Lọc theo lò hơi
        </Text>
        <DropDownPicker
          open={open}
          value={selectedBoiler}
          items={boilerOptions}
          setOpen={setOpen}
          setValue={setSelectedBoiler}
          setItems={setBoilerOptions}
          placeholder="Chọn lò hơi"
          style={{ borderColor: '#E5E7EB' }}
          dropDownContainerStyle={{ borderColor: '#E5E7EB' }}
          textStyle={{ fontSize: 14 }}
        />
      </View>

      {/* Danh sách người dùng */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('UserDetail', { user: item })}
            className="flex-row items-center bg-white p-4 mb-3 rounded-xl shadow-sm"
          >
            <Image
              source={{ uri: item.profilePicture || '' }}
              className="w-12 h-12 rounded-full mr-4 bg-gray-200"
            />
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-800">
                {item.fullName}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-xs text-gray-500">{item.department}</Text>
                <Text className="text-xs text-gray-400 mx-1">•</Text>
                <Text className="text-xs text-gray-500">{item.registrationDate}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="justify-center items-center mt-20">
            <Text className="text-gray-500">Không tìm thấy nhân viên nào</Text>
          </View>
        }
      />

      {/* Nút thêm nhân viên */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-600 rounded-full p-4 shadow-lg"
        onPress={() => navigation.navigate('CreateUser')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default UserManagementScreen;
