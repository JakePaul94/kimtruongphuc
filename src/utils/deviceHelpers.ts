import { DeviceAttributes } from "~/types/deviceType";
import { useMemo } from 'react';
import { BoilerAttributes, BoilerDevicesAttributes } from "~/types/boilerType";
export const getDevicesDueSoon = (
    devices: DeviceAttributes[],
    dateKey: 'nextMaintenanceDate' | 'nextInspectionDate',
    withinDays = 15
  ) => {
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + withinDays);
  
    return devices.filter((device) => {
      const targetDate = device[dateKey] ? new Date(device[dateKey]) : null;
      return (
        targetDate &&
        targetDate >= today &&
        targetDate <= dueDate
      );
    });
  };

  export const getBoilerNameFromDevice = (
    deviceId: number,
    boilerDevices: BoilerDevicesAttributes[],
    boilers: BoilerAttributes[]
  ): string | null => {
    const match = boilerDevices.find((bd) => bd.deviceId === deviceId);
    if (!match) return null;
  
    const boiler = boilers.find((b) => b.id === match.boilerId);
    return boiler?.name || null;
  };

  export const useFilteredDevices = ({
    allDevices,
    boilerDevices,
    boilerId,
    deviceType,
    maintenanceDue,
    inspectionDue,
  }: {
    allDevices: DeviceAttributes[];
    boilerDevices: BoilerDevicesAttributes[];
    boilerId: number | 'none' | null; // 👈 Thêm 'none'
    deviceType: 'main' | 'sub' | null;
    maintenanceDue: boolean;
    inspectionDue: boolean;
  }) => {
    return useMemo(() => {
      let filtered = [...allDevices];
  
      if (boilerId === 'none') {
        // 👉 Thiết bị không gán cho lò hơi nào
        const deviceIdsInBoiler = boilerDevices.map((bd) => bd.deviceId);
        filtered = filtered.filter((d) => !deviceIdsInBoiler.includes(d.id));
      } else if (boilerId) {
        // 👉 Lọc theo boilerId
        const allowedDeviceIds = boilerDevices
          .filter((bd) => bd.boilerId === boilerId)
          .map((bd) => bd.deviceId);
  
        filtered = filtered.filter((d) => allowedDeviceIds.includes(d.id));
      }
  
      if (deviceType === 'main') {
        filtered = filtered.filter((d) => !d.parentId);
      }
  
      if (deviceType === 'sub') {
        filtered = filtered.filter((d) => !!d.parentId);
      }
  
      if (maintenanceDue) {
        filtered = filtered.filter((d) => isDueSoon(d.nextMaintenanceDate));
      }
  
      if (inspectionDue) {
        filtered = filtered.filter((d) => isDueSoon(d.nextInspectionDate));
      }
  
      const tree = buildDeviceTree(filtered);
      return tree;
    }, [allDevices, boilerDevices, boilerId, deviceType, maintenanceDue, inspectionDue]);
  };
  

const isDueSoon = (dateStr?: string | null) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const now = new Date();
  const diff = (date.getTime() - now.getTime()) / (1000 * 3600 * 24);
  return diff <= 15; // 7 ngày tới
};

const buildDeviceTree = (devices: DeviceAttributes[]) => {
  const map: Record<string, DeviceAttributes & { children: DeviceAttributes[] }> = {};
  const roots: (DeviceAttributes & { children: DeviceAttributes[] })[] = [];

  devices.forEach(d => {
    map[d.id] = { ...d, children: [] };
  });

  devices.forEach(d => {
    if (d.parentId && map[d.parentId]) {
      map[d.parentId].children.push(map[d.id]);
    } else {
      roots.push(map[d.id]);
    }
  });

  return roots;
};
