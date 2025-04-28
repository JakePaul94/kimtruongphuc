import { NativeModules } from 'react-native';

const { MLKitModule } = NativeModules;

export const scanQRCode = async (uri:string) => {
  try {
    return await MLKitModule.scanQRCodeFromUri(uri);
  } catch (error) {
    console.error('QR Scan Error:', error);
    throw error;
  }
};

export const readDigitalNumbers = async (uri:string) => {
  try {
    return await MLKitModule.recognizeDigitalNumbers(uri);
  } catch (error) {
    console.error('Text Recognition Error:', error);
    throw error;
  }
};