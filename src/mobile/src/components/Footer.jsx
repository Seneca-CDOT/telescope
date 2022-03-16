import { View, Text, Image, StyleSheet, Pressable, Linking } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import GitHubContributorCard from './GitHubContributorCard';

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    width: '100%',
  },
  communityLogo: {
    marginRight: 10,
    paddingVertical: 15,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#121D59',
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
  },
  copyright: {
    color: 'white',
    fontSize: 15,
    paddingVertical: 10,
  },
  heading: {
    color: 'white',
    fontSize: 25,
    textTransform: 'uppercase',
  },
  left: {
    width: '50%',
  },
  leftDivider: {
    backgroundColor: 'white',
    height: 2,
    width: '60%',
  },
  right: {
    alignItems: 'flex-end',
    width: '50%',
  },
  rightDivider: {
    backgroundColor: 'white',
    height: 2,
    width: '40%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  stretch: {
    height: 150,
    width: 150,
  },
  subheading: {
    color: 'white',
    fontSize: 18,
    paddingBottom: 6,
    paddingTop: 10,
  },
});

const Footer = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.stretch} source={require('../assets/adaptive-icon.png')} />
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.left}>
            <Text style={styles.heading}>Docs</Text>
            <View style={styles.leftDivider} />
            <Pressable
              onPress={() =>
                Linking.openURL(
                  'https://github.com/Seneca-CDOT/telescope/blob/master/src/docs/docs/getting-started/environment-setup.md'
                )
              }
            >
              <Text style={styles.subheading}>Get Started</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                Linking.openURL(
                  'https://github.com/Seneca-CDOT/telescope/blob/master/src/docs/docs/contributing/CONTRIBUTING.md'
                )
              }
            >
              <Text style={styles.subheading}>Contribute</Text>
            </Pressable>
          </View>

          <View style={styles.right}>
            <Text style={styles.heading}>More</Text>
            <View style={styles.rightDivider} />
            <Pressable
              onPress={() =>
                Linking.openURL('https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List')
              }
            >
              <Text style={styles.subheading}>Planet CDOT Feed List</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.left}>
          <Text style={styles.heading}>Community</Text>
          <View style={styles.leftDivider} />
          <View style={{ flexDirection: 'row' }}>
            <Pressable onPress={() => Linking.openURL('https://github.com/Seneca-CDOT/telescope')}>
              <AntDesign name="github" style={styles.communityLogo} size={24} color="white" />
            </Pressable>
            <Pressable
              onPress={() =>
                Linking.openURL('https://seneca-open-source.slack.com/archives/CS5DGCAE5')
              }
            >
              <Ionicons name="logo-slack" style={styles.communityLogo} size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
      <GitHubContributorCard />
      <View>
        <Text style={styles.copyright}>
          Copyright © 2022 Seneca's Centre for Development of Open Technology
        </Text>
      </View>
    </View>
  );
};

export default Footer;
