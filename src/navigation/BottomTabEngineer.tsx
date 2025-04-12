import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons';

import DashBoardScreen from '~/screens/DashBoardScreen';
import TaskListScreen from '~/screens/roleBased/engineer/TaskListScreen';
import MaintenanceLogScreen from '~/screens/roleBased/engineer/MaintenanceLogScreen';
import SettingScreen from '~/screens/SettingScreen';

export type EngineerTabParamList = {
  DashBoard: undefined;
  TaskList: undefined;
  MaintenanceLog: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<EngineerTabParamList>();

export default function BottomTabEngineer() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'DashBoard':
              return <MaterialIcons name="dashboard" size={size} color={color} />;
            case 'TaskList':
              return <Ionicons name="list-circle-outline" size={size} color={color} />;
            case 'MaintenanceLog':
              return <AntDesign name="file1" size={size} color={color} />;
            case 'Settings':
              return <MaterialIcons name="settings" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#3674B5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="DashBoard" component={DashBoardScreen} options={{ title: 'Trang chính' }} />
      <Tab.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Danh sách Task' }} />
      <Tab.Screen name="MaintenanceLog" component={MaintenanceLogScreen} options={{ title: 'Nhật ký bảo trì' }} />
      <Tab.Screen name="Settings" component={SettingScreen} options={{ title: 'Cài đặt' }} />
    </Tab.Navigator>
  );
}