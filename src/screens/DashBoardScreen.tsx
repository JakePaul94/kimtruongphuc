import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { twMerge } from 'tailwind-merge';
import Navbar from '~/components/Navbar';
import { useAppStore } from '~/store/useAppStore';
import { getAllTasksByDateRange } from '~/apis/tasksApi';
import dayjs from 'dayjs';
import { useFocusEffect } from '@react-navigation/native';
import { isNearDate } from '~/utils/deviceHelpers';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const { users, devices, boilers } = useAppStore();
  const [cleaningTasks, setCleaningTasks] = useState<any[]>([]);
  const [waterReportTasks, setWaterReportTasks] = useState<any[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<any[]>([]);

  const taskLength = cleaningTasks.length + waterReportTasks.length 
  const taskCompleted = cleaningTasks.filter(task => task.status === "completed").length + waterReportTasks.filter(task => task.status === "completed").length
  const nearMaintenanceDevices = devices.filter(d=>isNearDate(d.nextMaintenanceDate)).length
  const nearInspectionDevices = devices.filter(d=>isNearDate(d.nextInspectionDate)).length
  const fetchTasks = useCallback(async () => {
    try {
      const startDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
      const endDate = dayjs().format('YYYY-MM-DD');
      const allTaskByRange = await getAllTasksByDateRange(startDate, endDate);
      setCleaningTasks(allTaskByRange.allCleaningTasks || []);
      setWaterReportTasks(allTaskByRange.allWaterReportTasks || []);
      setMaintenanceTasks(allTaskByRange.allMaintenanceTasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );
  // Sample data for boilers' production
  const boilerProductionData = {
    labels: boilers.map((b, i) => `${b.name}`),
    datasets: [
      {
        data: boilers.map(() => Math.floor(Math.random() * 100) + 50), // Random data for demo
        color: () => '#3b82f6', // Blue-500
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Navbar />
      <ScrollView className="flex-1 p-5">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">Tổng quan vận hành</Text>
        </View>

        {/* Enhanced StatCards */}
        <View className="mb-8 flex-row flex-wrap justify-between">
          <StatCard
            title="Nhân viên"
            icon="people"
            value={users.length}
            details={[
              { label: 'Đang hoạt động', value: users.length },
              { label: 'Ca ngày', value: Math.floor(users.length * 0.6) },
            ]}
            progress={1}
            color="bg-blue-600"
          />
          <StatCard
            title="Thiết bị"
            icon="hardware-chip"
            value={devices.length}
            details={[
              { label: 'Gần kiểm định', value: nearInspectionDevices},
              { label: 'Gần bảo trì', value: nearMaintenanceDevices },
            ]}
            progress={1}
            color="bg-green-600"
          />
          <StatCard
            title="Lò hơi"
            icon="flame"
            value={boilers.length}
            details={[
              { label: 'Hoạt động', value: boilers.length },
              { label: 'Hiệu suất', value: '98%' },
            ]}
            progress={1}
            color="bg-red-600"
          />
          <StatCard
            title="Nhiệm vụ"
            icon="checkmark-circle"
            value={taskLength}
            details={[
              { label: 'Hoàn thành', value: taskCompleted },
              { label: 'Chưa làm', value: taskLength -  taskCompleted},
            ]}
            progress={taskCompleted/taskLength}
            color="bg-purple-600"
          />
        </View>

        {/* Bar Chart for Boiler Production */}
        <View className="rounded-2xl bg-white p-5 shadow-lg">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-800">Sản lượng lò hơi</Text>
            <View className="flex-row space-x-3">
              <FilterButton label="Tháng" active />
              <FilterButton label="Tuần" />
              <FilterButton label="Hôm nay" />
            </View>
          </View>
          <BarChart
  data={boilerProductionData}
  width={screenWidth - 90}
  height={240}
  yAxisLabel=""
  yAxisSuffix=" tấn"
  chartConfig={{
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    barPercentage: 0.4,
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#e5e7eb',
    },
  }}
  style={{
    borderRadius: 16,
    padding: 10,
  }}
  showValuesOnTopOfBars
  fromZero
/>
        </View>
      </ScrollView>
    </View>
  );
};

const StatCard = ({
  title,
  icon,
  value,
  details,
  progress,
  color,
}: {
  title: string;
  icon: string;
  value: number;
  details: { label: string; value: string | number }[];
  progress: number;
  color: string;
}) => {
  return (
    <View className="mb-5 w-[48%] rounded-2xl bg-white p-5 shadow-lg">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={24} color="#374151" />
      </View>
      <Text className="text-2xl font-bold text-gray-900">{value}</Text>
      <View className="mt-3">
        {details.map((detail, index) => (
          <View key={index} className="mb-2 flex-row justify-between">
            <Text className="text-sm text-gray-600">{detail.label}</Text>
            <Text className="text-sm font-medium text-gray-800">{detail.value}</Text>
          </View>
        ))}
      </View>
      <View className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <View style={{ width: `${progress * 100}%` }} className={`h-full ${color} rounded-full`} />
      </View>
    </View>
  );
};

const FilterButton = ({ label, active }: { label: string; active?: boolean }) => {
  return (
    <TouchableOpacity
      className={twMerge(
        'rounded-full px-4 py-2',
        active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
      )}>
      <Text className={twMerge('text-sm font-medium', active ? 'text-white' : 'text-gray-700')}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default DashboardScreen;