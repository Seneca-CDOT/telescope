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
