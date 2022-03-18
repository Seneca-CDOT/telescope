import { View, StyleSheet, Pressable, Text } from 'react-native';

const styles = StyleSheet.create({
  btnText: {
    color: 'white',
    fontSize: 17,
    textTransform: 'uppercase',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 1000,
  },
});

const BannerButtons = ({ navigateToContact }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={navigateToContact}>
        <Text style={styles.btnText}>About us</Text>
      </Pressable>
      <Pressable onPress={() => console.warn('clicked Sign in')}>
        <Text style={styles.btnText}>Sign in</Text>
      </Pressable>
    </View>
  );
};

export default BannerButtons;
