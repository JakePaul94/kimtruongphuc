import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { API_BASE_URL } from '~/config/apiConfig';
import api from '~/apis/axiosInstance';
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

export const readQrCodeFromUri = async (imgUrl: string): Promise<string | null> => {
  try {

    const response = await api.post(`${API_BASE_URL}/img-process/scan-qr`, {
      imageUrl: imgUrl
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi đọc QR code từ URI:', error);
    return null;
  }
};

