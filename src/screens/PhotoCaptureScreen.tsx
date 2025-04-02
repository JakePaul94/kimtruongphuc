import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Alert } from 'react-native';
import { Camera as ExpoCamera, CameraType, CameraView } from 'expo-camera';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useRoute } from '@react-navigation/native';

import { cropImageFromRoi, getImageBase64, sendImageToServer } from '~/utils/ImageProccessing';
import { SafeAreaView } from 'react-native-safe-area-context';
type Props = NativeStackScreenProps<RootStackParamList, 'PhotoCapture'>;
const { width, height } = Dimensions.get('window');

export default function PhotoCaptureScreen({ navigation }: Props) {
  const [cameraSize, setCameraSize] = useState({ width: 0, height: 0 });
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const route = useRoute<Props['route']>();
  const { mode, nameImg, title, callback } = route.params;
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [croppedPhotoUri, setCroppedPhotoUri] = useState<string | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  if (hasPermission === null) return <Text>Đang kiểm tra quyền...</Text>;
  if (hasPermission === false)
    return (
      <Text>
        Không có quyền truy cập camera ,Vui lòng vào cài đặt cấp quyền camera cho thiết bị.
      </Text>
    );
  const [roiWidth, roiHeight] = mode === 'qr' ? [60, 60] : mode === 'roi' ? [75, 100] : [0, 0];
  const [cameraViewWidth, cameraViewHeight] = [width, (width * 4) / 3];
  const takePhotoHandle = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
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

        if (croppedPhoto) {
          setCroppedPhotoUri(croppedPhoto);
          const result = await sendImageToServer(croppedPhoto, mode);
          if (mode == 'qr' && result) {
            if (result == title) {
              
                callback?.({
                  photoUri: photo.uri,
                  nameImg: nameImg,
                  result: null
                })
                navigation.goBack();
              
            } else {
              alert(`Bạn đã chụp ${result} nhưng yêu cầu phải chụp ${title},Vui lòng chụp lại! `);
            }
          }
          if (mode == 'roi' && result) {
            console.log('result là ', result);
            const textArray = result.texts.map((item: { text: any }) => item.text);
            callback?.({photoUri: photo.uri,
              nameImg: nameImg, result: textArray })
            navigation.goBack();
          }
          if (mode == 'normal') {
            callback?.({
              photoUri: photo.uri,
              nameImg: nameImg,
              result: null
            })
            navigation.goBack();
          }
        }
      }
    }
  };
  const captureIntruction =
    mode === 'qr'
      ? 'Đưa mã qr vào khung '
      : mode === 'roi'
        ? 'Căn chỉnh màn hình máy đo vào khung'
        : null;
  return (
    <View className="flex-1 bg-black ">
      <SafeAreaView className="h-24"></SafeAreaView>
      <CameraView
        ref={(ref) => (cameraRef.current = ref)}
        style={{ height: (width * 4) / 3 }}
        className="relative flex w-full bg-slate-100"
        mute={true}
        ratio="4:3"
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setCameraSize({ width, height });
        }}>
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
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderStyle: 'dashed',
            position: 'absolute',
          }}>
          <Text style={styles.qrText}>{captureIntruction}</Text>
        </View>
        {croppedPhotoUri && (
          <Image src={croppedPhotoUri} className="fixed left-0 top-0 h-32 w-32" />
        )}
      </CameraView>
      <TouchableOpacity
        style={styles.captureButton}
        className="shadow-5xl border-4 border-gray-400"
        onPress={takePhotoHandle}>
        <Text className="text-5xl">📷</Text>
      </TouchableOpacity>
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
