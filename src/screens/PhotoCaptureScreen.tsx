import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Alert } from 'react-native';
import { Camera as ExpoCamera, CameraType, CameraView } from 'expo-camera';
import AntDesign from '@expo/vector-icons/AntDesign';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useRoute } from '@react-navigation/native';
import { cropImageFromRoi, readQrCodeFromUri } from '~/utils/ImageProccessing';
import { SafeAreaView } from 'react-native-safe-area-context';
import { uploadImage } from '~/apis/uploadApi';
import { compeleteTaskLocation } from '~/apis/tasksApi';
import { readDigitalNumbers, scanQRCode } from '~/native-modules/MLKitBridge';
import LoadingOverlay from '~/components/LoadingOverlay';

// import {  ExpoQRUriScanner } from 'expo-qr-uri-scanner';
type Props = NativeStackScreenProps<RootStackParamList, 'PhotoCapture'>;
const { width, height } = Dimensions.get('window');

export default function PhotoCaptureScreen({ navigation }: Props) {
  const [cameraSize, setCameraSize] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const route = useRoute<Props['route']>();
  const { mode, cleaningTaskLocation, waterReportTaskItem, cleaningCallback, waterReportCallback } =
    route.params;
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [croppedPhotoUri, setCroppedPhotoUri] = useState<string | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  console.log(isProcessing);
  if (hasPermission === null) return <Text>Đang kiểm tra quyền...</Text>;
  if (hasPermission === false)
    return (
      <Text>
        Không có quyền truy cập camera ,Vui lòng vào cài đặt cấp quyền camera cho thiết bị.
      </Text>
    );
  const [roiWidth, roiHeight] =
    mode === 'cleaning' ? [60, 60] : mode === 'water-report-with-AI' ? [75, 100] : [0, 0];
  const [cameraViewWidth, cameraViewHeight] = [width, (width * 4) / 3];
  const takePhotoHandle = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo && mode !== 'water-report-normal') {
        const x_roi = ((cameraViewWidth - roiWidth) / 2) * (photo.width / cameraViewWidth);
        const y_roi = ((cameraViewHeight - roiHeight) / 2) * (photo.height / cameraViewHeight);
        const roi_width = (roiWidth * photo.width) / cameraViewWidth;
        const roi_height = (roiHeight * photo.height) / cameraViewHeight;

        const croppedPhoto = await cropImageFromRoi(photo.uri, {
          x: x_roi,
          y: y_roi,
          width: roi_width,
          height: roi_height,
        });
        console.log('bat dua chup anh', croppedPhoto);
        if (croppedPhoto && mode == 'cleaning') {
          setCroppedPhotoUri(croppedPhoto);
          const result = await scanQRCode(croppedPhoto);
          console.log('kết quả quét ', result);

          if (result) {
            if (result == cleaningTaskLocation?.templateLocation.qrCodeIdentifier) {
              setIsProcessing(true);
              try {
                const completePhotoUrl = await uploadImage(photo.uri);
                if (completePhotoUrl && cleaningCallback && cleaningTaskLocation) {
                  await cleaningCallback(cleaningTaskLocation.id, completePhotoUrl);
                }
                navigation.goBack();
              } catch (err) {
                Alert.alert('Lỗi', 'Xảy ra lỗi khi tải ảnh hoặc cập nhật trạng thái.');
              } finally {
                setIsProcessing(false);
              }
            } else {
              alert(
                `Thông tin không trùng khớp cho ${cleaningTaskLocation?.templateLocation.name}, Vui lòng chụp lại!`
              );
            }
          }
        }
        if (croppedPhoto && mode == 'water-report-with-AI') {
          setCroppedPhotoUri(croppedPhoto);
          const result = await readDigitalNumbers(croppedPhoto);
          console.log('kết quả quét ', result);

          if (result) {
            console.log(result);
          }
        }
      }
      if (photo && mode === 'water-report-normal' && waterReportTaskItem && waterReportCallback) {
        setIsProcessing(true);
        try {
          const waterReportItemUrl = await uploadImage(photo.uri);
        await waterReportCallback(waterReportTaskItem?.id, null, true, null, waterReportItemUrl);
        navigation.goBack();
        } catch (error) {
          Alert.alert('Lỗi', 'Xảy ra lỗi khi tải ảnh hoặc cập nhật trạng thái.');
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };
  const captureIntruction =
    mode === 'cleaning'
      ? 'Đưa mã qr vào khung '
      : mode === 'water-report-with-AI'
        ? 'Căn chỉnh màn hình máy đo vào khung'
        : null;
  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="h-24" />
      <CameraView
        ref={(ref) => (cameraRef.current = ref)}
        style={{ height: (width * 4) / 3 }}
        className="relative w-full bg-slate-100"
        mute={true}
        ratio="4:3"
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setCameraSize({ width, height });
        }}>
        {mode !== 'water-report-normal' && (
          <>
            {' '}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: (cameraViewHeight - roiHeight) / 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
              className="flex flex-col items-center justify-center gap-10">
              <Text className="text-black">{captureIntruction}</Text>
              <AntDesign name="caretdown" size={24} color="black" />
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: (cameraViewHeight - roiHeight) / 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: (cameraViewHeight - roiHeight) / 2,
                left: 0,
                width: (cameraViewWidth - roiWidth) / 2,
                height: roiHeight,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: (cameraViewHeight - roiHeight) / 2,
                right: 0,
                width: (cameraViewWidth - roiWidth) / 2,
                height: roiHeight,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
            />
          </>
        )}

        {/* ROI khung quét */}
        <View
          style={{
            top: (cameraViewHeight - roiHeight) / 2,
            left: (cameraViewWidth - roiWidth) / 2,
            width: roiWidth,
            height: roiHeight,
            borderColor: 'red',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            borderStyle: 'dashed',
          }}></View>
        {croppedPhotoUri && (
          <Image src={croppedPhotoUri} className="absolute left-0 top-0 h-32 w-32" />
        )}
      </CameraView>
      <TouchableOpacity
        style={styles.captureButton}
        className="shadow-5xl border-4 border-gray-400"
        onPress={takePhotoHandle}
      />
      {isProcessing && <LoadingOverlay message="Đang tải ảnh và cập nhật..." />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1, position: 'relative', padding: 0 },

  // Khung quét QR (kích thước 150x150)
  qrScannerBox: {
    position: 'absolute',
    top: height / 2 - 30,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    borderColor: 'red',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
  },
  qrText: { color: 'white', fontSize: 11, textAlign: 'center' },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    left: width / 2 - 40,
    width: 80,
    height: 80,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
});
