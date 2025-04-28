import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Avatar, ListItem } from '@rneui/themed';
import { useAppStore } from '~/store/useAppStore'; // Giả sử bạn có store quản lý users
import { RootStackParamList } from '~/navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getCleaningTaskById } from '~/apis/tasksApi';
import AppHeader from '~/components/AppHeader';
import { getStatusColor, getStatusText } from '~/utils/tasksHelper';
import { formatDateDDMMYYYY, formatYMDtoDMY } from '~/utils/timeHelper';
import NeonLine from '~/components/LineNeon';

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
  const navigation = useNavigation<NavigationProp>();
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

  return (
    <View className="flex-1 bg-gray-100 ">
      <AppHeader
        title="Chi tiết nhiệm vụ"
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView className="flex-1 p-2">
        <View className="borderBottom flex flex-col items-center justify-center bg-white">
          <Text className="borderBottom w-full p-4 text-center text-xl font-bold text-green-800">
            {task.template?.name || 'Tên công việc'}
          </Text>
        </View>
        <Text className="py-4 text-base font-semibold text-gray-700">Thông tin chung</Text>
        <View className=" rounded-md bg-white  shadow-sm">
          <View className=" borderBottom flex-row items-center gap-4 p-4">
            <Text className=" font-semibold text-gray-600">Trạng thái:</Text>
            <Text className={`font-medium  ${getStatusColor(task.status)}`}>
              {getStatusText(task.status)}
            </Text>
          </View>
          {task?.scheduledDate && (
            <View className=" borderBottom flex-row items-center gap-4 p-4">
              <Text className=" font-semibold text-gray-600">Ngày:</Text>
              <Text className=" font-semibold text-gray-800">
                {formatYMDtoDMY(task?.scheduledDate)}
              </Text>
            </View>
          )}
          {task?.boiler?.name && (
            <View className=" borderBottom flex-row items-center gap-4 p-4">
              <Text className=" font-semibold text-gray-600">Vị trí:</Text>
              <Text className=" font-semibold text-gray-800">
                {getStatusText(task?.boiler?.name)}
              </Text>
            </View>
          )}
          {task.assignedUser && (
            <View className="borderBottom flex-row items-center gap-4 p-4">
              <Text className=" font-semibold text-gray-600">Người hoàn thành:</Text>
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
        {task.locations && task.locations.length > 0 && task.status !== 'canceled' && (
          <View className=" rounded-b-md  pb-6  ">
            <Text className=" py-4 text-base font-semibold text-gray-700">Vị trí và Hình ảnh</Text>
            <View className='p-4 bg-white'>
              <FlatList
                data={task.locations}
                renderItem={renderLocationItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CleaningTaskDetailScreen;
