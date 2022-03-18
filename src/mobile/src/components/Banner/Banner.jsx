import React from 'react';
import { View, StyleSheet } from 'react-native';
import BannerButtons from './BannerButtons';
import BannerText from './BannerText';

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: '#000000',
    bottom: 0,
    boxSizing: 'border-box',
    left: 0,
    margin: 0,
    opacity: 0.8,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    backgroundColor: '#121D59',
    flex: 1,
    opacity: 0.81,
    padding: 22,
  },
});

const Banner = ({ navigateToContact }) => {
  return (
    <View style={styles.container}>
      <BannerButtons navigateToContact={navigateToContact} />
      <BannerText />
      <View style={styles.backdrop} />
    </View>
  );
};

export default Banner;
