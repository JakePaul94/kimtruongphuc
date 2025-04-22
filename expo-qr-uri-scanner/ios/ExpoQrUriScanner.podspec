Pod::Spec.new do |s|
  s.name         = "ExpoQRUriScanner"
  s.version      = "1.0.0"
  s.summary      = "Expo module to scan QR codes from URI"
  s.platform     = :ios, "13.0"
  s.source_files = "*.{swift}"
  s.dependency "ExpoModulesCore"
  # Không cần thêm dependency cho Vision vì nó là framework mặc định của iOS
end