import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import Activity from './pages/Activity';
import Profile from './pages/Profile';
import Services from './pages/Services';


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }} // Hide the header as it is handled in your Home component
        />
        {/* Add other screens here */}
       
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Activity"
          component={Activity}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Services"
          component={Services}
          options={{ headerShown: false }}
        />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
