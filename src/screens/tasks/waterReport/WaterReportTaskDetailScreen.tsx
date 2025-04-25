import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Avatar, ListItem } from '@rneui/themed';
import { useAppStore } from '~/store/useAppStore'; // Giả sử bạn có store quản lý users
import { RootStackParamList } from '~/navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Định nghĩa type cho WaterReportTaskDetail (dựa trên response bạn cung cấp)
interface WaterReportItem {
    id: number;
    taskId: number;
    templateItemId: number;
    imageUrl: string | null;
    valueFromAI: any | null;
    isQualify: boolean | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    templateItem?: {
      id: number;
      templateId: number;
      label: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    };
  }
  
  // Định nghĩa type cho WaterReportTaskDetail (dựa trên response bạn cung cấp)
  interface WaterReportTaskDetail {
    id: number;
    templateId: number;
    boilerId: number;
    assignedTo: number | null;
    scheduledDate: string;
    status: string;
    createdBy: number | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    boiler?: {
      id: number;
      name: string;
      location: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    } | null;
    assignee?: {
      id: number;
      fullName: string;
      email: string;
    } | null;
    creator: any | null; // Có thể cần định nghĩa type cụ thể
    template?: {
      id: number;
      name: string;
      description: string;
      boilerId: number;
      createdAt: string;
      updatedAt: string;
    } | null;
    items?: WaterReportItem[];
  }

