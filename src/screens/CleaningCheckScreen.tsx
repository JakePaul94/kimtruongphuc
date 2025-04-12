import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, PixelRatio } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { formatDateDDMMYY } from '~/utils/timeHelper';

type Props = NativeStackScreenProps<RootStackParamList, 'CleaningCheck'>;

export default function CleaningCheckScreen({ navigation }: Props) {
  const route = useRoute<NativeStackScreenProps<RootStackParamList, 'CleaningCheck'>['route']>();
  const [photos, setPhotos] = useState<{ [key: string]: string | null }>({
    phBefore: null,
    phAfter: null,
    ppmBefore: null,
    ppmAfter: null,
    chemicalTest: null,
    normal: null,
  });

  const handlePhotoCapture = (data: {
    photoUri: string | undefined;
    nameImg: string;
    result: any;
  }) => {
    if (data.photoUri && data.nameImg) {
      setPhotos((prevPhotos) => ({
        ...prevPhotos,
        [data.nameImg]: data.photoUri || null,
      }));
    }
  };

  return (
    <View className="flex-1 bg-white p-0 ">
      <SafeAreaView className="h-8 w-full"></SafeAreaView>
      <View style={styles.thinBorder} className="flex h-16 flex-row items-center  px-2">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialIcons className="ml-2" name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="ml-4 text-2xl">Nghiệm thu vệ sinh</Text>
      </View>
      <View className="flex h-12 w-full items-center justify-center text-center">
        <Text className="text-xl">Nghiệm thu ngày {formatDateDDMMYY(new Date())}</Text>
      </View>
      <View className="p-4">
        {Object.entries({
          area1: 'Khu 1',
          area2: 'Khu 2',
        }).map(([key, title]) => (
          <View
            key={key}
            className="mb-6 rounded-xl bg-white p-4 shadow-md" // Thêm bóng đổ và bo góc
          >
            <Text className="text-lg font-semibold">{title}:</Text>
            {photos[key] && (
              <Image
                source={{ uri: photos[key]! }}
                className="mt-2 h-24 w-24 rounded-lg shadow-sm" // Tăng kích thước ảnh
              />
            )}
            <TouchableOpacity
              className="mt-2 rounded-lg bg-blue-500 p-2"
              onPress={() =>
                navigation.navigate('PhotoCapture', {
                  mode: 'qr',
                  nameImg: key,
                  title: title,
                  callback: handlePhotoCapture,
                })
              }>
              <Text className="text-center font-bold text-white">📸 Chụp</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TouchableOpacity
        className="m-6 rounded-lg bg-green-600  p-4 shadow-lg" // Nút lớn hơn, nổi bật
        onPress={() => navigation.goBack()}>
        <Text className="text-center text-lg font-bold text-white">✔ Gửi báo cáo</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  thinBorder: {
    borderBottomWidth: 1 / PixelRatio.get(), // Mỏng nhất theo mật độ điểm ảnh
    borderBottomColor: '#e5e7eb', // Màu border
  },
});
