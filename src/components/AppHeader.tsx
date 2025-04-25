import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons'; 

interface AppHeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  headerClassName?: string; 
  titleClassName?: string; 
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  onBackPress,
  showBackButton = true,
  rightComponent,
  headerClassName = '',
  titleClassName = '',
}) => {
  return (
    // Container chính của Header
    <View
      className={`bg-white ios:shadow-sm android:elevation-3 ${headerClassName}`}
    >
      <View className='h-12 bg-white'></View>
      <View className="flex-row items-center justify-between h-14 px-2">
        {/* Nút Back */}
        {showBackButton ? (
          <TouchableOpacity
            onPress={onBackPress}
            // Padding, chiều rộng tối thiểu, căn giữa
            className="p-2.5 min-w-[40px] items-center justify-center"
          >
            <Ionicons name="arrow-back-outline" size={30} className="text-zinc-400" />
          </TouchableOpacity>
        ) : (
          // Placeholder để giữ cân bằng layout
          <View className="min-w-[40px] p-2.5" />
        )}

        {/* Tiêu đề */}
        <View className="flex-1 items-center justify-center px-1">
           <Text
             // Kích thước chữ, độ đậm, màu chữ, căn giữa
             className={`text-xl font-semibold text-zinc-800 text-center ${titleClassName}`}
             numberOfLines={1} // Giữ nguyên prop này
           >
             {title}
           </Text>
        </View>


        {/* Component bên phải */}
        {rightComponent ? (
          // Đảm bảo container bên phải có kích thước tối thiểu để căn chỉnh
          <View className="min-w-[40px] p-2.5 items-center justify-center">
             {rightComponent}
           </View>
        ) : (
          // Placeholder để giữ cân bằng layout
          <View className="min-w-[40px] p-2.5" />
        )}
      </View>
    </View>
  );
};

export default AppHeader;