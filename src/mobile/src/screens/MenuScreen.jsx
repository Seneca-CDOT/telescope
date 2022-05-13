import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, StyleSheet, View, ScrollView, Switch, Platform } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import LinksButton from '../components/LinksButton';
import MenuHeaderUserCard from '../components/MenuHeaderUserCard';

const styles = StyleSheet.create({
  linkToggle: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    display: 'flex',
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    padding: Platform.OS === 'android' ? 4 : 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  linkToggleContent: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  linkToggleText: {
    color: '#121D59',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  menuScreen: {
    backgroundColor: '#F9FAFB',
    flex: 1,
  },
  navigation: {
    padding: 24,
  },
  navigationTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
});

const links = [
  {
    name: 'Telescope Dashboard',
    internal: false,
    icon: <MaterialIcons name="dashboard" size={24} color="#121D59" />,
    href: 'https://api.telescope.cdot.systems/v1/status/',
  },
  {
    name: 'Planet',
    internal: false,
    icon: <Ionicons name="planet" size={24} color="#121D59" />,
    href: 'https://telescope.cdot.systems/planet',
  },
  {
    name: 'Telescope Github',
    internal: false,
    icon: <Ionicons name="logo-github" size={24} color="#121D59" />,
    href: 'https://github.com/Seneca-CDOT/telescope',
  },
  {
    name: 'About us',
    internal: false,
    icon: <Ionicons name="ios-information-circle" size={24} color="#121D59" />,
    href: 'https://telescope.cdot.systems/docs/',
  },
];

const MenuScreen = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <SafeAreaView edges={['top']} style={styles.menuScreen}>
      <ScrollView>
        <MenuHeaderUserCard />
        <View style={styles.navigation}>
          <Text style={styles.navigationTitle}>General</Text>
          {links.map((linkInfo) => {
            return <LinksButton {...linkInfo} key={linkInfo.name} navigation={navigation} />;
          })}
          <Text style={styles.navigationTitle}>Setting</Text>
          <View style={styles.linkToggle}>
            <View style={styles.linkToggleContent}>
              <Ionicons name="moon" size={24} color="#121D59" />
              <Text style={styles.linkToggleText}>Dark mode</Text>
            </View>
            <Switch
              trackColor={{ false: '#9CA3AF85', true: '#9CA3AF85' }}
              thumbColor="#121D59"
              onValueChange={toggleSwitch}
              value={isEnabled}
              disabled
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MenuScreen;
