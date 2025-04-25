import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Avatar, ListItem } from '@rneui/themed';
import { useAppStore } from '~/store/useAppStore'; // Giả sử bạn có store quản lý users
import { RootStackParamList } from '~/navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getCleaningTaskById } from '~/apis/tasksApi';
import AppHeader from '~/components/AppHeader';


interface LocationItem {
  id: number;
  taskId: number;
  templateLocationId: number;
  photoUrl: string | null;
  notes: string | null;
  completedAt: string | null;
  createdAt: string;
  templateLocation?: {
    id: number;
    name: string;
    qrCodeIdentifier: string | null;
    instructions: string | null;
    exampleImageUrl: string | null;
  };
}

// Định nghĩa kiểu dữ liệu cho task detail
interface TaskDetail {
  id: number;
  templateId: number;
  boilerId: number;
  createdBy: number | null;
  assignedTo: number | null;
  status: string;
  scheduledDate: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  locations?: LocationItem[];
  creator: any | null;
  assignedUser?: {
    // Để nhất quán, giữ nguyên kiểu này, có thể bỏ nếu không dùng ở chỗ khác
    id: number;
    fullName: string;
    email: string;
    profilePicture?: string; // Thêm thuộc tính profilePicture
  } | null;
  boiler?: {
    id: number;
    name: string;
    location: string;
  } | null;
  template?: {
    id: number;
    name: string;
  } | null;
}

type EditCleaningTaskTemplateRouteProp = RouteProp<RootStackParamList, 'CleaningTaskDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const CleaningTaskDetailScreen = () => {
  const route = useRoute<EditCleaningTaskTemplateRouteProp>();
  const navigation = useNavigation<NavigationProp>()
  const { cleaningTaskId } = route.params;
  const { users } = useAppStore(); // Vẫn cần users store để hiển thị avatar

  const [task, setTask] = useState<TaskDetail | null>(null);

  useEffect(() => {
    // Giả sử bạn có hàm để fetch chi tiết task dựa trên taskId
    const fetchTaskDetails = async (id: number) => {
      // Thay thế đoạn này bằng logic gọi API thực tế của bạn
      console.log(`Fetching details for task ID: ${id}`);
      const cleaningTask: TaskDetail = await getCleaningTaskById(cleaningTaskId);
      // Tìm thông tin người dùng từ users
      const assignedUserInfo = users.find((user) => user.id === cleaningTask.assignedTo);
      if (assignedUserInfo && assignedUserInfo?.profilePicture !== null) {
        cleaningTask.assignedUser = {
          id: assignedUserInfo.id,
          fullName: assignedUserInfo.fullName,
          email: assignedUserInfo.email,
          profilePicture: assignedUserInfo?.profilePicture, // Lấy profilePicture
        };
      }
      setTask(cleaningTask);
    };

    fetchTaskDetails(cleaningTaskId);
  }, [cleaningTaskId, users]);

  const renderLocationItem = ({ item }: { item: LocationItem }) => (
    <View className="mr-4 items-center">
      {item.photoUrl && (
        <Image source={{ uri: item.photoUrl }} className="mb-2 h-24 w-24 rounded-md" />
      )}
      <Text className="text-center text-xs text-gray-700">{item.templateLocation?.name}</Text>
    </View>
  );

  if (!task) {
    return (
      <Text className="flex-1 items-center justify-center">Đang tải thông tin công việc...</Text>
    );
  }
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'in_process':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'canceled':
        return 'Thất bại';
      default:
        return status;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-blue-500'; // Màu xanh cho Hoàn thành
      case 'pending':
        return 'text-yellow-500'; // Màu vàng cho Chờ xử lý
      case 'in_process':
        return 'text-blue-500'; // Màu xanh dương cho Đang xử lý
      case 'canceled':
        return 'text-red-500'; // Màu đỏ cho Hủy bỏ
      default:
        return 'text-green-500';
    }
  };
  return (
    <View className="flex-1 bg-gray-100 ">
      <AppHeader title='Chi tiết nhiệm vụ'  onBackPress={()=>{navigation.goBack()}} />
      <ScrollView className='flex-1'>
        <Text className="mb-4 text-xl font-bold text-gray-800">
          {task.template?.name || 'Tên công việc'}
        </Text>
        <Text className="mb-2 text-base font-semibold text-gray-700">Thông tin chung</Text>
        <View className="mb-4 rounded-md bg-white p-4 shadow-sm">
          <View className="mb-2 flex-row items-center">
            <Text className="mr-2 font-semibold text-gray-600">Trạng thái:</Text>
            <Text className={`font-medium  ${getStatusColor(task.status)}`}>
              {getStatusText(task.status)}
            </Text>
          </View>
          {task.assignedUser && (
            <View className="mb-2 flex-row items-center">
              <Text className="mr-2 font-semibold text-gray-600">Người hoàn thành:</Text>
              <View className="flex-row items-center">
                <Avatar
                  rounded
                  source={
                    task.assignedUser.profilePicture
                      ? { uri: task.assignedUser.profilePicture }
                      : undefined
                  }
                  title={task.assignedUser.fullName.charAt(0).toUpperCase()}
                  containerStyle={{
                    backgroundColor: task.assignedUser.profilePicture ? 'transparent' : '#86939E',
                    marginRight: 8,
                    width: 24,
                    height: 24,
                  }}
                  titleStyle={{ fontSize: 12 }}
                />
                <Text className="font-medium text-gray-800">{task.assignedUser.fullName}</Text>
              </View>
            </View>
          )}
        </View>
        {task.locations && task.locations.length > 0 && (
          <View className="mb-4 rounded-md bg-white p-4 shadow-sm">
            <Text className="mb-2 text-base font-semibold text-gray-700">Vị trí và Hình ảnh</Text>
            <FlatList
              data={task.locations}
              renderItem={renderLocationItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CleaningTaskDetailScreen;
