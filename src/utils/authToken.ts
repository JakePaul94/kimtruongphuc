import * as SecureStore from 'expo-secure-store';
import {jwtDecode} from 'jwt-decode';

export async function saveTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
}

export async function getAccessToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('accessToken');
}

export async function getRefreshToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('refreshToken');
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
export function getRoleString(role:string):string{
  switch (role) {
    case 'admin':
        return 'Admin';
    case 'boiler_worker':
        return 'Công nhân lò hơi';
    case 'boiler_manager':
        return 'Quản lý';
    case 'hr':
        return 'Phòng nhân sự';
    default:
        return role;
}
  return ""
}