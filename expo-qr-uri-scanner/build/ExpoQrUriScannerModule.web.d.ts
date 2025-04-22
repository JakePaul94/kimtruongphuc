import { NativeModule } from 'expo';
import { ExpoQrUriScannerModuleEvents } from './ExpoQRUriScanner.types';
declare class ExpoQrUriScannerModule extends NativeModule<ExpoQrUriScannerModuleEvents> {
    PI: number;
    setValueAsync(value: string): Promise<void>;
    hello(): string;
}
declare const _default: typeof ExpoQrUriScannerModule;
export default _default;
//# sourceMappingURL=ExpoQRUriScannerModule.web.d.ts.map