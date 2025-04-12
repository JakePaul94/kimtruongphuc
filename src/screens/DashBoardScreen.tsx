
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { RootTabParamList } from '../navigation/BottomTabNavigator';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import Navbar from '../components/Navbar';

type Props = BottomTabScreenProps<RootTabParamList, 'DashBoard'>;
export default function DashBoardScreen({ navigation }: Props) {
  return (
    <View className="flex-1 items-center justify-start bg-white">
      <Navbar
        onNotificationPress={() => alert('Thông báo')}
        onMenuPress={() => alert('Mở menu')}
      />
      <ScrollView className="w-full flex-1 bg-gray-100 p-4">
        {/* Thông báo quan trọng */}
        <View className="mb-4 rounded-lg bg-white p-4 shadow-lg">
          <Text className="text-lg font-bold">🔔 Thông báo</Text>
          <Text>- 5 thiết bị đến hạn bảo trì</Text>
          <Text>- 2 công việc bảo trì chưa hoàn thành</Text>
        </View>

        {/* Công việc cần làm */}
        <View className="mb-4 rounded-lg bg-white p-4 shadow-lg">
          <Text className="text-lg font-bold">📋 Công việc cần làm</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('TodoList')}
            className="mt-2 rounded-lg bg-blue-500 p-2">
            <Text className="text-center text-white">Xem danh sách công việc</Text>
          </TouchableOpacity>
        </View>

        {/* Tình trạng thiết bị */}
        <View className="rounded-lg bg-white p-4 shadow-lg">
          <Text className="text-lg font-bold">🏢 Tình trạng thiết bị</Text>
          <Text>- 20 thiết bị hoạt động tốt</Text>
          <Text>- 3 thiết bị đang bảo trì</Text>
          <Text>- 1 thiết bị gặp sự cố</Text>
        </View>
      </ScrollView>
    </View>
  );
}
