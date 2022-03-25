import { View, Text, StyleSheet, Linking, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import supabase from '../../api/supabase';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    color: '#A0D1FB',
    fontSize: 45,
    fontWeight: '600',
    letterSpacing: 13,
    zIndex: 1000,
  },
  studentQuote: {
    zIndex: 1000,
  },
  studentQuoteText: {
    color: 'white',
    fontSize: 21,
    marginTop: 25,
    textAlign: 'center',
  },
});

async function getStudentQuotes() {
  const { data, error } = await supabase.from('quotes').select('*');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

const BannerText = () => {
  const [studentQuotes, setStudentQuotes] = useState(null);

  useEffect(() => {
    getStudentQuotes()
      .then((quotes) => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setStudentQuotes(quotes[randomIndex]);
        return quotes;
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Telescope</Text>
      {studentQuotes ?? (
        <Pressable
          style={styles.studentQuote}
          onPress={() => Linking.openURL(studentQuotes.blog_url)}
        >
          <Text style={styles.studentQuoteText}>"{studentQuotes.quote}"</Text>
          <Text style={styles.studentQuoteText}> {studentQuotes.author_name}</Text>
        </Pressable>
      )}
    </View>
  );
};

export default BannerText;
