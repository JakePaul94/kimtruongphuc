import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';

import DashBoardScreen from '~/screens/DashBoardScreen';
import ReportScreen from '~/screens/roleBased/director/ReportScreen';
import OverviewScreen from '~/screens/roleBased/director/OverviewScreen';
import SettingScreen from '~/screens/SettingScreen';

export type DirectorTabParamList = {
  DashBoard: undefined;
  Reports: undefined;
  Overview: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<DirectorTabParamList>();

export default function BottomTabDirector() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'DashBoard':
              return <MaterialIcons name="dashboard" size={size} color={color} />;
            case 'Reports':
              return <Feather name="file-text" size={size} color={color} />;
            case 'Overview':
              return <FontAwesome5 name="chart-pie" size={size} color={color} />;
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
      <Tab.Screen name="Reports" component={ReportScreen} options={{ title: 'Báo cáo' }} />
      <Tab.Screen name="Overview" component={OverviewScreen} options={{ title: 'Tổng quan' }} />
      <Tab.Screen name="Settings" component={SettingScreen} options={{ title: 'Cài đặt' }} />
    </Tab.Navigator>
  );
}