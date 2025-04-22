import ExpoModulesCore
import Vision
import UIKit

class ExpoQRUriScannerModule: Module {
    func definition() -> ModuleDefinition {
        Name("ExpoQRUriScanner")

        AsyncFunction("scanFromUri") { (uriString: String, promise: Promise) in
            guard let url = URL(string: uriString) else {
                promise.reject("URI_ERROR", "Invalid URI")
                return
            }

            // Tải hình ảnh từ URI
            do {
                let data = try Data(contentsOf: url)
                guard let image = UIImage(data: data) else {
                    promise.reject("IMAGE_ERROR", "Failed to load image")
                    return
                }

                // Khởi tạo Vision request để đọc QR code
                let request = VNDetectBarcodesRequest { request, error in
                    if let error = error {
                        promise.reject("SCAN_ERROR", "Failed to scan QR code: \(error.localizedDescription)")
                        return
                    }

                    guard let results = request.results as? [VNBarcodeObservation], let barcode = results.first else {
                        promise.reject("NO_QR_CODE", "No QR code found")
                        return
                    }

                    if let qrValue = barcode.payloadStringValue {
                        promise.resolve(qrValue) // Trả về giá trị QR code
                    } else {
                        promise.reject("NO_QR_CODE", "No QR code found")
                    }
                }

                // Thực hiện Vision request
                guard let cgImage = image.cgImage else {
                    promise.reject("IMAGE_ERROR", "Failed to convert image")
                    return
                }

                let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
                try handler.perform([request])
            } catch {
                promise.reject("URI_ERROR", "Failed to load URI: \(error.localizedDescription)")
            }
        }
    }
}