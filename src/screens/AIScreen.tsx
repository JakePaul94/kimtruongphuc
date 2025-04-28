import React, { useRef, useEffect } from 'react';
import { View, Animated, Dimensions, Easing, Image, Text, ScrollView } from 'react-native';
import NeonLine from '~/components/LineNeon';
import { StyleSheet } from 'react-native';
import Navbar from '~/components/Navbar';
const { width, height } = Dimensions.get('window');

export default function FullScreenImageScreen() {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [translateY]);

  return (
    <View className='flex-1'>
      <Navbar />
      <ScrollView className="flex-1">
        <View className="flex items-center justify-center p-4">
          <Text className="text-xl my-4 font-bold">Quản lý tập trung sử dụng AI </Text>
          <Text className="text-sm font-medium">Trang này chỉ tạ thời để giới thiệu hệ thống tự động hóa vận hành và quản lý ,sẽ chuyển thành trang điều khiển và thông tin AI trong tương lai</Text>
        </View>
        <View
          className=""
          style={{
            width: width,
            height: width,
            position: 'relative',
          }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={[styles.cell, styles.highlighted]}>
              <Image source={require('../assets/boiler.png')} className="h-24 w-24" />
            </View>
            <View style={styles.cell}>{/* Ô 1,2 */}</View>
            <View style={styles.cell}>{/* Ô 1,3 */}</View>
            <View style={styles.cell}>{/* Ô 1,4 */}</View>
            <View style={[styles.cell, styles.highlighted]}>
              <Image source={require('../assets/boiler.png')} className="h-24 w-24" />
            </View>
          </View>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={styles.cell}>{/* Ô 2,1 */}</View>
            <View
              className="flex items-center justify-center"
              style={[styles.cell, styles.highlighted]}>
              <Image source={require('../assets/s7.png')} className="h-24 w-24" />
            </View>
            <View style={styles.cell}>{/* Ô 2,3 */}</View>
            <View
              className="flex items-center justify-center"
              style={[styles.cell, styles.highlighted]}>
              <Image source={require('../assets/s7.png')} className="h-24 w-24" />
            </View>
            <View style={styles.cell}>{/* Ô 2,5 */}</View>
          </View>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={styles.cell}>{/* Ô 3,1 */}</View>
            <View style={styles.cell}>{/* Ô 3,2 */}</View>
            <View style={[styles.cell, styles.highlighted, { zIndex: 2000 }]}>
              <Animated.Image
                source={require('../assets/AI.png')}
                style={{
                  width: 96,
                  height: 96,
                  resizeMode: 'contain',
                  transform: [{ translateY }],
                }}
              />
            </View>
            <View style={styles.cell}>{/* Ô 3,4 */}</View>
            <View style={styles.cell}>{/* Ô 3,5 */}</View>
          </View>
          {/* Hàng 4 */}
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={styles.cell}>{/* Ô 4,1 */}</View>
            <View style={[styles.cell, styles.highlighted]}>{/* Ô 4,2 */}</View>
            <View style={styles.cell}>{/* Ô 4,3 */}</View>
            <View style={[styles.cell, styles.highlighted]}>{/* Ô 4,4 */}</View>
            <View style={styles.cell}>{/* Ô 4,5 */}</View>
          </View>
          {/* Hàng 5 */}
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={[styles.cell, styles.highlighted]}>{/* Ô 5,1 */}</View>
            <View style={styles.cell}></View>
            <View style={styles.cell}>
              <Image source={require('../assets/phone.png')} className="h-24 w-12" />
            </View>
            <View style={styles.cell}></View>
            <View style={[styles.cell, styles.highlighted]}>{/* Ô 5,5 */}</View>
          </View>
          <View
            style={{
              position: 'absolute',
              top: width * 0.19,
              left: width * 0.21,
              height: 0,
              width: 0,
            }}
            className="absolute ">
            <NeonLine rotation="55deg" color="green" length={width * 0.18} />
          </View>
          <View
            style={{
              position: 'absolute',
              top: width * 0.19,
              left: width * 0.79,
              height: 0,
              width: 0,
            }}
            className="absolute ">
            <NeonLine rotation="135deg" color="green" length={width * 0.18} />
          </View>
          <View
            style={{
              position: 'absolute',
              top: width * 0.4,
              left: width * 0.6,
              height: 0,
              width: 0,
            }}
            className="absolute ">
            <NeonLine rotation="135deg" length={width * 0.18} />
          </View>
          <View
            style={{
              position: 'absolute',
              top: width * 0.4,
              right: width * 0.6,
              height: 0,
              width: 0,
            }}
            className="absolute ">
            <NeonLine rotation="55deg" length={width * 0.18} />
          </View>
          <View
            style={{
              position: 'absolute',
              top: width * 0.68,
              left: width * 0.5,
              height: 0,
              width: 0,
            }}
            className="absolute ">
            <NeonLine rotation="90deg" color="red" length={width * 0.28} />
          </View>
        </View>
        <View className="p-6">
          <Text>
            Hệ thống quản lý tập trung . Dữ liệu từ tất cả lò hơi : (các cảm biến) được lấy thông
            qua S7 (hoặc các dòng PLC tương tự) và camera (nếu đọc đồng hồ ) đẩy về server và hiển
            thị tập trung tại 1 nơi duy nhất , sau đó công nhân sẽ điều khiển các thiết bị (băng tải
            , máy bơm , quạt ...) qua server - Chế độ thủ công . Hoặc AI sẽ xử lý toàn bộ dữ liệu và
            điều khiển tự đông tại server thông qua PLC - chế độ tự động và hiển thị thông tin lên
            ứng dụng . Các cảnh báo như sự cố , thông số vượt mức .. sẽ thông báo trực tiếp lên app
            của các nhân viên , công nhân trực thuộc lò hơi.{' '}
          </Text>
        </View>
        <View className="px-6">
          <Text>
            Lợi ích mang lại : Giảm thiểu tối đa nhân lực. Thay vì mỗi lò cần 1 nhân công theo dõi
            và điều khiển thì chỉ cần duy nhất 1 nhân viên điều khiển tại trung tâm (Chế độ thủ
            công). Hoặc không cần nếu AI xử lý toàn bộ . Quyền điều khiển cũng có thể được mở cho
            bất cứ ai nếu cần thiết (điều khiển thông qua điện thoại ){' '}
          </Text>
        </View>
        <View className="px-6 py-4">
          <Text>
            Điều kiện triển khai : Lò hơi cần phải có PLC mở giao tiếp với server (không cần màn
            hình ) . Nếu muốn lấy dữ liệu từ camera cần quyền truy xuất hình ảnh từ camera{' '}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  highlighted: {},
});
{
  /*
      <Image source={require("../assets/s7.jpg") } className='w-12 h-12'/>
      <Image source={require("../assets/boiler.png") } className='w-24 h-24'/>
      <View style={{ 
        height: 4, 
        width: 300, 
        backgroundColor: 'red',
        transform: [{ rotate: '45deg' }],
        margin: 20 // Thêm margin để không bị cắt khi xoay
      }}>
        <NeonLine
          color="#f0f"
          width={300}
          height={4}
          duration={3000}
        />
      </View> */
}
