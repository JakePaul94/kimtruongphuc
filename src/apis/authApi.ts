// src/apis/authApi.ts
import axios from 'axios';
import api from './axiosInstance';
import { API_BASE_URL } from '../config/apiConfig';

const axiosNoAuth = axios.create({
  baseURL: API_BASE_URL,
});

export const loginApi = (
  identifier: string,
  password: string,
  ipAddress: string,
  userAgent: string,
  loginTimestamp: Date
) => {
  return axiosNoAuth.post('/auth/login', {
    identifier,
    password,
    ipAddress,
    userAgent,
    loginTimestamp,
  });
};
export const autoLoginApi = (
  refreshToken: string,
  ipAddress: string,
  userAgent: string,
  loginTimestamp: Date
) => {
  console.log("Token gửi đi:", refreshToken)
  return axiosNoAuth.post('/auth/autologin', {
    refreshToken,
    ipAddress,
    userAgent,
    loginTimestamp,
  });
};
export const logoutApi = (refreshToken: string) =>
  axiosNoAuth.post('/auth/logout', { refreshToken });
export const changePasswordApi = (oldPassword: string, newPassword: string) =>
  api.post('/auth/change-password', { oldPassword, newPassword });
export const getUserInfoApi = () => api.get('/users/me');
export const updateUserInfoApi = (data: any) => api.put('/users/me', data);
export const getUserByIdApi = (userId: string) => api.get(`/users/${userId}`);