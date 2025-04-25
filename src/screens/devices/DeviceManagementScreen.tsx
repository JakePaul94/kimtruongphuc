import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '~/components/AppHeader';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { DeviceAttributes } from '~/types/deviceType';
import { useAppStore } from '~/store/useAppStore';
import DropDownPicker from 'react-native-dropdown-picker';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import Navbar from '~/components/Navbar';

dayjs.locale('vi');
dayjs.extend(relativeTime);

// Define the Device interface based on the API response
type Device = DeviceAttributes & {
  children?: Device[];
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DeviceManagementScreen = () => {
  const { devices, boilers, boilerDevices } = useAppStore();
  const [expandedDevices, setExpandedDevices] = useState<Set<number>>(new Set());
  const [deviceTree, setDeviceTree] = useState<Device[]>([]);
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [openBoilerFilter, setOpenBoilerFilter] = useState(false);
  const [selectedBoilerFilter, setSelectedBoilerFilter] = useState<string>('all');
  const [boilerFilterOptions, setBoilerFilterOptions] = useState<any[]>([]);

  const [openStatusFilter, setOpenStatusFilter] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'nearInspection' | 'nearMaintenance'>('all');
  const [statusFilterOptions] = useState([
    { label: 'Tất cả', value: 'all' },
    { label: 'Gần kiểm định', value: 'nearInspection' },
    { label: 'Gần bảo trì', value: 'nearMaintenance' },
  ]);

  useEffect(() => {
    // Chuyển boilers thành danh sách DropDown options
    const options = [
      { label: 'Tất cả', value: 'all' },
      { label: 'Không thuộc lò hơi', value: 'unassigned' },
      ...boilers.map((b) => ({
        label: b.name,
        value: b.id.toString(),
      })),
    ];
    setBoilerFilterOptions(options);
  }, [boilers]);

  const buildDeviceTree = useCallback((devices: DeviceAttributes[]): Device[] => {
    const deviceMap: { [key: number]: Device } = {};
    const tree: Device[] = [];
  
    devices.forEach((deviceAttr) => {
      deviceMap[deviceAttr.id] = { ...deviceAttr, children: [] };
    });
  
    devices.forEach((deviceAttr) => {
      const device = deviceMap[deviceAttr.id];
      if (deviceAttr.parentId === null) {
        tree.push(device);
      } else if (deviceMap[deviceAttr.parentId]) {
        deviceMap[deviceAttr.parentId].children!.push(device);
      }
    });
  
    return tree;
  }, []); // Dependency array có thể rỗng nếu nó không phụ thuộc vào state/props của component
  
  useEffect(() => {
    const fetchDevicesAndBuildTree = async () => {
      setLoading(true);
      setError(null);
      try {
        const tree = buildDeviceTree(devices);
        setDeviceTree(tree);
      } catch (err: any) {
        setError('Không thể tải danh sách thiết bị.');
        console.error('Lỗi tải danh sách thiết bị:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDevicesAndBuildTree();
  }, [devices, buildDeviceTree]);

  const toggleExpand = (deviceId: number) => {
    const newExpandedDevices = new Set(expandedDevices);
    if (newExpandedDevices.has(deviceId)) {
      newExpandedDevices.delete(deviceId);
    } else {
      newExpandedDevices.add(deviceId);
    }
    setExpandedDevices(newExpandedDevices);
  };

  const navigateToCreateDevice = (parentId: number | null = null) => {
    navigation.navigate('CreateDevice', { parentId });
  };

  const isNearDate = (dateString: string | null | undefined): boolean => {
    if (!dateString) return false;
    const date = dayjs(dateString);
    const now = dayjs();
    const diff = date.diff(now, 'day');
    return diff > 0 && diff < 15;
  };

  const filterAndRenderDevices = useCallback(() => {
    let filteredDevices = devices;

    // Filter by boiler
    if (selectedBoilerFilter === 'unassigned') {
      const assignedDeviceIds = boilerDevices.map((bd) => bd.deviceId);
      filteredDevices = filteredDevices.filter((device) => !assignedDeviceIds.includes(device.id));
    } else if (selectedBoilerFilter !== 'all') {
      filteredDevices = filteredDevices.filter((device) =>
        boilerDevices.some((bd) => bd.deviceId === device.id && bd.boilerId === Number(selectedBoilerFilter))
      );
    }

    // Filter by status
    if (selectedStatusFilter === 'nearInspection') {
      filteredDevices = filteredDevices.filter((device) => isNearDate(device.nextInspectionDate));
    } else if (selectedStatusFilter === 'nearMaintenance') {
      filteredDevices = filteredDevices.filter((device) => isNearDate(device.lastMaintenanceDate));
    }

    const tree = buildDeviceTree(filteredDevices);
    setDeviceTree(tree);
  }, [devices, selectedBoilerFilter, selectedStatusFilter, boilerDevices, buildDeviceTree]);

  useEffect(() => {
    filterAndRenderDevices();
  }, [filterAndRenderDevices]);

  const renderDevice = (device: Device, level: number = 0) => {
    const isExpanded = expandedDevices.has(device.id);
    const hasChildren = device.children && device.children.length > 0;
    const statusColor = device.usageStatus === 'Đang hoạt động' ? 'text-green-600' : 'text-red-600';
    const nearInspection = isNearDate(device.nextInspectionDate);
    const nearMaintenance = isNearDate(device.lastMaintenanceDate);

    return (
      <View key={device.id} style={{ marginLeft: level * 20 }}>
        <View className="mb-2 flex-row items-center justify-between rounded-lg bg-white p-4 shadow-md">
          <View className="flex-1 flex-row items-center">
            {hasChildren && (
              <TouchableOpacity onPress={() => toggleExpand(device.id)} className="mr-4">
                <Ionicons
                  name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                  size={20}
                  className="text-primary"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => navigation.navigate('DeviceDetail', { deviceId: device.id })}
            >
              <Text className="text-lg font-semibold text-gray-800">{device.deviceName}</Text>
              <Text className={`text-xs ${statusColor}`}>{device.usageStatus}</Text>
              {nearInspection && <Text className="text-xs text-yellow-600">Sắp kiểm định</Text>}
              {nearMaintenance && <Text className="text-xs text-orange-600">Sắp bảo trì</Text>}
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigateToCreateDevice(device.id)} className="ml-2">
            <Ionicons name="add-circle-outline" size={24} color="green" />
          </TouchableOpacity>
        </View>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <View>{device.children!.map((child) => renderDevice(child, level + 1))}</View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="green" />
        <Text className="mt-2 text-gray-500">Đang tải danh sách thiết bị...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 p-4">
        <Text className="text-center text-lg text-red-500">{error}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 rounded-lg bg-blue-500 p-3"
        >
          <Text className="font-semibold text-white">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-red-400">
      <Navbar/>

      {/* Filters */}
      <View style={{borderColor:"rgba(0,222,0,0.2)",borderTopWidth:0.2,borderBottomWidth:0.2}} className="px-4 py-2  bg-white z-20 shadow-sm">
        <View className="flex-row gap-4 space-x-2">
          <View className="flex-1">
            <Text className="mb-1 text-sm font-medium text-gray-600">Lọc theo lò hơi</Text>
            <DropDownPicker
              open={openBoilerFilter}
              value={selectedBoilerFilter}
              items={boilerFilterOptions}
              setOpen={setOpenBoilerFilter}
              setValue={setSelectedBoilerFilter}
              setItems={setBoilerFilterOptions}
              placeholder="Tất cả lò hơi"
              style={{ borderColor: '#E5E7EB' }}
              dropDownContainerStyle={{ borderColor: '#E5E7EB' }}
              textStyle={{ fontSize: 14 }}
            />
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-sm font-medium text-gray-600">Lọc theo trạng thái</Text>
            <DropDownPicker
              open={openStatusFilter}
              value={selectedStatusFilter}
              items={statusFilterOptions}
              setOpen={setOpenStatusFilter}
              setValue={setSelectedStatusFilter}
              placeholder="Tất cả trạng thái"
              style={{ borderColor: '#E5E7EB' }}
              dropDownContainerStyle={{ borderColor: '#E5E7EB' }}
              textStyle={{ fontSize: 14 }}
            />
          </View>
        </View>
      </View>

      <View className="flex-1 bg-red-400 p-4">
        <FlatList
          data={deviceTree}
          renderItem={({ item }) => renderDevice(item)}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text className="text-center text-gray-500">Không có thiết bị</Text>}
        />
      </View>
      {/* Floating Action Button for adding new device at the root level */}
      <TouchableOpacity onPress={() => navigateToCreateDevice()} style={styles.fab}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'green',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default DeviceManagementScreen;