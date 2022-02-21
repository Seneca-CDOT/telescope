import { View, StyleSheet } from 'react-native';
import Banner from '../components/Banner/Banner';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const HomeScreen = ({ navigation }) => {
  const navigateToContact = () => {
    navigation.navigate('Contact');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Banner navigateToContact={navigateToContact} />
    </SafeAreaView>
  );
};

export default HomeScreen;
