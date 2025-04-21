// screens/devices/CreateDeviceScreen.tsx
import React, { useState, useCallback } from 'react';
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
  Switch, // Thêm Switch cho boolean
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '~/components/AppHeader';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'; // Import date picker
import { Picker } from '@react-native-picker/picker';
import { useAppStore } from '~/store/useAppStore';
import { BoilerAttributes } from '~/types/boilerType';
import { createDevice } from '~/apis/deviceApi'; // API tạo mới
import { uploadImage } from '~/apis/uploadApi'; // API upload ảnh
import { RootStackParamList } from '~/navigation/AppNavigator'; // Import ParamList
import { DeviceAttributes } from '~/types/deviceType';
import { assignDeviceToBoiler } from '~/apis/boilerApi';
type CreateDeviceRouteProp = RouteProp<RootStackParamList, 'CreateDevice'>;
// --- Component FormInput (Tái sử dụng) ---
interface FormInputProps {
  label: string;
  value: string | number | undefined;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  required = false,
  multiline = false,
  numberOfLines = 1,
}) => (
  <View className="mb-4">
    <Text className="mb-1 text-base text-gray-700">
      {label} {required && <Text className="text-red-500">*</Text>}
    </Text>
    <TextInput
      className={`rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 ${multiline ? 'h-24' : ''}`}
      style={multiline ? { textAlignVertical: 'top' } : {}} // Căn text lên trên cho multiline
      value={value?.toString() ?? ''}
      onChangeText={onChangeText}
      placeholder={placeholder ?? `Nhập ${label.toLowerCase()}...`}
      placeholderTextColor="#9CA3AF"
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={multiline ? numberOfLines : 1}
    />
  </View>
);

// --- Component FormDatePicker (Tái sử dụng) ---
interface FormDatePickerProps {
  label: string;
  value: Date | null | undefined;
  onChange: (date: Date | null) => void;
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({ label, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentValue = value; // Lưu lại giá trị hiện tại trước khi thay đổi
    setShowPicker(Platform.OS === 'ios');
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate); // Người dùng chọn 1 ngày
    } else if (event.type === 'dismissed') {
      onChange(currentValue ?? null);
    } else if (event.type === 'neutralButtonPressed') {
      // Xóa ngày (Android)
      onChange(null); // Người dùng chọn xóa ngày
    }
    // Không cần gọi onChange nếu không phải các trường hợp trên
  };

  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return 'Chưa chọn ngày';
    // Sử dụng hàm formatDateFromIsoToDDMMYY hoặc tương tự nếu có
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <View className="mb-4">
      <Text className="mb-1 text-base text-gray-700">{label}</Text>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        className="rounded-md border border-gray-300 bg-white px-3 py-2.5">
        <Text className={`text-base ${value ? 'text-gray-900' : 'text-gray-400'}`}>
          {formatDate(value)}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={value || new Date()} // Giá trị hiện tại hoặc ngày hôm nay
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          // Thêm nút xóa ngày cho Android (nếu phiên bản hỗ trợ)
          {...(Platform.OS === 'android' && { neutralButton: { label: 'Xóa ngày' } })}
        />
      )}
    </View>
  );
};

// --- Component FormSwitch (Tái sử dụng) ---
interface FormSwitchProps {
  label: string;
  value: boolean | undefined;
  onValueChange: (value: boolean) => void;
}
const FormSwitch: React.FC<FormSwitchProps> = ({ label, value = false, onValueChange }) => (
  <View className="mb-4 flex-row items-center justify-between rounded-md border border-gray-300 bg-white p-3">
    <Text className="text-base text-gray-700">{label}</Text>
    <Switch
      trackColor={{ false: '#767577', true: '#81b0ff' }}
      thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={onValueChange}
      value={value}
    />
  </View>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Text className="mb-2 mt-6 text-sm font-semibold uppercase text-gray-500">{title}</Text>
);
// --- Component chính ---
type NavigationType = NativeStackNavigationProp<RootStackParamList>;

