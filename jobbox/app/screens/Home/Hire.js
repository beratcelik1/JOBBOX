import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PostJob from '../Home/PostJob';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';

import { HireApplicationsScreen } from './HireApplications';
import { useFocusEffect } from '@react-navigation/native';

import { EditJobScreen } from './EditJobScreen';
import FindTemplateScreen from './FindTemplateScreen';

import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import { ActivityIndicator } from 'react-native-paper';

function HireScreen({ navigation }) {
  const [loaded, setLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      setLoaded(false);
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
            setAllJobs(data);
            setJobs(data);
          })
          .catch((error) => console.error('Error:', error));
      };

      fetchJobs();
      setLoaded(true);
    }, [])
  );

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const handleSearch = () => {
    if (!searchQuery) {
      // if searchQuery is empty, show all jobs
      setJobs(allJobs);
    } else {
      const filteredJobs = allJobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
      setJobs(filteredJobs);
    }
  };
  const handleJobPress = (job) => {
    console.log(job);
    navigation.navigate('HireApplicationsScreen', { job: job });
  };

  const renderJob = ({ item }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('PostJob', { template: item, editing: true })
          }
        >
          <Ionicons name="create-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      <Text style={styles.jobDescription}>{item.description}</Text>
      <Text style={styles.jobDate}>{item.datePosted}</Text>
      <Text style={styles.jobDate}>
        Applications: {item.applications ? item.applications.length : 0}
      </Text>
      <Button onPress={() => handleJobPress(item)} title="View Job Post" />
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
        name="EditJob"
        component={EditJobScreen}
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
      width: -10,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
