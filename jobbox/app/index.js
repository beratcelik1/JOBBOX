import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Activity from './screens/Activity';
import Profile from './screens/Profile';
import Services from './screens/Services';
import Hire from './screens/Home/Hire';
import Work from './screens/Home/Work';

const logo = require('./assets/images/jobboxlogo.png');

const TopTab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();

function HomeTopTabs() {
  return (
    <TopTab.Navigator initialRouteName="Hire">
      <TopTab.Screen name="Hire" component={Hire} />
      <TopTab.Screen name="Work" component={Work} />
    </TopTab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <BottomTab.Navigator initialRouteName="Home">
        <BottomTab.Screen 
          name="Home" 
          component={HomeTopTabs} 
          options={{ 
            title: 'Home',
            headerTitle: () => <Image source={logo} style={{ width: 30, height: 30 }} />
          }}
        />
        <BottomTab.Screen 
          name="Services" 
          component={Services} 
          options={{ 
            title: 'Services',
            headerTitle: () => <Image source={logo} style={{ width: 30, height: 30 }} />
          }}
        />
        <BottomTab.Screen 
          name="Activity" 
          component={Activity} 
          options={{ 
            title: 'Activity',
            headerTitle: () => <Image source={logo} style={{ width: 30, height: 30 }} />
          }}
        />
        <BottomTab.Screen 
          name="Profile" 
          component={Profile} 
          options={{ 
            title: 'Profile',
            headerTitle: () => <Image source={logo} style={{ width: 30, height: 30 }} />
          }}
        />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
}
