import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import PaginationButton from './PaginationButton';

const styles = StyleSheet.create({
  pagination: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const Pagination = ({
  previousPostUrl,
  previousPostUrlError,
  nextPostUrl,
  nextPostUrlError,
  page,
  navigation,
}) => {
  return (
    <View style={styles.pagination}>
      <PaginationButton
        iconLeft={
          <MaterialIcons
            name="navigate-before"
            size={24}
            color={previousPostUrlError || !previousPostUrl ? '#00000050' : '#000000'}
          />
        }
        title="Previous Post"
        disabled={!!(previousPostUrlError || !previousPostUrl)}
        onPressAction={() => {
          navigation.replace('Post', { postURL: previousPostUrl[0].url, page: page - 1 });
        }}
      />

      <PaginationButton
        iconRight={
          <MaterialIcons
            name="navigate-next"
            size={24}
            color={nextPostUrlError || !nextPostUrl ? '#00000050' : '#000000'}
          />
        }
        title="Next Post"
        align="right"
        disabled={!!(nextPostUrlError || !nextPostUrl)}
        onPressAction={() => {
          navigation.replace('Post', { postURL: nextPostUrl[0].url, page: page + 1 });
        }}
      />
    </View>
  );
};

export default Pagination;
