import * as WebBrowser from 'expo-web-browser';
import { Text, StyleSheet, Pressable } from 'react-native';

const styles = StyleSheet.create({
  linkText: {
    color: '#121D59',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  links: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    display: 'flex',
    elevation: 2,
    flexDirection: 'row',
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});

const LinksButton = ({ name, internal, icon, href, navigation }) => {
  const handleOpenBrowser = async (url) => {
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <Pressable
      style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }, styles.links]}
      onPress={() => (internal ? navigation.navigate(href) : handleOpenBrowser(href))}
    >
      {icon}
      <Text style={styles.linkText}>{name}</Text>
    </Pressable>
  );
};

export default LinksButton;