export default function CreateDeviceScreen() {
  const navigation = useNavigation<NavigationType>();
  const route = useRoute<CreateDeviceRouteProp>();
  const { parentId } = route.params;
  const {boilers,boilerDevices} = useAppStore();
  const [selectedBoilerId, setSelectedBoilerId] = useState<string>('');
  // State cho form data, khởi tạo giá trị mặc định
  const [formData, setFormData] = useState<Partial<DeviceAttributes>>({
    deviceCode: '',
    deviceName: '',
    imageUrl: '', // Sẽ cập nhật sau khi upload
    isUnderWarranty: true, // Ví dụ giá trị mặc định
    // Thêm các giá trị mặc định khác nếu cần
    model: undefined,
    brand: undefined,
    origin: undefined,
    yearOfManufacture: undefined,
    serialNumber: undefined,
    usageStatus: undefined,
    installationDate: undefined,
    warrantyExpiration: undefined,
    location: undefined,
    value: undefined,
    department: undefined,
    manager: undefined,
    maintenanceCycle: undefined,
    operatingHours: undefined,
    depreciationValue: undefined,
    locationDetails: undefined,
    inspectionStatus: undefined,
  });
  const [saving, setSaving] = useState(false);
  const [pickedImageUri, setPickedImageUri] = useState<string | null>(null);

  // Hàm cập nhật state form chung
  const handleInputChange = useCallback(
    (key: keyof DeviceAttributes, value: string | number | boolean | Date | null) => {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // Hàm chọn ảnh
  const handleChooseImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Cần cấp quyền', 'Bạn cần cấp quyền truy cập thư viện ảnh.');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!pickerResult.canceled) {
      setPickedImageUri(pickerResult.assets[0].uri);
    }
  };

  // Hàm xử lý Lưu
  const handleSave = async () => {
    // --- Validation cơ bản ---
    let finalBoilerId: number | undefined = undefined;
    if (!formData.deviceCode || !formData.deviceName) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Mã thiết bị và Tên thiết bị.');
      return;
    }
    if (!pickedImageUri) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn hình ảnh cho thiết bị.');
      return;
    }
    // Thêm các validation khác nếu cần

    setSaving(true);
    try {
      // 1. Upload ảnh (nếu có)
      let finalImageUrl = '';
      if (pickedImageUri) {
        finalImageUrl = await uploadImage(pickedImageUri); // Gọi API upload
      } else {
        // Xử lý nếu ảnh là bắt buộc mà không có ảnh được chọn
        Alert.alert('Thiếu ảnh', 'Vui lòng chọn hình ảnh cho thiết bị.');
        setSaving(false);
        return;
      }
      console.log('Ảnh đã upload:', finalImageUrl);
      console.log('Dữ liệu form:', formData);
      console.log('Parent ID:', parentId);
      // 2. Chuẩn bị dữ liệu gửi đi
      const payload: Partial<DeviceAttributes> = {
        ...formData,
        imageUrl: finalImageUrl, // Sử dụng URL ảnh đã upload
        parentId: parentId ?? null, // Nếu không có parentId thì để null
        yearOfManufacture: formData.yearOfManufacture
          ? Number(formData.yearOfManufacture)
          : undefined,
        value: formData.value ? Number(formData.value) : undefined,
        operatingHours: formData.operatingHours ? Number(formData.operatingHours) : undefined,
        depreciationValue: formData.depreciationValue
          ? Number(formData.depreciationValue)
          : undefined,
      };
      // Loại bỏ các trường không cần thiết hoặc null/undefined nếu API yêu cầu
      Object.keys(payload).forEach((key) => {
        if (
          payload[key as keyof DeviceAttributes] === undefined ||
          payload[key as keyof DeviceAttributes] === null ||
          payload[key as keyof DeviceAttributes] === ''
        ) {
          delete payload[key as keyof DeviceAttributes];
        }
      });

      // 3. Gọi API tạo thiết bị
      const newDevice = await createDevice(payload);

      if (parentId) {
        // Tìm boilerId của thiết bị cha
        const boilerParent = boilerDevices.find(a => a.deviceId === parentId);
        const boilerParentId = boilerParent?.boilerId;
        
        if (boilerParentId) {
          // Nếu thiết bị cha đã thuộc về một lò hơi
          if (selectedBoilerId && parseInt(selectedBoilerId) !== boilerParentId) {
            Alert.alert(
              'Thông báo', 
              'Thiết bị con phải thuộc cùng lò hơi với thiết bị cha. Hệ thống sẽ tự động gán lò hơi theo thiết bị cha.'
            );
          }
          finalBoilerId = boilerParentId; // Luôn sử dụng boilerId của thiết bị cha
        } else if (selectedBoilerId) {
          // Thiết bị cha không thuộc lò hơi nào, nhưng người dùng chọn lò hơi cho thiết bị con
          finalBoilerId = parseInt(selectedBoilerId);
        }
      } else if (selectedBoilerId) {
        // Không có parentId và người dùng chọn lò hơi
        finalBoilerId = parseInt(selectedBoilerId);
      }
      if(finalBoilerId){
        assignDeviceToBoiler(newDevice.id,finalBoilerId)
      }
      Alert.alert('Thành công', 'Tạo thiết bị mới thành công!');
      // Điều hướng đến màn hình chi tiết của thiết bị vừa tạo hoặc quay lại danh sách
      navigation.replace('DeviceDetail', { deviceId: newDevice.id }); // Ví dụ: replace để không quay lại màn tạo
      // Hoặc navigation.goBack();
    } catch (error: any) {
      console.error('Lỗi khi tạo thiết bị:', error);
      Alert.alert('Lỗi', `Không thể tạo thiết bị mới. ${error?.message || ''}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <AppHeader
        title="Tạo Thiết Bị Mới"
        onBackPress={() => navigation.goBack()}
        // Nút Lưu bên phải
        rightComponent={
          saving ? (
            <ActivityIndicator color="#4F46E5" />
          ) : (
            <TouchableOpacity onPress={handleSave} className="p-2">
              <Feather name="save" size={16} color="#4F46E5" />
            </TouchableOpacity>
          )
        }
      />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Phần chọn ảnh */}
        <View className="my-4 items-center">
          <TouchableOpacity
            onPress={handleChooseImage}
            className="h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-400 bg-gray-200">
            {pickedImageUri ? (
              <Image
                source={{ uri: pickedImageUri }}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <View className="items-center">
                <Ionicons name="camera-outline" size={40} color="gray" />
                <Text className="mt-1 text-sm text-gray-600">Chọn ảnh</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Thông tin bắt buộc */}
        <SectionTitle title="Thông tin bắt buộc" />
        <FormInput
          label="Mã thiết bị"
          value={formData.deviceCode}
          onChangeText={(text) => handleInputChange('deviceCode', text)}
          required={true}
        />
        <FormInput
          label="Tên thiết bị"
          value={formData.deviceName}
          onChangeText={(text) => handleInputChange('deviceName', text)}
          required={true}
        />

        {/* Thông tin chung */}
        <SectionTitle title="Thông tin chung" />
        <FormInput
          label="Model"
          value={formData.model}
          onChangeText={(text) => handleInputChange('model', text)}
        />
        <FormInput
          label="Thương hiệu"
          value={formData.brand}
          onChangeText={(text) => handleInputChange('brand', text)}
        />
        <FormInput
          label="Xuất xứ"
          value={formData.origin}
          onChangeText={(text) => handleInputChange('origin', text)}
        />
        <FormInput
          label="Năm sản xuất"
          value={formData.yearOfManufacture}
          onChangeText={(text) => handleInputChange('yearOfManufacture', text)}
          keyboardType="numeric"
        />
        <FormInput
          label="Số serial"
          value={formData.serialNumber}
          onChangeText={(text) => handleInputChange('serialNumber', text)}
        />
        <FormInput
          label="Tình trạng sử dụng"
          value={formData.usageStatus}
          onChangeText={(text) => handleInputChange('usageStatus', text)}
          placeholder="Ví dụ: Đang hoạt động, Ngưng sử dụng, Hỏng..."
        />
        <FormInput
          label="Số giờ hoạt động"
          value={formData.operatingHours}
          onChangeText={(text) => handleInputChange('operatingHours', text)}
          keyboardType="numeric"
        />
        <FormInput
          label="Giá trị (VNĐ)"
          value={formData.value}
          onChangeText={(text) => handleInputChange('value', text)}
          keyboardType="numeric"
        />
        <FormInput
          label="Giá trị hao mòn (VNĐ)"
          value={formData.depreciationValue}
          onChangeText={(text) => handleInputChange('depreciationValue', text)}
          keyboardType="numeric"
        />
        <SectionTitle title="Vị trí & Quản lý" />
        <View className="mb-4">
          <Text className="mb-1 text-base text-gray-700">Lò hơi (nếu thuộc về lò hơi nào đó)</Text>
          <View className="rounded-md border border-gray-300 bg-white">
            <Picker
              selectedValue={selectedBoilerId}
              onValueChange={(itemValue) => setSelectedBoilerId(itemValue)}
              style={{ height: 50 }}>
              <Picker.Item label="-- Chọn lò hơi --" value="" />
              {boilers.map((boiler: BoilerAttributes) => (
                <Picker.Item key={boiler.id} label={boiler.name} value={boiler.id.toString()} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Ngày tháng & Bảo hành */}
        <SectionTitle title="Lắp đặt & Bảo hành" />
        <FormDatePicker
          label="Ngày lắp đặt"
          value={formData.installationDate}
          onChange={(date) => handleInputChange('installationDate', date)}
        />
        <FormDatePicker
          label="Ngày hết hạn bảo hành"
          value={formData.warrantyExpiration}
          onChange={(date) => handleInputChange('warrantyExpiration', date)}
        />
        <FormSwitch
          label="Còn bảo hành?"
          value={formData.isUnderWarranty}
          onValueChange={(value) => handleInputChange('isUnderWarranty', value)}
        />

        {/* Vị trí & Quản lý */}
        <SectionTitle title="Vị trí & Quản lý" />
        <FormInput
          label="Vị trí lắp đặt"
          value={formData.location}
          onChangeText={(text) => handleInputChange('location', text)}
        />
        <FormInput
          label="Chi tiết vị trí"
          value={formData.locationDetails}
          onChangeText={(text) => handleInputChange('locationDetails', text)}
          multiline={true}
          numberOfLines={3}
        />
        <FormInput
          label="Bộ phận quản lý"
          value={formData.department}
          onChangeText={(text) => handleInputChange('department', text)}
        />
        <FormInput
          label="Người quản lý"
          value={formData.manager}
          onChangeText={(text) => handleInputChange('manager', text)}
        />

        {/* Bảo trì & Kiểm định (Thông tin cơ bản) */}
        <SectionTitle title="Bảo trì & Kiểm định (Thông tin cơ bản)" />
        <FormInput
          label="Chu kỳ bảo trì"
          value={formData.maintenanceCycle}
          onChangeText={(text) => handleInputChange('maintenanceCycle', text)}
          placeholder="Ví dụ: 3 tháng, 6 tháng, 1 năm..."
        />
        <FormInput
          label="Tình trạng kiểm định"
          value={formData.inspectionStatus}
          onChangeText={(text) => handleInputChange('inspectionStatus', text)}
          placeholder="Ví dụ: Đạt yêu cầu, Cần kiểm định lại..."
        />

        {/* Nút Lưu ở cuối form (tùy chọn) */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className={`mt-8 flex-row items-center justify-center rounded-lg py-3 ${saving ? 'bg-gray-400' : 'bg-blue-600 active:bg-blue-700'}`}>
          {saving && <ActivityIndicator color="#fff" className="mr-2" />}
          <Text className="text-base font-semibold text-white">
            {saving ? 'Đang lưu...' : 'Lưu Thiết Bị'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
