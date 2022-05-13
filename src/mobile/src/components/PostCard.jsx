import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import useSWR from 'swr';

import Skeleton from './Skeleton';
import formatPublishedDate from '../utils/formatPublishedDate';

const styles = StyleSheet.create({
  card: {
    marginLeft: 16,
    marginRight: 16,
    padding: 12,
  },
  cardContent: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  cardPostInfo: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 8,
  },
  cardText: {
    flexShrink: 1,
    marginLeft: 12,
  },
  cardTextError: {
    color: '#EF4444',
  },
  skeletonCardAuthor: {
    marginTop: 8,
  },
  skeletonCardText: {
    marginVertical: 2,
  },
});

const PostCard = ({ postURL, page, navigation }) => {
  const { data: post, error } = useSWR(postURL);

  if (error) {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Entypo name="text-document" size={38} color="#EF444485" />
          <View style={styles.cardText}>
            <Text style={styles.cardTextError}>Error Fetching post</Text>
          </View>
        </View>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Entypo name="text-document" size={38} color="#9CA3AF85" />
          <View style={styles.cardText}>
            <Skeleton width={250} height={12} style={styles.skeletonCardText} />
            <Skeleton width={150} height={12} style={styles.skeletonCardText} />
            <Skeleton width={50} height={12} style={styles.skeletonCardAuthor} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          navigation.navigate('Post', { postURL, page });
        }}
      >
        <View style={styles.cardContent}>
          <Entypo name="text-document" size={38} color="#9CA3AF85" />
          <View style={styles.cardText}>
            <Text numberOfLines={2}>{post.title}</Text>
            <Text style={styles.cardPostInfo}>
              {post.feed.author} | {formatPublishedDate(post.published)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PostCard;
