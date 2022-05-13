import { StyleSheet, ScrollView } from 'react-native';

import Post from '../components/Post';

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 16,
  },
});

const PostScreen = ({ route, navigation }) => {
  return (
    <ScrollView style={styles.screen}>
      <Post {...route.params} navigation={navigation} />
    </ScrollView>
  );
};

export default PostScreen;
