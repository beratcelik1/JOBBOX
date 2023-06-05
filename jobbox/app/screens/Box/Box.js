import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { Ionicons } from '@expo/vector-icons';

function StatusBadge({ status }) {
  let text = '';
  let color = '';
  switch (status) {
    case 'open':
      text = 'Open';
      color = 'green';
      break;
    case 'hired':
      text = 'Hired';
      color = 'blue';
      break;
    case 'closed':
      text = 'Closed';
      color = 'red';
      break;
    case 'rejected':
      text = 'Rejected';
      color = 'grey';
      break;
  }

  return (
    <View style={{ backgroundColor: color, borderRadius: 5, padding: 5, alignSelf: 'flex-start' }}>
      <Text style={{ color: 'white' }}>{text}</Text>
    </View>
  );
}

function StatusScreen() {
  const [loaded, setLoaded] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoaded(false);
      let token;
      try {
        // Fetch the token from the async storage
        token = await AsyncStorage.getItem('token');
      } catch(e) {
        Alert.alert('Error', 'Could not retrieve user information. Please try again later.');
        return;
      }

      // Fetch the jobs from your server
      try {
        const response = await fetch('http://tranquil-ocean-74659.herokuapp.com/jobs/user/jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setJobs(data);
        setLoaded(true);
      } catch (error) {
        // console.error('Error:', error);
        setError('Failed to load jobs. Please try again later.');
      }
    };

    fetchJobs();
  }, []);

    const renderJob = ({ item }) => {
        // Provide JSX to render each job in the list
        return (
        <TouchableOpacity 
            style={styles.jobCard}
            // onPress={() => navigation.navigate('JobDetail', { job: item })} 
        > 
            <View style={styles.jobHeader}>  
                <Text style={styles.jobTitle}>{item.title}</Text>
                <View style = {{ flexDirection: 'row',justifyContent: 'space-between'}}>
                    <Text style={styles.jobTitle2}>{item.postedBy?.firstname} {item.postedBy?.lastname} - 4.3 </Text>
                    <Ionicons name="star" size={13} color="#4683fc" /> 
                </View>
            </View>     
            <View
                style={{
                borderBottomColor: '#4683fc',
                borderBottomWidth: 1.5,
                marginBottom: 10,
                }}/>

            <View style = {{ flexDirection: 'row', justifyContent: 'flex-start',}}> 
                <View style = {{ width: '60%'}} > 
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5}}> 
                            <Ionicons name="md-cash" size={20} color="#4683fc" /> 
                            <Text style={styles.jobDescription}>  {item.pay} $ </Text>
                        </View> 

                        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <Ionicons name="md-time" size={20} color="#4683fc" />
                            <Text style={styles.jobDescription}>  {item.estimatedTime}</Text>
                            <Text style={styles.jobDescription}>  {item.estimatedTimeUnit}</Text>
                    </View> 
                </View> 

                <View style = {{ width: '40%',}}> 
                    <StatusBadge status={item.status} />
                </View>
            </View>
        </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
          {error ? (
            <Text style={{ color: 'red' }}>{error}</Text>
          ) : loaded ? (
            <FlatList data={jobs} renderItem={renderJob} keyExtractor={(item, index) => item._id} style={styles.jobList}/>
          ) : (
            <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#0000ff"/>
          )}
        </View>
      );
      
}

const styles = {
    container: {
        flex: 1,
        marginTop: 10, 
    },
    jobCard: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 10,
        borderRadius: 10,
        marginLeft: 15,
        marginRight: 15,
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
    jobHeader: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10, 
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    jobTitle2: {
        fontSize: 13,
    },
    jobDescription: {
        fontSize: 14,
        color: '#000',
    },
    jobDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
}

export default StatusScreen;
