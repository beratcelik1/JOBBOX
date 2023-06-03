import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PostJob from '../Home/PostJob';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';

import { HireApplicationsScreen } from './HireApplications';
import { useFocusEffect } from '@react-navigation/native';

import FindTemplateScreen from './FindTemplateScreen';

import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import { ActivityIndicator } from 'react-native-paper';

function HireScreen({ navigation }) {
  const [loaded, setLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);


  const fetchJobs = async () => {
    // Fetch the token from the async storage
    const token = await AsyncStorage.getItem('token');
    console.log(token);

    // Decode the token to get the user ID
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;

    // Fetch the jobs from your server
    fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Set the jobs state
        setJobs(data);
      })
      .catch((error) => console.error('Error:', error));
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoaded(false);
      fetchJobs();
      setLoaded(true);
    }, [])
  );

  const handleSearch = () => {
    console.log(searchQuery);

    // for testing showMessage
    showMessage({
      message: true ? 'Your request has been sent!' : 'Your job is posted!',
      description:
        true && 'you will get a notification when your job post is approved.',
      type: 'info',
      floating: true,
      icon: 'success',
      duration: 3000,
    });
  };
  const handleJobPress = (job) => {
    console.log(job);
    navigation.navigate('HireApplicationsScreen', { job: job });
  }; 

  const handleDeleteJob = async (jobId) => {
    // Confirm the delete action
    Alert.alert(
      "Delete Job",
      "Are you sure you want to delete this job?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: async () => {
          // Fetch the token from the async storage
          const token = await AsyncStorage.getItem('token');
          console.log(token);

          // Make the DELETE request
          fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/${jobId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              // Refresh the job list after deleting
              // You may wish to handle potential errors here too
              fetchJobs();
            })
            .catch((error) => console.error('Error:', error));
        }}
      ],
      { cancelable: false }
    );
  };
  


  const renderJob = ({ item }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('PostJob', { template: item, editing: true })
          } 
          style = {styles.button2}
        >
          <Ionicons name="create-outline" size={24} color="#4683fc" />
          <Text style={styles.buttonText2}>Edit post</Text>
        </TouchableOpacity> 

        <TouchableOpacity
      onPress={() => handleDeleteJob(item._id)}
      style={styles.button2}
    >
      <Text style={styles.buttonText2}>Delete Job</Text>
    </TouchableOpacity>

      </View>
      <Text style={styles.jobDescription}>{item.description}</Text>
      <Text style={styles.jobDate}>{item.datePosted}</Text> 
      <Text style={styles.jobDate}> 
        Applications: {item.applications ? item.applications.length : 0}
      </Text>  

            <TouchableOpacity 
              style={styles.button}
              onPress={() => handleJobPress(item)}  
            > 
                <Text style={styles.buttonText}> View Possible Hires</Text>
            </TouchableOpacity>
    </View>
  );  

  

  return (
    <View style={styles.container}>
      {loaded ? (
        <React.Fragment>
          <SearchBar
            placeholder={'Find previously created jobs..'}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            showSearchButton
          />

          <FlatList
            data={jobs}
            renderItem={renderJob}
            keyExtractor={(item, index) => item._id}
            style={styles.applicantView} 
          />
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('FindTemplateScreen')}
              style={styles.Postbtn}
            >
              <Text style={{ fontWeight: 'bold', color: '#fff' }}>
                New job post
              </Text>
            </TouchableOpacity>
          </View>
        </React.Fragment>
      ) : (
        <ActivityIndicator
          style={{ marginTop: 30 }}
          size="large"
          color="#0000ff"
        />
      )}
    </View>
  );
}

const HireStack = createStackNavigator();

export default function Hire() {
  return (
    <HireStack.Navigator initialRouteName="HireScreen">
      <HireStack.Screen
        name="HireScreen"
        component={HireScreen}
        options={{ headerShown: false }}
      />
      <HireStack.Screen
        name="PostJob"
        component={PostJob}
        options={{
          headerTitle: '',
          headerShown: true,
          headerBackTitle: '',
          headerBackTitleVisible: false,
        }}
      />
      <HireStack.Screen
        name="HireApplicationsScreen"
        component={HireApplicationsScreen}
        options={{
          headerTitle: '',
          headerShown: true,
          headerBackTitle: '',
          headerBackTitleVisible: false,
        }}
      />
      <HireStack.Screen
        name="FindTemplateScreen"
        component={FindTemplateScreen}
        options={{
          headerTitle: '',
          headerShown: true,
          headerBackTitle: '',
          headerBackTitleVisible: false,
        }}
      />
    </HireStack.Navigator>
  );
}

const styles = StyleSheet.create({
  applicantView: { 
    marginLeft: -20, 
    marginRight: 0, 
    marginBottom: 0, 
  },
  Postbtn: { 
    backgroundColor: '#4683fc', 
    borderRadius: 50, 
    width: 150, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    marginLeft: 30,
    marginRight: 10,
    // Android shadow properties
    elevation: 5,
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }, 
  button: { 
    backgroundColor: '#4683fc',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
    alignItems: 'center', 
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    
  }, 
  button2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#f2f3f5',
    paddingTop: 6, 
    paddingBottom: 6, 
    paddingLeft: 15, 
    paddingRight: 15, 
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
},
buttonText2: {
    marginLeft: 5,
    color: '#4683fc', 
},
  jobHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  jobDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
  },
});
