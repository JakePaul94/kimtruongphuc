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
    isDataFetched: boolean // Flag để biết dữ liệu đã được fetch chưa
    setUsers: (users: UserAttributes[]) => void
    setBoilers: (boilers: BoilerAttributes[]) => void
    setDevices: (devices: DeviceAttributes[]) => void
    setBoilerUsers: (boilerUsers: BoilerUsersAttributes[]) => void
    setBoilerDevices: (boilerDevices: BoilerDevicesAttributes[]) => void
    setCleaningTaskTemplates: (templates: CleaningTemplate[]) => void; // Thêm setter nếu cần
    setWaterReportTemplates: (templates: WaterReportTemplate[]) => void; // Thêm setter nếu cần
    setDataFetched: (fetched: boolean) => void;
    fetchInitialData: () => Promise<boolean> // Trả về boolean thành công/thất bại
    resetAppData: () => void; // Hàm để reset data khi logout
}

export const useAppStore = create<AppState>((set,get) => ({
    users: [],
    boilers: [],
    devices: [],
    boilerUsers: [],
    boilerDevices: [],
    cleaningTaskTemplates: [],
    waterReportTemplates:[],
    fetchIniDataLoading: false,
    error: null,
    isDataFetched: false, // Khởi tạo là false
    setDataFetched: (fetched: boolean) => set({ isDataFetched: fetched }),
    setUsers: (users: UserAttributes[]) => set({ users }),
    setBoilers: (boilers: BoilerAttributes[]) => set({ boilers }),
    setDevices: (devices: DeviceAttributes[]) => set({ devices }),
    setBoilerUsers: (boilerUsers: BoilerUsersAttributes[]) => set({ boilerUsers }),
    setBoilerDevices: (boilerDevices: BoilerDevicesAttributes[]) => set({ boilerDevices }),
    setCleaningTaskTemplates: (cleaningTaskTemplates: CleaningTemplate[]) => set({ cleaningTaskTemplates }),
    setWaterReportTemplates: (waterReportTemplates: WaterReportTemplate[]) => set({ waterReportTemplates }),

    fetchInitialData: async () => {
        // Nếu đang fetch rồi thì không fetch nữa
        if (get().fetchIniDataLoading) {
            console.log("Đang trong quá trình tải dữ liệu ban đầu, bỏ qua lần gọi này.");
            return false; // Hoặc true nếu coi như thành công vì đang chạy rồi
        }
        console.log("Bắt đầu tải dữ liệu ban đầu...");
        set({ fetchIniDataLoading: true, error: null })
        try {
            const [
                users,
                boilers,
                devices,
                boilerUsers,
                boilerDevices,
                cleaningTaskTemplates,
                waterReportTemplates
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
                waterReportTemplates,
                isDataFetched: true, // Đánh dấu đã fetch thành công
                error: null
            })
            console.log("Tải dữ liệu ban đầu thành công.");
            return true; // Thành công
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu ban đầu:', error)
            set({
                error: 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
                isDataFetched: false // Đánh dấu fetch thất bại
            })
            return false; // Thất bại
        } finally {
            set({ fetchIniDataLoading: false }); // Luôn tắt loading khi kết thúc
        }
    },

    // Hàm reset state của app store khi logout
    resetAppData: () => {
        console.log("Resetting App Store data...");
        set({
            users: [],
            boilers: [],
            devices: [],
            boilerUsers: [],
            boilerDevices: [],
            cleaningTaskTemplates: [],
            waterReportTemplates:[],
            fetchIniDataLoading: false,
            error: null,
            isDataFetched: false, // Quan trọng: reset cờ này
        });
    }
}))