import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import DashBoardScreen from '~/screens/DashBoardScreen';
import SettingScreen from '~/screens/SettingScreen';

import TrackingScreen from '~/screens/TrackingScreen';
import DeviceManagementScreen from '~/screens/devices/DeviceManagementScreen';
import AIScreen from '~/screens/AIScreen';
import TaskManagementScreen from '~/screens/roleBased/admin/TasksManagementScreen';




export type AdminTabParamList = {
  DashBoard: undefined;
  Devices: undefined;
  CreateTask: undefined;
  Tracking: undefined;
  UserManagement: undefined;
  AI :undefined
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
            case 'Devices':
              return <MaterialCommunityIcons name="devices" size={size} color={color} />;
            case 'CreateTask':
              return <Ionicons name="create" size={size} color={color} />;
            case 'Tracking':
              return <AntDesign name="linechart" size={size} color={color} />;
              case 'AI':
              return  <MaterialCommunityIcons name="details" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#0466c8',
        tabBarInactiveTintColor: 'rgba(0,0,0,0.3)',
        headerShown: false, tabBarStyle: {
          // Style cho toàn bộ tab bar
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ccc',
          height: 70, 
          alignItems:"center"
         // Điều chỉnh chiều cao nếu cần
        },
        // Thêm dòng này để căn giữa icon theo chiều dọc
        tabBarIconStyle: {
          marginTop: 8,
          marginBottom: 2,
        },
      })}
    >
      <Tab.Screen name="DashBoard" component={DashBoardScreen} options={{ title: 'Trang chính' }} />
      <Tab.Screen name="Devices" component={DeviceManagementScreen} options={{ title: 'Thiết bị' }} />
      <Tab.Screen name="CreateTask" component={TaskManagementScreen} options={{ title: 'QL công việc' }} />
      <Tab.Screen name="Tracking" component={TrackingScreen} options={{ title: 'Theo dõi' }} />
      <Tab.Screen name="AI" component={AIScreen} options={{ title: 'AI' }} />
    </Tab.Navigator>
  );
}
