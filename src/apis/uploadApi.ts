import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL } from '../config/apiConfig';
import api from "./axiosInstance";

export const uploadImage = async (uri: string) => {
  const formData = new FormData();

  const fileName = uri.split('/').pop() || `image-${Date.now()}.jpg`;
  const fileType = fileName.split('.').pop();

  formData.append("image", {
    uri,
    name: fileName,
    type: `image/${fileType}`
  } as any);

  try {
    const res = await api.post(
      `${API_BASE_URL}/api/uploads/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return res.data.imageUrl; // giả sử server trả về { url: "..." }

  } catch (err) {
    throw err;
  }
};
export const deleteImage = async (publicImageUrl: string): Promise<void> => {
  try {
    await api.delete(`${API_BASE_URL}/api/uploads/image`, {
      data: { imageUrl: publicImageUrl }, 
    });

  } catch (err) {
    console.error("Lỗi khi xóa ảnh:", err);
  }
};