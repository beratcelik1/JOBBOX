import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import WorkPeriodDetails from './WorkPeriod';

const StatusScreenMain = () => {
  const navigation = useNavigation();

  // Dummy data
  const [jobs, setJobs] = useState([
    { id: '1', title: 'Job 1', status: 'In Progress',
    myLocation: {
      latitude: 49.939137625826056,
      longitude:  -119.39467990636201,
    },
    employerLocation: {
      latitude: 49.94096432668098,
      longitude:  -119.39825863503745,
    },
 
  },
    { id: '2', title: 'Job 2', status: 'Applied', 
    myLocation: {
      latitude: 49.939137625826056,
      longitude:  -119.39467990636201,
    },
    employerLocation: {
      latitude: 49.94096432668098,
      longitude:  -119.39825863503745,
    },

  },
    { id: '3', title: 'Job 3', status: 'Completed',
    myLocation: {
      latitude: 49.939137625826056,
      longitude:  -119.39467990636201,
    },
    employerLocation: {
      latitude: 49.94096432668098,
      longitude:  -119.39825863503745,
    },

   },
    { id: '4', title: 'Job 4', status: 'Completed', 
    myLocation: {
      latitude: 49.939137625826056,
      longitude:  -119.39467990636201,
    },
    employerLocation: {
      latitude: 49.94096432668098,
      longitude:  -119.39825863503745,
    },

  },
    // ... more jobs
  ]);

  const inProgressJobs = jobs.filter(job => job.status !== 'Completed');
  const completedJobs = jobs.filter(job => job.status === 'Completed');

  const handleJobPress = (job) => {
    navigation.navigate('WorkPeriodDetails', { job });
  };

  const renderJob = ({ item }) => (
    <TouchableOpacity style={styles.jobCard} onPress={() => handleJobPress(item)}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <View style={[
        styles.jobStatusContainer,
        item.status === 'Applied' && { backgroundColor: '#5ec949' },
        item.status === 'In Progress' && { backgroundColor: '#4683fc' },
        item.status === 'Completed' && { backgroundColor: '#c7c7c7'}
      ]}>
        <Text style={styles.jobStatus}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>In-Progress / Applied Jobs</Text>
      <FlatList
        data={inProgressJobs}
        renderItem={renderJob}
        keyExtractor={item => item.id}
      />
      <Text style={styles.sectionTitle}>Completed Jobs</Text>
      <FlatList
        data={completedJobs}
        renderItem={renderJob}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const Stack = createStackNavigator();

const StatusScreen = () => (
  <NavigationContainer independent={true}>
    <Stack.Navigator initialRouteName="StatusScreenMain">
      <Stack.Screen name="StatusScreenMain" component={StatusScreenMain} options={{ title: 'Box' }} />
      <Stack.Screen name="WorkPeriodDetails" component={WorkPeriodDetails} options={{ title: 'Period Details' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = {
  container: {
    flex: 1,
    padding: 10,
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
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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

export default StatusScreen;

