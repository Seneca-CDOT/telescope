import React from 'react';
// 1. import `NativeBaseProvider` component
import { NativeBaseProvider, Text, Box } from 'native-base';

export default function App() {
  // 2. Use at the root of your app
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Text>Telescope mobile app!</Text>
      </Box>
    </NativeBaseProvider>
  );
}
