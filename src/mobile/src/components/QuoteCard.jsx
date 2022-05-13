import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

import quotes from '../student-quotes';

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    height: 200,
    overflow: 'hidden',
  },
  darkOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    padding: 12,
  },
  quoteAuthor: {
    color: '#FFFFFF',
    fontStyle: 'italic',
    margin: 8,
    textAlign: 'center',
  },
  quoteText: {
    color: '#FFFFFF',
    margin: 8,
    textAlign: 'center',
  },
  shadow: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    elevation: 10,
    margin: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
});

const IMAGE_SERVICE_URL = Constants.manifest.extra.imageServiceUrl;

const QuoteCard = () => {
  const [studentQuote, setStudentQuote] = useState(quotes[0]);

  useEffect(() => {
    setStudentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const handleOpenBrowser = async (url) => {
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <View style={styles.shadow}>
      {/* Since Image props in React Native is automatically cached and map to the URL.
          At the moment only IOS have the option to reload the cache.
          see: https://reactnative.dev/docs/images#cache-control-ios-only
      */}
      <Image
        style={styles.card}
        resizeMode="cover"
        source={{ uri: IMAGE_SERVICE_URL, cache: 'reload' }}
      >
        <View style={styles.darkOverlay}>
          <Text onPress={() => handleOpenBrowser(studentQuote.url)} style={styles.quoteText}>
            &quot;{studentQuote.quote}&quot;
          </Text>
          <Text onPress={() => handleOpenBrowser(studentQuote.url)} style={styles.quoteAuthor}>
            {studentQuote.author}
          </Text>
        </View>
      </Image>
    </View>
  );
};

export default QuoteCard;
