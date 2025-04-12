import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

import DashBoardScreen from '~/screens/DashBoardScreen';
import EmployeeListScreen from '~/screens/roleBased/hr/EmployeeListScreen';
import SettingScreen from '~/screens/SettingScreen';

export type HRTabParamList = {
  DashBoard: undefined;
  Employees: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<HRTabParamList>();

export default function BottomTabHR() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'DashBoard':
              return <MaterialIcons name="dashboard" size={size} color={color} />;
            case 'Employees':
              return <FontAwesome name="users" size={size} color={color} />;
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
      <Tab.Screen name="Employees" component={EmployeeListScreen} options={{ title: 'Nhân viên' }} />
      <Tab.Screen name="Settings" component={SettingScreen} options={{ title: 'Cài đặt' }} />
    </Tab.Navigator>
  );
}