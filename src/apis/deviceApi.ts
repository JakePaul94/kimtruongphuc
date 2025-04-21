// src/apis/authApi.ts

import { DeviceAttributes, DeviceWithoutIdAttributes } from '~/types/deviceType';
import api from './axiosInstance';

export const getAllDevices = async (): Promise<DeviceAttributes[]> => {
  try {
    console.log("lấy dữ liệu  device")
    const response = await api.get('/devices');
    return response.data;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export const getDevicesForMe = async (): Promise<DeviceAttributes[]> => {
  try {
    const response = await api.get('/devices/for-my-boiler');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getDeviceById = async (deviceId: number): Promise<DeviceAttributes> => {

  try {
    const response = await api.get(`/devices/device/${deviceId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateDevice = async (deviceId: number, data: Partial<DeviceWithoutIdAttributes>): Promise<DeviceAttributes> => {
  try {
    const response = await api.put(`/devices/update/${deviceId}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export const createDevice = async (data: Partial<DeviceWithoutIdAttributes>): Promise<DeviceAttributes> => {
  try {
    const response = await api.post("/devices/create", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const deleteDevice = async (deviceId:number) => {
  try {
    await api.delete(`/devices/device/${deviceId}`)
  } catch (error) {
    console.error(error);
    throw error
  }
}