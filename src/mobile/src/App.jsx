import 'react-native-url-polyfill/auto';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';

import Navigation from './navigation/Navigation';

export default registerRootComponent(function App() {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
});
