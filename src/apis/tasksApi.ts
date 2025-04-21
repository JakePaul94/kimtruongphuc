import { CleaningTemplate, CreateCleaningTemplatePayload, CleaningTask, WaterReportItem, WaterReportTemplate, WaterReportTemplateCreatePayload, WaterReportTemplateUpdatePayload } from '~/types/tasksType';
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

export const acceptTask = async (cleaningTaskId: number): Promise<any> => {
  try {
    const response = await api.put(`/cleaning-tasks/tasks/${cleaningTaskId}/accept`)
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
    const response = await api.put(`/cleaning-tasks/tasks/locations/${locationId}/complete`)
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

