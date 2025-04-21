import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { twMerge } from 'tailwind-merge';
import Navbar from '~/components/Navbar';
import { useAppStore } from '~/store/useAppStore';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const { users, devices, boilers } = useAppStore();
  const productionData = [50, 80, 40, 90, 60, 100, 75];
  const benchmarkData = [60, 70, 55, 80, 50, 95, 70];
  const tasks = 121;
  return (
    <View className="flex-1">
      <Navbar />
      <ScrollView className="flex-1 p-4 bg-green-50">
        {/* Header */}

        {/* Cards */}
        <View className="mb-6 flex-row flex-wrap justify-between">
          <StatCard title="Nhân viên" value={users.length} progress={1} color="bg-black" />
          <StatCard title="Thiết bị" value={devices.length} progress={0.95} color="bg-blue-500" />
          <StatCard title="Lò hơi" value={boilers.length} progress={1} color="bg-pink-500" />
          <StatCard title="Nhiệm vụ trong tháng" value={tasks} progress={0.86} color="bg-black" />
        </View>
        {/* Chart */}
        <View className="rounded-2xl bg-white p-4 shadow-md">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-base font-semibold">Sản lượng</Text>
            <View className="flex-row space-x-2">
              <FilterButton label="Tháng" active />
              <FilterButton label="Tuần" />
              <FilterButton label="Hôm nay" />
            </View>
          </View>
          <LineChart
            data={{
              labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
              datasets: [
                {
                  data: productionData,
                  color: () => '#3c56ac', // Sản lượng - màu đen
                  strokeWidth: 2,
                },
                {
                  data: benchmarkData,
                  color: () => '#ec4899', // Benchmark - màu hồng (Tailwind: pink-500)
                  strokeWidth: 2,
                },
              ],
              legend: ['Sản lượng', 'Chuẩn'],
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#fff',
              },
            }}
            bezier
            style={{
              borderRadius: 16,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const StatCard = ({
  title,
  value,
  progress,
  color,
}: {
  title: string;
  value: number;
  progress: number;
  color: string;
}) => {
  return (
    <View className="mb-4 w-[48%] rounded-2xl bg-white p-4 shadow-md">
      <Text className="text-sm text-gray-500">{title}</Text>
      <Text className="text-lg font-bold">{value}</Text>
      <View className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <View style={{ width: `${progress * 100}%` }} className={`h-full ${color} rounded-full`} />
      </View>
    </View>
  );
};

const FilterButton = ({ label, active }: { label: string; active?: boolean }) => {
  return (
    <TouchableOpacity
      className={twMerge(
        'rounded-full px-3 py-1',
        active ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
      )}>
      <Text className={active ? 'text-sm font-medium text-white' : 'text-sm text-gray-600'}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default DashboardScreen;
