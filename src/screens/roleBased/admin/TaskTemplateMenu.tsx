import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '~/components/AppHeader';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export default function TaskTemplateMenuScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View className="flex-1 bg-green-50">
      <AppHeader title="Quản lý mẫu công việc" onBackPress={()=>{navigation.goBack()}} rightComponent={
    <TouchableOpacity
      onPress={() => {
        Alert.alert(
          "Hướng dẫn",
          "Đây là màn hình để quản lý mẫu công việc. Công việc vệ sinh và báo cáo chất lượng nước sẽ được server tự động tạo vào 6 giờ sáng hàng ngày dựa trên các mẫu này. Còn mẫu bảo trì sẽ là tiêu chuẩn để nhân viên tiến hành vào chụp ảnh báo cáo ."
        );
      }}
      className="items-center justify-center"
    >
      <Ionicons name="information-circle-outline" size={28} color="#24c40f" />
    </TouchableOpacity>
  } />

      <View className="px-6 py-2 mt-4 bg-white">
        <TouchableOpacity
          className="flex-row borderBottom items-center justify-between py-4"
          onPress={() => navigation.navigate('CleaningTaskTemplate')}>
          <Text className="text-lg font-semibold">Quản lý mẫu vệ sinh lò hơi</Text>
          <FontAwesome name="chevron-right" size={10} color={"#d0d0d0"}/>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row borderBottom items-center justify-between py-4"
          onPress={() => navigation.navigate('WaterReportTemplate')}>
          <Text className="text-lg font-semibold">Quản lý mẫu báo cáo chất lượng nước</Text>
          <FontAwesome name="chevron-right" size={10} color={"#d0d0d0"}/>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-between py-4"
          onPress={() => navigation.navigate('WaterReportTemplate')}>
          <Text className="text-lg font-semibold">Quản lý mẫu bảo trì thiết bị</Text>
          <FontAwesome name="chevron-right" size={10} color={"#d0d0d0"}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}
