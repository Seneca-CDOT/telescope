import { createStackNavigator } from '@react-navigation/stack';

import PostScreen from '../screens/PostScreen';
import BottomNavbar from './BottomNavbar';

const screenOptionStyle = {
  tabBarShowLabel: false,
  headerShown: true,
  headerBackTitleVisible: false,
  headerTintColor: '#000000',
};
const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen
        name="Base"
        options={() => ({
          headerShown: false,
        })}
        component={BottomNavbar}
      />
      <Stack.Screen
        name="Post"
        options={() => ({
          headerTitle: '',
          cardStyle: { backgroundColor: '#F9FAFB' },
        })}
        component={PostScreen}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
