import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
// Import hàm gọi API và hàm lấy ngày
import {
  formatDateDDMMYY,
  formatIsoDateToHHMMSSDDMMYYYY,
  getTodayDateString,
} from '../../../utils/timeHelper'; // <-- Điều chỉnh đường dẫn này cho đúng
import { formatDateFromISO } from '../../../utils/timeHelper'; // Giả sử bạn có file này
import { getAllTasksForMeAPI } from '~/apis/workerAPI';
import Navbar from '~/components/Navbar';

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

// --- Component ---
export default function MyTasksScreen() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Hiện tại vẫn dùng ngày hôm nay, chưa thêm Date Picker
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

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

  // Hàm lấy màu nền dựa trên status (dùng cho NativeWind)
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

  // Hàm render item dùng NativeWind
  const renderTaskItem = ({ item }: { item: TaskItem }) => (
    // Sử dụng TouchableOpacity để có thể nhấn vào item
    <TouchableOpacity
      className="mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm active:bg-gray-100" // Thêm active state
      onPress={() => console.log('Navigate to task detail:', item.id, item.type)}>
      {/* Header: Title và Status Badge */}
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="mr-2 flex-1 text-base font-semibold text-gray-800">{item.title}</Text>
        <View
          className={`min-w-[85px] items-center rounded-full px-3 py-1 ${getStatusBgClass(item.status)}`}>
          <Text className="text-[11px] font-bold uppercase text-white">
            {item.status.replace('_', ' ')}
          </Text>
        </View>
      </View>

      {/* Thông tin chi tiết */}
      <Text className="mb-1 text-sm text-gray-600">
        Loại: <Text className="font-medium capitalize">{item.type}</Text> (
        {item.assignmentType === 'assigned' ? 'Được giao' : 'Có sẵn'})
      </Text>
      <Text className="mb-1 text-sm text-gray-600">Ngày: {item.scheduledDate}</Text>
      {item.completedAt && (
        <Text className="mb-1 text-sm text-gray-600">
          Hoàn thành: {formatIsoDateToHHMMSSDDMMYYYY(item.completedAt)}
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

      {/* Có thể thêm các nút khác nếu cần */}
      {/* <View className="mt-3 border-t border-gray-200 pt-2">
           <Button title="Bắt đầu" onPress={() => {}}/>
       </View> */}
    </TouchableOpacity>
  );

  // Hàm render nội dung chính
  const renderContent = () => {
    if (isLoading) {
      // Sử dụng ActivityIndicator của React Native
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
          {/* Thêm nút thử lại */}
          <TouchableOpacity
            className="mt-4 rounded bg-blue-500 px-4 py-2"
            onPress={() => fetchTasks()} // Gọi lại hàm fetchTasks (cần định nghĩa lại hoặc đưa ra ngoài useEffect)
          >
            <Text className="font-semibold text-white">Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (tasks.length === 0) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Không có công việc nào cho ngày {selectedDate}.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        className="flex-1" // Đảm bảo FlatList chiếm không gian
        contentContainerStyle={{ paddingBottom: 20 }} // Thêm padding dưới cho list
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
      />
    );
  };

  // Định nghĩa lại fetchTasks ở đây để nút "Thử lại" có thể gọi
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

  return (
    <View className="flex-1 bg-gray-50 p-0">
      <Navbar />
      <View className="flex-1 bg-gray-50 p-4">
        <Text className="mb-4 text-center text-xl font-bold text-gray-700">
          Công việc ngày: {selectedDate}
        </Text>
        {renderContent()}
      </View>
    </View>
  );
}

// Không cần StyleSheet.create nữa
