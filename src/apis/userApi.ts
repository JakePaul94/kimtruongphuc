import { UserAttributes } from '~/types/userType';
import api from './axiosInstance';
export const getAllUsers = async (): Promise<any[]> => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const createUser = async (data: Partial<UserAttributes>): Promise<UserAttributes> => {
  try {
    const response = await api.post('/users/create', data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}