/* eslint-disable prettier/prettier */
import { Ionicons, MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import CameraScreen from '../screens/PhotoCaptureScreen';
import DashBoardScreen from '../screens/DashBoardScreen';
import SettingScreen from '../screens/SettingScreen';
import TodoListScreen from '~/screens/ToDoListScreen';
import CreateTaskScreen from '~/screens/CreateTaskScreen';
import TrackingScreen from '~/screens/TrackingScreen';
import { useAuthStore } from '~/store/authStore';

export type RootTabParamList = {
  DashBoard: undefined;
  TodoList: undefined;
  Settings: undefined;
  CreateTask : undefined;
  Tracking:undefined
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabNavigator() {
  const user = useAuthStore((state) => state.user); // Lấy thông tin user
  const isAdmin = user?.role === 'admin';
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'DashBoard') {
            return <MaterialIcons name="dashboard" size={size} color={color} />;
          } else if (route.name === 'TodoList') {
            return <AntDesign name="calendar" size={size} color={color} />;
          } else if (route.name === 'Settings') {
            return <MaterialCommunityIcons name="devices" size={size} color={color} />;
          } else if (route.name === 'CreateTask') {
            return <Ionicons name="create" size={size} color={color} />;
          } else if (route.name === 'Tracking') {
            return <AntDesign name="linechart" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#3674B5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="DashBoard" component={DashBoardScreen} options={{ title: 'Trang Chính' }} />
      <Tab.Screen name="TodoList" component={TodoListScreen} options={{ title: 'Nhiệm vụ' }} />
      <Tab.Screen name="Settings" component={SettingScreen} options={{ title: 'Thiết bị' }} />
      <Tab.Screen name="Tracking" component={TrackingScreen} options={{ title: 'Theo dõi' }} />

      {/* Tab dành riêng cho admin */}
      {isAdmin && (
        <Tab.Screen
          name="CreateTask"
          component={CreateTaskScreen}
          options={{ title: 'Tạo task' }}
        />
      )}
    </Tab.Navigator>
  );
}
