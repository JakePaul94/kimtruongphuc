import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, Button, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

interface CleaningTask {
  id: number;
  locations: CleaningTaskLocation[];
}

interface CleaningTaskLocation {
  id: number;
  templateLocation: {
    name: string;
    instructions: string;
  };
  photoUrl: string | null;
  notes: string | null;
  completedAt: string | null;
}

interface RouteParams {
  taskId: number;
}

const CleaningTaskExecutionScreen = () => {
  const route = useRoute();
  const { taskId } = route.params as RouteParams;

  const [task, setTask] = useState<CleaningTask | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = async () => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/cleaning-tasks/tasks/${taskId}`);
      setTask(res.data);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể tải nhiệm vụ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const handleCompleteLocation = async (locationId: number, imageUri: string, notes: string) => {
    const formData = new FormData();
    formData.append('photo', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('notes', notes);

    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/cleaning-tasks/tasks/locations/${locationId}/complete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!task) return;
      setTask({
        ...task,
        locations: task.locations.map(loc =>
          loc.id === locationId
            ? { ...loc, completedAt: new Date().toISOString(), notes, photoUrl: imageUri }
            : loc
        ),
      });

      Alert.alert('Thành công', 'Đã hoàn thành vị trí.');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể hoàn thành vị trí.');
    }
  };

  const pickImage = async (locationId: number, notes: string) => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      handleCompleteLocation(locationId, imageUri, notes);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!task) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Không tìm thấy nhiệm vụ.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-4">
      {task.locations.map((loc, index) => (
        <View key={loc.id} className="mb-6 border p-4 rounded-xl bg-white shadow">
          <Text className="text-lg font-semibold mb-2">
            📍 {index + 1}. {loc.templateLocation.name}
          </Text>
          <Text className="text-sm text-gray-500 mb-2">{loc.templateLocation.instructions}</Text>

          {loc.completedAt ? (
            <>
              <Text className="text-green-600 font-bold mb-2">✅ Đã hoàn thành</Text>
              {loc.photoUrl && <Image source={{ uri: loc.photoUrl }} className="w-full h-40 rounded-xl mb-2" />}
              {loc.notes && <Text className="italic text-gray-600">Ghi chú: {loc.notes}</Text>}
            </>
          ) : (
            <LocationInput location={loc} onSubmit={pickImage} />
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const LocationInput = ({ location, onSubmit }: { location: CleaningTaskLocation; onSubmit: (locationId: number, notes: string) => void }) => {
  const [notes, setNotes] = useState('');

  return (
    <>
      <TextInput
        placeholder="Ghi chú"
        value={notes}
        onChangeText={setNotes}
        className="border rounded-xl p-2 mb-3"
        multiline
      />
      <Button title="📸 Chụp ảnh & hoàn thành" onPress={() => onSubmit(location.id, notes)} />
    </>
  );
};

export default CleaningTaskExecutionScreen;
