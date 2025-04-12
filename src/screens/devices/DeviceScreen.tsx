import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { getDevicesForMe } from '~/apis/deviceApi';
import { format, parseISO, differenceInDays } from 'date-fns';
import { FontAwesome } from '@expo/vector-icons';
import clsx from 'clsx';
import Navbar from '~/components/Navbar';

interface Device {
  id: number;
  deviceCode: string;
  deviceName: string;
  parentId?: number | null;
  boilerId?: number | null;
  model?: string;
  brand?: string;
  origin?: string;
  yearOfManufacture?: number;
  serialNumber?: string;
  usageStatus: string;
  installationDate?: string;
  warrantyExpiration?: string;
  imageUrl: string;
  location?: string;
  value?: number;
  department?: string;
  manager?: string;
  maintenanceCycle?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate: string;
  operatingHours?: number;
  maintenanceHistory?: string;
  depreciationValue?: number;
  lastChecked?: string;
  isUnderWarranty?: boolean;
  locationDetails?: string;
  isNeedMaintenance?: boolean;
  lastInspectionDate?: string;
  nextInspectionDate: string;
  inspectionHistory?: string;
  inspectionStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DeviceScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await getDevicesForMe();
        const devices = data.map((item) => item.device);
        setDevices(devices);
        console.log('Danh sách thiết bị:', devices);
      } catch (err) {
        console.error('Lỗi khi tải danh sách thiết bị', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const renderDateStatus = (dateStr: string, label: string) => {
    if (!dateStr) return null;
    const date = parseISO(dateStr);
    const daysLeft = differenceInDays(date, new Date());

    const color =
      daysLeft <= 0 ? 'text-red-500' : daysLeft <= 7 ? 'text-yellow-500' : 'text-green-600';
    const icon = daysLeft <= 0 ? 'exclamation-circle' : 'calendar-check-o';

    return (
      <View className="flex-row items-center gap-1">
        <FontAwesome name={icon as any} size={14} color="gray" />
        <Text className={clsx('text-sm', color)}>
          {label}: {format(date, 'dd/MM/yyyy')} (
          {daysLeft <= 0 ? 'quá hạn' : `còn ${daysLeft} ngày`})
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Device }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DeviceDetail', { deviceId: item.id })}
      className="m-2 rounded-2xl bg-white p-4 shadow-md">
      <Text className="text-xl font-semibold text-gray-800">{item.deviceName}</Text>
      <Text className="text-sm text-gray-600">Mã thiết bị: {item.deviceCode}</Text>
      <Text className="mb-2 text-sm text-gray-500">Trạng thái: {item.usageStatus}</Text>
      {renderDateStatus(item.nextMaintenanceDate, 'Bảo trì')}
      {renderDateStatus(item.nextInspectionDate, 'Kiểm định')}
    </TouchableOpacity>
  ); 

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#1e40af" />
        <Text className="mt-4 text-base text-gray-500">Đang tải thiết bị...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Navbar/>
    
      <View className="flex-1">
        <FlatList
          
          data={devices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
          ListHeaderComponent={
            <Text className="text-xl text-center font-bold mb-4">Danh sách thiết bị</Text>
          }
        />
      </View>
    </View>
  );
}
