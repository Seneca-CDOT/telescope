import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useSWRInfinite from 'swr/infinite';

import HomeHeader from '../components/HomeHeader';
import QuoteCard from '../components/QuoteCard';
import PostCard from '../components/PostCard';
import LineSeparator from '../components/LineSeparator';
import createPostUrl from '../utils/createUrl';

const styles = StyleSheet.create({
  homeScreen: {
    backgroundColor: '#F9FAFB',
    flex: 1,
  },
});

const HomeScreen = ({ navigation }) => {
  const {
    data: pages,
    error,
    setSize,
    size,
  } = useSWRInfinite((index) => createPostUrl(30, index + 1));

  if (error || !pages || !pages.length) {
    return null;
  }

  return (
    <SafeAreaView edges={['top']} style={styles.homeScreen}>
      <FlatList
        data={pages.flat()}
        ItemSeparatorComponent={LineSeparator}
        ListHeaderComponent={
          <>
            <HomeHeader />
            <QuoteCard />
          </>
        }
        onEndReached={() => setSize(size + 1)}
        onEndReachedThreshold={0.2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return <PostCard postURL={item.url} page={index + 1} navigation={navigation} />;
        }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