type EditCleaningTaskTemplateRouteProp = RouteProp<RootStackParamList, 'WaterReportTaskDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const WaterReportTaskDetailScreen = () => {
  const route = useRoute<EditCleaningTaskTemplateRouteProp>();
  const { waterReportTaskId } = route.params;
  const { users } = useAppStore(); // Vẫn cần users store để hiển thị avatar nếu assignee không đầy đủ

  const [task, setTask] = useState<WaterReportTaskDetail | null>(null);

  useEffect(() => {
    // Giả sử bạn có hàm để fetch chi tiết WaterReportTask dựa trên taskId
    const fetchTaskDetails = async (id: number) => {
      // Thay thế đoạn này bằng logic gọi API thực tế của bạn
      console.log(`Fetching details for Water Report Task ID: ${id}`);
      const dummyTask: WaterReportTaskDetail = {
        id: 11,
        templateId: 1,
        boilerId: 1,
        assignedTo: null,
        scheduledDate: "2025-04-22",
        status: "pending",
        createdBy: null,
        completedAt: null,
        createdAt: "2025-04-22T10:30:00.000Z",
        updatedAt: "2025-04-22T10:30:00.000Z",
        boiler: {
          id: 1,
          name: "Lò hơi Habeco",
          location: "Hoàng Hoa Thám - Đống Đa - Hà Nội",
          description: "Lò hơi  Công ty sản xuất rượu bia Hà Nội",
          createdAt: "2025-04-12T04:29:23.000Z",
          updatedAt: "2025-04-12T04:29:23.000Z"
        },
        assignee: null,
        creator: null,
        template: {
          id: 1,
          name: "Báo cáo chất lượng nước hằng ngày",
          description: "Mẫu báo cáo chật lượng nước hằng ngày cho lò hơi sẽ tự sinh nhiệm vụ mỗi ngày",
          boilerId: 1,
          createdAt: "2025-04-12T04:56:20.000Z",
          updatedAt: "2025-04-18T00:36:27.000Z"
        },
        items: [
          {
            id: 23,
            taskId: 11,
            templateItemId: 1,
            imageUrl: null,
            valueFromAI: null,
            isQualify: null,
            notes: null,
            createdAt: "2025-04-22T10:30:00.000Z",
            updatedAt: "2025-04-22T10:30:00.000Z",
            templateItem: {
              id: 1,
              templateId: 1,
              label: "pH Level",
              description: "Check pH value (Target: 8.5-9.5)",
              createdAt: "2025-04-12T04:56:20.000Z",
              updatedAt: "2025-04-12T04:56:20.000Z"
            }
          },
          {
            id: 24,
            taskId: 11,
            templateItemId: 2,
            imageUrl: null,
            valueFromAI: null,
            isQualify: null,
            notes: null,
            createdAt: "2025-04-22T10:30:00.000Z",
            updatedAt: "2025-04-22T10:30:00.000Z",
            templateItem: {
              id: 2,
              templateId: 1,
              label: "Độ kiềm",
              description: "Kiểm tra chỉ số ppm",
              createdAt: "2025-04-12T04:56:20.000Z",
              updatedAt: "2025-04-22T13:25:42.000Z"
            }
          }
        ]
      };
      setTask(dummyTask);
    };

    fetchTaskDetails(waterReportTaskId);
  }, [waterReportTaskId]);

  const renderItem = ({ item }: { item: WaterReportItem }) => (
    <View className="bg-white rounded-md shadow-sm p-4 mb-2">
      <Text className="text-base font-semibold text-gray-700">{item.templateItem?.label}</Text>
      {item.templateItem?.description && (
        <Text className="text-sm text-gray-500 mb-2">{item.templateItem.description}</Text>
      )}
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} className="w-full h-32 rounded-md mb-2" />
      )}
      {item.valueFromAI !== null && (
        <Text className="text-sm text-gray-800">Giá trị AI: {item.valueFromAI}</Text>
      )}
      {item.notes && (
        <Text className="text-sm text-gray-800">Ghi chú: {item.notes}</Text>
      )}
      <View className="flex-row items-center mt-2">
        <Text className="text-sm text-gray-600 mr-2">Đạt yêu cầu:</Text>
        <Text className={`text-sm font-medium ${item.isQualify === true ? 'text-green-500' : item.isQualify === false ? 'text-red-500' : 'text-gray-800'}`}>
          {item.isQualify === true ? 'Có' : item.isQualify === false ? 'Không' : 'Chưa xác định'}
        </Text>
      </View>
    </View>
  );

  if (!task) {
    return <Text className="flex-1 items-center justify-center">Đang tải thông tin báo cáo nước...</Text>;
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-xl font-bold text-gray-800 mb-4">{task.template?.name || 'Báo cáo nước'}</Text>

      <View className="bg-white rounded-md shadow-sm p-4 mb-4">
        <Text className="text-base font-semibold text-gray-700 mb-2">Thông tin chung</Text>
        <View className="flex-row items-center mb-2">
          <Text className="font-semibold text-gray-600 mr-2">Trạng thái:</Text>
          <Text className={`text-gray-800 font-medium ${
            task.status === 'completed' ? 'text-green-500' :
            task.status === 'pending' ? 'text-yellow-500' :
            'text-red-500'
          }`}>{task.status}</Text>
        </View>
        {task.assignee && (
          <View className="flex-row items-center mb-2">
            <Text className="font-semibold text-gray-600 mr-2">Người thực hiện:</Text>
            <View className="flex-row items-center">
              <Avatar
                rounded
                title={task.assignee.fullName.charAt(0).toUpperCase()}
                containerStyle={{ backgroundColor: '#86939E', marginRight: 8, width: 24, height: 24 }}
                titleStyle={{ fontSize: 12 }}
              />
              <Text className="text-gray-800 font-medium">{task.assignee.fullName}</Text>
            </View>
          </View>
        )}
        {task.boiler && (
          <View className="mb-2">
            <Text className="font-semibold text-gray-600 mr-2">Lò hơi:</Text>
            <Text className="text-gray-800 font-medium">{task.boiler.name}</Text>
            <Text className="text-gray-500 text-sm">{task.boiler.location}</Text>
          </View>
        )}
      </View>

      {task.items && task.items.length > 0 && (
        <View className="bg-white rounded-md shadow-sm p-4 mb-4">
          <Text className="text-base font-semibold text-gray-700 mb-2">Chi tiết báo cáo</Text>
          <FlatList
            data={task.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}
    </View>
  );
};

export default WaterReportTaskDetailScreen;