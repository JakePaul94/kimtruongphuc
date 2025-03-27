import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { RootStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'WaterQualityReport'>;

export default function WaterQualityReportScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-white p-4">
      <Text className="mb-4 text-xl font-bold">📋 Báo cáo chất lượng nước</Text>

      <Text className="text-lg">Mô tả tình trạng:</Text>
      <TextInput
        className="mb-4 mt-2 rounded-lg border p-2"
        placeholder="Nhập thông tin chi tiết..."
      />

      <TouchableOpacity
        className="mt-4 rounded-lg bg-blue-500 p-3"
        onPress={() => navigation.goBack()}>
        <Text className="text-center font-bold text-white">Gửi báo cáo</Text>
      </TouchableOpacity>
    </View>
  );
}
