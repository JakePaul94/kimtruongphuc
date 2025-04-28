import { CleaningTemplate, CreateCleaningTemplatePayload, CleaningTask, WaterReportItem, WaterReportTemplate, WaterReportTemplateCreatePayload, WaterReportTemplateUpdatePayload, WaterReportTask, SelfGeneratedMaintainTaskItem } from '~/types/tasksType';
import api from './axiosInstance';


// CleaningTask
export const getAllCleaningTaskTemplates = async (): Promise<CleaningTemplate[]> => {
  try {
    const response = await api.get('/cleaning-tasks/templates');
    return response.data;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export const createCleaningTaskTemplate = async (payload: CreateCleaningTemplatePayload): Promise<CleaningTemplate> => {
  try {
    const response = await api.post('/cleaning-tasks/templates', payload);
    return response.data;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export const updateCleaningTaskTemplate = async (cleaningTaskTemplateId: number, payload: Partial<CreateCleaningTemplatePayload>): Promise<CleaningTemplate> => {
  try {
    const response = await api.put(`/cleaning-tasks/templates/${cleaningTaskTemplateId}`, payload);
    return response.data;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export const acceptCleaningTask = async (cleaningTaskId: number): Promise<any> => {
  try {
    const response = await api.put(`/cleaning-tasks/tasks/${cleaningTaskId}/accept`)
    return response.data
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export const acceptWaterReportTask = async (waterReportTaskId: number): Promise<any> => {
  try {
    const response = await api.put(`/water-report-tasks/tasks/${waterReportTaskId}/accept`)
    return response.data
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export const getCleaningTaskById = async (cleaningTaskId: number): Promise<CleaningTask> => {
  try {
    const response = await api.get(`/cleaning-tasks/tasks/${cleaningTaskId}`)
    return response.data
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export const compeleteTaskLocation = async (locationId: number, notes: string | null, photoUrl: string): Promise<any> => {
  try {
    const response = await api.put(`/cleaning-tasks/tasks/locations/${locationId}/complete`, { notes: notes, photoUrl: photoUrl })
    return response.data
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}



export const getAllWaterReportTemplates = async (): Promise<WaterReportTemplate[]> => {
  try {
    const response = await api.get('/water-report-tasks/templates');
    return response.data;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export const createWaterReportTemplate = async (payload: WaterReportTemplateCreatePayload): Promise<CleaningTemplate> => {
  console.log(payload)
  try {
    const response = await api.post('/water-report-tasks/templates', payload);
    return response.data;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export const updateWaterReportTemplate = async (cleaningTaskTemplateId: number, payload: Partial<WaterReportTemplateUpdatePayload>): Promise<CleaningTemplate> => {
  try {
    const response = await api.put(`/water-report-tasks/templates/${cleaningTaskTemplateId}`, payload);
    return response.data;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export const deleteWaterReportTemplate = async (cleaningTaskTemplateId: number): Promise<void> => {
  try {
    await api.delete(`/water-report-tasks/templates/${cleaningTaskTemplateId}`);
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export const getWaterReportById = async (waterReportId: number): Promise<any> => {
  try {
    const response = await api.get(`/water-report-tasks/tasks/${waterReportId}`)
    return response.data
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export const getMaintenanceTaskById = async (maintenanceTaskId: number): Promise<any> => {
  try {
    const response = await api.get(`/maintenance-tasks/task/${maintenanceTaskId}`)
    console.log(response.data)
    return response.data
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export const compeleteWaterReportItem = async (itemId: number, valueFromAI: string | null, isQualify: boolean | null, notes: string | null, photoUrl: string): Promise<any> => {
  try {
    console.log(photoUrl)
    const response = await api.put(`/water-report-tasks/tasks/items/${itemId}/complete`, { notes: notes, valueFromAI: valueFromAI, isQualify: isQualify, photoUrl: photoUrl })
    return response.data
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export const completeWaterReport = async (itemId: number): Promise<any> => {
  try {

    const response = await api.put(`/water-report-tasks/tasks/${itemId}/status`, { status: "completed" })
    return response.data
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
export const generateAndCompleteTask = async (deviceId: number, items: SelfGeneratedMaintainTaskItem[], notes: string | null): Promise<any> => {
  try {
    const response = await api.post('/maintenance-tasks/tasks/create-complete', { notes: notes, deviceId: deviceId, items: items })
    return response.data
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

interface AllTasksResponse {
  allCleaningTasks: {
    id: number;
    templateId: number;
    boilerId: number;
    createdBy: number | null;
    assignedTo: number | null;
    status: "pending" | "in_process" | "completed" | "cancelled";
    scheduledDate: string; //<ctrl98>-MM-DD
    completedAt: string | null; // ISO 8601 format
    createdAt: string; // ISO 8601 format
    updatedAt: string;
    assignedUser: {
      id: number,
      fullName: string,
      email: string,
      profilePicture: string | null
    } | null
    ;
    boiler: {
      id: number,
      name: string
    };
    template: {
      name: string
    }// ISO 8601 format
  }[];
  allWaterReportTasks: {
    id: number;
    templateId: number;
    boilerId: number;
    assignedTo: number | null;
    scheduledDate: string; //<ctrl98>-MM-DD
    status: "pending" | "in_process" | "completed" | "cancelled";
    createdBy: number | null;
    completedAt: string | null; // ISO 8601 format
    createdAt: string; // ISO 8601 format
    updatedAt: string; // ISO 8601 format
    assignedUser: {
      id: number,
      fullName: string,
      email: string,
      profilePicture: string | null
    } | null
    ;
    boiler: {
      id: number,
      name: string
    };
    template: {
      name: string
    }
  }[];
  allMaintenanceTasks: {
    id: number;
    deviceId: number;
    templateId: number | null;
    assignedTo: number | null;
    createdBy: number | null;
    scheduledDate: string; // ISO 8601 format (có thể có thời gian)
    completedAt: string | null; // ISO 8601 format
    notes: string | null;
    status: "pending" | "in_process" | "completed" | "cancelled";
    createdAt: string; // ISO 8601 format
    updatedAt: string; // ISO 8601 format
    device?: {
      id: number;
      deviceName: string;
      boilers: {
        name: "Lò hơi Habeco"
      }[] | null
    };
  }[];
}
export const getAllTasksByDateRange = async (startDate: string, endDate: string): Promise<AllTasksResponse> => {
  try {
    const url = `/tasks/?startDate=${startDate}&endDate=${endDate}`;
    const response = await api.get(url);
    console.log(startDate, endDate)
    return response.data;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}