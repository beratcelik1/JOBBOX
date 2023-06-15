import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import WorkPeriodDetails from './WorkPeriod'; 

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
  },
};

const BoxMain = () => { 
  const navigation = useNavigation(); 

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const token = await AsyncStorage.getItem('token');
              const userId = await AsyncStorage.getItem('userId');
              console.log('userId:', userId);
              if (!userId) {
                console.log('User ID not found in storage');
                return; // or handle this situation some other way
            }
              // Use userId here instead of user._id
              const response = await axios.get(`https://tranquil-ocean-74659.herokuapp.com/jobs/user/${userId}/inprogress`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });

              setJobs(response.data);
          } catch (err) {
              console.error(err);
          }
      };

      fetchData();
  }, []); 

  
  const handleJobPress = (job) => {
    navigation.navigate('WorkPeriodDetails', { job });
  };
  
  const renderItem = ({ item }) => ( 
    <TouchableOpacity style={styles.jobCard} onPress={() => handleJobPress(item)}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <View style={[
        styles.jobStatusContainer,
        item.status === 'Applied' && { backgroundColor: '#5ec949' },
        item.status === 'in progress' && { backgroundColor: '#4683fc' },
        item.status === 'Completed' && { backgroundColor: '#c7c7c7'}
      ]}>
        <Text style={styles.jobStatus}>{item.status}</Text>
      </View>
    </TouchableOpacity>


    
  );

  return (
    <View style = {{flex: 1}}>
      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};  

const Stack = createStackNavigator();

const Box = () => (
  <NavigationContainer independent={true} theme={MyTheme}>
    <Stack.Navigator initialRouteName="BoxMain">
      <Stack.Screen name="BoxMain" component={BoxMain} options={{ title: 'Box' }} />
      <Stack.Screen name="WorkPeriodDetails" component={WorkPeriodDetails} options={{ title: 'Period Details' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = {
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  jobCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
  },
  jobTitle: {
    fontSize: 18,
  },
  jobStatus: {
    fontSize: 16,
    fontWeight: '500',
  }, 
  jobStatusContainer: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  jobStatus: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff' // Change this color to something else if 'Completed' status is hard to read
  }
};

export default Box;
