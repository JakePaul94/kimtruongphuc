import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDateDDMMYYYY, formatYMDtoDMY, getTodayDateString } from '../../../utils/timeHelper';
import { getAllTasksForMeAPI } from '~/apis/workerAPI';
import Navbar from '~/components/Navbar';
import { useAppStore } from '~/store/useAppStore';
import { getBoilerNameFromDevice, getDevicesDueSoon } from '../../../utils/deviceHelpers';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '~/store/authStore';
import { acceptCleaningTask, acceptWaterReportTask } from '~/apis/tasksApi';
import { getStatusBgClass, getStatusText } from '~/utils/tasksHelper';
import { DeviceAttributes } from '~/types/deviceType';

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

export default function MyTasksScreen() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [activeTab, setActiveTab] = useState<'available' | 'in_progress'>('available');

  const { devices, boilers, users, boilerDevices } = useAppStore();
  const maintenanceDevices = getDevicesDueSoon(devices, 'nextMaintenanceDate');
  const inspectionDevices = getDevicesDueSoon(devices, 'nextInspectionDate');
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore((state) => state.user);

  const fetchTasks = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await getAllTasksForMeAPI(selectedDate);

      // Lọc tasks theo tab hiện tại
      const filteredTasks = data.filter((task) => {
        if (activeTab === 'available') {
          return task.status === 'pending';
        } else {
          return task.status === 'in_process';
        }
      });

      setTasks(filteredTasks);
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

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [activeTab, selectedDate])
  );

  const handlePressDevice = (id: number) => {
    navigation.navigate('DeviceDetail', { deviceId: id });
  };

  const handleItemPress = (typeTask: string, id: number, status: string) => {
    if (activeTab === 'available') {
      Alert.alert(
        'Xác nhận',
        `Bạn có chắc chắn muốn thực hiện công việc này?`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Đồng ý',
            onPress: async () => {
              if (typeTask === 'cleaning') {
                await acceptCleaningTask(id);
                navigation.navigate('CleaningTask', { cleaningTaskId: id });
              } else if (typeTask === 'water-report') {
                await acceptWaterReportTask(id);
                navigation.navigate('WaterReport', { waterReportId: id });
              }
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      if (typeTask === 'cleaning') {
        navigation.navigate('CleaningTask', { cleaningTaskId: id });
      } else if (typeTask === 'water-report') {
        navigation.navigate('WaterReport', { waterReportId: id });
      }
    }
  };

  const getTypeString = (str: string) => {
    if (str === 'cleaning') {
      return 'Vệ sinh';
    }
    if (str === 'water-report') {
      return 'Báo cáo nước';
    }
    return 'Chưa phân loại';
  };

  const renderTaskItem = ({ item }: { item: TaskItem }) => {
    const scheduledDateAsDate = new Date(item.scheduledDate);
    const completedAtAsDate = item.completedAt ? new Date(item.completedAt) : null;
    console.log(item.type);
    return (
      <TouchableOpacity
        className="mb-3 rounded-lg border border-gray-200 bg-white  shadow-sm active:bg-gray-100"
        onPress={() => handleItemPress(item.type, item.id, item.status)}>
        <View
          style={{
            borderBottomWidth: 0.3,
            borderColor: 'rgba(255,0,0,0.3)',
            backgroundColor: 'rgba(222,0,0,0.02)',
          }}
          className=" flex-row  items-center justify-between p-3">
          <Text className="mr-2 flex-1  text-base font-semibold text-gray-800">{item.title}</Text>
          <View
            className={`min-w-[85px] items-center rounded-full px-3 py-1 ${getStatusBgClass(item.status)}`}>
            <Text className="text-[11px] font-bold uppercase text-white">
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        <View
          style={{ borderBottomWidth: 0.3, borderColor: 'rgba(255,0,0,0.13)' }}
          className="m-0 flex h-12 flex-row content-center  items-center justify-start px-4">
          <Text className=" text-center text-sm text-gray-600">
            Loại: <Text className="font-medium capitalize">{getTypeString(item.type)}</Text> (
            {item.assignmentType === 'assigned' ? 'Đã nhận' : 'Có sẵn'})
          </Text>
        </View>
        <View
          style={{ borderBottomWidth: 0.3, borderColor: 'rgba(255,0,0,0.13)' }}
          className="m-0 flex h-12 flex-row content-center items-center justify-start px-4">
          <Text className=" text-center text-sm text-gray-600">
            Ngày: {formatDateDDMMYYYY(scheduledDateAsDate)}
          </Text>
        </View>

        {completedAtAsDate && (
          <Text className="mb-1 text-sm text-gray-600">
            Hoàn thành: {formatDateDDMMYYYY(completedAtAsDate)}
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
    const type = dateKey === 'nextMaintenanceDate'? "bảo trì":"kiểm định"
    return (
      <View className="mb-5">
        <Text className="mb-4 text-base font-semibold text-gray-700">{title}</Text>
        {data.map((device) => (
          <TouchableOpacity key={device.id} onPress={() => handlePressDevice(device.id)}>
            <View className="mb-2 rounded-md border border-gray-200 bg-white  shadow-sm">
              <View
                style={{
                  borderBottomWidth: 0.3,
                  borderColor: 'rgba(1,244,0,0.3)',
                  backgroundColor: 'rgba(222,0,0,0.02)',
                }}
                className="flex items-center justify-center p-2 text-center">
                <Text className="text-lg font-bold text-green-800">{device.deviceName}</Text>
              </View>
              {getBoilerNameFromDevice(device.id, boilerDevices, boilers) && (
                <View className="flex flex-row justify-between py-2 px-4">
                  <Text className="text-sm text-gray-600">Vị trí :</Text>
                  <Text className="text-sm font-semibold text-gray-600">{getBoilerNameFromDevice(device.id, boilerDevices, boilers)}</Text>
                </View>
              )}
              <View className="flex flex-row justify-between py-2 px-4">
                <Text className="text-sm text-gray-600">Model :</Text>
                <Text className="text-sm font-semibold text-gray-600">{device.model}</Text>
              </View>
              <View className="flex flex-row justify-between py-2 px-4">
                <Text className="text-sm text-gray-600">Ngày đến hạn {type} :</Text>
                <Text className="text-sm font-semibold text-red-600">
                  {formatDateDDMMYYYY(new Date(device[dateKey]))}
                </Text>
              </View>
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
          <TouchableOpacity className="mt-4 rounded bg-blue-500 px-4 py-2" onPress={fetchTasks}>
            <Text className="font-semibold text-white">Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (tasks.length === 0) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">
            {activeTab === 'available'
              ? 'Không có công việc nào có thể nhận'
              : 'Không có công việc nào đang làm'}{' '}
            ngày {formatYMDtoDMY(selectedDate)}
          </Text>
        </View>
      );
    }

    return (
      <View className="space-y-3">
        {tasks.map((item, index) => (
          <View key={index}>{renderTaskItem({ item })}</View>
        ))}
      </View>
    );
  };

  const renderHeaderTabs = () => {
    return (
      <View className="h-12  w-full flex-row bg-white">
        <TouchableOpacity className="h-full w-1/2" onPress={() => setActiveTab('available')}>
          <View
            className={`flex-1 items-center justify-start  ${
              activeTab === 'available' ? 'border-b  border-green-500' : ''
            }`}>
            <Text
              className={`text-center text-lg font-semibold ${
                activeTab === 'available' ? 'text-green-600' : 'text-gray-500'
              }`}>
              Có thể nhận
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="h-full w-1/2" onPress={() => setActiveTab('in_progress')}>
          <View
            className={`flex-1 items-center justify-start  ${
              activeTab === 'in_progress' ? 'border-b  border-green-500' : ''
            }`}>
            <Text
              className={`text-center text-lg font-semibold ${
                activeTab === 'in_progress' ? 'text-green-600' : 'text-gray-500'
              }`}>
              Đang Làm
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Navbar />
      {renderHeaderTabs()}

      <ScrollView className="flex-1  py-4" showsVerticalScrollIndicator={false}>
        <Text style={{backgroundColor:"rgba(101, 113, 219, 0.01) ",borderBottomWidth:0.3,borderTopWidth:0.3,borderColor:"rgba(0,222,0,0.3)"}} className="py-4 text-center text-lg font-semibold text-gray-800">
          {activeTab === 'available' ? 'Công việc có thể nhận' : 'Công việc đang làm'} ngày{' '}
          {formatYMDtoDMY(selectedDate)}
        </Text>

        <View className='p-4'>
          <View className="mb-6">{renderContent()}</View>
          {/* Chỉ hiển thị thiết bị ở tab "Có thể nhận" */}
          {activeTab === 'available' && (
            <>
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
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
