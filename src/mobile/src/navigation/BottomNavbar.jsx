import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import SearchScreen from '../screens/SearchScreen';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  bottomNavbar: {
    backgroundColor: '#FFFFFF',
    height: Platform.OS === 'android' ? 70 : 90,
  },
  centerIcon: {
    alignItems: 'center',
  },
  dot: {
    backgroundColor: '#121D59',
    borderRadius: 25,
    bottom: -4,
    height: 3,
    justifyContent: 'center',
    width: 8,
  },
});

const BottomNavbar = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.bottomNavbar,
        headerShown: false,
        tabBarActiveTintColor: '#121D59',
        tabBarInactiveTintColor: '#52525B95',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <View style={styles.centerIcon}>
                <AntDesign name="home" color={color} size={size} />
                {focused ? <View style={styles.dot} /> : null}
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <View style={styles.centerIcon}>
                <Ionicons name="search" color={color} size={size} />
                {focused ? <View style={styles.dot} /> : null}
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <View style={styles.centerIcon}>
                <Ionicons name="md-menu" color={color} size={size} />
                {focused ? <View style={styles.dot} /> : null}
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavbar;
