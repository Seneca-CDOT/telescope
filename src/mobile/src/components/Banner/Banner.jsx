import React from 'react';
import { View, StyleSheet } from 'react-native';
import BannerButtons from './BannerButtons';
import BannerText from './BannerText';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121D59',
    flex: 1,
    opacity: 0.81,
    padding: 22,
  },
  backdrop: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    margin: 0,
    backgroundColor: '#000000',
    opacity: 0.8,
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
