import React from 'react';
import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { SWRConfig } from 'swr';

import Navigation from './navigation/Navigation';

export default registerRootComponent(function App() {
  return (
    <SWRConfig
      value={{ fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()) }}
    >
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </SWRConfig>
  );
});
