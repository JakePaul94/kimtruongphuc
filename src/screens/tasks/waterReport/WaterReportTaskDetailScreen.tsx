import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Avatar } from '@rneui/themed';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppStore } from '~/store/useAppStore';
import { RootStackParamList } from '~/navigation/AppNavigator';
import AppHeader from '~/components/AppHeader';
import { getStatusColor, getStatusText } from '~/utils/tasksHelper';
import { formatYMDtoDMY } from '~/utils/timeHelper';
import { getWaterReportById } from '~/apis/tasksApi';
// Giả sử API này

interface WaterReportItem {
  id: number;
  taskId: number;
  templateItemId: number;
  imageUrl: string | null;
  valueFromAI: string | null;
  note: string | null;
  completedAt: string | null;
  createdAt: string;
  templateItem?: {
    id: number;
    description: string;
    label:string
  };
}

interface WaterReportTaskDetail {
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
  items?: WaterReportItem[];
  creator: any | null;
  assignedUser?: {
    id: number;
    fullName: string;
    email: string;
    profilePicture?: string;
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

type WaterReportTaskRouteProp = RouteProp<RootStackParamList, 'WaterReportTaskDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WaterReportTaskDetailScreen = () => {
  const route = useRoute<WaterReportTaskRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { waterReportTaskId } = route.params;
  const { users } = useAppStore();

  const [task, setTask] = useState<WaterReportTaskDetail | null>(null);

  useEffect(() => {
    const fetchTaskDetails = async (id: number) => {
      const reportTask: WaterReportTaskDetail = await getWaterReportById(waterReportTaskId);
      const assignedUserInfo = users.find((user) => user.id === reportTask.assignedTo);
      if (assignedUserInfo && assignedUserInfo?.profilePicture !== null) {
        reportTask.assignedUser = {
          id: assignedUserInfo.id,
          fullName: assignedUserInfo.fullName,
          email: assignedUserInfo.email,
          profilePicture: assignedUserInfo.profilePicture,
        };
      }
      setTask(reportTask);
    };

    fetchTaskDetails(waterReportTaskId);
  }, [waterReportTaskId, users]);

  const renderItem = ({ item }: { item: WaterReportItem }) => (
    <View className="mr-4 items-center">
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} className="mb-2 h-24 w-24 rounded-md" />
      )}
      <Text className="text-center text-xs text-gray-700">{item.templateItem?.label}</Text>
      {item.valueFromAI && (
        <Text className="mt-1 text-xs text-green-700">
          Giá trị: {item.valueFromAI}
        </Text>
      )}
    </View>
  );

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Đang tải thông tin báo cáo...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader
        title="Chi tiết báo cáo"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView className="flex-1 p-2">
        <View className="borderBottom flex flex-col items-center justify-center bg-white">
          <Text className="borderBottom w-full p-4 text-center text-xl font-bold text-blue-800">
            {task.template?.name || 'Báo cáo nước'}
          </Text>
        </View>

        <Text className="py-4 text-base font-semibold text-gray-700">Thông tin chung</Text>
        <View className="rounded-md bg-white shadow-sm">
          <View className="borderBottom flex-row items-center gap-4 p-4">
            <Text className="font-semibold text-gray-600">Trạng thái:</Text>
            <Text className={`font-medium ${getStatusColor(task.status)}`}>
              {getStatusText(task.status)}
            </Text>
          </View>

          {task?.scheduledDate && (
            <View className="borderBottom flex-row items-center gap-4 p-4">
              <Text className="font-semibold text-gray-600">Ngày:</Text>
              <Text className="font-semibold text-gray-800">
                {formatYMDtoDMY(task.scheduledDate)}
              </Text>
            </View>
          )}

          {task?.boiler?.name && (
            <View className="borderBottom flex-row items-center gap-4 p-4">
              <Text className="font-semibold text-gray-600">Lò hơi:</Text>
              <Text className="font-semibold text-gray-800">{task.boiler.name}</Text>
            </View>
          )}

          {task.assignedUser && (
            <View className="borderBottom flex-row items-center gap-4 p-4">
              <Text className="font-semibold text-gray-600">Người hoàn thành:</Text>
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

        {task.items && task.items.length > 0 && task.status !== 'canceled' && (
          <View className="rounded-b-md  pb-6 ">
            <Text className="py-4 text-base font-semibold text-gray-700">Các chỉ số và hình ảnh:</Text>
            <View className='p-4 w-full rounded-sm bg-white'>
              <FlatList
                data={task.items}
                renderItem={renderItem}
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

export default WaterReportTaskDetailScreen;
