import { NativeModules } from 'react-native';

const { QrCodeModule } = NativeModules;

type QrCodeModuleType = {
  scanQrFromUri: (uri: string) => Promise<string>;
};

export default QrCodeModule as QrCodeModuleType;