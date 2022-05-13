import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { Avatar } from 'react-native-elements';
import * as WebBrowser from 'expo-web-browser';
import useSWR from 'swr';
import { MaterialIcons } from '@expo/vector-icons';

import { tagsStyles, baseStyles } from './styles/post';
import formatPublishedDate from '../../utils/formatPublishedDate';
import getNameInitials from '../../utils/getNameInitials';
import createPostUrl from '../../utils/createUrl';
import Pagination from './Pagination';
import Skeleton from '../Skeleton';

const styles = StyleSheet.create({
  authorInfo: {
    color: '#9CA3AF',
    flexShrink: 1,
    marginLeft: 12,
  },
  errorIcon: {
    color: '#EF4444',
    textAlign: 'center',
  },
  postErrorMessage: {
    color: '#EF4444',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  postInfo: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 12,
    paddingVertical: 8,
  },
  postPage: {
    marginVertical: 16,
  },
  skeletonAuthorInfoText: {
    marginLeft: 12,
  },
  skeletonContentText: {
    marginVertical: 6,
  },
  skeletonTitle: {
    marginVertical: 4,
  },
  title: {
    color: '#121D59',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

/* eslint-disable react-native/no-inline-styles */
const Post = ({ postURL, page, navigation }) => {
  const { data: post, error: postError } = useSWR(postURL);
  const { data: previousPostUrl, error: previousPostUrlError } = useSWR(
    page - 1 > 0 ? createPostUrl(1, page - 1) : ''
  );
  const { data: nextPostUrl, error: nextPostUrlError } = useSWR(createPostUrl(1, page + 1));

  const handleOpenBrowser = async (url) => {
    await WebBrowser.openBrowserAsync(url);
  };
  const { width } = useWindowDimensions();

  if (postError) {
    return (
      <View style={styles.postPage}>
        <MaterialIcons name="error" size={40} style={styles.errorIcon} />
        <Text style={styles.postErrorMessage}>Error Fetching Post</Text>
        <Pagination
          previousPostUrl={previousPostUrl}
          previousPostUrlError={previousPostUrlError}
          nextPostUrl={nextPostUrl}
          nextPostUrlError={nextPostUrlError}
          page={page}
          navigation={navigation}
        />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.postPage}>
        <Skeleton width={350} height={24} />
        <Skeleton width={300} height={24} style={styles.skeletonTitle} />
        <View style={styles.postInfo}>
          <Skeleton width={50} height={50} variant="circle" />
          <Skeleton width={150} height={16} style={styles.skeletonAuthorInfoText} />
        </View>

        <Skeleton width={350} height={16} style={styles.skeletonContentText} />
        <Skeleton width={300} height={16} style={styles.skeletonContentText} />
        <Skeleton width={200} height={16} style={styles.skeletonContentText} />
      </View>
    );
  }

  return (
    <View style={styles.postPage}>
      <Text style={styles.title}>{post.title}</Text>
      <View style={styles.postInfo}>
        <Avatar
          size="medium"
          rounded
          title={getNameInitials(post.feed.author)}
          overlayContainerStyle={{ backgroundColor: '#121D59' }}
        />
        <Text style={styles.authorInfo} onPress={() => handleOpenBrowser(post.feed.link)}>
          {post.feed.author} | {formatPublishedDate(post.published)}
        </Text>
      </View>
      <RenderHtml
        contentWidth={width}
        source={{ html: post.html }}
        tagsStyles={tagsStyles}
        baseStyle={baseStyles}
      />
      <Pagination
        previousPostUrl={previousPostUrl}
        previousPostUrlError={previousPostUrlError}
        nextPostUrl={nextPostUrl}
        nextPostUrlError={nextPostUrlError}
        page={page}
        navigation={navigation}
      />
    </View>
  );
};

export default Post;
