import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,Button, StyleSheet,TouchableOpacity, FlatList, Alert,} from 'react-native';
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
import LoadingScreen from '../../components/LoadingScreen';
import { formatDateTime } from '../../utils/formatDateTime';

function HireScreen({ navigation }) {
  const [loading, setloading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [archivedJobs, setArchivedJobs] = useState([]);


  useFocusEffect(
    React.useCallback(() => {
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
          // Filter jobs into 'active' and 'archived'
          const activeJobs = data.filter(job => job.status !== 'in progress');
          const archived = data.filter(job => job.status === 'in progress');
        
          // Set the jobs and archivedJobs states
          setAllJobs(activeJobs);
          setJobs(activeJobs);
          setArchivedJobs(archived);
        })
        .catch((error) => console.error('Error:', error));

        setloading(false);
      };

      fetchJobs();
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

  const renderJob = ({ item }) => {
    const [startDate, startTime] = formatDateTime(item.startDateTime);
    const [endDate, endTime] = formatDateTime(item.endDateTime);
    
    return (
      <View style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{item.title}</Text>
        </View>   
        <View
          style={{
            borderBottomColor: '#fff',
            borderBottomWidth: 1.5,
            marginBottom: 10,
          }}/> 

        <View style = {{ 
          flexDirection: 'row',
          justifyContent: 'flex-start',}}> 

          <View style = {{ width: '60%'}} > 
            <View style={styles.jobDetails}>
              <Text style={styles.jobDescription}>{item.category}</Text>
            </View>
            <View style={styles.jobDetails}>
              <Text style={styles.jobDescription}>{item.location}</Text>
            </View>
          </View> 

          <View style = {{ width: '40%'}}> 
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5}}> 
              <Ionicons name="md-cash" size={20} color="#fff" /> 
              <Text style={styles.jobDescription}>  {item.pay} $</Text>
            </View> 

            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Ionicons name="md-time" size={20} color="#fff" />
              <Text style={styles.jobDescription}>  {item.estimatedTime}</Text>
              <Text style={styles.jobDescription}>  {item.estimatedTimeUnit}</Text>
            </View> 
          </View>
        </View>
        
        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Text style={styles.jobDescription}>Start Date/Time {startDate}/{startTime}</Text>
          <Text style={styles.jobDescription}>End Date/Time {endDate}/{endTime}</Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleJobPress(item)}  
        > 
          <Text style={styles.buttonText}> View Possible Hires ({item.applicants ? item.applicants.length : 0})</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <React.Fragment>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ArchivedJobsScreen')}
            style={styles.archiveIcon}
          >
            <Ionicons name="archive" size={32} color= "#cccccc" />
          </TouchableOpacity>
          <SearchBar
            placeholder={'Find previously created jobs..'}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </View>
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
      {loading && <LoadingScreen />}
    </View>
  );  
}

function ArchivedJobsScreen({ navigation }) {
  const [loading, setloading] = useState(true);
  const [archivedJobs, setArchivedJobs] = useState([]);
  const handleJobPress = (job) => {
    console.log(job);
    navigation.navigate('HireApplicationsScreen', { job, isArchived: true });
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchArchivedJobs = async () => {
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
          // Filter jobs into 'active' and 'archived'
          const archived = data.filter(job => job.status === 'in progress');
          
          // Set the archivedJobs states
          setArchivedJobs(archived);
        })
        .catch((error) => console.error('Error:', error));
        
        setloading(false);
      };

      fetchArchivedJobs();
    }, [])
  );

  const renderJob = ({ item }) => {
    const [startDate, startTime] = formatDateTime(item.startDateTime);
    const [endDate, endTime] = formatDateTime(item.endDateTime);

    return ( <View style={styles.jobCardArchive}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
      </View>   
      <View
        style={{
          borderBottomColor: '#fff',
          borderBottomWidth: 1.5,
          marginBottom: 10,
        }}/> 

      <View style = {{ 
        flexDirection: 'row',
        justifyContent: 'flex-start',}}> 

        <View style = {{ width: '60%'}} > 
          <View style={styles.jobDetails}>
            <Text style={styles.jobDescription}>{item.category}</Text>
          </View>
          <View style={styles.jobDetails}>
            <Text style={styles.jobDescription}>{item.location}</Text>
          </View>
        </View> 

        <View style = {{ width: '40%'}}> 
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5}}> 
            <Ionicons name="md-cash" size={20} color="#fff" /> 
            <Text style={styles.jobDescription}>  {item.pay} $</Text>
          </View> 

          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Ionicons name="md-time" size={20} color="#fff" />
            <Text style={styles.jobDescription}>  {item.estimatedTime}</Text>
            <Text style={styles.jobDescription}>  {item.estimatedTimeUnit}</Text>
          </View> 
          
        </View>
      </View>

      <View style={{  justifyContent: 'flex-start'}}> 
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start'}}> 
            <Text style = {{marginTop: 4, color: '#fff', fontWeight: '700'}}>Start Date:  </Text>
            <Text style={styles.jobDescription}>{startDate}</Text>
          </View> 

          <View style={{ flexDirection: 'row', justifyContent: 'flex-start'}}> 
            <Text style = {{marginTop: 4, color: '#fff', fontWeight: '700'}}>Start Time:  </Text>
            <Text style={styles.jobDescription}>{startTime}</Text>
          </View>
        </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => handleJobPress(item)}  
      > 
        <Text style={styles.buttonText}> View Job details</Text>
      </TouchableOpacity>
    </View>);
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}
      <FlatList
        data={archivedJobs}
        renderItem={renderJob}
        keyExtractor={(item, index) => item._id.toString()}
        style={styles.applicantView}
      />
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
      <HireStack.Screen
      name="ArchivedJobsScreen"
      component={ArchivedJobsScreen}
      options={{ headerTitle: '', headerBackTitleVisible: false }}
    />
    </HireStack.Navigator>
  );
}

const styles = StyleSheet.create({ 
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 1,
    marginTop: 0,
  },
  archiveIcon: {
    backgroundColor: '#fff',
    padding: 1,
    height: 40,
    width: 40,
    marginTop: -17,
    marginLeft: -5,
    marginRight:4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#4683fc',
    fontWeight: '600'
  },
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
    marginTop:5,
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
    backgroundColor: '#4683fc',
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
  jobCardArchive: {
    backgroundColor: '#cccc',
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
    backgroundColor: '#f2f3f5',
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
    color: '#4683fc', 
    fontWeight: '600',
    
  }, 
  jobHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, 
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  jobDescription: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  jobDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
  },
});
