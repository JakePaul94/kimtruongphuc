import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Navbar from '../components/Navbar';

import { RootStackParamList } from '../navigation/AppNavigator';
import { RootTabParamList } from '../navigation/BottomTabNavigator';

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'TodoList'>,
  NativeStackScreenProps<RootStackParamList>
>;
export default function TodoListScreen({ navigation }: Props) {
  return (
    <View className="flex-1 items-center justify-start bg-white">
      <Navbar
        title="Nguyễn Văn A"
        onNotificationPress={() => alert('Thông báo')}
        onMenuPress={() => alert('Mở menu')}
      />
      <ScrollView className="w-full flex-1 bg-gray-100 p-4">
        <View className="mb-4 rounded-lg bg-white p-4 shadow-lg">
          <Text className="text-lg font-bold">📋 Công việc cần làm</Text>

          <View className="mt-2 rounded-lg bg-white p-3 shadow">
            <Text className="font-semibold">🛠 Bảo trì thiết bị Quạt</Text>
            <Text className="text-gray-500">Hạn: 28/03/2025</Text>
            <TouchableOpacity className="mt-2 rounded-lg bg-blue-500 p-2">
              <Text className="text-center text-white">Tiến Hành</Text>
            </TouchableOpacity>
          </View>

          {/* Công việc 2: Nghiệm thu vệ sinh */}
          <View className="mt-2 rounded-lg bg-white p-3 shadow">
            <Text className="font-semibold">🧹 Nghiệm thu vệ sinh</Text>
            <Text className="text-gray-500">Hạn: 29/03/2025</Text>
            <TouchableOpacity className="mt-2 rounded-lg bg-green-500 p-2">
              <Text className="text-center text-white">Tiến Hành</Text>
            </TouchableOpacity>
          </View>

          {/* Công việc 3: Báo cáo chất lượng nước */}
          <View className="mt-2 rounded-lg bg-white p-3 shadow">
            <Text className="font-semibold">💧 Báo cáo chất lượng nước</Text>
            <Text className="text-gray-500">Hạn: 30/03/2025</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('WaterQualityReport')}
              className="mt-2 rounded-lg bg-orange-500 p-2">
              <Text className="text-center text-white">Tiến Hành</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
