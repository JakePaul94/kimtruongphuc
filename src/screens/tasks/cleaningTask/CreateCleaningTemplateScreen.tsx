import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { CreateCleaningTemplatePayload } from '~/types/tasksType';
import { useAppStore } from '~/store/useAppStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { createCleaningTaskTemplate } from '~/apis/tasksApi';
import AppHeader from '~/components/AppHeader';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CreateCleaningTaskTemplateScreen() {
  const { cleaningTaskTemplates, boilers, fetchInitialData } = useAppStore();
  const navigation = useNavigation<NavigationProp>();

  const [boilerId, setBoilerId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [locations, setLocations] = useState<CreateCleaningTemplatePayload['locations']>([]);

  const handleAddLocation = () => {
    setLocations([...locations, { name: '', instructions: '' }]);
  };

  const handleLocationChange = (index: number, field: string, value: string) => {
    const updated = [...locations];
    (updated[index] as any)[field] = value;
    setLocations(updated);
  };

  const handleSubmit = async () => {
    try {
      if (!boilerId || !name || locations.length === 0) return;
      const exists = cleaningTaskTemplates.find((tpl) => tpl.boilerId === boilerId);
      if (exists) return Alert.alert('Lò hơi đã có template');
      const newCleaningTaskTemplate = await createCleaningTaskTemplate({
        name,
        boilerId,
        description,
        locations,
      });

      await fetchInitialData();
      Alert.alert('Thành công', 'Tạo template thành công');
      navigation.replace('CleaningTaskTemplate');
    } catch (error) {
      console.error('Lỗi khi tạo mẫu nhiệm vụ:', error);
      Alert.alert('Lỗi', `Không thể tạo mẫu nhiệm vụ mới. ${error || ''}`);
    }
  };

  return (
    <View className="flex-1">
      <AppHeader title="Tạo mẫu nhiệm vụ vệ sinh lò hơi" onBackPress={navigation.goBack} />
      <ScrollView className="flex-1 bg-gray-100 p-4">
        <Text className="mb-2 text-lg font-bold text-gray-800">Chọn lò hơi</Text>
        <View className="rounded-md border border-gray-300 bg-white">
          <Picker selectedValue={boilerId} onValueChange={(v) => setBoilerId(v)}>
            <Picker.Item label="Chọn lò hơi" value={null} />
            {boilers.map((b) => (
              <Picker.Item key={b.id} label={b.name} value={b.id} />
            ))}
          </Picker>
        </View>
        <Text className="mt-4 text-lg font-bold text-gray-800">Tên template</Text>
        <TextInput
          className="rounded-md border border-gray-300 bg-white p-2 text-gray-700"
          value={name}
          onChangeText={setName}
        />
        <Text className="mt-4 text-lg font-bold text-gray-800">Mô tả</Text>
        <TextInput
          className="rounded-md border border-gray-300 bg-white p-2 text-gray-700"
          value={description}
          onChangeText={setDescription}
        />
        <Text className="mt-4 text-lg font-bold text-gray-800">Vị trí</Text>
        {locations.map((loc, index) => (
          <View key={index} className="mb-4 rounded-md border border-gray-200 bg-white p-3">
            <TextInput
              className="mb-2 rounded-md border border-gray-300 p-2 text-gray-700"
              placeholder="Tên vị trí"
              value={loc.name}
              onChangeText={(text) => handleLocationChange(index, 'name', text)}
            />
            <TextInput
              className="rounded-md border border-gray-300 p-2 text-gray-700"
              placeholder="Hướng dẫn"
              value={loc.instructions}
              onChangeText={(text) => handleLocationChange(index, 'instructions', text)}
            />
          </View>
        ))}
        <TouchableOpacity
          onPress={handleAddLocation}
          className="mt-4 items-center rounded-md bg-blue-500 p-3">
          <Text className="text-center font-bold text-white">+ Thêm vị trí</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          className="mt-6 items-center rounded-md bg-green-500 p-3">
          <Text className="text-center font-bold text-white">Tạo template</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
