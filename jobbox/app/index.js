import React from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { RootNavigationContext } from './navigation/RootNavigationContext';
import Activity from './screens/Activity';
import Profile from './screens/Profile';
import Services from './screens/Services';
import Hire from './screens/Home/Hire';
import Work from './screens/Home/Work';
import Messages from './screens/Messages';
import Notifications from './screens/Notifications';
import PostJob from './screens/Home/PostJob';

import { useState } from 'react';
import Login from './screens/Login';
import Signup from './screens/Signup';
// other imports... 


const logo = require('./assets/images/jobboxlogo4.png');
const logo2 = require('./assets/images/jobboxlogotek.png');

const TopTab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeTopTabs() {
  return (
    <TopTab.Navigator initialRouteName="Hire">
      <TopTab.Screen name="Hire" component={Hire} />
      <TopTab.Screen name="Work" component={Work} />
    </TopTab.Navigator>
  );
}

function MyTabs() {
  const navigation = useNavigation();
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Services') {
            iconName = focused ? 'construct' : 'construct-outline';
          } else if (route.name === 'Activity') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: [
          {
            display: 'flex'
          },
          null
        ]
      }}
    >
      <BottomTab.Screen 
        name="Home" 
        component={HomeTopTabs} 
        options={{ 
          headerTitle: () => (
            <View style={{ alignItems: 'center' }}>
              <Image source={logo} style={{ width: 170, height: 30 }} />
            </View>
          ),
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <Image source={logo2} style={{ width: 30, height: 30 }} />
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 10 }}>
              <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
                <Icon name="chatbox-outline" size={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                <Icon name="notifications-outline" size={24} style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <BottomTab.Screen 
        name="Services" 
        component={Services} 
        options={{ 
          headerTitle: () => (
            <View style={{ alignItems: 'center' }}>
              <Image source={logo} style={{ width: 170, height: 30 }} />
            </View>
          ),
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <Image source={logo2} style={{ width: 30, height: 30 }} />
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 10 }}>
              <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
                <Icon name="chatbox-outline" size={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                <Icon name="notifications-outline" size={24} style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    <BottomTab.Screen 
      name="Activity" 
      component={Activity} 
      options={{ 
        headerTitle: () => (
          <View style={{ alignItems: 'center' }}>
            <Image source={logo} style={{ width: 170, height: 30 }} />
          </View>
        ),
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <Image source={logo2} style={{ width: 30, height: 30 }} />
          </View>
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', marginRight: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
              <Icon name="chatbox-outline" size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
              <Icon name="notifications-outline" size={24} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
    <BottomTab.Screen 
      name="Profile" 
      component={Profile} 
      options={{ 
        headerTitle: () => (
          <View style={{ alignItems: 'center' }}>
            <Image source={logo} style={{ width: 170, height: 30 }} />
          </View>
        ),
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <Image source={logo2} style={{ width: 30, height: 30 }} />
          </View>
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', marginRight: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
              <Icon name="chatbox-outline" size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
              <Icon name="notifications-outline" size={24} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
    </BottomTab.Navigator>
  );
}
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigationRef = React.useRef();

  if (!isAuthenticated) {
      return (
          <NavigationContainer ref={navigationRef} independent={true}>
              <Stack.Navigator>
                  <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                  <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
              </Stack.Navigator>
          </NavigationContainer>
      );
  }

  return (
      <NavigationContainer ref={navigationRef} independent={true}>
          <RootNavigationContext.Provider value={navigationRef}>
              <Stack.Navigator>
                  <Stack.Screen 
                      name="MyTabs" 
                      component={MyTabs} 
                      options={{ headerShown: false }} 
                  />
                  <Stack.Screen 
                      name="Messages" 
                      component={Messages} 
                      options={{ headerBackTitle: '', headerBackTitleVisible: false }} 
                  />
                  <Stack.Screen 
                      name="Notifications" 
                      component={Notifications} 
                      options={{ headerBackTitle: '', headerBackTitleVisible: false }} 
                  />
                  <Stack.Screen 
                      name="PostJob" 
                      component={PostJob} 
                      options={{headerBackTitle: '', headerBackTitleVisible: false
                      }} 
                  />
              </Stack.Navigator>
          </RootNavigationContext.Provider>
      </NavigationContainer>
  );
}
