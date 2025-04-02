import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '~/screens/LoginScreen';
import WaterQualityReportScreen from '~/screens/WaterQualityReportScreen';
import { useAuthStore } from '~/store/authStore';
import PhotoCaptureScreen from '~/screens/PhotoCaptureScreen';
import CleaningCheckScreen from '~/screens/CleaningCheckScreen';

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
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen name="WaterQualityReport" component={WaterQualityReportScreen} />
          <Stack.Screen name="CleaningCheck" component={CleaningCheckScreen} />
          <Stack.Screen name="PhotoCapture" component={PhotoCaptureScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
