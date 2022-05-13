import { Text, View, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';

import logo from '../assets/logo.png';

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 12,
  },
  logo: {
    height: 40,
    width: 40,
  },
  title: {
    color: '#A0D1FB',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    paddingLeft: 4,
  },
});

const HomeHeader = () => {
  return (
    <View style={styles.header}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Telescope</Text>
    </View>
  );
};

export default HomeHeader;
