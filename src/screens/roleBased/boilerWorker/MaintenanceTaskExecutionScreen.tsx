import React, { useState } from 'react';
import { View, Text, TextInput, Image, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { uploadImage } from '~/apis/uploadApi';
import { generateAndCompleteTask } from '~/apis/tasksApi';
import AppHeader from '~/components/AppHeader';
import { SelfGeneratedMaintainTaskItem } from '~/types/tasksType';

type MaintenanceTaskRouteProp = RouteProp<RootStackParamList, 'MaintenanceTaskExecution'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MaintenanceTaskExecutionScreen() {
  const route = useRoute<MaintenanceTaskRouteProp>();
  const { deviceId } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const [items, setItems] = useState<SelfGeneratedMaintainTaskItem[]>([
    { title: 'Bảo trì tổng thể', result: '', photoUrl: '' },
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Add loading state
  console.log(items)

  const handlePickImage = async (index: number) => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      console.log('Chụp ảnh:', uri);

      // Set loading to true when starting upload
      setIsLoading(true);

      try {
        const uploadedUrl = await uploadImage(uri);
        console.log(uri, uploadedUrl);
        if (uploadedUrl) {
          const updatedItems = items.map((item, i) =>
            i === index ? { ...item, photoUrl: uploadedUrl } : item
          );
          setItems(updatedItems);
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể upload ảnh');
      } finally {
        // Set loading to false when upload is finished
        setIsLoading(false);
      }
    }
  };

  const handleUpdateResult = (index: number, result: string) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, result } : item
    );
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    if (!newTitle.trim()) return;
    setItems([...items, { title: newTitle.trim(), result: '', photoUrl: '' }]);
    setNewTitle('');
  };

  const handleSubmit = async () => {
    // Kiểm tra tất cả các item có cả title và photoUrl đều có giá trị hợp lệ
    const allFieldsValid = items.every(item => item.result.trim() !== "" && item.photoUrl !== "");
  
    if (!allFieldsValid) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ mô tả công việc và chụp ảnh cho tất cả các mục');
      return;  // Ngừng thực hiện khi thiếu tiêu đề hoặc ảnh
    }
  
    try {
      const result = await generateAndCompleteTask(deviceId, items, 'Kiểm tra bảo trì thường kỳ');
      if (result) {
        Alert.alert('Thành công', 'Đã hoàn thành nhiệm vụ bảo trì');
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', 'Không thể gửi dữ liệu');
      }
    } catch (err) {
      Alert.alert('Lỗi kết nối', 'Vui lòng kiểm tra mạng');
    }
  };

  return (
    <View className="flex-1">
      <AppHeader title="Bảo trì thiết bị" onBackPress={() => navigation.goBack()} />
      <View className="flex-1 bg-white p-4">
        <Text className="mb-4 text-xl font-bold text-gray-800">Thực hiện nhiệm vụ bảo trì</Text>

        {/* Show loading indicator when isLoading is true */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item, index }) => (
              <View className="mb-4 rounded-xl border bg-gray-100 p-3">
                <Text className="font-semibold text-gray-700">{item.title}</Text>
                <TextInput
                  placeholder="Mô tả "
                  value={item.result}
                  onChangeText={(text) => handleUpdateResult(index, text)}
                  className="mt-2 rounded border bg-white px-2 py-1 text-gray-800"
                />
                <TouchableOpacity
                  className="mt-2 flex-row items-center"
                  onPress={() => handlePickImage(index)}
                >
                  <Ionicons name="camera" size={20} color="#333" />
                  <Text className="ml-2 text-gray-600">Chụp ảnh</Text>
                </TouchableOpacity>
                <View className="mt-2 rounded-lg overflow-hidden">
                  {item.photoUrl ? (
                    <Image
                      source={{ uri: item.photoUrl }}
                      style={{ height: 160, width: 160 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="text-gray-500">Chưa có ảnh</Text>
                  )}
                </View>
              </View>
            )}
          />
        )}

        <View className="mt-2 flex-row items-center gap-2">
          <TextInput
            placeholder="Thêm mục mới chi tiết"
            value={newTitle}
            onChangeText={setNewTitle}
            className="flex-1 rounded border bg-white px-3 py-2 text-gray-800"
          />
          <TouchableOpacity onPress={handleAddItem} className="rounded bg-blue-500 px-4 py-2">
            <Text className="font-semibold text-white">Thêm</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          className="mt-4 items-center rounded-xl bg-green-600 py-3"
        >
          <Text className="font-bold text-white">Gửi </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
