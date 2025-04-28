import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Dimensions, Text, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import DropDownPicker from 'react-native-dropdown-picker';
import Navbar from '~/components/Navbar';
import { useAppStore } from '~/store/useAppStore';

const screenWidth = Dimensions.get('window').width;

const PARAMS = [
  { label: 'Áp suất hơi', value: 'steam_pressure' },
  { label: 'Áp suất buồng đốt', value: 'chamber_pressure' },
  { label: 'Nhiệt độ buồng đốt', value: 'combustion_temp' },
  { label: 'Nhiệt độ trước túi lọc', value: 'pre_bag_temp' },
  { label: 'Nhiệt độ nước cấp', value: 'feedwater_temp' },
  { label: 'Nhiệt độ sau bộ gia nhiệt', value: 'post_heater_temp' },
  { label: 'Nhiệt độ khí thải', value: 'exhaust_temp' },
  { label: 'Lượng oxy dư', value: 'excess_oxygen' },
  { label: 'Tần số băng tải 1', value: 'conveyor1_freq' },
  { label: 'Tần số quạt 1', value: 'fan1_freq' },
  { label: 'Tần số quạt 2', value: 'fan2_freq' },
  { label: 'Tần số quạt khói', value: 'smoke_fan_freq' },
  { label: 'Dòng điện quạt khói', value: 'smoke_fan_current' },
  { label: 'Chênh lệch áp suất', value: 'dif_pressure' },
];

export default function TrackingChart() {
  const { boilers } = useAppStore();
  const [selectedBoiler, setSelectedBoiler] = useState<string>('all');
  const [selectedParam, setSelectedParam] = useState<string>('steam_pressure');
  const [boilerOpen, setBoilerOpen] = useState(false);
  const [paramOpen, setParamOpen] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [timeLabels, setTimeLabels] = useState<string[]>(['now']);
  const [trackingData, setTrackingData] = useState<{ [key: string]: number[] }>(() =>
    Object.fromEntries(PARAMS.map((p) => [p.value, [Math.floor(Math.random() * 100)]]))
  );

  const boilerOptions = [
    { label: 'Tất cả lò hơi', value: 'all' },
    ...boilers.map((boiler) => ({ label: boiler.name, value: boiler.id.toString() })),
  ];

  const pushFakeData = useCallback(() => {
    const now = new Date().toLocaleTimeString().split(' ')[0]; // hh:mm:ss

    setTrackingData((prev) => {
      const updated: typeof prev = {};
      for (const param of PARAMS) {
        const arr = [...(prev[param.value] || []), Math.floor(Math.random() * 100)];
        updated[param.value] = arr.length > 10 ? arr.slice(-10) : arr;
      }
      return updated;
    });

    setTimeLabels((prev) => {
      const updated = [...prev, now];
      return updated.length > 10 ? updated.slice(-10) : updated;
    });
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(pushFakeData, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedBoiler, pushFakeData]);
  const COLUMN_WIDTH = 100;

  return (
    <View className="flex-1 bg-white">
      <Navbar />

      {/* Bộ lọc */}
      <View className="z-50 borderBottom flex-row items-center border-b border-t  px-4">
        <View style={{ flex: 1, zIndex: boilerOpen ? 3000 : 1000 }}>
          <DropDownPicker
            open={boilerOpen}
            value={selectedBoiler}
            items={boilerOptions}
            setOpen={setBoilerOpen}
            setValue={setSelectedBoiler}
            setItems={() => {}}
            placeholder="Chọn lò hơi"
            style={{ borderColor: 'rgba(0,0,0,0)' }}
            zIndex={3000}
            zIndexInverse={1000}
          />
        </View>
        <View style={{ width: 16 }} />
        <View style={{ flex: 1, zIndex: paramOpen ? 3000 : 1000 }}>
          <DropDownPicker
            open={paramOpen}
            value={selectedParam}
            items={PARAMS}
            setOpen={setParamOpen}
            setValue={setSelectedParam}
            setItems={() => {}}
            placeholder="Thông số theo dõi"
            style={{ borderColor: 'rgba(0,0,0,0)' }}
            zIndex={2000}
            zIndexInverse={2000}
          />
        </View>
      </View>

      <View className="w-full items-center p-6 text-center">
        <Text className="text-lg font-semibold">
          Theo dõi: {PARAMS.find((p) => p.value === selectedParam)?.label}
        </Text>
      </View>
      <View className="w-full items-center  text-center">
        <Text className="text-sm font-semibold">
          -- Dữ liệu ở đây đang chỉ là giả lập --
        </Text>
      </View>
      {/* Biểu đồ */}
      <View className="flex items-center">
        <LineChart
          data={{
            labels: timeLabels,
            datasets: [{ data: trackingData[selectedParam] || [] }],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#fefefe',
            backgroundGradientFrom: '#f3f4f6',
            backgroundGradientTo: '#e5e7eb',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            labelColor: () => '#333',
            style: { borderRadius: 16 },
            propsForDots: { r: '4', strokeWidth: '1', stroke: '#007bff' },
          }}
          bezier
          style={{ margin: 6, borderRadius: 16 }}
        />
      </View>

      {/* Bảng dữ liệu */}
      <ScrollView horizontal className="mt-4">
        <ScrollView className="mx-4 mb-6 rounded-xl border border-gray-200 bg-white">
          <View className="flex-row bg-gray-100">
            <View style={{ width: COLUMN_WIDTH }} className="border-r border-gray-300 flex items-start justify-center px-2 py-2">
              <Text className="font-semibold text-gray-700">Thời gian</Text>
            </View>
            {PARAMS.map((param) => (
              <View
                key={param.value}
                style={{ width: COLUMN_WIDTH }}
                className="border-r flex items-center justify-center border-gray-300 px-2 py-2">
                <Text className="font-semibold text-gray-700">{param.label}</Text>
              </View>
            ))}
          </View>

          {timeLabels.map((label, idx) => (
            <View
              key={idx}
              className="flex-row border-t border-gray-100"
              style={{
                backgroundColor:
                  idx === timeLabels.length - 1 ? '#e0f7fa' : idx % 2 === 0 ? '#f9f9f9' : '#fff',
              }}>
              <View style={{ width: COLUMN_WIDTH }} className="border-r border-gray-200 px-2 py-2">
                <Text className="text-gray-600">{label}</Text>
              </View>
              {PARAMS.map((param) => (
                <View
                  key={param.value}
                  style={{ width: COLUMN_WIDTH }}
                  className="border-r text-center flex items-center justify-center border-gray-100 px-2 py-2">
                  <Text className="font-medium text-blue-600">
                    {trackingData[param.value]?.[idx] ?? '--'}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}
