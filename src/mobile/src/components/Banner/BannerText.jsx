import { View, Text, StyleSheet, Linking, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import quotes from '../../student-quotes';
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

const BannerText = () => {
  const [studentQuote, setStudentQuote] = useState(quotes[0]);

  async function fetchStudentQuotes() {
    console.log('starting');
    const { data, status, statusText, error } = await supabase.from('quotes').select('*');
    console.log('fetching supabase');
    if (error) {
      console.log('error', error);
      console.log('status', status);
      console.log('text', statusText);
    } else {
      console.log('data', data);
      setStudentQuote(data);
    }
  }

  useEffect(() => {
    fetchStudentQuotes();
    // setStudentQuote(studentQuote[Math.floor(Math.random() * studentQuote.length)]);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Telescope</Text>
      <Pressable style={styles.studentQuote} onPress={() => Linking.openURL(studentQuote.url)}>
        <Text style={styles.studentQuoteText}>"{studentQuote.quote}"</Text>
        <Text style={styles.studentQuoteText}> {studentQuote.author}</Text>
      </Pressable>
    </View>
  );
};

export default BannerText;
