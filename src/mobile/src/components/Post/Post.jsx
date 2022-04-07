import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import useSWR from 'swr';
import RenderHtml from 'react-native-render-html';
import { tagsStyles, baseStyles } from './styles/post';

const styles = StyleSheet.create({
  post: {
    minHeight: 300,
  },
  title: {
    color: '#A0D1FB',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -1.5,
    paddingVertical: 16,
    textAlign: 'center',
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
      <Text style={styles.title}>{post.title}</Text>
      <RenderHtml
        contentWidth={width}
        source={{ html: `${post.html}` }}
        tagsStyles={tagsStyles}
        baseStyle={baseStyles}
      />
    </View>
  );
}
