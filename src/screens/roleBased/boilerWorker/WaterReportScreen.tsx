import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '~/components/AppHeader';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { WaterReportTask, WaterReportTaskItem } from '~/types/tasksType';
import { compeleteWaterReportItem, getWaterReportById } from '~/apis/tasksApi';

type WaterReportRouteProp = RouteProp<RootStackParamList, 'WaterReport'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WaterReportTaskScreen() {
  const route = useRoute<WaterReportRouteProp>();
  const { waterReportId } = route.params;
  const navigation = useNavigation<NavigationProp>();

  const [task, setTask] = useState<WaterReportTask | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchTask = async () => {
        try {
          const data = await getWaterReportById(waterReportId);

          setTask(data);
        } catch (error) {
          console.error('Lỗi khi lấy công việc mẫu nước:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTask();
    }, [waterReportId])
  );

  const handleNoteChange = (itemId: number, note: string) => {
    if (!task) return;
    const updatedItems = task.items.map((item) =>
      item.id === itemId ? { ...item, notes: note } : item
    );
    setTask({ ...task, items: updatedItems });
  };

  const completeItemCallback = async (
    itemId: number,
    valueFromAI: string | null,
    isQualify: boolean | null,
    notes: string | null,
    photoUrl: string
  ) => {
    await compeleteWaterReportItem(itemId, valueFromAI, isQualify, notes, photoUrl);
  };

  const handleCapturePhoto = (itemId: number, item: WaterReportTaskItem) => {
    navigation.navigate('PhotoCapture', {
      mode: 'water-report-with-AI',
      waterReportTaskItem: item,
      waterReportCallback: completeItemCallback,
    });
  };

  const handleSubmit = () => {
    navigation.goBack();
  };

  if (loading || !task) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <AppHeader title="Báo cáo mẫu nước" />
      <ScrollView className="px-4 py-6">
        <Text className="mb-2 text-xl font-semibold text-gray-800">{task.template.name}</Text>
        <Text className="mb-4 text-gray-500">Lò hơi: {task.boiler.name}</Text>

        {task.items.map((item) => (
          <View key={item.id} className="mb-4 rounded-2xl bg-gray-100 p-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-700">{item.templateItem.label}</Text>
            <Text className="mb-2 text-sm text-gray-500">{item.templateItem.description}</Text>

            <TextInput
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
              placeholder="Nhập ghi chú..."
              value={item.notes || ''}
              onChangeText={(text) => handleNoteChange(item.id, text)}
              multiline
            />

            <View className="mt-3 flex-row items-center justify-between">
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  className="h-24 w-24 rounded-xl border border-gray-300"
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-sm text-gray-400">Chưa có ảnh</Text>
              )}

              <TouchableOpacity
                onPress={() => handleCapturePhoto(item.id, item)}
                className="rounded-full bg-blue-500 p-3 shadow-md">
                <Feather name="camera" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={handleSubmit}
          className="mt-6 items-center rounded-2xl bg-green-600 py-3 shadow-md">
          <Text className="text-base font-semibold text-white">Hoàn thành báo cáo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
