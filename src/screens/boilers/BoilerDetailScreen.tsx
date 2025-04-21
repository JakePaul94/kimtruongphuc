import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '~/components/AppHeader';
import { UserAttributes } from '~/types/userType';
import { DeviceAttributes } from '~/types/deviceType';
import { getBoilerById, getBoilerDevices, getBoilerUsers } from '~/apis/boilerApi';
import { BoilerAttributes, GetBoilerByIdResponseType } from '~/types/boilerType';
import { useAppStore } from '~/store/useAppStore';

// Define the navigation param list
type RootStackParamList = {
  BoilerDetail: { boilerId: number };
};

interface EmployeeDisplayProps {
  id: number;
  name: string;
  role: string;
  phoneNumber: string | null | undefined;
}
type BoilerDetailRouteProp = RouteProp<RootStackParamList, 'BoilerDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BoilerDetailScreen: React.FC = () => {
  const route = useRoute<BoilerDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const boilerId = route.params?.boilerId;
  const boiler = useAppStore((state) => state.boilers).find((b) => b.id === boilerId);
  const { users, boilerUsers, devices, boilerDevices } = useAppStore();
  const [employees, setEmployees] = useState<EmployeeDisplayProps[]>([]);
  const [equipment, setEquipment] = useState<Partial<DeviceAttributes>[]>([]);
  const [activeTab, setActiveTab] = useState<'employees' | 'equipment'>('employees');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [errorDevices, setErrorDevices] = useState<string | null>(null);
  const [loadingBoiler, setLoadingBoiler] = useState(true); // Khởi tạo là true vì ban đầu đang tải
  const [errorBoiler, setErrorBoiler] = useState<string | null>(null);

  useEffect(() => {
    if (!boilerId) return;

    const filteredUsers = users.filter((user) =>
      boilerUsers.some((bu) => bu.boilerId === boilerId && bu.userId === user.id)
    );

    setEmployees(
      filteredUsers.map((item) => ({
        id: item.id,
        name: item.fullName,
        role: item.role,
        phoneNumber: item.phoneNumber,
      }))
    );

    const filteredDevices = devices.filter((device) =>
      boilerDevices.some((bd) => bd.boilerId === boilerId && bd.deviceId === device.id)
    );

    setEquipment(
      filteredDevices.map((item) => ({
        id: item.id,
        name: item.deviceName,
        status: item.usageStatus,
      }))
    );

    setLoadingUsers(false);
    setLoadingDevices(false);
    setLoadingBoiler(false);
  }, [boilerId, users, devices, boilerUsers, boilerDevices]);
  const handleCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber.trim()}`; // Trim whitespace from phone number
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log(`Cannot open phone URL: ${url}`);
        }
      })
      .catch((err) => console.error('Error opening phone URL:', err));
  };

  const renderEmployee = ({
    item,
  }: {
    item: { id: number; name: string; role: string; phoneNumber: string };
  }) => (
    <View className="mb-2 flex-row items-center justify-between rounded-lg bg-white p-3 shadow-sm">
      <View>
        <Text className="text-base font-semibold">{item.name}</Text>
        <Text className="text-sm text-gray-600">{item.role}</Text>
      </View>
      <TouchableOpacity onPress={() => handleCall(item.phoneNumber)}>
        <Ionicons name="call" size={24} color="#39cf5e" />
      </TouchableOpacity>
    </View>
  );

  const renderEquipment = ({ item }: { item: { id: number; name: string; status: string } }) => (
    <View className="mb-2 rounded-lg bg-white p-3 shadow-sm">
      <Text className="text-base font-semibold">{item.name}</Text>
      <Text className="text-sm text-gray-600">Trạng thái: {item.status}</Text>
    </View>
  );

  if ((boilerId === undefined || !boiler) && !loadingBoiler) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg text-red-500">Lỗi: Không tìm thấy thông tin lò hơi.</Text>
        <TouchableOpacity
          className="mt-4 rounded-lg bg-green-500 p-3"
          onPress={() => navigation.goBack()}>
          <Text className="font-semibold text-white">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (loadingBoiler) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="green" />
        <Text className="mt-2 text-gray-500">Đang tải thông tin lò hơi...</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader title="Thông tin lò hơi" onBackPress={navigation.goBack} />
      <View className="flex-1 p-4">
        {/* Boiler Details */}
        {boiler && (
          <View className="mb-4 rounded-lg bg-white p-4 shadow-md">
            <Text className="text-xl font-bold text-green-600">Chi Tiết Lò Hơi</Text>
            <Text className="mt-3 text-lg font-semibold">{boiler.name}</Text>
            <Text className="mt-2 text-gray-700">{boiler.location}</Text>
            <Text className="mt-2 text-gray-600">{boiler.description}</Text>
          </View>
        )}

        {/* Tabs */}
        <View className="mb-4 flex-row">
          <TouchableOpacity
            className={`flex-1 rounded-t-lg p-3 ${activeTab === 'employees' ? 'bg-green-500' : 'bg-gray-300'}`}
            onPress={() => setActiveTab('employees')}>
            <Text
              className={`text-center font-semibold ${activeTab === 'employees' ? 'text-white' : 'text-gray-700'}`}>
              Nhân viên
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 rounded-t-lg p-3 ${activeTab === 'equipment' ? 'bg-green-500' : 'bg-gray-300'}`}
            onPress={() => setActiveTab('equipment')}>
            <Text
              className={`text-center font-semibold ${activeTab === 'equipment' ? 'text-white' : 'text-gray-700'}`}>
              Thiết bị
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'employees' ? (
          loadingUsers ? (
            <View className="items-center justify-center">
              <ActivityIndicator size="large" color="green" />
            </View>
          ) : errorUsers ? (
            <View className="items-center justify-center">
              <Text className="text-red-500">{errorUsers}</Text>
              <TouchableOpacity
                onPress={() => {
                  setLoadingUsers(true);
                  setErrorUsers(null);
                  getBoilerUsers(boilerId)
                    .then((data) =>
                      setEmployees(
                        data.map((item) => ({
                          id: item.user.id,
                          name: item.user.fullName,
                          role: item.user.role,
                          phoneNumber: item.user.phoneNumber,
                        }))
                      )
                    )
                    .catch((err) => {
                      setErrorUsers('Không thể tải lại danh sách nhân viên.');
                      console.error('Lỗi tải lại danh sách nhân viên:', err);
                    })
                    .finally(() => setLoadingUsers(false));
                }}
                className="mt-2 rounded bg-blue-500 p-2">
                <Text className="text-white">Thử lại</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={employees as { id: number; name: string; role: string; phoneNumber: string }[]}
              renderItem={renderEmployee}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <Text className="text-center text-gray-500">Không có nhân viên</Text>
              }
            />
          )
        ) : loadingDevices ? (
          <View className="items-center justify-center">
            <ActivityIndicator size="large" color="green" />
          </View>
        ) : errorDevices ? (
          <View className="items-center justify-center">
            <Text className="text-red-500">{errorDevices}</Text>
            <TouchableOpacity
              onPress={() => {
                setLoadingDevices(true);
                setErrorDevices(null);
                getBoilerDevices(boilerId)
                  .then((data) =>
                    setEquipment(
                      data.map((item) => ({
                        id: item.device.id,
                        name: item.device.deviceName,
                        status: item.device.usageStatus,
                      }))
                    )
                  )
                  .catch((err) => {
                    setErrorDevices('Không thể tải lại danh sách thiết bị.');
                    console.error('Lỗi tải lại danh sách thiết bị:', err);
                  })
                  .finally(() => setLoadingDevices(false));
              }}
              className="mt-2 rounded bg-blue-500 p-2">
              <Text className="text-white">Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={equipment as { id: number; name: string; status: string }[]}
            renderItem={renderEquipment}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text className="text-center text-gray-500">Không có thiết bị</Text>
            }
          />
        )}
      </View>
    </View>
  );
};

export default BoilerDetailScreen;
