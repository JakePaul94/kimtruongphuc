import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/AppNavigator';
import AppHeader from '~/components/AppHeader';
import { useAppStore } from '~/store/useAppStore';
import { updateWaterReportTemplate, deleteWaterReportTemplate } from '~/apis/tasksApi'; // Giả định có hàm delete
import { WaterReportItem } from '~/types/tasksType';
import { Ionicons } from '@expo/vector-icons';

type EditWaterReportTemplateRouteProp = RouteProp<RootStackParamList, 'EditWaterReportTemplate'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type WaterReportTemplate = {
  id: number;
  name: string;
  description?: string;
  boilerId: number;
  items: { id?: number; label: string; description?: string }[];
  boiler?: { id: number; name: string };
};

export default function EditWaterReportTemplateScreen() {
  const route = useRoute<EditWaterReportTemplateRouteProp>();
  const { template } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const { fetchInitialData } = useAppStore();

  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [items, setItems] = useState<Partial<WaterReportItem>[]>(template?.items);

  const handleItemChange = (index: number, value: string, field: 'label' | 'description') => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { label: '', templateId: template.id }]);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSave = async () => {
    const validItems = items.filter((item) => item.label !== undefined && item.label.trim() !== '');
    if (!name || validItems.length === 0) {
      return Alert.alert('Lỗi', 'Vui lòng điền tên mẫu và ít nhất một mục kiểm tra.');
    }

    try {
      const payload = {
        name,
        description,
        items: validItems.map((item) => ({
          templateId: template.id,
          label: item.label!.trim(),
          description: item.description ? item.description.trim() : '',
          id: item.id,
        })),
      };
      await updateWaterReportTemplate(template.id, payload);
      await fetchInitialData();
      Alert.alert('Thành công', 'Đã cập nhật mẫu báo cáo nước thành công.');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi cập nhật mẫu:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật mẫu báo cáo nước.');
    }
  };

  const handleDeleteTemplate = () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa mẫu "${template.name}" không?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWaterReportTemplate(template.id);
              await fetchInitialData();
              Alert.alert('Thành công', 'Đã xóa mẫu báo cáo nước thành công.');
              navigation.goBack();
            } catch (error) {
              console.error('Lỗi xóa mẫu:', error);
              Alert.alert('Lỗi', 'Không thể xóa mẫu báo cáo nước.');
            }
          },
        },
      ],
    );
  };

  if (!template) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg text-gray-600">Không tìm thấy mẫu báo cáo nước.</Text>
      </View>
    );
  }

  return (
    <View className='flex-1'>
       <AppHeader title="Chỉnh Sửa Mẫu Báo Cáo Nước" onBackPress={navigation.goBack} rightComponent={ <TouchableOpacity onPress={handleDeleteTemplate} className="p-2">
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>} />
      <ScrollView className="flex-1 bg-gray-100 p-4">
      
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-800">{template.name}</Text>
         
        </View>
        <Text className="mb-2 text-lg font-semibold text-gray-700">Tên Mẫu Báo Cáo</Text>
        <TextInput
          className="mb-4 rounded-md border border-gray-300 bg-white p-2 text-gray-700"
          value={name}
          onChangeText={setName}
        />
        <Text className="mb-2 text-lg font-semibold text-gray-700">Mô Tả (tùy chọn)</Text>
        <TextInput
          className="mb-4 rounded-md border border-gray-300 bg-white p-2 text-gray-700"
          value={description}
          onChangeText={setDescription}
        />
        <Text className="mb-2 text-lg font-semibold text-gray-700">Các Mục Kiểm Tra</Text>
        {items.map((item, index) => (
          <View key={index} className="mb-2 rounded-md border border-gray-200 bg-white p-3">
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="font-semibold text-gray-600">Mục {index + 1}</Text>
              {items.length > 1 && (
                <TouchableOpacity onPress={() => handleDeleteItem(index)} className="p-2">
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              className="mb-2 rounded-md border border-gray-300 bg-gray-100 p-2 text-gray-700"
              placeholder="Nhãn mục kiểm tra (ví dụ: Độ dẫn điện)"
              value={item.label}
              onChangeText={(text) => handleItemChange(index, text, 'label')}
            />
            <TextInput
              className="rounded-md border border-gray-300 bg-gray-100 p-2 text-gray-700"
              placeholder="Mô tả (tùy chọn)"
              value={item.description}
              onChangeText={(text) => handleItemChange(index, text, 'description')}
            />
          </View>
        ))}
        <TouchableOpacity
          onPress={handleAddItem}
          className="mt-4 items-center rounded-md bg-blue-500 p-3">
          <Text className="font-bold text-white">+ Thêm Mục Kiểm Tra</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          className="mt-6 items-center rounded-md bg-green-500 p-3">
          <Text className="font-bold text-white">Lưu Thay Đổi</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}