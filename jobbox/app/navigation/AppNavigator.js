// navigation/AppNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Hire from '../screens/Home/Hire';
import PostJob from '../screens/Home/PostJob.js'; 

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Hire" component={Hire} />
    <Stack.Screen name="PostJob" component={PostJob} /> {/* add this line */}
    {/* other screens */}
  </Stack.Navigator>
);

export default AppNavigator;
