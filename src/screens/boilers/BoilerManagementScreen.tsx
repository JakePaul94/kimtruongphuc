import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/AppNavigator';
import AppHeader from '~/components/AppHeader';
import { useAppStore } from '~/store/useAppStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BoilerManagementScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const boilers = useAppStore((state) => state.boilers);
 

  const handlePressBoiler = (boilerId: number) => {
    navigation.navigate('BoilerDetail', { boilerId });
  };

  const handleAddBoiler = () => {
    navigation.navigate('CreateBoiler');
  };

  return (
    <View className="flex-1 bg-white">
      <AppHeader title="Quản lý lò hơi" onBackPress={() => navigation.goBack()} />
      <View className="flex-1 p-4">
        {boilers.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">Chưa có lò hơi nào.</Text>
          </View>
        ) : (
          <FlatList
            data={boilers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlePressBoiler(item.id)}
                className="flex-row items-center justify-between border-b border-gray-200 p-4"
              >
                <View className="flex-row items-center gap-4">
                  <Ionicons name="thermometer" size={22} color="green" />
                  <View>
                    <Text className="text-base text-green-800">{item.name}</Text>
                    {item.location && (
                      <Text className="text-sm text-gray-500">{item.location}</Text>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="gray" />
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleAddBoiler}
        className="absolute bottom-6 right-6 bg-green-600 p-4 rounded-full shadow-lg"
        style={{ elevation: 5 }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default BoilerManagementScreen;
