import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '~/components/AppHeader';

const CreateBoilerScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateBoiler = async () => {
    if (!name || !location) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ Tên và Địa điểm lò hơi.');
      return;
    }

    try {
      // Gửi request tạo lò hơi lên server (tuỳ thuộc API của bạn)
      // Ví dụ:
      // await boilerService.create({ name, location, description });

      Alert.alert('Thành công', 'Tạo lò hơi thành công!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Thất bại', 'Không thể tạo lò hơi. Vui lòng thử lại.');
    }
  };

  return (
    <View className='flex-1 bg-gray-100'>
        <AppHeader title='Thêm lò hơi mới' onBackPress={navigation.goBack}/>
        <KeyboardAvoidingView
          className="flex-1 bg-white p-4"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
        
            <Text className="mb-1 text-gray-700">Tên Lò Hơi</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nhập tên lò hơi"
              className="border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <Text className="mb-1 text-gray-700">Địa điểm</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Nhập địa điểm"
              className="border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <Text className="mb-1 text-gray-700">Mô tả (tuỳ chọn)</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Nhập mô tả"
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded px-3 py-2 mb-6"
            />
            <TouchableOpacity
              onPress={handleCreateBoiler}
              className="bg-green-600 py-3 rounded"
            >
              <Text className="text-white text-center font-semibold">Tạo Lò Hơi</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
    </View>
  );
};

export default CreateBoilerScreen;
