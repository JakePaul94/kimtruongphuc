import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '~/store/useAppStore'; // Giả định store quản lý state
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/AppNavigator';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppHeader from '~/components/AppHeader';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WaterReportTemplateScreen() {
  const waterReportTemplates = useAppStore((state) => state.waterReportTemplates);
  console.log(waterReportTemplates)
  const navigation = useNavigation<NavigationProp>();

  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader title="Mẫu Báo Cáo Nước" />
      <View className='flex-1 gap-4 p-4'>
        <FlatList
          data={waterReportTemplates}
          keyExtractor={(item) => item.id.toString()}
          className='gap-6'
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white border-b border-gray-200 py-3 mb-4 px-4"
              onPress={() =>
                navigation.navigate('EditWaterReportTemplate', { template: item })
              }>
              <Text className="text-lg font-bold text-gray-800 mb-1">{item.name}</Text>
              <Text className="text-sm text-gray-600">{item.description}</Text>
              <Text className="text-xs text-gray-500 mt-1">Lò hơi: {item.boiler?.name}</Text>
            </TouchableOpacity>
          )}
         
        />
      </View>

      {/* Nút thêm mới */}
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateWaterReportTemplate')}
        className="absolute bottom-6 right-6 h-14 w-14 rounded-full bg-blue-500 shadow-md items-center justify-center">
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}