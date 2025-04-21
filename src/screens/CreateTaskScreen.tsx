import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "~/navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CreateTaskScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-xl font-bold mb-4">CreateTask Screen</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("CleaningTaskTemplate")}
        className="mt-4 bg-blue-500 px-4 py-2 rounded">
        <Text className="text-white text-base">Xem danh sách template vệ sinh</Text>
      </TouchableOpacity>
       <TouchableOpacity
        onPress={() => navigation.navigate("WaterReportTemplate")}
        className="mt-4 bg-blue-500 px-4 py-2 rounded">
        <Text className="text-white text-base">Xem danh sách template báo cáo chất lượng nước</Text>
      </TouchableOpacity>
    </View>
  );
}
