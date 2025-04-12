import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import DashBoardScreen from '~/screens/DashBoardScreen';
import SettingScreen from '~/screens/SettingScreen';
import CreateTaskScreen from '~/screens/CreateTaskScreen';
import TrackingScreen from '~/screens/TrackingScreen';
import UserManagementScreen from '~/screens/roleBased/admin/UserManagementScreen';

export type AdminTabParamList = {
  DashBoard: undefined;
  Settings: undefined;
  CreateTask: undefined;
  Tracking: undefined;
  UserManagement: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

export default function BottomTabAdmin() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'DashBoard':
              return <MaterialIcons name="dashboard" size={size} color={color} />;
            case 'Settings':
              return <MaterialCommunityIcons name="devices" size={size} color={color} />;
            case 'CreateTask':
              return <Ionicons name="create" size={size} color={color} />;
            case 'Tracking':
              return <AntDesign name="linechart" size={size} color={color} />;
            case 'UserManagement':
              return <MaterialIcons name="manage-accounts" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#3674B5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="DashBoard" component={DashBoardScreen} options={{ title: 'Trang chính' }} />
      <Tab.Screen name="Settings" component={SettingScreen} options={{ title: 'Thiết bị' }} />
      <Tab.Screen name="CreateTask" component={CreateTaskScreen} options={{ title: 'Tạo Task' }} />
      <Tab.Screen name="Tracking" component={TrackingScreen} options={{ title: 'Theo dõi' }} />
      <Tab.Screen name="UserManagement" component={UserManagementScreen} options={{ title: 'QL Người dùng' }} />
    </Tab.Navigator>
  );
}
