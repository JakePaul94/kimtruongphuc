/* eslint-disable prettier/prettier */
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React from 'react';

import CameraScreen from '../screens/PhotoCaptureScreen';
import DashBoardScreen from '../screens/DashBoardScreen';
import SettingScreen from '../screens/SettingScreen';
import TodoListScreen from '~/screens/ToDoListScreen';

export type RootTabParamList = {
  DashBoard: undefined;
  TodoList: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({
        route,
      }: {
        route: { name: keyof RootTabParamList };
      }): BottomTabNavigationOptions => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'DashBoard') {
            return <MaterialIcons name="dashboard" size={size} color={color} />;
          } else if (route.name === 'TodoList') {
            return <AntDesign name="calendar" size={size} color={color} />;
          } else if (route.name === 'Settings') {
            return <MaterialIcons name="settings" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#3674B5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="DashBoard" component={DashBoardScreen} options={{ title: 'Trang Chính' }} />
      <Tab.Screen name="TodoList" component={TodoListScreen} options={{ title: 'Nhiệm vụ' }} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
}
