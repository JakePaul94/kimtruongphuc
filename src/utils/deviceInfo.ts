import { NetworkInfo } from 'react-native-network-info';
import * as Device from 'expo-device';

export const getIpAddress = async (): Promise<string> => {
    const ip = await NetworkInfo.getIPAddress();
    return ip ?? '0.0.0.0'; 
}
export const getUserAgent = (): string => {
  return `${Device.manufacturer} ${Device.modelName} (${Device.osName} ${Device.osVersion})`;
};
