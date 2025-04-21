import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '~/store/useAppStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/AppNavigator';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppHeader from '~/components/AppHeader';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CleaningTaskTemplateScreen() {
  const { cleaningTaskTemplates, boilers } = useAppStore();
  const navigation = useNavigation<NavigationProp>();

  return (
    <View className="flex-1">
      <AppHeader title="Mẫu nhiệm vụ vệ sinh lò hơi" onBackPress={navigation.goBack} />
      <View className="relative flex-1 bg-gray-100 p-4">
        <FlatList
          data={cleaningTaskTemplates}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="border-b border-gray-200 bg-white px-4 py-3"
              onPress={() =>
                navigation.navigate('EditCleaningTaskTemplate', {
                  template: item,
                })
              }><Text className='text-xl font-bold  color-red-900'>{boilers.find((b) => b.id === item.boilerId)?.name}</Text>
              <Text className="mb-1 text-lg font-bold text-gray-800">{item.name}</Text>
              <Text className="text-sm text-gray-600">{item.description}</Text>
              
            </TouchableOpacity>
          )}
        />
        {/* Nút thêm mới */}
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateCleaningTaskTemplate')}
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-md">
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
