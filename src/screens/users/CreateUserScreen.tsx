import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
  } from 'react-native';
  import { useState } from 'react';
  import AppHeader from '~/components/AppHeader';
  import { useNavigation } from '@react-navigation/native';
  import { NativeStackNavigationProp } from '@react-navigation/native-stack';
  import { RootStackParamList } from '~/navigation/AppNavigator';
  import { Picker } from '@react-native-picker/picker';
// Adjust the import based on your store setup
  import * as ImagePicker from 'expo-image-picker';
import { useAppStore } from '~/store/useAppStore';
import { BoilerAttributes } from '~/types/boilerType';
import { uploadImage } from '~/apis/uploadApi';
import { createUser } from '~/apis/userApi';
import { assignUserToBoiler } from '~/apis/boilerApi';
  
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  
  const CreateUserScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const boilers = useAppStore((state) => state.boilers);
    const fetchInitialData = useAppStore((state) => state.fetchInitialData); // Fetch boilers from store
    const [form, setForm] = useState({
      fullName: '',
      email: '',
      phoneNumber: '',
      gender: '',
      role: 'boiler_worker',
      department: '',
      boilerId: '',
      profilePicture: '',
      registrationDate: '',
      dateOfBirth: '',
      address: '',
      country: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleChange = (field: string, value: string) => {
      setForm({ ...form, [field]: value });
    };
  
    const pickImage = async () => {
      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Lỗi', 'Cần cấp quyền truy cập thư viện ảnh để chọn ảnh');
        return;
      }
  
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio for avatar
        quality: 1,
      });
  
      if (!result.canceled && result.assets?.[0]?.uri) {
        handleChange('profilePicture', result.assets[0].uri);
      }
    };
  
    const handleSubmit = async () => {
      if (!form.fullName || !form.email || !form.phoneNumber) {
        return Alert.alert('Lỗi', 'Vui lòng điền đầy đủ họ tên, email và số điện thoại');
      }
  
      setIsSubmitting(true);
      try {
        if (form.profilePicture) {
          // Upload image and get URL (assuming you have an uploadImage function)   
            const imageUrl = await uploadImage(form.profilePicture);
            handleChange('profilePicture', imageUrl);
            
        }
        // Call your API to create user here    
        const {boilerId, ...user} = form
        console.log('User Data:', user);
        const mewUser = await createUser(user);
        await assignUserToBoiler(mewUser.id, parseInt(boilerId));
        await fetchInitialData()
        console.log('User Created:', form);
        Alert.alert('Thành công', 'Tạo nhân viên mới thành công');
        navigation.replace("UserDetail", { user: mewUser });
      } catch (error) {
        Alert.alert('Lỗi', 'Đã có lỗi xảy ra, vui lòng thử lại');
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <View className="flex-1 bg-gray-100">
        <AppHeader title="Thêm nhân viên mới" onBackPress={navigation.goBack} />
        <ScrollView className="flex-1 p-4">
          <View className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <View>
              <Text className="text-gray-600 mb-2">Họ và tên *</Text>
              <TextInput
                placeholder="Nhập họ và tên"
                value={form.fullName}
                onChangeText={(text) => handleChange('fullName', text)}
                className="bg-gray-50 p-3 rounded-md border border-gray-200"
              />
            </View>
  
            <View>
              <Text className="text-gray-600 mb-2">Email *</Text>
              <TextInput
                placeholder="Nhập email"
                value={form.email}
                keyboardType="email-address"
                onChangeText={(text) => handleChange('email', text)}
                className="bg-gray-50 p-3 rounded-md border border-gray-200"
              />
            </View>
  
            <View>
              <Text className="text-gray-600 mb-2">Số điện thoại *</Text>
              <TextInput
                placeholder="Nhập số điện thoại"
                value={form.phoneNumber}
                keyboardType="phone-pad"
                onChangeText={(text) => handleChange('phoneNumber', text)}
                className="bg-gray-50 p-3 rounded-md border border-gray-200"
              />
            </View>
  
            <View>
              <Text className="text-gray-600 mb-2">Ảnh đại diện</Text>
              {form.profilePicture ? (
                <Image
                  source={{ uri: form.profilePicture }}
                  className="w-24 h-24 rounded-full mb-2 self-center"
                />
              ) : null}
              <TouchableOpacity
                className="bg-gray-50 p-3 rounded-md border border-gray-200"
                onPress={pickImage}
              >
                <Text className="text-blue-600 text-center">
                  {form.profilePicture ? 'Thay đổi ảnh' : 'Chọn ảnh đại diện'}
                </Text>
              </TouchableOpacity>
            </View>
  
            <View>
              <Text className="text-gray-600 mb-2">Ngày đăng ký (YYYY-MM-DD)</Text>
              <TextInput
                placeholder="Nhập ngày đăng ký"
                value={form.registrationDate}
                onChangeText={(text) => handleChange('registrationDate', text)}
                className="bg-gray-50 p-3 rounded-md border border-gray-200"
              />
            </View>
  
            <View>
              <Text className="text-gray-600 mb-2">Ngày sinh (YYYY-MM-DD)</Text>
              <TextInput
                placeholder="Nhập ngày sinh"
                value={form.dateOfBirth}
                onChangeText={(text) => handleChange('dateOfBirth', text)}
                className="bg-gray-50 p-3 rounded-md border border-gray-200"
              />
            </View>
  
            <View>
              <Text className="text-gray-600 mb-2">Địa chỉ</Text>
              <TextInput
                placeholder="Nhập địa chỉ"
                value={form.address}
                onChangeText={(text) => handleChange('address', text)}
                className="bg-gray-50 p-3 rounded-md border border-gray-200"
              />
            </View>
  
            <View>
              <Text className="text-gray-600 mb-2">Quốc gia</Text>
              <TextInput
                placeholder="Nhập quốc gia"
                value={form.country}
                onChangeText={(text) => handleChange('country', text)}
                className="bg-gray-50 p-3 rounded-md border border-gray-200"
              />
            </View>
  
            <View>
              <Text className="text-gray-600 mb-2">Giới tính</Text>
              <View className="bg-gray-50 rounded-md border border-gray-200">
                <Picker
                  selectedValue={form.gender}
                  onValueChange={(value) => handleChange('gender', value)}
                  style={{ height: 50 }}
                >
                  <Picker.Item label="-- Chọn giới tính --" value="" />
                  <Picker.Item label="Nam" value="Male" />
                  <Picker.Item label="Nữ" value="Female" />
                </Picker>
              </View>
            </View>
  
            <View>
              <Text className="text-gray-600 mb-2">Vai trò</Text>
              <View className="bg-gray-50 rounded-md border border-gray-200">
                <Picker
                  selectedValue={form.role}
                  onValueChange={(value) => handleChange('role', value)}
                  style={{ height: 50 }}
                >
                  <Picker.Item label="Công nhân lò hơi" value="boiler_worker" />
                  <Picker.Item label="Quản trị viên" value="admin" />
                  <Picker.Item label="Nhân viên IT" value="it_staff" />
                </Picker>
              </View>
            </View>
  
            <View>
              <Text className="text-gray-600 mb-2">Phòng ban</Text>
              <TextInput
                placeholder="Nhập phòng ban"
                value={form.department}
                onChangeText={(text) => handleChange('department', text)}
                className="bg-gray-50 p-3 rounded-md border border-gray-200"
              />
            </View>
  
            <View>
              <Text className="text-gray-600 mb-2">Lò hơi</Text>
              <View className="bg-gray-50 rounded-md border border-gray-200">
                <Picker
                  selectedValue={form.boilerId}
                  onValueChange={(value) => handleChange('boilerId', value)}
                  style={{ height: 50 }}
                >
                  <Picker.Item label="-- Chọn lò hơi --" value="" />
                  {boilers.map((boiler: BoilerAttributes) => (
                    <Picker.Item
                      key={boiler.id}
                      label={boiler.name}
                      value={boiler.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
  
            <TouchableOpacity
            style={{marginTop:50,marginBottom:50}}
              className={`bg-blue-500 p-4 rounded-md  ${
                isSubmitting ? 'opacity-50' : ''
              }`}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text className="text-white text-center font-semibold">
                {isSubmitting ? 'Đang tạo...' : 'Thêm nhân viên'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };
  
  export default CreateUserScreen;


