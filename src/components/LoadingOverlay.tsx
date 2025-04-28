import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function LoadingOverlay({ message = 'Đang xử lý...' }: { message?: string }) {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  message: {
    marginTop: 12,
    color: '#fff',
    fontSize: 16,
  },
});