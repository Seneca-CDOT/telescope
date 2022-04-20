import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  Pressable,
  Linking,
} from 'react-native';
import useSWR from 'swr';
import RenderHtml from 'react-native-render-html';
import { tagsStyles, baseStyles } from './styles/post';

const styles = StyleSheet.create({
  post: {
    minHeight: 400,
  },
  postAuthor: {
    color: 'black',
    fontSize: 15,
  },
  postAvatar: {
    height: 50,
    width: '20%',
  },
  postHeader: {
    alignItems: 'center',
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1.5,
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 5,
  },
  postInfo: {
    width: '80%',
  },
  postTitle: {
    color: '#121D59',
    fontSize: 20,
  },
});

export default function Post({ postURL }) {
  const { data: post, error } = useSWR(postURL);
  const { width } = useWindowDimensions();

  if (error) {
    console.error(error);
    return (
      <View style={styles.post}>
        <Text>Error Loading Post</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.post}>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Image style={styles.postAvatar} source={require('../../assets/adaptive-icon.png')} />
        <View style={styles.postInfo}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Pressable onPress={() => Linking.openURL(post.feed.link)}>
            <Text style={styles.postAuthor}>{post.feed.author}</Text>
          </Pressable>
        </View>
      </View>
      <RenderHtml
        contentWidth={width}
        source={{ html: `${post.html}` }}
        tagsStyles={tagsStyles}
        baseStyle={baseStyles}
      />
    </View>
  );
}
