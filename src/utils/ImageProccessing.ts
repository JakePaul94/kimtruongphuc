import * as ImageManipulator from 'expo-image-manipulator';
import jsQR from 'jsqr';
import * as FileSystem from 'expo-file-system';

type CropRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ProcessAndUploadProps = {
  photoUri: string;
  cropRegion: CropRegion;
};

export const cropImageFromRoi = async (photoUri: string, cropRegion: CropRegion) => {
  try {
    const cropped = await ImageManipulator.manipulateAsync(
      photoUri,
      [{
        crop: {
          originX: cropRegion.x,
          originY: cropRegion.y,
          width: cropRegion.width,
          height: cropRegion.height,
        },
      }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    return cropped.uri;
  } catch (error) {
    console.error('Lỗi xử lý ảnh:', error);
    return null;
  }
};

export const getImageBase64 = async (imageUri: string): Promise<string | null> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Lỗi khi đọc ảnh thành base64:', error);
    return null;
  }
};
export const sendImageToServer = async (imageUri: string, mode: string) => {
  try {
    const base64 = await getImageBase64(imageUri);

    if (mode == "qr") {
      const response = await fetch('http://192.168.1.3:5000/scan_qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });

      const result = await response.json();
      if (response.ok && result.qr_codes.length > 0) {
        return result.qr_codes[0].data
      } else {
        alert('Không tìm thấy mã QR,Vui lòng chụp lại');
      }
    }
    else if (mode == "roi") {
      const response = await fetch('http://192.168.1.3:5000/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });

      const result = await response.json();
      if (response.ok && result) {
        return result
      } else {
        alert('Không nhận diện được số');
      }
    }
    else{
      return null
    }
  } catch (error) {
    console.error('Lỗi khi gửi ảnh:', error);
    alert('Lỗi kết nối đến server!');
  }
};
