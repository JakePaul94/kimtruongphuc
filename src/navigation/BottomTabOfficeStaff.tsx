import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import DashBoardScreen from '~/screens/DashBoardScreen';
import DocumentManagementScreen from '~/screens/roleBased/officeStaff/DocumentManagementScreen';
import SettingScreen from '~/screens/SettingScreen';

export type OfficeStaffTabParamList = {
  DashBoard: undefined;
  Documents: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<OfficeStaffTabParamList>();

export default function BottomTabOfficeStaff() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'DashBoard':
              return <MaterialIcons name="dashboard" size={size} color={color} />;
            case 'Documents':
              return <Ionicons name="folder-open-outline" size={size} color={color} />;
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
      <Tab.Screen name="Documents" component={DocumentManagementScreen} options={{ title: 'Tài liệu' }} />
      <Tab.Screen name="Settings" component={SettingScreen} options={{ title: 'Cài đặt' }} />
    </Tab.Navigator>
  );
}