import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';

const NeonLine = ({
  color = 'cyan',
  length = 200,
  thickness = 3,
  speed = 2000,
  rotation = '0deg', // Thêm tham số rotation với giá trị mặc định
}) => {
  const progress = useRef(new Animated.Value(0)).current;
  const circleRadius = thickness * 1.5;

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: speed,
        useNativeDriver: true,
      })
    ).start();
  }, [progress, speed]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-circleRadius, length + circleRadius],
  });

  return (
    <View style={[styles.container, { transform: [{ rotate: rotation }] }]}>
      <Svg height={Math.max(thickness, circleRadius * 2)} width={length}>
        <Line
          x1="0"
          y1={Math.max(thickness, circleRadius * 2) / 2}
          x2={length}
          y2={Math.max(thickness, circleRadius * 2) / 2}
          stroke={color}
          strokeWidth={thickness}
        />
        <Animated.View
          style={{
            transform: [{ translateX }],
            position: 'absolute',
            top: (Math.max(thickness, circleRadius * 2) - circleRadius * 2) / 2,
            left: 0,
          }}
        >
          <Svg width={circleRadius * 2} height={circleRadius * 2}>
            <Circle
              cx={circleRadius}
              cy={circleRadius}
              r={circleRadius}
              fill={color}
            />
            <Circle
              cx={circleRadius}
              cy={circleRadius}
              r={circleRadius * 0.6}
              fill={color}
              opacity={0.8}
            />
            <Circle
              cx={circleRadius}
              cy={circleRadius}
              r={circleRadius * 0.3}
              fill="white"
              opacity={0.9}
            />
          </Svg>
        </Animated.View>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NeonLine;