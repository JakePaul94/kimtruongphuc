import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { useAppStore } from '~/store/useAppStore';
import AppHeader from '~/components/AppHeader';
import { getAllTasksByDateRange } from '~/apis/tasksApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { Avatar } from '@rneui/themed';
import relativeTime from 'dayjs/plugin/relativeTime';
import Navbar from '~/components/Navbar';
dayjs.locale('vi');
dayjs.extend(relativeTime);

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TaskManagementScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { users, boilers, boilerUsers } = useAppStore();

  const [selectedBoiler, setSelectedBoiler] = useState<string>('all');
  const [selectedRange, setSelectedRange] = useState<
    'today' | 'last7days' | 'last30days' | 'custom'
  >('today');

  const [cleaningTasks, setCleaningTasks] = useState<any[]>([]);
  const [waterReportTasks, setWaterReportTasks] = useState<any[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<any[]>([]);

  const [boilerOpen, setBoilerOpen] = useState(false);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [boilerOptions, setBoilerOptions] = useState<any[]>([]);
  const [rangeOptions] = useState([
    { label: 'Hôm nay', value: 'today' },
    { label: '7 ngày qua', value: 'last7days' },
    { label: '30 ngày qua', value: 'last30days' },
    { label: 'Tùy chỉnh', value: 'custom' },
  ]);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date>(dayjs().subtract(1, 'day').toDate()); // Mặc định 1 ngày gần nhất
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    const options = [
      { label: 'Tất cả lò hơi', value: 'all' },
      { label: 'Không thuộc lò hơi', value: 'unassigned' },
      ...boilers.map((b) => ({
        label: b.name,
        value: b.id.toString(),
      })),
    ];
    setBoilerOptions(options);
  }, [boilers]);

  const fetchTasks = useCallback(
    async (start?: string, end?: string) => {
      try {
        let startDateToSend: string | undefined = start;
        let endDateToSend: string | undefined = end;

        if (selectedRange === 'today') {
          startDateToSend = dayjs().format('YYYY-MM-DD');
          endDateToSend = dayjs().format('YYYY-MM-DD');
        } else if (selectedRange === 'last7days') {
          startDateToSend = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
          endDateToSend = dayjs().format('YYYY-MM-DD');
        } else if (selectedRange === 'last30days') {
          startDateToSend = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
          endDateToSend = dayjs().format('YYYY-MM-DD');
        } else if (selectedRange === 'custom' && startDate && endDate) {
          startDateToSend = dayjs(startDate).format('YYYY-MM-DD');
          endDateToSend = dayjs(endDate).format('YYYY-MM-DD');
        } else if (selectedRange !== 'custom') {
          // Mặc định fetch 1 ngày gần nhất nếu không phải custom và các range khác
          startDateToSend = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
          endDateToSend = dayjs().format('YYYY-MM-DD');
        }

        if (startDateToSend && endDateToSend) {
          const allTaskByRange = await getAllTasksByDateRange(startDateToSend, endDateToSend);
          setCleaningTasks(allTaskByRange.allCleaningTasks);
          setWaterReportTasks(allTaskByRange.allWaterReportTasks);
          setMaintenanceTasks(allTaskByRange.allMaintenanceTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    [selectedRange, selectedBoiler, startDate, endDate]
  );

  useEffect(() => {
    fetchTasks();
  }, [selectedRange, selectedBoiler, startDate, endDate]);

  const onStartDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedRange === 'custom') {
        fetchTasks(dayjs(selectedDate).format('YYYY-MM-DD'), dayjs(endDate).format('YYYY-MM-DD'));
      }
    }
  };

  const onEndDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      if (selectedRange === 'custom') {
        fetchTasks(dayjs(startDate).format('YYYY-MM-DD'), dayjs(selectedDate).format('YYYY-MM-DD'));
      }
    }
  };

  const showStartDatepicker = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatepicker = () => {
    setShowEndDatePicker(true);
  };
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
    <View className="flex-1 bg-gray-50">
      <Navbar />
      <View
        style={{ zIndex: 2000,borderTopWidth: 0.3, borderBottomWidth: 0.3, borderBlockColor: 'rgba(0,222,0,0.3)' }}
        className="flex flex-row ">
        <View className="z-20 w-1/2  bg-white px-4 py-1">
          <DropDownPicker
            open={boilerOpen}
            value={selectedBoiler}
            items={boilerOptions}
            setOpen={setBoilerOpen}
            setValue={setSelectedBoiler}
            setItems={setBoilerOptions}
            placeholder="Chọn lò hơi"
            style={{ borderColor: 'rgba(0,0,0,0)' }}
            dropDownContainerStyle={{ borderColor: '#E5E7EB' }}
            textStyle={{ fontSize: 14 }}
            zIndex={3000}
            zIndexInverse={1000}
            onChangeValue={() => {
              fetchTasks(
                selectedRange === 'custom' ? dayjs(startDate).format('YYYY-MM-DD') : undefined,
                selectedRange === 'custom' ? dayjs(endDate).format('YYYY-MM-DD') : undefined
              );
            }}
          />
        </View>
        <View className="z-20 w-1/2  bg-white px-4 py-1">
          <DropDownPicker
            open={rangeOpen}
            value={selectedRange}
            items={rangeOptions}
            setOpen={setRangeOpen}
            setValue={setSelectedRange}
            setItems={() => {}}
            placeholder="Chọn thời gian"
            style={{ borderColor: 'rgba(0,0,0,0)' }}
            dropDownContainerStyle={{ borderColor: '#E5E7EB' }}
            textStyle={{ fontSize: 14 }}
            zIndex={2000}
            zIndexInverse={2000}
            onChangeValue={(value) => {
              // Khi thay đổi range, fetch lại task (trừ khi là custom, sẽ xử lý ở date picker)
              if (value !== 'custom') {
                fetchTasks();
              }
            }}
          />
        </View>
      </View>

      {selectedRange === 'custom' && (
        <View
          style={{ zIndex: 1000, borderBottomWidth: 0.3, borderBlockColor: 'rgba(0,0,0,0.2)' }}
          className="flex-row gap-2 space-x-2 bg-white px-4 py-2">
          <TouchableOpacity
            onPress={showStartDatepicker}
            className="w-1/2 flex-1 rounded-md px-3 py-4">
            <Text className="text-sm text-gray-600">
              Ngày bắt đầu: {dayjs(startDate).format('DD/MM/YYYY')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showEndDatepicker}
            className="w-1/2 flex-1  rounded-md px-3 py-4">
            <Text className="text-sm text-gray-600">
              Ngày kết thúc: {dayjs(endDate).format('DD/MM/YYYY')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {showStartDatePicker && (
        <DateTimePicker
          testID="startDatePicker"
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          testID="endDatePicker"
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
        />
      )}
      <View className="z-10 flex-1 p-4">
        <ScrollView className=" py-2">
          <Text className="mb-4 text-lg font-semibold text-gray-800">Công việc Vệ sinh</Text>
          {cleaningTasks.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate('CleaningTaskDetail', { cleaningTaskId: item.id })}
              className="mb-2 rounded-md bg-white p-4 shadow-sm">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold text-gray-800">{item.template.name}</Text>
                <Text className={`${getStatusColor(item.status)} font-medium`}>
                  {getStatusText(item.status)}
                </Text>
              </View>
              <Text className="py-2 text-sm text-gray-600">
                Ngày thực hiện: {dayjs(item.scheduledDate).format('DD/MM/YYYY')}
              </Text>
              {item.assignedUser && (
                <View className="mt-1 flex-row items-center">
                  <Avatar
                    rounded
                    source={{ uri: item.assignedUser.profilePicture }}
                    title={item.assignedUser.fullName.charAt(0).toUpperCase()}
                    containerStyle={{
                      backgroundColor: '#86939E',
                      marginRight: 8,
                      width: 24,
                      height: 24,
                    }}
                    titleStyle={{ fontSize: 12 }}
                  />
                  <Text className="text-sm text-gray-700">
                    Người thực hiện: {item.assignedUser.fullName}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          <Text className="mb-4 mt-4 text-lg font-semibold text-gray-800">
            Công việc Báo cáo Nước
          </Text>
          {waterReportTasks.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                navigation.navigate('WaterReportTaskDetail', { waterReportTaskId: item.id })
              }
              className="mb-2 rounded-md bg-white p-4 shadow-sm">
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-base font-semibold text-gray-800">{item.template.name}</Text>
                <Text className={`${getStatusColor(item.status)} font-medium`}>
                  {getStatusText(item.status)}
                </Text>
              </View>
              <Text className="text-sm text-gray-600">
                Ngày thực hiện: {dayjs(item.scheduledDate).format('DD/MM/YYYY')}
              </Text>
              {item.assignedUser && (
                <View className="mt-1 flex-row items-center">
                  <Avatar
                    rounded
                    source={{ uri: item.assignedUser.profilePicture }}
                    title={item.assignedUser.fullName.charAt(0).toUpperCase()}
                    containerStyle={{
                      backgroundColor: '#86939E',
                      marginRight: 8,
                      width: 24,
                      height: 24,
                    }}
                    titleStyle={{ fontSize: 12 }}
                  />
                  <Text className="text-sm text-gray-700">
                    Người thực hiện: {item.assignedUser.fullName}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          <Text className="mb-4 mt-4 text-lg font-semibold text-gray-800">Công việc Bảo trì</Text>
          {maintenanceTasks.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                navigation.navigate('MaintenanceTaskDetail', { maintenanceTaskId: item.id })
              }
              className="mb-2 rounded-md bg-white p-4 shadow-sm">
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-base font-semibold text-gray-800">
                  {item.device.deviceName}
                </Text>
                <Text className={`${getStatusColor(item.status)} font-medium`}>
                  {getStatusText(item.status)}
                </Text>
              </View>
              {item.device.boilers && <Text className="py-1">{item.device.boilers[0].name}</Text>}
              <Text className="py-1 text-sm text-gray-600">
                Ngày thực hiện: {dayjs(item.scheduledDate).format('DD/MM/YYYY')}
              </Text>
              {item.assignedUser && (
                <View className="mt-1 flex-row items-center">
                  <Avatar
                    rounded
                    source={{ uri: item.assignedUser.profilePicture }}
                    title={item.assignedUser.fullName.charAt(0).toUpperCase()}
                    containerStyle={{
                      backgroundColor: '#86939E',
                      marginRight: 8,
                      width: 24,
                      height: 24,
                    }}
                    titleStyle={{ fontSize: 12 }}
                  />
                  <Text className="text-sm text-gray-700">
                    Người thực hiện: {item.assignedUser.fullName}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default TaskManagementScreen;
