import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoCapture'>;
export default function PhotoCaptureScreen({ navigation }: Props) {
  const [photos, setPhotos] = useState<string[]>([]);

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync();
  
    if (!result.canceled && result.assets.length > 0) {
      setPhotos([...photos, result.assets[0].uri]);  
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4">📷 Chụp ảnh báo cáo</Text>

      {photos.map((photo, index) => (
        <Image key={index} source={{ uri: photo }} className="w-full h-40 rounded-lg mb-2" />
      ))}

      <TouchableOpacity onPress={takePhoto} className="bg-blue-500 p-3 rounded-lg mt-4">
        <Text className="text-center text-white font-bold">📸 Chụp ảnh</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} className="bg-green-500 p-3 rounded-lg mt-4">
        <Text className="text-center text-white font-bold">✔ Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}
