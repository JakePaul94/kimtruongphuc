import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import { RootStackParamList } from '~/navigation/AppNavigator';
import { format, parseISO, differenceInDays } from 'date-fns';
import { FontAwesome } from '@expo/vector-icons';
import clsx from 'clsx';
import Navbar from '~/components/Navbar';
import { DeviceAttributes } from '~/types/deviceType';
import { useAppStore } from '~/store/useAppStore';
import { useAuthStore } from '~/store/authStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DeviceScreen() {
  const [allDevices, setAllDevices] = useState<DeviceAttributes[]>([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState<'all' | 'main' | 'component'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'nearMaintenance' | 'nearInspection'>('all');

  const { boilers, boilerDevices, boilerUsers, users, fetchInitialData, devices } = useAppStore();
  const { user } = useAuthStore();
  const navigation = useNavigation<NavigationProp>();

  const deviceTypeOptions: { label: string; value: 'all' | 'main' | 'component' }[] = [
    { label: 'Tất cả loại', value: 'all' },
    { label: 'Thiết bị chính', value: 'main' },
    { label: 'Linh kiện/Phụ thuộc', value: 'component' },
  ];

  const statusFilterOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Gần bảo trì', value: 'nearMaintenance' },
    { label: 'Gần kiểm định', value: 'nearInspection' },
  ];

  useEffect(() => {
    if (user) {
      const boilerId = boilerUsers.find((t) => t.userId === user.id)?.boilerId;
      if (boilerId) {
        const deviceIds = boilerDevices
          .filter((bd) => bd.boilerId === boilerId)
          .map((bd) => bd.deviceId);

        // Lọc danh sách devices theo deviceIds
        const filterDevices = devices.filter((device) => deviceIds.includes(device.id));
        setAllDevices(filterDevices);
      }
    }
  }, [devices, boilers, users, boilerDevices, boilerUsers]);

  // Hàm kiểm tra trạng thái gần bảo trì và gần kiểm định
  const getDeviceStatus = (device: DeviceAttributes) => {
    const today = new Date();
    const daysToNextMaintenance = device.nextMaintenanceDate ? differenceInDays(parseISO(device.nextMaintenanceDate), today) : null;
    const daysToNextInspection = device.nextInspectionDate ? differenceInDays(parseISO(device.nextInspectionDate), today) : null;

    // Trạng thái gần bảo trì (dưới 7 ngày)
    const isNearMaintenance = daysToNextMaintenance !== null && daysToNextMaintenance <= 7 && daysToNextMaintenance >= 0;
    // Trạng thái gần kiểm định (dưới 7 ngày)
    const isNearInspection = daysToNextInspection !== null && daysToNextInspection <= 7 && daysToNextInspection >= 0;

    return {
      isNearMaintenance,
      isNearInspection,
    };
  };

  // Hàm lọc thiết bị dựa trên loại và trạng thái
  const filteredDevices = allDevices.filter((device) => {
    // Lọc theo loại thiết bị
    const matchesType =
      selectedDeviceType === 'all';

    // Lọc theo trạng thái gần bảo trì/kiểm định
    const { isNearMaintenance, isNearInspection } = getDeviceStatus(device);
    let matchesStatus = true;

    if (selectedStatus === 'nearMaintenance') {
      matchesStatus = isNearMaintenance;
    } else if (selectedStatus === 'nearInspection') {
      matchesStatus = isNearInspection;
    }

    return matchesType && matchesStatus;
  });

  // --- Hàm render item và date status giữ nguyên ---
  const renderDateStatus = (dateStr: string, label: string) => {
    if (!dateStr) return null;
    try {
      const date = parseISO(dateStr);
      const daysLeft = differenceInDays(date, new Date());
      const color =
        daysLeft <= 0 ? 'text-red-500' : daysLeft <= 7 ? 'text-yellow-500' : 'text-green-600';
      const icon = daysLeft <= 0 ? 'exclamation-circle' : 'calendar-check-o';
      return (
        <View className="flex-row items-center gap-1">
          <FontAwesome name={icon as any} size={14} color="gray" />
          <Text className={clsx('text-sm', color)}>{label}: {format(date, 'dd/MM/yyyy')} ({daysLeft <= 0 ? 'quá hạn' : `còn ${daysLeft} ngày`})</Text>
        </View>
      );
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return <Text className="text-xs text-red-500">{label}: Ngày không hợp lệ</Text>;
    }
  };

  const renderItem = ({ item }: { item: DeviceAttributes }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DeviceDetail', { deviceId: item.id })}
      className="m-2 rounded-2xl bg-white p-4 shadow-md">
      <Text className="text-xl font-semibold text-gray-800">{item.deviceName}</Text>
      <Text className="text-sm text-gray-600">Mã thiết bị: {item.deviceCode}</Text>
      <Text className="mb-2 text-sm text-gray-500">Trạng thái: {item.usageStatus}</Text>
      {item.nextMaintenanceDate && renderDateStatus(item.nextMaintenanceDate, 'Bảo trì')}
      {item.nextInspectionDate && renderDateStatus(item.nextInspectionDate, 'Kiểm định')}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <Navbar />
      <View className="flex flex-row h-16 justify-between bg-white p-2 shadow-md">
        <View className="w-1/2 h-12 border-r border-green-200 bg-white px-3 pt-2">
          <View className="justify-center">
            <Picker
              selectedValue={selectedStatus}
              onValueChange={(itemValue) => setSelectedStatus(itemValue)}
              style={{ height: 40 }}
              mode="dialog">
              {statusFilterOptions.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="w-1/2 h-12 bg-white px-3 pt-2">
          <View className="justify-center">
            <Picker
              selectedValue={selectedDeviceType}
              onValueChange={(itemValue) => setSelectedDeviceType(itemValue)}
              style={{ height: 40 }}
              mode="dialog">
              {deviceTypeOptions.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <Text className="p-6 text-center text-xl font-bold">
        Danh sách thiết bị ({filteredDevices.length})
      </Text>

      <View className="flex-1">
        <FlatList
          data={filteredDevices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 12, paddingTop: 5 }}
          ListEmptyComponent={
            <View className="items-center justify-center p-10">
              <Text className="text-gray-500">Không tìm thấy thiết bị nào phù hợp.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
