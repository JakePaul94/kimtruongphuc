import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createIncidentReport } from '~/apis/incidentApi'; // bạn tự định nghĩa API call này
import AppHeader from '~/components/AppHeader';

export default function CreateIncidentReportScreen({ route }: any) {
  const navigation = useNavigation();
  const deviceId = route?.params?.deviceId || null;
  const reportedBy = 1; // có thể lấy từ auth context hoặc JWT
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<{ uri: string; name: string; type: string }[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPhotos(prev => [
        ...prev,
        {
          uri: asset.uri,
          name: asset.fileName || `photo-${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
        },
      ]);
    }
  };

  const submitReport = async () => {
    if (!deviceId || !description || photos.length === 0) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ và thêm ít nhất 1 ảnh.');
      return;
    }

    const formData = new FormData();
    formData.append('deviceId', deviceId.toString());
    formData.append('reportedBy', reportedBy.toString());
    formData.append('description', description);
    photos.forEach((photo, index) => {
      formData.append('photos', {
        uri: photo.uri,
        name: photo.name,
        type: photo.type,
      } as any);
    });

    try {
      await createIncidentReport(formData);
      Alert.alert('Thành công', 'Báo cáo đã được gửi.');
      navigation.goBack();
    } catch (err) {
      console.error('Lỗi gửi báo cáo:', err);
      Alert.alert('Lỗi', 'Không thể gửi báo cáo sự cố.');
    }
  };

  return (
    <View className='flex-1'><AppHeader title='Báo cáo sự cố thiết bị' onBackPress={navigation.goBack} /><ScrollView className="flex-1 bg-white p-4">
      

      <Text className="text-lg text-gray-700 mb-1">Mô tả sự cố :</Text>
      <TextInput
        multiline
        value={description}
        onChangeText={setDescription}
        placeholder="Nhập mô tả chi tiết..."
        className="border rounded-md p-2 text-base mb-4 bg-gray-50"
        style={{ minHeight: 100 }}
      />

      <Text className="text-lg text-gray-700 mb-2">Hình ảnh minh họa :</Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {photos.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo.uri }}
            className="w-24 h-24 rounded-md"
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={pickImage}
        className="mb-6 flex-row items-center justify-center border border-dashed border-gray-400 rounded-md p-4"
      >
        <Ionicons name="camera" size={20} color="gray" />
        <Text className="ml-2 text-gray-600">Thêm ảnh</Text>
      </TouchableOpacity>

      <Button title="Gửi báo cáo" onPress={submitReport} />
    </ScrollView></View>
  );
}
