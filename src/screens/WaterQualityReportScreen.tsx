import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  PixelRatio,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { formatDateDDMMYY } from '~/utils/timeHelper';

type Props = NativeStackScreenProps<RootStackParamList, 'WaterQualityReport'>;

export default function WaterQualityReportScreen({ navigation }: Props) {
  const route =
    useRoute<NativeStackScreenProps<RootStackParamList, 'WaterQualityReport'>['route']>();
  interface PhotoData {
    uri: string | null;
    predictions: string[];
  }

  const [photos, setPhotos] = useState<{ [key: string]: PhotoData }>({
    phBefore: { uri: null, predictions: [] },
    phAfter: { uri: null, predictions: [] },
    ppmBefore: { uri: null, predictions: [] },
    ppmAfter: { uri: null, predictions: [] },
    chemicalTest: { uri: null, predictions: [] },
    normal: { uri: null, predictions: [] },
  });
  const handlePhotoCapture = (data: {
    photoUri: string | undefined;
    nameImg: string;
    result?: string[];
  }) => {
    if (data.nameImg) {
      setPhotos((prev) => ({
        ...prev,
        [data.nameImg]: {
          uri: data.photoUri || null,
          predictions: data.result || [],
        },
      }));
    }
  };
  type CaptureMode = 'qr' | 'roi' | 'normal';
  type PhotoConfig = {
    title: string;
    mode: CaptureMode;
  };

  type PhotoConfigs = {
    phBefore: PhotoConfig;
    phAfter: PhotoConfig;
    ppmBefore: PhotoConfig;
    ppmAfter: PhotoConfig;
    chemicalTest: PhotoConfig;
    normal: PhotoConfig;
  };
  const photoConfigs: PhotoConfigs = {
    phBefore: { title: 'Ảnh đo PH 1', mode: 'roi' },
    phAfter: { title: 'Ảnh đo PH 2', mode: 'roi' },
    ppmBefore: { title: 'Ảnh đo ppm 1', mode: 'roi' },
    ppmAfter: { title: 'Ảnh đo ppm 2', mode: 'roi' },
    chemicalTest: { title: 'Ảnh test hóa chất', mode: 'normal' },
    normal: { title: 'Ảnh thường', mode: 'normal' },
  };
  return (
    <View className="flex-1 bg-white  ">
      <SafeAreaView className="h-8 w-full"></SafeAreaView>
      <View style={styles.thinBorder} className="flex h-16 flex-row items-center  px-2">
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialIcons className="ml-2" name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="ml-4 text-2xl">Báo cáo chất lượng nước</Text>
      </View>
      <ScrollView>
        <View className="flex h-12 w-full items-center justify-center text-center">
          <Text className="text-xl">Báo cáo ngày {formatDateDDMMYY(new Date())}</Text>
        </View>

        <View className="p-4">
          {Object.entries(photoConfigs).map(([key, config]) => (
            <View key={key} className="mb-6 rounded-xl bg-white p-4 shadow-md">
              <Text className="text-lg font-semibold">{config.title}:</Text>
              {photos[key].uri && (
                <View className="flex flex-row justify-start gap-6">
                  <Image
                    source={{ uri: photos[key].uri }}
                    className="mt-2 h-24 w-24 rounded-lg shadow-sm"
                  />
                  {photos[key].predictions.length > 0 && config.mode === 'roi' && (
                    <View className="mt-2">
                      <Text className="font-medium">Kết quả nhận diện:</Text>
                      {photos[key].predictions.map((prediction, index) => (
                        <Text key={index} className="text-sm">
                          {prediction}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              )}
              <TouchableOpacity
                className="mt-2 rounded-lg bg-blue-500 p-2"
                onPress={() =>
                  navigation.navigate('PhotoCapture', {
                    mode: config.mode,
                    nameImg: key,
                    title: config.title,
                    callback: handlePhotoCapture,
                  })
                }>
                <Text className="text-center font-bold text-white">📸 Chụp</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity
          className="m-6 rounded-lg bg-green-600 px-6 py-4 shadow-lg"
          onPress={() => navigation.goBack()}>
          <Text className="text-center text-lg font-bold text-white">✔ Gửi báo cáo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  thinBorder: {
    borderBottomWidth: 1 / PixelRatio.get(), // Mỏng nhất theo mật độ điểm ảnh
    borderBottomColor: '#e5e7eb', // Màu border
  },
});
