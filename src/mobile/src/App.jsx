import React from 'react';
import 'react-native-url-polyfill/auto';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { SWRConfig } from 'swr';
import { AppState } from 'react-native';

import Navigation from './navigation/Navigation';

export default registerRootComponent(function App() {
  return (
    // https://swr.vercel.app/docs/advanced/react-native
    <SWRConfig
      value={{
        provider: () => new Map(),
        isVisible: () => {
          return true;
        },
        initFocus(callback) {
          let appState = AppState.currentState;

          const onAppStateChange = (nextAppState) => {
            /* If it's resuming from background or inactive mode to active one */
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
              callback();
            }
            appState = nextAppState;
          };

          // Subscribe to the app state change events
          const subscription = AppState.addEventListener('change', onAppStateChange);

          return () => {
            subscription.remove();
          };
        },
        fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
      }}
    >
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </SWRConfig>
  );
});
