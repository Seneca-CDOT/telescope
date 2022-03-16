import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';

const GitHubContributorCard = () => {
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#A0D1FB',
      borderRadius: 5,
    },
    avatarContainer: {
      width: '30%',
    },
    avatar: {
      width: 50,
      height: 50,
    },
    content: {
      width: '70%',
    },
  });

  return (
    <View style={styles.container}>
      <View styles={styles.avatarContainer}>
        <Image style={styles.avatar} source={require('../assets/adaptive-icon.png')} />
      </View>

      <Text styles={styles.content}>GitHubContributorCard</Text>
    </View>
  );
};

export default GitHubContributorCard;
