import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // Required for timezone conversion

dayjs.extend(utc);
dayjs.extend(timezone);


export const formatIsoDateToHHMMSSDDMMYYYY = (isoDateString: string): string => {
  const timeZone = 'Asia/Ho_Chi_Minh';
  return dayjs(isoDateString).tz(timeZone).format('HH:mm:ss DD/MM/YYYY');
};



export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
export function formatDateFromISO(isoDateString: string): string {
  return isoDateString.split('T')[0];
}
export function formatDateDDMMYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}
export const formatDateFromIsoToDDMMYY = (isoDateString?: string | null): string => {
  if (!isoDateString) return '-';
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  // getMonth() trả về từ 0-11 nên cần +1, padStart để đảm bảo 2 chữ số
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
