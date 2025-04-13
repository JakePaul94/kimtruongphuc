import api from './axiosInstance';

export const createIncidentReport = async (formData: FormData): Promise<any[]> => {
  // Thay any[] bằng Task[] nếu có kiểu Task
  try {
    console.log(`[API] Fetching create Incident Report`); // Log để debug (tùy chọn)
    const res = await api.post('/incident-reports', formData);
    return res.data;
  } catch (error) {
    console.error(`[API] Error  create Incident Report, error`);
    throw error;
  }
};
