// screens/devices/DeviceDetailScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
// Thêm SafeAreaView, TextInput, Alert
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons'; // Thêm Feather cho icon edit/save
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/navigation/AppNavigator';
import { deleteDevice, getDeviceById, updateDevice } from '~/apis/deviceApi'; // Giả sử có hàm updateDevice
import { formatDateFromIsoToDDMMYY } from '~/utils/timeHelper'; // Thêm formatIsoDate nếu cần gửi lại API
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '~/components/AppHeader';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker'; // Import image picker
import { uploadImage } from '~/apis/uploadApi';
import { useAuthStore } from '~/store/authStore';
import { useAppStore } from '~/store/useAppStore';

type DeviceDetailRouteProp = RouteProp<RootStackParamList, 'DeviceDetail'>;
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateIncidentReport' | 'DeviceDetail'
>;

// --- Component ProfileItem Cập nhật ---
const ProfileItem = ({
  label,
  value,
  isEditing, // Prop mới: cho biết có đang ở chế độ sửa không
  onChangeValue, // Prop mới: callback khi giá trị thay đổi
  keyboardType = 'default', // Prop mới: kiểu bàn phím cho TextInput
  editable = true, // Prop mới: Trường này có cho phép sửa không
  fieldKey, // Prop mới: key của trường dữ liệu để cập nhật state
}: {
  label: string;
  value: string | number | undefined | null | boolean;
  isEditing: boolean;
  onChangeValue: (key: string, text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  editable?: boolean;
  fieldKey: string; // Ví dụ: 'deviceName', 'model', 'brand'...
}) => {
  // Không hiển thị TextInput cho giá trị boolean
  const showTextInput = isEditing && typeof value !== 'boolean' && editable;

  return (
    <View
      className={`mb-2 flex-row items-center justify-between gap-4 rounded-md border bg-white p-4 ${!editable && isEditing ? 'border-gray-100 bg-gray-50' : 'border-gray-200'}`}>
      <Text className={`text-base ${!editable && isEditing ? 'text-gray-400' : 'text-gray-800'}`}>
        {label}
      </Text>
      {showTextInput ? (
        <TextInput
          className="w-1/2 flex-1 rounded border border-blue-300 bg-white px-2 py-1 text-right text-base font-semibold text-gray-800"
          value={value?.toString() ?? ''} // Hiển thị giá trị hiện tại
          onChangeText={(text) => onChangeValue(fieldKey, text)} // Gọi callback khi thay đổi
          placeholder={label} // Placeholder là label
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          editable={editable} // TextInput có thể sửa hoặc không
        />
      ) : (
        <Text
          className={`text-base font-semibold ${!editable && isEditing ? 'text-gray-400' : 'text-gray-800'}`}>
          {typeof value === 'boolean' ? (value ? '✅' : '❌') : (value ?? '-')}
        </Text>
      )}
    </View>
  );
};

const SectionTitle = ({ title }: { title: string }) => (
  <Text className="mb-2 mt-6 text-sm font-semibold uppercase text-gray-500">{title}</Text>
);

export default function DeviceDetailScreen() {
  const route = useRoute<DeviceDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const deviceId = route.params?.deviceId;
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role; // Lấy vai trò người dùng từ store
  const { devices, fetchInitialData } = useAppStore();
  const [device, setDevice] = useState<any>(null); // Dữ liệu gốc từ API
  const [editedDevice, setEditedDevice] = useState<any>(null); // Dữ liệu đang chỉnh sửa
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [saving, setSaving] = useState(false); // Trạng thái đang lưu
  const [pickedImageUri, setPickedImageUri] = useState<string | null>(null); // Lưu URI ảnh mới chọn
  const [selectedRequestType, setSelectedRequestType] = useState<string | null>(null);
  useEffect(() => {
    if (typeof deviceId !== 'number') {
      Alert.alert('Lỗi', 'Không nhận được ID thiết bị hợp lệ.');
      return;
    }

    const data = devices.find((a) => a.id === deviceId);
    if (!data) {
      Alert.alert('Lỗi', 'Không tìm thấy thiết bị.');
      setDevice(null);
      setEditedDevice(null);
      return;
    }

    setDevice(data);
    setEditedDevice(JSON.parse(JSON.stringify(data)));
    setPickedImageUri(null);
  }, [deviceId, devices]);

  // Xử lý khi giá trị trong TextInput thay đổi
  const handleValueChange = (key: string, value: string) => {
    setEditedDevice((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Hàm xử lý nhấn nút Sửa/Lưu
  const handleToggleEditSave = () => {
    if (isEditing) {
      // --- Logic Lưu ---
      handleSave();
    } else {
      // --- Bắt đầu Chỉnh sửa ---
      if (userRole === 'admin') {
        // <<<--- KIỂM TRA QUYỀN ADMIN Ở ĐÂY
        setIsEditing(true);
        setEditedDevice(JSON.parse(JSON.stringify(device)));
        setPickedImageUri(null);
      } else {
        // Thông báo hoặc không làm gì nếu không phải admin cố nhấn nút sửa (nếu nút đó vẫn hiện)
        Alert.alert('Không có quyền', 'Bạn không có quyền chỉnh sửa thiết bị này.');
        console.log('Permission denied: Only admins can edit.');
      }
    }
  };

  // Hàm xử lý Lưu thay đổi
  const handleSave = async () => {
    if (!editedDevice) return;
    setSaving(true);
    if (editedDevice.maintenanceCycle) {
      const match = editedDevice.maintenanceCycle.match(/^(\d+)\s*tháng$/i);
      if (!match) {
        Alert.alert(
          'Định dạng không hợp lệ',
          'Vui lòng nhập Chu kỳ bảo trì theo định dạng "x tháng" (ví dụ: 3 tháng).'
        );
        return;
      }
    }
    try {
      const dataToUpdate = { ...editedDevice };
      if (pickedImageUri) {
        dataToUpdate.imageUrl = await uploadImage(pickedImageUri);
        console.log('Dữ liệu cập nhật:', dataToUpdate);
      }
      await updateDevice(editedDevice.id, dataToUpdate); // Gọi API update
      Alert.alert('Thành công', 'Cập nhật thông tin thiết bị thành công!');
      setIsEditing(false);
      fetchInitialData();
    } catch (error) {
      console.error('Lỗi khi cập nhật thiết bị:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin thiết bị.');
    } finally {
      setSaving(false);
    }
  };

  // Hàm xử lý Hủy bỏ chỉnh sửa (khi nhấn nút back trong chế độ sửa)
  const handleCancelEdit = () => {
    if (JSON.stringify(device) !== JSON.stringify(editedDevice) || pickedImageUri) {
      // Kiểm tra xem có thay đổi không
      Alert.alert('Hủy thay đổi?', 'Bạn có chắc muốn hủy các thay đổi đã thực hiện?', [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          onPress: () => {
            setIsEditing(false);
            setEditedDevice(JSON.parse(JSON.stringify(device))); // Khôi phục dữ liệu gốc
            setPickedImageUri(null); // Hủy ảnh đã chọn
            // navigation.goBack(); // Quay lại màn hình trước nếu muốn
          },
          style: 'destructive',
        },
      ]);
    } else {
      // Nếu không có thay đổi, chỉ cần thoát chế độ sửa
      setIsEditing(false);
      setEditedDevice(JSON.parse(JSON.stringify(device)));
      setPickedImageUri(null);
      // navigation.goBack(); // Quay lại màn hình trước nếu muốn
    }
  };

  // Hàm xử lý nút Back chung
  const handleGoBack = () => {
    if (isEditing) {
      handleCancelEdit(); // Nếu đang sửa, hỏi xác nhận hủy
    } else if (navigation.canGoBack()) {
      navigation.goBack(); // Nếu không sửa, quay lại bình thường
    }
  };

  // Hàm chọn ảnh
  const handleChooseImage = async () => {
    // Xin quyền truy cập thư viện ảnh
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Cần cấp quyền', 'Bạn cần cấp quyền truy cập thư viện ảnh để chọn ảnh.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true, // Cho phép cắt/xoay ảnh cơ bản
      aspect: [1, 1], // Tỉ lệ ảnh (ví dụ: vuông)
      quality: 0.8, // Chất lượng ảnh (0-1)
    });

    if (!pickerResult.canceled) {
      setPickedImageUri(pickerResult.assets[0].uri);
      // Cập nhật ảnh hiển thị ngay lập tức (trong editedDevice nếu muốn lưu trực tiếp)
      // setEditedDevice(prev => ({ ...prev, imageUrl: pickerResult.assets[0].uri }));
    }
  };
  console.log('pickedImageUri:', pickedImageUri); // Log để debug (tùy chọn)
  // Log để debug (tùy chọn)
  // --- Render ---

  if (!device)
    return (
      // Hiển thị lỗi nếu không tải được device
      <SafeAreaView className="flex-1 bg-gray-100">
        <AppHeader title="Lỗi" onBackPress={() => navigation.goBack()} />
        <View className="flex-1 items-center justify-center p-5">
          <Text className="text-center text-red-600">
            Không thể tải thông tin chi tiết của thiết bị.
          </Text>
        </View>
      </SafeAreaView>
    );

  // Dữ liệu hiển thị sẽ là editedDevice khi đang sửa, ngược lại là device gốc
  const displayDevice = isEditing ? editedDevice : device;
  const currentImageUri = pickedImageUri ?? displayDevice?.imageUrl; // Ưu tiên ảnh mới chọn
  const renderAdminActions = () => (
    <View className="mb-6 flex-row items-center justify-between">
      <View className="mr-2  h-12 flex-1 justify-center overflow-hidden rounded-lg border border-gray-200 bg-slate-200">
        <Picker
          selectedValue={selectedRequestType}
          style={{ width: '100%' }}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedRequestType(itemValue);
            if (itemValue === 'maintenance') {
            } else if (itemValue === 'inspection') {
              // navigation.navigate('CreateInspectionRequest', { deviceId: displayDevice.id });
            } else if (itemValue === 'check') {
              // navigation.navigate('CreateCheckRequest', { deviceId: displayDevice.id });
            } // Reset the picker selection after navigation (optional)
            setTimeout(() => setSelectedRequestType(null), 500);
          }}>
          <Picker.Item label="Tạo yêu cầu" value={null} />
          <Picker.Item label="Tạo yêu cầu bảo trì" value="maintenance" />
          <Picker.Item label="Tạo yêu cầu kiểm định" value="inspection" />
          <Picker.Item label="Tạo yêu cầu kiểm tra" value="check" />
        </Picker>
      </View>
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Xác nhận xóa',
            `Bạn có chắc chắn muốn xóa thiết bị "${displayDevice.deviceName}" không?`,
            [
              { text: 'Không', style: 'cancel' },
              {
                text: 'Có',
                style: 'destructive',
                onPress: async () => {
                  try {
                    await deleteDevice(displayDevice.id);
                    Alert.alert('Thành công', 'Thiết bị đã được xóa.');
                    navigation.goBack();
                    fetchInitialData();
                  } catch (error) {
                    console.error('Lỗi khi xóa thiết bị:', error);
                    Alert.alert('Lỗi', 'Không thể xóa thiết bị.');
                  }
                },
              },
            ]
          );
        }}
        className="h-12 w-2/5 flex-shrink-0 items-center justify-center rounded-lg bg-red-600 px-3 py-3 active:bg-red-700">
        <Text className="text-sm font-semibold text-white">Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBoilerWorkerActions = () => {
    const now = new Date();

    const isNeedMaintenance =
      displayDevice.nextMaintenanceDate &&
      (new Date(displayDevice.nextMaintenanceDate).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24) <=
        15;

    const isNeedInspection =
      displayDevice.nextInspectionDate &&
      (new Date(displayDevice.nextInspectionDate).getTime() - now.getTime()) /
        (1000 * 60 * 60 * 24) <=
        15;

    return (
      <View className="mb-6 flex-row justify-between">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MaintenanceTaskExecution', { deviceId: displayDevice.id });
          }}
          disabled={!isNeedMaintenance}
          className={`flex-1 items-center justify-center rounded-lg px-3 py-3 ${
            isNeedMaintenance ? 'bg-blue-600 active:bg-blue-700' : 'bg-gray-300'
          } mr-1`}>
          <Text className="text-sm font-semibold text-white">Bảo trì</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // Điều hướng đến màn hình kiểm định
          }}
          disabled={!isNeedInspection}
          className={`flex-1 items-center justify-center rounded-lg px-3 py-3 ${
            isNeedInspection ? 'bg-orange-500 active:bg-orange-600' : 'bg-gray-300'
          } mx-1`}>
          <Text className="text-sm font-semibold text-white">Kiểm định</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CreateIncidentReport', { deviceId: displayDevice.id });
          }}
          className="ml-1 flex-1 items-center justify-center rounded-lg bg-red-600 px-3 py-3 active:bg-red-700">
          <Text className="text-sm font-semibold text-white">Báo sự cố</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <AppHeader
        title={isEditing ? 'Chỉnh sửa Thiết bị' : 'Chi tiết Thiết bị'}
        onBackPress={handleGoBack} // Luôn dùng handleGoBack để xử lý cancel/back
        // Hiển thị nút Sửa hoặc Lưu/Loading
        rightComponent={
          saving ? (
            <ActivityIndicator className="text-primary" />
          ) : (
            <TouchableOpacity onPress={handleToggleEditSave} className="">
              <Feather name={isEditing ? 'save' : 'edit-2'} size={16} className="text-primary" />
            </TouchableOpacity>
          )
        }
      />

      {/* ScrollView chứa nội dung */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // Để TextInput không mất focus khi chạm ra ngoài
      >
        {/* --- Phần Ảnh --- */}
        <View className="mb-6 items-center pt-4">
          <TouchableOpacity onPress={handleChooseImage} className="m-4" disabled={!isEditing}>
            {currentImageUri ? (
              <Image src={currentImageUri} className="h-32 w-32 rounded-xl object-cover" />
            ) : (
              <View className="h-32 w-32 items-center justify-center rounded-xl bg-gray-200">
                <Ionicons name="image-outline" size={40} color="gray" />
              </View>
            )}
            {isEditing && ( // Hiển thị icon camera nhỏ khi đang sửa
              <View className="absolute bottom-0 right-0 rounded-full bg-blue-500 p-1.5 shadow">
                <Feather name="camera" size={16} color="white" />
              </View>
            )}
          </TouchableOpacity>

          {/* Tên và Mã thiết bị */}
          <ProfileItem
            label="Tên thiết bị"
            fieldKey="deviceName"
            value={displayDevice?.deviceName}
            isEditing={isEditing}
            onChangeValue={handleValueChange}
            editable={true} // Cho phép sửa tên
          />
          <ProfileItem
            label="Mã thiết bị"
            fieldKey="deviceCode"
            value={displayDevice?.deviceCode}
            isEditing={isEditing}
            onChangeValue={handleValueChange}
            editable={false} // Ví dụ: không cho sửa mã
          />
        </View>

        {/* --- Các Nút Hành Động (Có thể ẩn đi khi đang sửa) --- */}
        {userRole === 'boiler_worker' && !isEditing && renderBoilerWorkerActions()}
        {userRole === 'admin' && !isEditing && renderAdminActions()}

        {/* --- Các Phần Thông Tin --- */}
        <SectionTitle title="Thông tin chung" />
        {/* Ví dụ: Cho sửa Model, Brand, không cho sửa Serial */}
        <ProfileItem
          label="Model"
          fieldKey="model"
          value={displayDevice?.model}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={true}
        />
        <ProfileItem
          label="Thương hiệu"
          fieldKey="brand"
          value={displayDevice?.brand}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={true}
        />
        <ProfileItem
          label="Xuất xứ"
          fieldKey="origin"
          value={displayDevice?.origin}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={true}
        />
        <ProfileItem
          label="Số serial"
          fieldKey="serialNumber"
          value={displayDevice?.serialNumber}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={false}
        />
        <ProfileItem
          label="Năm sản xuất"
          fieldKey="yearOfManufacture"
          value={displayDevice?.yearOfManufacture}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          keyboardType="numeric"
          editable={true}
        />
        <ProfileItem
          label="Bộ phận"
          fieldKey="department"
          value={displayDevice?.department}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={true}
        />
        <ProfileItem
          label="Người quản lý"
          fieldKey="manager"
          value={displayDevice?.manager}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={true}
        />
        <ProfileItem
          label="Vị trí lắp đặt"
          fieldKey="location"
          value={displayDevice?.location}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={true}
        />
        <ProfileItem
          label="Chi tiết vị trí"
          fieldKey="locationDetails"
          value={displayDevice?.locationDetails}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={true}
        />
        <ProfileItem
          label="Tình trạng sử dụng"
          fieldKey="usageStatus"
          value={displayDevice?.usageStatus}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={true}
        />
        <ProfileItem
          label="Số giờ hoạt động"
          fieldKey="operatingHours"
          value={displayDevice?.operatingHours}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          keyboardType="numeric"
          editable={true}
        />
        <ProfileItem
          label="Giá trị"
          fieldKey="value"
          value={displayDevice?.value}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          keyboardType="numeric"
          editable={true}
        />
        <ProfileItem
          label="Giá trị hao mòn"
          fieldKey="depreciationValue"
          value={displayDevice?.depreciationValue}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          keyboardType="numeric"
          editable={true}
        />

        {/* Các trường Ngày tháng và Boolean thường không cho sửa trực tiếp ở đây */}
        {/* Chúng có thể được cập nhật thông qua các màn hình Bảo trì, Kiểm định riêng */}
        <SectionTitle title="Bảo trì" />
        <ProfileItem
          label="Chu kỳ bảo trì"
          fieldKey="maintenanceCycle"
          value={displayDevice?.maintenanceCycle}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={false}
        />
        <ProfileItem
          label="Lần bảo trì gần nhất"
          fieldKey="lastMaintenanceDate"
          value={formatDateFromIsoToDDMMYY(displayDevice?.lastMaintenanceDate)}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={false}
        />
        <ProfileItem
          label="Ngày bảo trì kế tiếp"
          fieldKey="nextMaintenanceDate"
          value={formatDateFromIsoToDDMMYY(displayDevice?.nextMaintenanceDate)}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={false}
        />
        <ProfileItem
          label="Cần bảo trì?"
          fieldKey="isNeedMaintenance"
          value={displayDevice?.isNeedMaintenance}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={false}
        />

        <SectionTitle title="Kiểm định" />
        <ProfileItem
          label="Lần kiểm định gần nhất"
          fieldKey="lastInspectionDate"
          value={formatDateFromIsoToDDMMYY(displayDevice?.lastInspectionDate)}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={false}
        />
        <ProfileItem
          label="Ngày kiểm định kế tiếp"
          fieldKey="nextInspectionDate"
          value={formatDateFromIsoToDDMMYY(displayDevice?.nextInspectionDate)}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={false}
        />
        <ProfileItem
          label="Tình trạng kiểm định"
          fieldKey="inspectionStatus"
          value={displayDevice?.inspectionStatus}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={false}
        />

        <SectionTitle title="Thông tin khác" />
        <ProfileItem
          label="Ngày lắp đặt"
          fieldKey="installationDate"
          value={formatDateFromIsoToDDMMYY(displayDevice?.installationDate)}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={false}
        />
        <ProfileItem
          label="Ngày hết hạn bảo hành"
          fieldKey="warrantyExpiration"
          value={formatDateFromIsoToDDMMYY(displayDevice?.warrantyExpiration)}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={false}
        />
        <ProfileItem
          label="Còn bảo hành?"
          fieldKey="isUnderWarranty"
          value={displayDevice?.isUnderWarranty}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={false}
        />
        <ProfileItem
          label="Lần kiểm tra gần nhất"
          fieldKey="lastChecked"
          value={formatDateFromIsoToDDMMYY(displayDevice?.lastChecked)}
          isEditing={isEditing}
          onChangeValue={handleValueChange}
          editable={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
