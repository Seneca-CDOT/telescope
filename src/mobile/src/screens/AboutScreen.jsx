import React from 'react';
import { ScrollView, Text, StyleSheet, Linking, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollView: {
    width: '80%',
  },
  header: {
    color: '#A0D1FB',
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  aboutHeader: {
    fontSize: 32,
  },
  paragraphHeader: {
    fontSize: 22,
  },
  hyperlink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  quote: {
    fontStyle: 'italic',
    width: '80%',
    paddingVertical: 10,
  },
});

const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={{ paddingVertical: 10 }}>
          <Text style={[styles.header, styles.aboutHeader]}>About</Text>
          <Text>
            One of the key features of Seneca's open source involvement has been the emphasis on
            sharing what we're working on, teaching, and learning through blogging. We believe that
            one of the most rewarding parts of learning to work in the open source community is
            discovering that one can become part of the fabric of the web, find a voice, and build a
            following.{'\n\n'}
            We also believe that reading each other's blog posts is important. In the blog posts of
            our colleagues, we find that we are not alone in our struggles to make things work, our
            interests in various topics, and that imposter syndrome isn't something unique to "me."
            {'\n\n'}
            To better enable the discovery of blogs within our community, we set up an open blog
            <Text
              style={styles.hyperlink}
              onPress={() => Linking.openURL('https://en.wikipedia.org/wiki/Planet_(software)')}
            >
              {' '}
              Planet:
            </Text>{' '}
            an aggregated feed of blog posts from Seneca faculty and students working on open source
            in a single page. Our old blog Planet used to live at
            <Text
              style={styles.hyperlink}
              onPress={() => Linking.openURL('https://matrix.senecacollege.ca/')}
            >
              {' '}
              http://zenit.senecac.on.ca/~chris.tyler/planet/
            </Text>
            , and was run faithfully by Chris Tyler for more than a decade. We've made a re-creation
            of what it looked like at{' '}
            <Text
              style={styles.hyperlink}
              onPress={() => Linking.openURL('http://telescope.cdot.systems/planet')}
            >
              {' '}
              http://telescope.cdot.systems/planet
            </Text>{' '}
            if you want to see it..
          </Text>
          <Text style={[styles.header, styles.paragraphHeader]}>What is a Planet?</Text>
          <View style={[styles.container]}>
            <Text style={styles.quote}>
              Planet is a feed aggregator application designed to collect posts from the weblogs of
              members of an Internet community and display them on a single page. Planet runs on a
              web server. It creates pages with entries from the original feeds in chronological
              order, most recent entries first. --Wikipedia
            </Text>
            <Text>
              In the early 2000s, before the rise of social media apps like Twitter and Facebook,
              Planet solved an important problem in the free and open source community. It used
              various "feed" technologies (RSS, Atom, CDF) to allow blog posts from different
              platforms to be aggregated into a single page that was constantly updated with the
              latest posts by people within a particular community. {'\n\n'}
              Written in Python by Jeff Waugh and Scott James Remnant, Planet could be configured
              with a list of blog feeds and an HTML template. It would use these to dynamically
              generate a site with posts in chronological order from the specified feeds.
            </Text>
          </View>
          <Text style={[styles.header, styles.paragraphHeader]}>In Search of a New Planet</Text>
          <Text>
            Our original Planet was shutdown in January 2020. The software we use was last updated
            13 years ago. While the underlying code has drifted further into the past, our needs
            have moved forward. Maintaining the existing system, especially with the number of
            students involved in open source at Seneca, has become too difficult. Our current site
            often breaks, and needs manual interventions on a regular basis. Going forward, we need
            a new planet to call home.{'\n\n'}
            We have decided it is time to consider moving to a new system. Unfortunately, almost
            every system that came to replace Planet has itself become unmaintained.{'\n\n'}
            Rather than try to find an existing solution, we have instead decided to try and create
            one. Because we need this software, we also feel that we should create and maintain it.
            And, since our need for a Planet comes out of our collective work on open source, we
            think that creating it together as open source would be the most desireable path
            forward.
          </Text>
          <Text style={[styles.header, styles.paragraphHeader]}>Trying to Define Our Planet</Text>
          <Text>
            We have learned a number of things over the past decade running our own planet. We've
            also watched as social media and modern technologies have reshaped our expectations for
            what a system like this can and should be.{'\n\n'}
            It's not 100% clear what we need to build, which is part of the fun. It is our hope that
            you will leave a mark on this project, and bring your own ideas, experience, and code to
            the task of defining our planet.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
