import { registerWebModule, NativeModule } from 'expo';
class ExpoQrUriScannerModule extends NativeModule {
    PI = Math.PI;
    async setValueAsync(value) {
        this.emit('onChange', { value });
    }
    hello() {
        return 'Hello world! 👋';
    }
}
export default registerWebModule(ExpoQrUriScannerModule);
//# sourceMappingURL=ExpoQRUriScannerModule.web.js.map