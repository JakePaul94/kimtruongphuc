import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useAppStore } from '~/store/useAppStore';
import { updateCleaningTaskTemplate } from '~/apis/tasksApi';
import { CleaningTemplate, CleaningTemplateLocation } from '~/types/tasksType';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/AppNavigator';
import AppHeader from '~/components/AppHeader';

type EditCleaningTaskTemplateRouteProp = RouteProp<RootStackParamList, 'EditCleaningTaskTemplate'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function EditCleaningTaskTemplateScreen() {
  const route = useRoute<EditCleaningTaskTemplateRouteProp>();
  const template = route.params.template;
  const navigation = useNavigation<NavigationProp>();
  const { fetchInitialData } = useAppStore();

  const [description, setDescription] = useState(template?.description || '');
  const [locations, setLocations] = useState<Partial<CleaningTemplateLocation>[]>(
    template?.locations || []
  );

  const handleLocationChange = (
    index: number,
    field: keyof CleaningTemplateLocation,
    value: string
  ) => {
    const updated = [...locations];
    updated[index] = { ...updated[index], [field]: value };
    setLocations(updated);
  };

  const handleAddLocation = () => {
    setLocations([
      ...locations,
      {
        name: '',
        instructions: '',
        qrCodeIdentifier: '',
        templateId: template.id,
      },
    ]);
  };

  const handleSave = async () => {
    const overwriteData: Partial<CleaningTemplate> = {
      description: description,
      locations: locations as CleaningTemplateLocation[],
    };

    try {
      await updateCleaningTaskTemplate(template.id, overwriteData);
      await fetchInitialData();
      navigation.goBack();
      Alert.alert('Thành công', 'Cập nhật template thành công');
    } catch (error) {
      console.error('Lỗi khi cập nhật template:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật template');
    }
  };

  if (!template)
    return (
      <Text className="flex-1 items-center justify-center text-lg text-gray-600">
        Không tìm thấy template
      </Text>
    );

  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader title="Chỉnh sửa mẫu nhiệm vụ vệ sinh" onBackPress={navigation.goBack} />
      <ScrollView className="flex-1 p-4">
        <Text className="mb-4 text-xl font-bold text-gray-800">{template.name}</Text>
        <Text className="mb-2 font-semibold text-gray-700">Chỉnh sửa mô tả</Text>
        <TextInput
          className="mb-4 rounded-md border border-gray-300 bg-white p-2 text-gray-700"
          value={description}
          placeholder={template?.description}
          onChangeText={setDescription}
          multiline
        />
        {locations.map((loc, index) => (
          <View key={index} className="mb-4 rounded-md border border-gray-200 bg-white p-3">
            <Text className="mb-2 font-semibold text-gray-700">Vị trí {index + 1}</Text>
            <TextInput
              className="mb-2 rounded-md border border-gray-300 p-2 text-gray-700"
              value={loc.name}
              onChangeText={(text) => handleLocationChange(index, 'name', text)}
              placeholder="Tên vị trí"
            />
            <TextInput
              className="mb-2 rounded-md border border-gray-300 p-2 text-gray-700"
              value={loc.instructions}
              onChangeText={(text) => handleLocationChange(index, 'instructions', text)}
              placeholder="Hướng dẫn vệ sinh"
            />
            <TextInput
              className="rounded-md border border-gray-300 p-2 text-gray-700"
              value={loc.qrCodeIdentifier || ''}
              onChangeText={(text) => handleLocationChange(index, 'qrCodeIdentifier', text)}
              placeholder="Mã QR (nếu có)"
            />
          </View>
        ))}
        <TouchableOpacity
          onPress={handleAddLocation}
          className="mt-4 items-center rounded-md bg-blue-500 p-3">
          <Text className="text-center font-bold text-white">+ Thêm vị trí</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          className="mt-6 items-center rounded-md bg-green-500 p-3">
          <Text className="text-center font-bold text-white">Lưu thay đổi</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
