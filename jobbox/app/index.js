import React, { useRef, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation ,DefaultTheme} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
  },
};

import { Modalize } from 'react-native-modalize';
import { Dimensions } from 'react-native';

import { RootNavigationContext } from './navigation/RootNavigationContext';
import Activity from './screens/Activity/Wallet';
import Profile from './screens/Profile/Profile';
import Services from './screens/Services/Services';
import Hire from './screens/Home/Hire';
import Work from './screens/Home/Work';
import Notifications from './screens/Notifications/Notifications';
import PostJob from './screens/Home/PostJob';
import Category from './screens/Services/Category';
import JobScreen from './screens/Services/JobScreen';
import ProfileSection from './screens/Profile/ProfileSection';
import WorkHistoryScreen from './screens/Activity/WorkHistoryScreen';
import HireHistoryScreen from './screens/Activity/HireHistoryScreen';
import EditTargetsScreen from './screens/Activity/EditTargetsScreen'; 
import Box from './screens/Box/Box'; 

import Login from './screens/Register/Login'; 
import Signup from './screens/Register/Signup';

import { Section } from 'react-native-paper';
import FlashMessage from 'react-native-flash-message';
import SettingsPage from './screens/Settings/Settings';
import ChangePasswordScreen from './screens/Settings/ChangePassword';
import DeleteAccountScreen from './screens/Settings/DeleteAccount';
import AccountSecurityScreen from './screens/Settings/AccountSecurity';
import FAQScreen from './screens/Settings/FAQ';
import PushNotificationsComponent from './screens/Settings/PushNotifications';

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

