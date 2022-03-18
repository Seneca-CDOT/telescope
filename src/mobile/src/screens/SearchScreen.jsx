import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

const SearchScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Search Screen</Text>
    </SafeAreaView>
  );
};

export default SearchScreen;
