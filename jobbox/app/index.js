import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Activity from './app/screens/Activity';
import Profile from './app/screens/Profile';
import Services from './app/screens/Services';
import Hire from './app/screens/Home/Hire';
import Work from './app/screens/Home/Work';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Hire" component={Hire} />
      <Tab.Screen name="Work" component={Work} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeTabs} options={{title: 'Home'}} />
        <Stack.Screen name="Activity" component={Activity} options={{title: 'Activity'}} />
        <Stack.Screen name="Profile" component={Profile} options={{title: 'Profile'}} />
        <Stack.Screen name="Services" component={Services} options={{title: 'Services'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
