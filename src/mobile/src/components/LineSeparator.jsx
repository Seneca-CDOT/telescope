import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  lineSeparator: {
    backgroundColor: '#D1D5DB85',
    height: 1,
    marginHorizontal: 16,
    marginVertical: 12,
  },
});

const LineSeparator = () => {
  return <View style={styles.lineSeparator} />;
};

export default LineSeparator;
