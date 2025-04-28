import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { getMaintenanceTaskById } from '~/apis/tasksApi';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '~/components/AppHeader';
import { Avatar } from '@rneui/themed';
import { formatYMDtoDMY } from '~/utils/timeHelper';
import { getStatusColor, getStatusText } from '~/utils/tasksHelper';
import NeonLine from '~/components/LineNeon';

type MaintenanceTaskItem = {
  id: number;
  taskId: number;
  title: string;
  result: string;
  photoUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type MaintenanceTaskDetail = {
  id: number;
  deviceId: number;
  templateId: number | null;
  assignedTo: number;
  createdBy: number;
  scheduledDate: string;
  completedAt: string | null;
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  device: {
    id: number;
    deviceName: string;
  };
  items: MaintenanceTaskItem[];
  assignedUser: {
    id: number;
    fullName: string;
    profilePicture: string | null;
  } | null;
};

type MaintenanceTaskDetailRouteProp = RouteProp<RootStackParamList, 'MaintenanceTaskDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MaintenanceTaskDetailScreen() {
  const route = useRoute<MaintenanceTaskDetailRouteProp>();
  const { maintenanceTaskId } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const [taskDetail, setTaskDetail] = useState<MaintenanceTaskDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTaskDetail();
  }, []);

  const fetchTaskDetail = async () => {
    try {
      setLoading(true);
      const res = await getMaintenanceTaskById(maintenanceTaskId);
      setTaskDetail(res);
    } catch (error) {
      console.error('Failed to fetch task detail', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!taskDetail) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Không tìm thấy thông tin nhiệm vụ</Text>
      </View>
    );
  }
  taskDetail.items.map((item)=>{
    console.log(item.photoUrl)
  })
  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader
        title="Chi tiết bảo trì"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView className="flex-1 p-3">
        {/* Tên thiết bị */}
        <View className="mb-4 items-center bg-white rounded-lg p-4 shadow-sm">
          <Text className="text-xl font-bold text-green-800">{taskDetail.device.deviceName}</Text>
        </View>

        {/* Thông tin chung */}
        <Text className="py-2 text-base font-semibold text-gray-700">Thông tin chung</Text>
        <View className="rounded-md bg-white shadow-sm">
          {/* Trạng thái */}
          <View className="border-b border-gray-200 flex-row items-center gap-4 p-4">
            <Text className="font-semibold text-gray-600">Trạng thái:</Text>
            <Text className={`font-medium ${getStatusColor(taskDetail.status)}`}>
              {getStatusText(taskDetail.status)}
            </Text>
          </View>

          {/* Ngày bảo trì */}
          <View className="border-b border-gray-200 flex-row items-center gap-4 p-4">
            <Text className="font-semibold text-gray-600">Ngày bảo trì:</Text>
            <Text className="font-semibold text-gray-800">
              {formatYMDtoDMY(taskDetail.scheduledDate)}
            </Text>
          </View>

          {/* Ghi chú */}
          {taskDetail.notes && (
            <View className="border-b border-gray-200 flex-row items-start gap-4 p-4">
              <Text className="font-semibold text-gray-600">Ghi chú:</Text>
              <Text className="flex-1 text-gray-800">{taskDetail.notes}</Text>
            </View>
          )}

          {/* Người được giao */}
          {taskDetail.assignedUser && (
            <View className="flex-row items-center gap-4 p-4">
              <Text className="font-semibold text-gray-600">Người thực hiện:</Text>
              <Avatar
                rounded
                size={32}
                source={
                  taskDetail.assignedUser.profilePicture
                    ? { uri: taskDetail.assignedUser.profilePicture }
                    : undefined
                }
                title={taskDetail.assignedUser.fullName.charAt(0)}
              />
              <Text className="text-gray-800 font-semibold">{taskDetail.assignedUser.fullName}</Text>
            </View>
          )}
        </View>



        {/* Danh sách mục bảo trì */}
        <Text className="py-2 text-base font-semibold text-gray-700">Danh sách hạng mục</Text>
        <View className="space-y-4">
          {taskDetail.items.map((item) => (
            <View key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
              <Text className="text-lg font-semibold mb-2">{item.title}</Text>

              {/* Kết quả */}
              <Text className="text-sm text-gray-600 mb-2">Kết quả: {item.result || 'Chưa có kết quả'}</Text>

              {/* Ảnh */}
              {item.photoUrl ? (
                <Image
                  source={{ uri: item.photoUrl }}
                  className="h-32 w-32 rounded-md mb-2 border-red-500"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-sm text-gray-400 italic">Không có hình ảnh</Text>
              )}

              {/* Trạng thái */}
              <Text className="text-sm text-gray-500">Trạng thái: {getStatusText(item.status)}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}
