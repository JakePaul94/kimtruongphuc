import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

import DashBoardScreen from '~/screens/DashBoardScreen';

import BoilerStatusScreen from '~/screens/roleBased/boilerManager/BoilerStatusScreen';
import SettingScreen from '~/screens/SettingScreen';

export type BoilerManagerTabParamList = {
  DashBoard: undefined;
  Tasks: undefined;
  BoilerStatus: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<BoilerManagerTabParamList>();

export default function BottomTabBoilerManager() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'DashBoard':
              return <MaterialIcons name="dashboard" size={size} color={color} />;
            case 'Tasks':
              return <Ionicons name="list-outline" size={size} color={color} />;
            case 'BoilerStatus':
              return <Feather name="thermometer" size={size} color={color} />;
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
      <Tab.Screen name="BoilerStatus" component={BoilerStatusScreen} options={{ title: 'Trạng thái lò' }} />
      <Tab.Screen name="Settings" component={SettingScreen} options={{ title: 'Cài đặt' }} />
    </Tab.Navigator>
  );
}