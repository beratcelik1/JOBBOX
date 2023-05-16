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
import Services from './screens/Services/Services';
import Hire from './screens/Home/Hire';
import Work from './screens/Home/Work';
import Messages from './screens/Messages';
import Notifications from './screens/Notifications';
import PostJob from './screens/Home/PostJob';
import Category from './screens/Services/Category';
import JobScreen from './screens/JobScreen';

import { useState } from 'react';
import Login from './screens/Login';
import Signup from './screens/Signup';


import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Replace the Firebase configuration object with your own
const firebaseConfig = {
  apiKey: "AIzaSyA4-qjFOwO00m1siyVnQyrU3HSdyeVDR1s",
  authDomain: "jobbox-d937e.firebaseapp.com",
  databaseURL: "https://jobbox-d937e.firebaseio.com",
  projectId: "jobbox-d937e",
  storageBucket: "jobbox-d937e.appspot.com",
  messagingSenderId: "336768061417",
  appId: "1:336768061417:android:475307605d96af03e64578",
          
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const logo = require('./assets/images/jobboxlogo4.png');
const logo2 = require('./assets/images/jobboxlogotek.png');


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
      tabBarActiveTintColor: '#4683fc',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: [
        {
          display: 'flex'
        },
        null
      ]
    })}
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
  
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  

  const AuthStack = () => (
    <Stack.Navigator>
      <Stack.Screen 
        name="Login" 
        options={{ headerShown: false }}>
        {props => <Login {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
  
  const MainStack = () => (
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
      <Stack.Screen 
        name="Category"
        component={Category} 
        options={{ headerBackTitle: '', headerBackTitleVisible: false }} 
      />
      <Stack.Screen 
        name="Job" 
        component={JobScreen}
        options={{headerTitle: ' ', headerBackTitle: '', headerBackTitleVisible: false,}}  
      />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer ref={navigationRef} independent={true}>
      <RootNavigationContext.Provider value={navigationRef}>
        {isAuthenticated ? <MainStack /> : <AuthStack />}
      </RootNavigationContext.Provider>
    </NavigationContainer>
  );
}

