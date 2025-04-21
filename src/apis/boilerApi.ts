// src/apis/boilerApi.ts

import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import api from './axiosInstance';
import { BoilerAttributes, BoilerDevicesAttributes, BoilerUsersAttributes, BoilerWithoutIdAttribute, GetBoilerByIdResponseType } from '~/types/boilerType';
import { UserAttributes } from '~/types/userType';
import { DeviceAttributes } from '~/types/deviceType';

export const getBoilerForMe = async (): Promise<any[]> => {
  try {
    const response = await api.get('/boilers/for-my-boiler');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getBoilerById = async (boilerId: number): Promise<GetBoilerByIdResponseType> => {
  try {
    const response = await api.get(`/boilers/${boilerId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateBoiler = async (boilerId: number, data: Partial<BoilerWithoutIdAttribute>): Promise<BoilerAttributes> => {
  try {
    const response = await api.put(`/boilers/${boilerId}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const getAllBoilers = async (): Promise<BoilerAttributes[]> => {
  try {
    const response = await api.get("/boilers");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const getAllBoilerUsers = async (): Promise<BoilerUsersAttributes[]> => {
  try {
    const response = await api.get("/boilers/users");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const getAllBoilerDevices = async (): Promise<BoilerDevicesAttributes[]> => {
  try {
    const response = await api.get("/boilers/devices");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const deleteBoiler = async (boilerId: number): Promise<void> => {
  try {
    await api.delete(`/boilers/${boilerId}`);
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}


export const createBoiler = async (data: Omit<BoilerWithoutIdAttribute, "createAt" | "updateAt">): Promise<BoilerAttributes> => {

  try {
    const response = await api.post(`/boilers`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const assignUserToBoiler = async (userId: number, boilerId: number): Promise<BoilerUsersAttributes> => {
  try { const response = await api.post("/boilers/assign-user", { userId, boilerId }); return response.data; }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export const removeUserFromBoiler = async (userId: number, boilerId: number): Promise<void> => {
  try {
    await api.delete(`/boilers/${boilerId}/users/${userId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getBoilerUsers = async (boilerId: number): Promise<BoilerUsersAttributes & {user:UserAttributes}[]> => { 
  try {
    const response = await api.get(`/boilers/${boilerId}/users`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const getBoilerDevices = async (boilerId: number): Promise<BoilerUsersAttributes & {device:DeviceAttributes}[]> => {
  try {
    const response = await api.get(`/boilers/${boilerId}/devices`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const assignDeviceToBoiler = async (deviceId: number, boilerId: number): Promise<BoilerDevicesAttributes> => {
  try {
    const response = await api.post("/boilers/assign-device", { deviceId, boilerId });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const removeDeviceFromBoiler = async (deviceId: number, boilerId: number): Promise<void> => {
  try {
    await api.delete(`/boilers/${boilerId}/devices/${deviceId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}