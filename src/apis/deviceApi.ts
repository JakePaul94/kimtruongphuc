// src/apis/authApi.ts

import api from './axiosInstance';

export const getDevicesForMe = async (): Promise<any[]> => {
  // Thay any[] bằng Task[] nếu có kiểu Task
  try {
    const response = await api.get('/devices/for-my-boiler');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getDeviceById = async (deviceId:number): Promise<any[]> => {
  // Thay any[] bằng Task[] nếu có kiểu Task
  try {
    const response = await api.get(`/devices/device/${deviceId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};