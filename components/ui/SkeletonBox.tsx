// components/ui/SkeletonBox.tsx
// 왼쪽 → 오른쪽으로 그라데이션이 스치는 shimmer 스켈레톤
// 텍스트, 이미지, 카드 등 어디서든 재사용 가능
import React, { useEffect } from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: object;
}

const SHIMMER_WIDTH = 180;
const SHIMMER_TRAVEL = 600;

export const SkeletonBox = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: Props) => {
  const translateX = useSharedValue(-SHIMMER_WIDTH);

  useEffect(() => {
    translateX.value = -SHIMMER_WIDTH;
    translateX.value = withRepeat(
      withTiming(SHIMMER_TRAVEL, { duration: 1400, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[{ width, height, borderRadius, backgroundColor: '#E8E8E8', overflow: 'hidden' }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle, { width: SHIMMER_WIDTH }]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.55)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};
