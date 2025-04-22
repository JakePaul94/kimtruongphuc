// Chỉ import những gì cần thiết
import { requireNativeModule } from 'expo-modules-core';

// Định nghĩa interface mà không cần extends ExpoModule
export interface ExpoQRUriScannerModule {
  scanFromUri(uri: string): Promise<string>;
}

// Load module native
export const ExpoQRUriScanner: ExpoQRUriScannerModule = requireNativeModule('ExpoQRUriScanner')