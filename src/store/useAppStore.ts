import { create } from 'zustand'
import { getAllBoilers, getAllBoilerUsers, getAllBoilerDevices } from '~/apis/boilerApi'
import { getAllDevices } from '~/apis/deviceApi'
import { getAllCleaningTaskTemplates, getAllWaterReportTemplates } from '~/apis/tasksApi'
import { getAllUsers } from '~/apis/userApi'
import { BoilerAttributes, BoilerDevicesAttributes, BoilerUsersAttributes } from '~/types/boilerType'
import { CleaningTemplate, WaterReportTemplate } from '~/types/tasksType'
import { DeviceAttributes } from '~/types/deviceType'
import { UserAttributes } from '~/types/userType'

interface AppState {
    users: UserAttributes[]
    boilers: BoilerAttributes[]
    devices: DeviceAttributes[]
    boilerUsers: BoilerUsersAttributes[]
    boilerDevices: BoilerDevicesAttributes[]
    cleaningTaskTemplates: CleaningTemplate[]
    waterReportTemplates: WaterReportTemplate[]
    fetchIniDataLoading: boolean
    error: string | null
    isDataFetched: boolean
    setUsers: (users: UserAttributes[]) => void
    setBoilers: (boilers: BoilerAttributes[]) => void
    setDevices: (devices: DeviceAttributes[]) => void
    setBoilerUsers: (boilerUsers: BoilerUsersAttributes[]) => void
    setBoilerDevices: (boilerDevices: BoilerDevicesAttributes[]) => void
    setDataFetched: (fetched: boolean) => void;
    fetchInitialData: () => Promise<void>
}

export const useAppStore = create<AppState>((set) => ({
    users: [],
    boilers: [],
    devices: [],
    boilerUsers: [], cleaningTaskTemplates: [],waterReportTemplates:[], isDataFetched: false,
    boilerDevices: [], fetchIniDataLoading: false,
    error: null,
    setDataFetched: (fetched: boolean) => set({ isDataFetched: fetched }),
    setUsers: (users: UserAttributes[]) => set({ users }),
    setBoilers: (boilers: BoilerAttributes[]) => set({ boilers }),
    setDevices: (devices: DeviceAttributes[]) => set({ devices }),
    setBoilerUsers: (boilerUsers: BoilerUsersAttributes[]) => set({ boilerUsers }),
    setBoilerDevices: (boilerDevices: BoilerDevicesAttributes[]) => set({ boilerDevices }),
    setCleaningTaskTemplates: (cleaningTaskTemplates: CleaningTemplate[]) => set({ cleaningTaskTemplates }),
    setWaterReportTemplates: (waterReportTemplates: WaterReportTemplate[]) => set({ waterReportTemplates }),
    fetchInitialData: async () => {
        console.log("khởi tạo dữ liệu ")
        set({ fetchIniDataLoading: true, error: null })
        try {
            const [
                users,
                boilers,
                devices,
                boilerUsers,
                boilerDevices, cleaningTaskTemplates,waterReportTemplates
            ] = await Promise.all([
                getAllUsers(),
                getAllBoilers(),
                getAllDevices(),
                getAllBoilerUsers(),
                getAllBoilerDevices(),
                getAllCleaningTaskTemplates(),
                getAllWaterReportTemplates()
            ])

            set({
                users,
                boilers,
                devices,
                boilerUsers,
                boilerDevices,
             cleaningTaskTemplates,
                waterReportTemplates
            })
        } catch (error) {
            console.error('Failed to fetch initial data:', error)
            set({
                fetchIniDataLoading: false, // Kết thúc quá trình tải dù có lỗi hay không
                error: 'Failed to load data. Please try again later.', // Hiển thị lỗi nếu có
            })
        }
    },
}))