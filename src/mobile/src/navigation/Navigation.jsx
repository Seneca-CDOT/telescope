import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons, Entypo, EvilIcons } from '@expo/vector-icons';

import SearchScreen from '../screens/SearchScreen';
import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ContactScreen from '../screens/ContactScreen';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  navBarIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Navigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          {
            display: 'flex',
          },
          null,
        ],
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <View style={styles.navBarIcon}>
              <Entypo name="home" size={24} color="#121D59" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: () => (
            <View style={styles.navBarIcon}>
              <EvilIcons name="search" size={24} color="#121D59" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          tabBarIcon: () => (
            <View style={styles.navBarIcon}>
              <MaterialIcons name="contact-support" size={24} color="#121D59" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          tabBarIcon: () => (
            <View style={styles.navBarIcon}>
              <MaterialIcons name="exit-to-app" size={24} color="#121D59" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Theme"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <View style={styles.navBarIcon}>
              <MaterialIcons name="brightness-4" size={24} color="#121D59" />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Navigation;
