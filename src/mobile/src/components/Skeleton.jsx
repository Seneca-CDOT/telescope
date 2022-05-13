import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';

/* eslint-disable react-native/no-inline-styles */
const Skeleton = ({ width, height, variant = 'box', style }) => {
  const opacity = useRef(new Animated.Value(0.3));
  const borderRadius = variant === 'circle' ? 9999 : 0;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 0.5,
          useNativeDriver: true,
          duration: 500,
        }),
        Animated.timing(opacity.current, {
          toValue: 0.3,
          useNativeDriver: true,
          duration: 800,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          opacity: opacity.current,
          height,
          width,
          backgroundColor: '#00000030',
          borderRadius,
        },
        style,
      ]}
    />
  );
};

export default Skeleton;
