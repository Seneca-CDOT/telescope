import Constants from 'expo-constants';
import { FlatList, View, Button, StyleSheet } from 'react-native';
import useSWRInfinite from 'swr/infinite';
import Post from './Post';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  divider: {
    backgroundColor: '#9f9f9f',
    height: 1,
    marginBottom: 20,
    marginHorizontal: 'auto',
    marginVertical: 16,
    width: '100%',
  },
});

const POST_URL = Constants.manifest.extra.postsUrl;

function Posts() {
  const {
    data: pages,
    error,
    setSize,
    size,
  } = useSWRInfinite((index) => `${POST_URL}?page=${index + 1}`);

  if (error || !pages || !pages.length) {
    return null;
  }

  const renderPost = ({ item }) =>
    item.map((post) => (
      <View key={post.id}>
        <Post postURL={post.url} />
        <View style={styles.divider} />
      </View>
    ));

  return (
    <View style={styles.container}>
      <FlatList
        data={pages}
        renderItem={renderPost}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title="Load More" onPress={() => setSize(size + 1)} />
    </View>
  );
}

export default Posts;
