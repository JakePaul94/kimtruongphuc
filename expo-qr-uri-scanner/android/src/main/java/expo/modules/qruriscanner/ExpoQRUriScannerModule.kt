package expo.modules.qruriscanner

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class ExpoQRUriScannerModule : Module() {
    private val context: Context
        get() = appContext.reactContext ?: throw IllegalStateException("Context not available")

    override fun definition() = ModuleDefinition {
        Name("ExpoQRUriScanner")

        AsyncFunction("scanFromUri") { uriString: String ->
            var bitmap: Bitmap? = null
            try {
                // Chuyển URI thành Bitmap
                val uri = Uri.parse(uriString)
                bitmap = when (uri.scheme) {
                    "file" -> BitmapFactory.decodeFile(uri.path)
                    "content" -> {
                        val inputStream = context.contentResolver.openInputStream(uri)
                        val bmp = BitmapFactory.decodeStream(inputStream)
                        inputStream?.close()
                        bmp
                    }
                    else -> {
                        val url = URL(uriString)
                        BitmapFactory.decodeStream(url.openStream())
                    }
                }

                if (bitmap == null) {
                    promise.reject("URI_ERROR", "Failed to load image from URI")
                    return@AsyncFunction
                }

                // Khởi tạo ML Kit Barcode Scanner
                val scanner = BarcodeScanning.getClient()
                val image = InputImage.fromBitmap(bitmap, 0)

                // Quét QR code
                scanner.process(image)
                    .addOnSuccessListener { barcodes ->
                        if (barcodes.isNotEmpty()) {
                            val barcode = barcodes[0]
                            promise.resolve(barcode.rawValue)
                        } else {
                            promise.reject("NO_QR_CODE", "No QR code found")
                        }
                    }
                    .addOnFailureListener { e ->
                        promise.reject("SCAN_ERROR", "Failed to scan QR code: ${e.message}")
                    }
            } catch (e: Exception) {
                promise.reject("URI_ERROR", "Failed to load URI: ${e.message}")
            } finally {
                bitmap?.recycle() // Giải phóng Bitmap để tránh rò rỉ bộ nhớ
            }
        }
    }
}