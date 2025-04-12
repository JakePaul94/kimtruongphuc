import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import DashBoardScreen from '~/screens/DashBoardScreen';
import MyTasksScreen from '~/screens/roleBased/boilerWorker/MyTasksScreen';
import SettingScreen from '~/screens/SettingScreen';
import DeviceScreen from '~/screens/devices/DeviceScreen'; // ✅ Import màn hình thiết bị

export type BoilerWorkerTabParamList = {
  DashBoard: undefined;
  MyTasks: undefined;
  Settings: undefined;
  Devices: undefined;
};

const Tab = createBottomTabNavigator<BoilerWorkerTabParamList>();

export default function BottomTabBoilerWorker() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'DashBoard':
              return <MaterialIcons name="dashboard" size={size} color={color} />;
            case 'MyTasks':
              return <Ionicons name="checkmark-done-sharp" size={size} color={color} />;
            case 'Settings':
              return <MaterialIcons name="settings" size={size} color={color} />;
            case 'Devices':
              return <Ionicons name="hardware-chip-outline" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#3674B5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="DashBoard" component={DashBoardScreen} options={{ title: 'Trang chính' }} />
      <Tab.Screen name="MyTasks" component={MyTasksScreen} options={{ title: 'Công việc của tôi' }} />
      <Tab.Screen name="Devices" component={DeviceScreen} options={{ title: 'Thiết bị' }} />
      <Tab.Screen name="Settings" component={SettingScreen} options={{ title: 'Cài đặt' }} />
    </Tab.Navigator>
  );
}
