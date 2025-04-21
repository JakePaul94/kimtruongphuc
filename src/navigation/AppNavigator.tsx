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
import SettingScreen from '~/screens/SettingScreen';
import BoilerManagementScreen from '~/screens/boilers/BoilerManagementScreen';
import BoilerDetailScreen from '~/screens/boilers/BoilerDetailScreen';
import CreateBoilerScreen from '~/screens/boilers/CreateBoilerScreen';
import DeviceManagementScreen from '~/screens/devices/DeviceManagementScreen';
import UserManagementScreen from '~/screens/users/UserManagementScreen';
import CreateDeviceScreen from '~/screens/devices/CreateDeviceScreen';
import { useEffect } from 'react';
import { useAppStore } from '~/store/useAppStore';
import { UserAttributes } from '~/types/userType';
import UserDetailScreen from '~/screens/users/UserDetailScreen';
import CreateUserScreen from '~/screens/users/CreateUserScreen';
import CleaningTaskTemplateScreen from '~/screens/tasks/cleaningTask/CleaningTemplateListScreen';
import CreateCleaningTaskTemplateScreen from '~/screens/tasks/cleaningTask/CreateCleaningTemplateScreen';
import EditCleaningTaskTemplateScreen from '~/screens/tasks/cleaningTask/EditCleaningTemplateScreen';
import { CleaningTaskLocation, CleaningTemplate, WaterReportTemplate } from '~/types/tasksType';
import WaterReportTemplateScreen from '~/screens/tasks/waterReport/WaterReportTemplateScreeen';
import CreateWaterReportTemplateScreen from '~/screens/tasks/waterReport/CreateWaterReportTemplateScreen';
import EditWaterReportTemplateScreen from '~/screens/tasks/waterReport/EditWaterReportTemplateScreen';
import CleaningTaskScreen from '~/screens/roleBased/boilerWorker/CleaningTaskScreen';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  WaterQualityReport: undefined;
  CleaningCheck: undefined;
  PhotoCapture: {
    mode: 'cleaning' | 'water-report-with-AI' | 'water-report-normal';
    cleaningTaskLocation?: CleaningTaskLocation;
    callback?: (data: { photoUri: string }) => void;
  };
  ChangePassword: undefined;
  UserManagement: undefined;
  UserDetail: { user: UserAttributes };
  CreateUser: undefined;
  Loading: undefined;
  Profile: undefined;
  DeviceManagement: undefined;
  DeviceDetail: { deviceId: number };
  CleaningTask: { cleaningTaskId: number };
  CreateIncidentReport: { deviceId: number };
  CleaningTaskExecution: { cleaningTaskId: number };
  CleaningTaskTemplate: undefined;
  CreateCleaningTaskTemplate: undefined;
  EditCleaningTaskTemplate: { template: CleaningTemplate };
  WaterReportTemplate: undefined;
  CreateWaterReportTemplate: undefined;
  EditWaterReportTemplate: { template: WaterReportTemplate };
  Setting: undefined;
  BoilerManagement: undefined;
  BoilerDetail: { boilerId: number };
  CreateBoiler: undefined;
  CreateDevice: { parentId?: number | null | undefined };
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
  const { fetchInitialData, isDataFetched, fetchIniDataLoading, setDataFetched } = useAppStore(
    (state) => state
  );
  const role = user?.role;
  const authLoading = useAuthStore((state) => state.loading);
  useEffect(() => {
    const loadData = async () => {
      if (!isDataFetched) {
        await fetchInitialData();
        setDataFetched(true);
      }
    };
    loadData();
  }, [isAuthenticated, role]);
  const isLoading = authLoading || (isAuthenticated && role === 'admin' && !isDataFetched);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoading ? (
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
          <Stack.Screen name="Setting" component={SettingScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="UserManagement" component={UserManagementScreen} />
          <Stack.Screen name="UserDetail" component={UserDetailScreen} />
          <Stack.Screen name="CreateUser" component={CreateUserScreen} />
          <Stack.Screen name="BoilerManagement" component={BoilerManagementScreen} />
          <Stack.Screen name="BoilerDetail" component={BoilerDetailScreen} />
          <Stack.Screen name="CreateBoiler" component={CreateBoilerScreen} />

          <Stack.Screen name="WaterQualityReport" component={WaterQualityReportScreen} />

          <Stack.Screen name="CleaningTaskTemplate" component={CleaningTaskTemplateScreen} />
          <Stack.Screen
            name="CreateCleaningTaskTemplate"
            component={CreateCleaningTaskTemplateScreen}
          />
          <Stack.Screen
            name="EditCleaningTaskTemplate"
            component={EditCleaningTaskTemplateScreen}
          />
          <Stack.Screen name="CleaningTask" component={CleaningTaskScreen} />
          <Stack.Screen name="CleaningCheck" component={CleaningCheckScreen} />
          <Stack.Screen name="CleaningTaskExecution" component={CleaningTaskExecutionScreen} />

          <Stack.Screen name="WaterReportTemplate" component={WaterReportTemplateScreen} />
          <Stack.Screen
            name="CreateWaterReportTemplate"
            component={CreateWaterReportTemplateScreen}
          />
          <Stack.Screen name="EditWaterReportTemplate" component={EditWaterReportTemplateScreen} />
          <Stack.Screen name="PhotoCapture" component={PhotoCaptureScreen} />
          <Stack.Screen name="DeviceDetail" component={DeviceDetailScreen} />
          <Stack.Screen name="DeviceManagement" component={DeviceManagementScreen} />
          <Stack.Screen name="CreateDevice" component={CreateDeviceScreen} />
          <Stack.Screen name="CreateIncidentReport" component={CreateIncidentReportScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
