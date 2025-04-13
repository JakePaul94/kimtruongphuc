import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '~/store/authStore';
import { View, ActivityIndicator } from 'react-native';
import LoginScreen from '~/screens/LoginScreen';
import ChangePasswordScreen from '~/screens/ChangePasswordScreen';
import WaterQualityReportScreen from '~/screens/WaterQualityReportScreen';
import CleaningCheckScreen from '~/screens/CleaningCheckScreen';
import PhotoCaptureScreen from '~/screens/PhotoCaptureScreen';
import BottomTabAdmin from './BottomTabAdmin';
import BottomTabBoilerManager from './BottomTabBoilerManager';
import BottomTabBoilerWorker from './BottomTabBoilerWorker';
import BottomTabDirector from './BottomTabDirector';
import BottomTabEngineer from './BottomTabEngineer';
import BottomTabHR from './BottomTabHR';
import BottomTabOfficeStaff from './BottomTabOfficeStaff';
import MyProfileScreen from '~/screens/MyProfileScreen';
import DeviceDetailScreen from '~/screens/devices/DeviceDetailScreen';
import CreateIncidentReportScreen from '~/screens/incident/CreateIncidentReportScreen';
import CleaningTaskExecutionScreen from '~/screens/roleBased/boilerWorker/CleaningTaskExecutionScreen';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  WaterQualityReport: undefined;
  CleaningCheck: undefined;
  PhotoCapture: {
    mode: 'qr' | 'roi' | 'normal';
    nameImg: string;
    title: string;
    callback?: (data: { photoUri: string | undefined; nameImg: string; result: any }) => void;
  };
  ChangePassword: undefined;
  Loading: undefined;
  Profile: undefined;
  DeviceDetail: { deviceId: number };
  CreateIncidentReport: { deviceId: number };
  CleaningTaskExecution: { cleaningTaskId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Tạo một component cho màn hình Loading
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

export default function AppNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const role = user?.role;
  const authLoading = useAuthStore((state) => state.loading);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authLoading ? (
        <Stack.Screen name="Loading" component={LoadingScreen} />
      ) : !isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : (
        <>
          {role === 'admin' && <Stack.Screen name="Main" component={BottomTabAdmin} />}
          {role === 'boiler_manager' && (
            <Stack.Screen name="Main" component={BottomTabBoilerManager} />
          )}
          {role === 'boiler_worker' && (
            <Stack.Screen name="Main" component={BottomTabBoilerWorker} />
          )}
          {role === 'director' && <Stack.Screen name="Main" component={BottomTabDirector} />}
          {role === 'engineer' && <Stack.Screen name="Main" component={BottomTabEngineer} />}
          {role === 'hr' && <Stack.Screen name="Main" component={BottomTabHR} />}
          {role === 'office_staff' && <Stack.Screen name="Main" component={BottomTabOfficeStaff} />}
          <Stack.Screen name="Profile" component={MyProfileScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="WaterQualityReport" component={WaterQualityReportScreen} />
          <Stack.Screen name="CleaningCheck" component={CleaningCheckScreen} />
          <Stack.Screen name="PhotoCapture" component={PhotoCaptureScreen} />
          <Stack.Screen name="DeviceDetail" component={DeviceDetailScreen} />
          <Stack.Screen name="CreateIncidentReport" component={CreateIncidentReportScreen} />
          <Stack.Screen name="CleaningTaskExecution" component={CleaningTaskExecutionScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