function MyTabs({handleSignOut}) {
  const navigation = useNavigation(); 
  const [user, setUser] = useState({});
  const [hasNotifications, setHasNotifications] = useState(false);
  const modalizeRef = useRef(null);
  // Fetch the current user's information
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log(response.data);
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user data: ", err);
      }
    }
    fetchUserData();
  }, []);

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const response = await axios.get(`https://tranquil-ocean-74659.herokuapp.com/auth/notifications/${user._id}`); 
  //       if (response.data && response.data.length > 0) {
  //         setHasNotifications(true);
  //       }
  //       // console.log(response.data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  //   // Only call fetchNotifications if user._id exists (i.e., if the user data has been fetched)
  //   if (user._id) {
  //     fetchNotifications();
  //   }
  // }, [user]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`https://tranquil-ocean-74659.herokuapp.com/auth/notifications/${user._id}`); 
        if (response.data && response.data.length > 0) {
          setHasNotifications(true);
        } else {
          setHasNotifications(false);
        }
        // console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    let intervalId;

    // Only call fetchNotifications if user._id exists (i.e., if the user data has been fetched)
    if (user._id) {
      fetchNotifications();
      intervalId = setInterval(fetchNotifications, 3000); // Fetch every 3 seconds
    }

    // Clean up the interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  }, [user]);
  const handleMenu =  () => {
    console.log("handle out")
    modalizeRef.current?.open();
  };
  const commonOptions = {
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
          {hasNotifications && (
            <View style={{ position: 'absolute', right: -2, top: -2, backgroundColor: 'red', borderRadius: 6, width: 12, height: 12, justifyContent: 'center', alignItems: 'center' }} />
          )}
          <Icon name="notifications-outline" size={24} style={{ marginLeft: 0 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleMenu}>
          <Icon name="ellipsis-vertical-outline" size={24} />
        </TouchableOpacity>
      </View>
    ),
  };
  return (
    <>
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
  
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'md-grid' : 'md-grid-outline';
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
            display: 'flex',
          },
          null,
        ],
      })}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeTopTabs}
        options={{
          ...commonOptions,
        }}
      />
      <BottomTab.Screen
        name="Categories"
        component={Services}
        options={{
          ...commonOptions,
        }}
      />
      <BottomTab.Screen
        name=" "
        component={Box}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                width: 70,
                height: 50,
                borderRadius: 30,
                marginBottom: -20,
                backgroundColor: focused ? '#4683FC' : '#D3D3D3',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon name={focused ? 'cube' : 'cube-outline'} size={size} color={focused ? 'white' : 'gray'} />
            </View>
          ),
          tabBarButton: (props) => <TouchableOpacity {...props} />,
          ...commonOptions,
        }}
      />
      <BottomTab.Screen
        name="Activity"
        component={Activity}
        options={{
          ...commonOptions,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          ...commonOptions,
        }}
      />
    </BottomTab.Navigator>
    <Modalize
      ref={modalizeRef}
      snapPoint={Dimensions.get('window').height * 0.4}
      modalHeight={Dimensions.get('window').height * 0.8}
    >
      <View style={{ padding: 20 }}>
        <TouchableOpacity onPress={() => {
    modalizeRef.current?.close();navigation.navigate('Settings')}}>
          <Text style={{ fontSize: 20, marginBottom: 20 }}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {console.log('Sign Out');modalizeRef.current?.close();handleSignOut()}}>
          <Text style={{ fontSize: 20 }}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </Modalize>
    </>
  );
  
}
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigationRef = React.useRef();
  const [signOutFlag, setSignOutFlag] = useState(false);

  
  const AuthStack = () => (
    <Stack.Navigator 
      screenOptions={{ 
        cardStyle: { backgroundColor: '#4683FC'}
      }}
    >
      <Stack.Screen 
        name="Login" 
        options={{ headerShown: false }}>
        {props => <Login {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      <Stack.Screen 
        name="MyTabs" 
        component={MyTabs} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>

  );
  
  const handleSignOut = () => {
    console.log("signing out")
    setIsAuthenticated(false)
    console.log(isAuthenticated)
  };
  const MainStack = ({handleSignOut}) => (
    <Stack.Navigator >
      
      <Stack.Screen 
      name="MyTabs" 
      options={{ headerShown: false }}
      component={()=><MyTabs handleSignOut={handleSignOut}/>}
    >
    </Stack.Screen>
      <Stack.Screen 
        name="Messages" 
        component={ChatHandler} 
        options={{ headerBackTitle: 'Back', headerBackTitleVisible: false }} 
      />
      <Stack.Screen 
        name="ChatRoom" 
        component={ChatRoom} 
        options={{ headerBackTitle: 'Back', headerBackTitleVisible: false }} 
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
       <Stack.Screen name="ProfileSection" component={ProfileSection} 
       options={{headerTitle: 'Profile', headerBackTitle: '', headerBackTitleVisible: false }} 
      />

       <Stack.Screen 
        name="WorkHistoryScreen" 
        component={WorkHistoryScreen} 
        options={{ headerBackTitle: '', headerBackTitleVisible: false }} 
      />
      <Stack.Screen 
        name="HireHistoryScreen" 
        component={HireHistoryScreen} 
        options={{ headerBackTitle: '', headerBackTitleVisible: false }} 
      />
      <Stack.Screen 
        name="EditTargetsScreen" 
        component={EditTargetsScreen} 
        options={{ headerBackTitle: '', headerBackTitleVisible: false }} 
      />
      
      <Stack.Screen
        name="Settings"
        component={()=><SettingsPage handleSignOut={handleSignOut}/>}
        options={{ headerTitle: 'Settings' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ headerTitle: 'Change Password' }}
      />
      <Stack.Screen
        name="AccountSecurity"
        component={AccountSecurityScreen}
        options={{ headerTitle: 'Account Security' }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{ headerTitle: 'Delete Account' }}
      />
      <Stack.Screen
        name="FAQ"
        component={FAQScreen}
        options={{ headerTitle: 'FAQ' }}
      />
      <Stack.Screen
        name="PushNotification"
        component={PushNotificationsComponent}
        options={{ headerTitle: 'Notification Settings' }}
      />

    </Stack.Navigator>
  );

  return (
    <NavigationContainer key = {isAuthenticated?1:0} ref={navigationRef} independent={true} theme={MyTheme}>
      <RootNavigationContext.Provider value={navigationRef}>
        {isAuthenticated ? <MainStack handleSignOut={handleSignOut}/> : <AuthStack />}
      </RootNavigationContext.Provider>
      <FlashMessage position="top" />
      
    </NavigationContainer>
  )
}
