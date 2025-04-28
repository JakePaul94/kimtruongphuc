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
import { useCallback, useEffect, useState } from 'react';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { CleaningTask, CleaningTaskLocation } from '~/types/tasksType';
import { compeleteTaskLocation, getCleaningTaskById } from '~/apis/tasksApi';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '~/components/AppHeader';

type CleaningTaskRouteProp = RouteProp<RootStackParamList, 'CleaningTask'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CleaningTaskScreen() {
  const route = useRoute<CleaningTaskRouteProp>();
  const { cleaningTaskId } = route.params;

  const navigation = useNavigation<NavigationProp>();
  const [task, setTask] = useState<CleaningTask | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchTask = async () => {
        try {
          const data = await getCleaningTaskById(cleaningTaskId);
          setTask(data);
        } catch (error) {
          console.error('Lỗi khi lấy công việc:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTask();
    }, [cleaningTaskId]) // Chỉ gọi lại nếu `cleaningTaskId` thay đổi
  );
  const handleNoteChange = (locationId: number, note: string) => {
    if (!task) return;
    const updatedLocations = task.locations.map((loc) =>
      loc.id === locationId ? { ...loc, notes: note } : loc
    );
    setTask({ ...task, locations: updatedLocations });
  };
  const compelteLocationCallback = async (locationId: number, photoUrl: string) => {
    await compeleteTaskLocation(locationId, ' Hoàn thành lúc null ', photoUrl);
  };
  const handleCapturePhoto = (locationId: number, location: CleaningTaskLocation) => {
    navigation.navigate('PhotoCapture', {
      mode: 'cleaning',
      cleaningTaskLocation: location,
      cleaningCallback: compelteLocationCallback,
    });
  };

  const handleSubmit = async () => {
    try {
      navigation.goBack();
    } catch (err) {
      console.error('Lỗi khi hoàn thành task:', err);
    }
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
      <AppHeader title="Tiến hành" onBackPress={()=>{navigation.goBack()}} />
      <ScrollView className="px-4 py-6">
        <Text className="mb-2 text-xl font-semibold text-gray-800">{task.template.name}</Text>
        <Text className="mb-4 text-gray-500">Lò hơi: {task.boiler.name}</Text>

        {task.locations
          .filter((loc) => !loc.completedAt) // chỉ lấy những location chưa hoàn thành
          .map((loc) => (
            <View key={loc.id} className="mb-4 rounded-2xl bg-gray-100 p-4 shadow-sm">
              <Text className="text-base font-semibold text-gray-700">
                {loc.templateLocation.name}
              </Text>
              <Text className="mb-2 text-sm text-gray-500">
                {loc.templateLocation.instructions}
              </Text>

              <TextInput
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
                placeholder="Nhập ghi chú..."
                value={loc.notes || ''}
                onChangeText={(text) => handleNoteChange(loc.id, text)}
                multiline
              />

              <View className="mt-3 flex-row items-center justify-between">
                {loc.photoUrl ? (
                  <Image
                    source={{ uri: loc.photoUrl }}
                    className="h-24 w-24 rounded-xl border border-gray-300"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-sm text-gray-400">Chưa có ảnh</Text>
                )}

                <TouchableOpacity
                  onPress={() => handleCapturePhoto(loc.id, loc)}
                  className="rounded-full bg-blue-500 p-3 shadow-md">
                  <Feather name="camera" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

       
      </ScrollView>
    </View>
  );
}
