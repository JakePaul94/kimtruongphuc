import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Thêm icon
import { formatDateDDMMYY, formatYMDtoDMY, getTodayDateString } from '../../../utils/timeHelper'; // Điều chỉnh đường dẫn này cho đúng
import { getAllTasksForMeAPI } from '~/apis/workerAPI';
import Navbar from '~/components/Navbar';
import { useAppStore } from '~/store/useAppStore';
import { getDevicesDueSoon } from '../../../utils/deviceHelpers';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
// --- Interface TaskItem giữ nguyên ---
interface TaskItem {
  id: number;
  type: string;
  assignmentType: string;
  title: string;
  description: string | null;
  scheduledDate: string;
  status: string;
  assignedTo: number | null;
  createdBy: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  boilerId: number | null;
  boilerName?: string | null;
  deviceId: number | null;
  deviceName?: string | null;
}
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
// --- Component ---
export default function MyTasksScreen() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const { devices, boilers, users, boilerDevices } = useAppStore();
  const maintenanceDevices = getDevicesDueSoon(devices, 'nextMaintenanceDate');
  const inspectionDevices = getDevicesDueSoon(devices, 'nextInspectionDate');
  const navigation = useNavigation<NavigationProp>();
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await getAllTasksForMeAPI(selectedDate);
        setTasks(data);
      } catch (error: any) {
        console.error('Lỗi khi tải công việc:', error);
        setErrorMessage(
          error.response?.data?.message || error.message || 'Không thể tải danh sách công việc.'
        );
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [selectedDate]);
  const handlePressDevice = (id: number) => {
    navigation.navigate('DeviceDetail', { deviceId: id });
  };
  const handleItemPress = (typeTask: string, id: number) => {
    if (typeTask === 'cleaning') {
      navigation.navigate('CleaningTask', { cleaningTaskId: id });
    }
  };
  const getStatusBgClass = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400';
      case 'in_process':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'canceled':
        return 'bg-gray-500';
      case 'failed':
        return 'bg-red-500';
      case 'skipped':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };

  const renderTaskItem = ({ item }: { item: TaskItem }) => {
    // Convert scheduledDate and completedAt to Date objects
    const scheduledDateAsDate = new Date(item.scheduledDate);
    const completedAtAsDate = item.completedAt ? new Date(item.completedAt) : null;

    return (
      <TouchableOpacity
        className="mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm active:bg-gray-100"
        onPress={() => handleItemPress(item.type, item.id)}>
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="mr-2 flex-1 text-base font-semibold text-gray-800">{item.title}</Text>
          <View
            className={`min-w-[85px] items-center rounded-full px-3 py-1 ${getStatusBgClass(item.status)}`}>
            <Text className="text-[11px] font-bold uppercase text-white">
              {item.status.replace('_', ' ')}
            </Text>
          </View>
        </View>

        <Text className="mb-1 text-sm text-gray-600">
          Loại: <Text className="font-medium capitalize">{item.type}</Text> (
          {item.assignmentType === 'assigned' ? 'Được giao' : 'Có sẵn'} )
        </Text>
        <Text className="mb-1 text-sm text-gray-600">
          Ngày: {formatDateDDMMYY(scheduledDateAsDate)}
        </Text>
        {completedAtAsDate && (
          <Text className="mb-1 text-sm text-gray-600">
            Hoàn thành: {formatDateDDMMYY(completedAtAsDate)}
          </Text>
        )}
        {item.boilerName && (
          <Text className="mb-1 text-sm text-gray-600">Lò hơi: {item.boilerName}</Text>
        )}
        {item.deviceName && (
          <Text className="mb-1 text-sm text-gray-600">Thiết bị: {item.deviceName}</Text>
        )}
        {item.description && (
          <Text className="mt-2 text-xs text-gray-500">Mô tả: {item.description}</Text>
        )}
      </TouchableOpacity>
    );
  };
  const renderDeviceList = (
    title: string,
    data: any[],
    dateKey: 'nextMaintenanceDate' | 'nextInspectionDate'
  ) => {
    if (data.length === 0) return null;

    return (
      <View className="mb-5">
        <Text className="mb-2 text-base font-semibold text-gray-700">{title}</Text>
        {data.map((device) => (
          <TouchableOpacity onPress={() => handlePressDevice(device.id)}>
            <View
              key={device.id}
              className="mb-2 rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <Text className="text-sm font-medium text-gray-800">{device.deviceName}</Text>
              <Text className="text-sm text-gray-600">Model: {device.model}</Text>
              <Text className="text-sm text-gray-600">
                Ngày đến hạn: {formatDateDDMMYY(new Date(device[dateKey]))}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text className="mt-2 text-gray-500">Đang tải công việc...</Text>
        </View>
      );
    }

    if (errorMessage) {
      return (
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-center text-base text-red-600">{errorMessage}</Text>
          <TouchableOpacity
            className="mt-4 rounded bg-blue-500 px-4 py-2"
            onPress={() => fetchTasks()} // Gọi lại hàm fetchTasks
          >
            <Text className="font-semibold text-white">Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (tasks.length === 0) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">
            Không có công việc nào cho ngày {formatYMDtoDMY(selectedDate)}.
          </Text>
        </View>
      );
    }

    return (
      <View className="space-y-3">
        {tasks.map((item) => (
          <View key={`${item.type}-${item.id}`}>{renderTaskItem({ item })}</View>
        ))}
      </View>
    );
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getAllTasksForMeAPI(selectedDate);
      setTasks(data);
    } catch (error: any) {
      console.error('Lỗi khi tải công việc:', error);
      setErrorMessage(
        error.response?.data?.message || error.message || 'Không thể tải danh sách công việc.'
      );
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAction = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn thực hiện hành động này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đồng ý', onPress: () => console.log('Hành động đã được xác nhận') },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar />
      <View className="h-12 w-full flex-row bg-white">
        <TouchableOpacity className="h-full w-1/2  ">
          <View className="flex-1 items-center  justify-center border-r border-red-100">
            <Text className="text-center font-semibold text-gray-800">Có thể nhận</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="h-full w-1/2">
          <View className="flex-1 items-center justify-center">
            <Text className="text-center font-bold text-gray-800">Đang Làm</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-3" showsVerticalScrollIndicator={false}>
        <Text className="mb-4 text-center text-lg font-semibold text-gray-800">
          Công việc ngày {formatYMDtoDMY(selectedDate)}
        </Text>

        <View className="mb-6">{renderContent()}</View>

        {renderDeviceList(
          '🔧 Thiết bị cần bảo trì trong 15 ngày tới',
          maintenanceDevices,
          'nextMaintenanceDate'
        )}

        {renderDeviceList(
          '🧪 Thiết bị cần kiểm định trong 15 ngày tới',
          inspectionDevices,
          'nextInspectionDate'
        )}
      </ScrollView>
    </View>
  );
}
