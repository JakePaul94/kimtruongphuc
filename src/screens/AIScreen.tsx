import React, { useRef, useEffect } from 'react';
import { View, Animated, Dimensions, Easing, ImageSourcePropType } from 'react-native';

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
    <View className="flex-1 justify-center items-center bg-white">
      <Animated.Image
        source={require('../assets/AI.png') as ImageSourcePropType}
        style={{
          resizeMode: 'contain',
          transform: [{ translateY }],
        }}
        className={"w-24 "}
      />
    </View>
  );
}
