import { registerWebModule, NativeModule } from 'expo';

import { ExpoQrUriScannerModuleEvents } from './ExpoQRUriScanner.types';

class ExpoQrUriScannerModule extends NativeModule<ExpoQrUriScannerModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoQrUriScannerModule);
