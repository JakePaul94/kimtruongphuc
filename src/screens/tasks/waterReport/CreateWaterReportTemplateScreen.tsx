import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useAppStore } from '~/store/useAppStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { createWaterReportTemplate } from '~/apis/tasksApi';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type WaterReportTemplateItem = {
  label: string;
  description?: string;
};

export default function CreateWaterReportTemplateScreen() {
  const { boilers, fetchInitialData,waterReportTemplates } = useAppStore();
  const navigation = useNavigation<NavigationProp>();

  const [boilerId, setBoilerId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<WaterReportTemplateItem[]>([{ label: '' }]);

  const handleAddItem = () => {
    setItems([...items, { label: '' }]);
  };

  const handleItemChange = (index: number, value: string, field: 'label' | 'description') => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    if (!boilerId || !name || items.some(item => !item.label)) {
      return Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
    }
    if (boilerId && waterReportTemplates.some(item => item.boilerId === boilerId)) {
      return Alert.alert('Lỗi', 'Mẫu cho lò hơi đã tồn tại,vui lòng chỉnh sửa thay vì tạo mới!');
      } 
    try {
      const payload = {
        boilerId,
        name,
        description,
        items,
      };
      await createWaterReportTemplate(payload);
      await fetchInitialData();
      Alert.alert('Thành công', 'Đã tạo mẫu báo cáo nước thành công.');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi tạo mẫu:', error);
      Alert.alert('Lỗi', 'Không thể tạo mẫu báo cáo nước.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-xl font-bold text-gray-800 mb-4">Tạo Mẫu Báo Cáo Nước Mới</Text>

      <Text className="text-lg font-semibold text-gray-700 mb-2">Chọn Lò Hơi</Text>
      <View className="border border-gray-300 rounded-md bg-white mb-4">
        <Picker selectedValue={boilerId} onValueChange={(value) => setBoilerId(value)}>
          <Picker.Item label="Chọn lò hơi" value={null} />
          {boilers.map((boiler) => (
            <Picker.Item key={boiler.id} label={boiler.name} value={boiler.id} />
          ))}
        </Picker>
      </View>

      <Text className="text-lg font-semibold text-gray-700 mb-2">Tên Mẫu Báo Cáo</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 bg-white text-gray-700 mb-4"
        value={name}
        onChangeText={setName}
        placeholder="Ví dụ: Kiểm tra nước hàng ngày Lò hơi A"
      />

      <Text className="text-lg font-semibold text-gray-700 mb-2">Mô Tả (tùy chọn)</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 bg-white text-gray-700 mb-4"
        value={description}
        onChangeText={setDescription}
        placeholder="Mô tả chi tiết về mẫu báo cáo này"
      />

      <Text className="text-lg font-semibold text-gray-700 mb-2">Các Mục Kiểm Tra</Text>
      {items.map((item, index) => (
        <View key={index} className="bg-white rounded-md border border-gray-200 p-3 mb-2">
          <Text className="text-gray-600 font-semibold mb-1">Mục {index + 1}</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700 mb-2"
            placeholder="Nhãn mục kiểm tra (ví dụ: pH Level)"
            value={item.label}
            onChangeText={(text) => handleItemChange(index, text, 'label')}
          />
          <TextInput
            className="border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700"
            placeholder="Mô tả (tùy chọn)"
            value={item.description}
            onChangeText={(text) => handleItemChange(index, text, 'description')}
          />
        </View>
      ))}

      <TouchableOpacity onPress={handleAddItem} className="bg-blue-500 rounded-md p-3 items-center mt-4">
        <Text className="text-white font-bold">+ Thêm Mục Kiểm Tra</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSubmit} className="bg-green-500 rounded-md p-3 items-center mt-6">
        <Text className="text-white font-bold">Tạo Mẫu Báo Cáo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}