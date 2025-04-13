// src/apis/authApi.ts

import api from './axiosInstance';



export const getAllTasksForMeAPI = async (dateString: string): Promise<any[]> => { // Thay any[] bằng Task[] nếu có kiểu Task
    try {
      console.log(`[API] Fetching tasks for date: ${dateString}`); // Log để debug (tùy chọn)
      const response = await api.get('/tasks/today', {
        params: {
          date: dateString // key 'date' phải khớp với tên query param backend mong đợi (là 'date')
        }
      });

      return response.data;
    } catch (error) {
      console.error(`[API] Error fetching tasks for date ${dateString}:`, error);
      throw error;
    }
  };
export const acceptWaterReportTaskById = async (taskId: number): Promise<any> => {
    try {
      const response = await api.post(`/water-report-tasks/tasks/${taskId}/accept`);
      return response.data;
    } catch (error) {
      console.error(`[API] Error accepting task with ID ${taskId}:`, error);
      throw error;
    }
  }

export const getCleaningTaskById = async (taskId: number): Promise<any[]> => {
  // Thay any[] bằng Task[] nếu có kiểu Task
  try {
    console.log(`[API] Fetching cleaning task with ID: ${taskId}`); // Log để debug (tùy chọn)
    const response = await api.get(`/cleaning-tasks/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`[API] Error fetching cleaning task with ID ${taskId}:`, error);
    throw error;
  }
}
export const getWaterReportTaskById = async (taskId: number): Promise<any[]> => {
  // Thay any[] bằng Task[] nếu có kiểu Task
  try {
    console.log(`[API] Fetching water report task with ID: ${taskId}`); // Log để debug (tùy chọn)
    const response = await api.get(`/water-report-tasks/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`[API] Error fetching water report task with ID ${taskId}:`, error);
    throw error;
  }
}