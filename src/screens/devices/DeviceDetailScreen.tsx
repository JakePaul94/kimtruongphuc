// screens/devices/DeviceDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { getDeviceById } from '~/apis/deviceApi';
import { formatDateFromIsoToDDMMYY } from '~/utils/timeHelper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DeviceDetailRouteProp = RouteProp<RootStackParamList, 'DeviceDetail'>;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateIncidentReport'>;

const ProfileItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined | null | boolean;
}) => (
  <View className="mb-2 flex-row items-center justify-between rounded-md border border-gray-200 bg-white p-4">
    <Text className="text-base text-gray-800">{label}</Text>
    <Text className="text-base font-semibold text-gray-800">
      {typeof value === 'boolean' ? (value ? '✅' : '❌') : (value ?? '-')}
    </Text>
  </View>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Text className="mb-2 mt-6 text-sm font-semibold uppercase text-gray-500">{title}</Text>
);

export default function DeviceDetailScreen() {
  const route = useRoute<DeviceDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { deviceId } = route.params as { deviceId: number };
  console.log('deviceId', deviceId);
  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const data = await getDeviceById(deviceId);
        setDevice(data);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết thiết bị', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevice();
  }, [deviceId]);

  if (loading) return <ActivityIndicator className="mt-10" />;
  if (!device)
    return <Text className="mt-10 text-center text-red-500">Không tìm thấy thiết bị</Text>;

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View className="mb-6 items-center">
        {device.imageUrl ? (
          <Image source={{ uri: device.imageUrl }} className="h-32 w-32 rounded-xl" />
        ) : (
          <View className="h-32 w-32 items-center justify-center rounded-xl bg-gray-200">
            <Ionicons name="image-outline" size={40} color="gray" />
          </View>
        )}
        <Text className="mt-4 text-xl font-bold text-gray-800">{device.deviceName}</Text>
        <Text className="text-sm text-gray-500">{device.deviceCode}</Text>
      </View>
      <View className="mb-6 flex-row justify-between">
        <TouchableOpacity
          onPress={() => {
            // điều hướng đến màn hình tạo bảo trì
          }}
          disabled={!device.isNeedMaintenance}
          className={`mr-2 flex-1 items-center justify-center rounded-lg px-4 py-3 ${
            device.isNeedMaintenance ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
          <Text className="font-semibold text-sm text-white">Bảo trì</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // điều hướng đến màn hình tạo kiểm định
          }}
          disabled={!device.nextInspectionDate || new Date(device.nextInspectionDate) > new Date()}
          className={`mx-1 flex-1 items-center justify-center rounded-lg px-4 py-3 ${
            device.nextInspectionDate && new Date(device.nextInspectionDate) <= new Date()
              ? 'bg-orange-600'
              : 'bg-gray-300'
          }`}>
          <Text className="font-semibold text-sm text-white">Kiểm định</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CreateIncidentReport', { deviceId: device.id });
          }}
          className="ml-2 flex-1 items-center justify-center rounded-lg bg-red-600 px-4 py-3">
          <Text className="font-semibold text-sm text-white">Báo sự cố</Text>
        </TouchableOpacity>
      </View>
      <SectionTitle title="Thông tin chung" />
      <ProfileItem label="Model" value={device.model} />
      <ProfileItem label="Thương hiệu" value={device.brand} />
      <ProfileItem label="Xuất xứ" value={device.origin} />
      <ProfileItem label="Số serial" value={device.serialNumber} />
      <ProfileItem label="Năm sản xuất" value={device.yearOfManufacture} />
      <ProfileItem label="Bộ phận" value={device.department} />
      <ProfileItem label="Người quản lý" value={device.manager} />
      <ProfileItem label="Vị trí lắp đặt" value={device.location} />
      <ProfileItem label="Chi tiết vị trí" value={device.locationDetails} />
      <ProfileItem label="Tình trạng sử dụng" value={device.usageStatus} />
      <ProfileItem label="Số giờ hoạt động" value={device.operatingHours} />
      <ProfileItem label="Giá trị" value={device.value} />
      <ProfileItem label="Giá trị hao mòn" value={device.depreciationValue} />

      <SectionTitle title="Bảo trì" />
      <ProfileItem label="Chu kỳ bảo trì" value={device.maintenanceCycle} />
      <ProfileItem label="Lần bảo trì gần nhất" value={formatDateFromIsoToDDMMYY(device.lastMaintenanceDate)} />
      <ProfileItem label="Ngày bảo trì kế tiếp" value={formatDateFromIsoToDDMMYY(device.nextMaintenanceDate)} />
      <ProfileItem label="Cần bảo trì?" value={device.isNeedMaintenance} />

      <SectionTitle title="Kiểm định" />
      <ProfileItem label="Lần kiểm định gần nhất" value={formatDateFromIsoToDDMMYY(device.lastInspectionDate)} />
      <ProfileItem label="Ngày kiểm định kế tiếp" value={formatDateFromIsoToDDMMYY(device.nextInspectionDate)} />
      <ProfileItem label="Tình trạng kiểm định" value={device.inspectionStatus} />

      <SectionTitle title="Thông tin khác" />
      <ProfileItem label="Ngày lắp đặt" value={formatDateFromIsoToDDMMYY(device.installationDate)} />
      <ProfileItem label="Ngày hết hạn bảo hành" value={formatDateFromIsoToDDMMYY(device.warrantyExpiration)} />
      <ProfileItem label="Còn bảo hành?" value={device.isUnderWarranty} />
      <ProfileItem label="Lần kiểm tra gần nhất" value={formatDateFromIsoToDDMMYY(device.lastChecked)} />
    </ScrollView>
  );
}
