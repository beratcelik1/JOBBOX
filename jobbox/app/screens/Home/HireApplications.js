import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LoadingScreen from '../../components/LoadingScreen';

export function HireApplicationsScreen({ route, navigation }) {
  const { job, isArchived = false } = route.params;
  const [applicants, setApplicants] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hiredApplicantId, setHiredApplicantId] = useState(null);

  const fetchApplicants = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Fetch the token from async storage
      const response = await axios.get(
        `http://tranquil-ocean-74659.herokuapp.com/jobs/applicants/${job._id}`,
        { headers: { Authorization: `Bearer ${token}` } } // Include the token in your request
      );
      console.log(response.data);
      setApplicants(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchApplicants();
    setLoading(false);
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchApplicants();
    setRefreshing(false);
  }, []); 

  const handleHire = async (applicantId) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.post(
        `http://tranquil-ocean-74659.herokuapp.com/jobs/hire/${job._id}/${applicantId}`, // Here is the change
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      if (response.status === 200) {
        Alert.alert('Success', 'User has been hired successfully!');
        setHiredApplicantId(applicantId);
        setApplicants(prevApplicants => {
          return prevApplicants.map(a => {
            if (a._id === applicantId) {
              return { ...a, hired: true };
            } else {
              return a;
            }
          });
        });
        // Send notification
      const notification = {
        to: applicantId, 
        from: user._id, // Assuming `user` is defined in your component and refers to the current user
        action: 'hired',
        jobId: job._id,
      };
      await axios.post('https://tranquil-ocean-74659.herokuapp.com/auth/notifications', notification);
    }
    } catch (error) {
      console.error(error.response.data);
      Alert.alert('Error', 'Something went wrong while hiring the user');
    }
  };
  
  const handleReject = async (applicantId) => {
    const token = await AsyncStorage.getItem('token');
    axios.post(`http://tranquil-ocean-74659.herokuapp.com/jobs/users/${applicantId}/reject`, 
    {jobId: job._id}, 
    {headers: { Authorization: `Bearer ${token}` }}
    ).then((response) => {
      // handle successful response
      if(response.status === 200){
        Alert.alert('Success', 'User has been rejected successfully!');
        // Remove the rejected applicant from the applicants array
        setApplicants(applicants.filter(applicant => applicant._id !== applicantId));
      }
    }).catch((error) => {
      // handle error
      console.error(error.response.data); // This will log the actual error message from the server
      Alert.alert('Error', 'Something went wrong while rejecting the user');
    });
  };
  
  const renderApplicant = ({ item }) => (
    <View style={styles.applicantCard}>
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={{ uri: item.profilePic }}
          style={styles.applicantImage}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={styles.applicantName}
              >{`${item.firstname} ${item.lastname}`}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.applicantRating}>{item.rating}</Text>
                <Ionicons
                  style={styles.applicantStar}
                  name="star"
                  size={17}
                  color="#f28e1b"
                />
              </View>
            </View>
          </View>
          <Text style={styles.applicantBio}>{item.skills}Fetch applicant skills</Text> 

          <View
            style={{ flexDirection: 'row', marginTop: 15, marginBottom: -5 }}
            >{!isArchived && (<>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => handleHire(item._id)} 
              disabled={hiredApplicantId === item._id}
            >
              <Ionicons name="checkmark-circle" size={20} color="#4683fc" />
              <Text style={styles.buttonText}>Hire</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button} 
              onPress={() => handleReject(item._id)} 
              disabled={hiredApplicantId === item._id}
            >
              <Ionicons name="close-circle" size={20} color="#4683fc" />
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Ionicons name="eye" size={20} color="#4683fc" />
              <Text style={styles.buttonText}>Review</Text>
            </TouchableOpacity>
            </>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  const handleDeleteJob = async () => {
    // Confirm the delete action
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              // Fetch the token from the async storage
              const token = await AsyncStorage.getItem('token');
  
              if (!token) {
                console.log('Token is not stored in AsyncStorage');
                Alert.alert('Error', 'Authentication token is missing.');
                return;
              }
  
              console.log('Token:', token);
  
              // Make the DELETE request
              await axios.delete(`http://tranquil-ocean-74659.herokuapp.com/jobs/${job._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
  
              // Show alert message
              Alert.alert('Job Deleted', 'This job has been successfully deleted.', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('HireScreen'),
                },
              ]);
            } catch (error) {
              console.error('Error:', error.response);
              Alert.alert('Error', 'Something went wrong while deleting the job');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.jobCard}> 

        <View style = {{flexDirection: 'row'}}> 
          <View style={{ flex: 1, marginLeft: 20, marginBottom: -10, marginRight: 10}}>
            <Text style={styles.title}>{job.title}</Text> 
            <View
              style={{
                borderBottomColor: '#fff',
                borderBottomWidth: 1.5,
                marginBottom: 5,
                marginTop: 5,
                
              }}/>  

            <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5}}> 
              <View style={{flexDirection: 'row', justifyContent: 'flex-stat', marginBottom: 5, marginRight: 25}}> 
                <Ionicons name="md-cash" size={20} color="#fff" /> 
                <Text style={styles.jobDescription}>  {job.pay} $</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Ionicons name="md-time" size={20} color="#fff" />
                <Text style={styles.jobDescription}>  {job.estimatedTime}</Text>
                <Text style={styles.jobDescription}>  {job.estimatedTimeUnit}</Text>
              </View>  
            </View>
            <Text style={styles.description}><Text style ={{fontWeight: 'bold'}}>Skills:</Text> {job.skills}</Text> 
          </View>
          <View style={styles.jobProgressSection}>
          {!isArchived && (<>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('PostJob', { template: job, editing: true })
              }
              style={styles.button2}
            >
              <Ionicons name="create-outline" size={24} color="#4683fc" />
              <Text style={styles.buttonText2}>Edit post</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteJob} style={styles.buttonDel}>
              <Ionicons name="trash-outline" size={24} color="#fff" />
              <Text style={styles.buttonTextDel}>Delete Job</Text>
            </TouchableOpacity>
            </>
            )}
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditJob', { job })}
                style={styles.editBtn}
              >
              </TouchableOpacity>
            </View>
          </View> 
        </View>
        <View style= {{marginTop: 0, marginLeft: 20}}>  
          <Text style={styles.description2}><Text style ={{fontWeight: 'bold'}}>Description:</Text> {job.description}</Text>
        </View>
      </View> 

      {applicants?.length < 1 ? (
        <View
          style={{
            flex: 1,
            marginTop: 40,
            justifyContent: 'top',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 18, color: '#000' }}>No applicants yet</Text>
        </View>
      ) : (
        <FlatList
          data={applicants}
          renderItem={renderApplicant}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.applicantView}
        />
      )}
      {loading && <LoadingScreen />}
    </View>
  );
}

// Styles...
const styles = StyleSheet.create({ 

  jobDescription: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  }, 

  button2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f3f5',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  buttonText2: {
    marginLeft: 5,
    color: '#4683fc',
  },
  buttonDel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eb5c52',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
    elevation: 5,
    marginBottom: 10,
  },
  buttonTextDel: {
    marginLeft: 5,
    color: '#fff',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 15,
    marginTop: 5,
    color: '#fff',
  }, 
  description2: {
    fontSize: 15,
    marginTop: -25,
    marginRight: 20,
    color: '#fff',
  },
  date: {
    fontSize: 14,
    marginTop: 10,
    color: '#fff9',
  },
  numApplications: {
    fontSize: 14,
    marginTop: 10,
    color: '#fff9',
  },
  jobCard: {
    // flexDirection: 'row',
    backgroundColor: '#4683fc',
    paddingRight: 20,
    paddingTop: 20,
    paddingLeft: 0, 
    // paddingBottom: -20,
    marginTop: '-5%',
    marginLeft: -15,
    marginRight: -15,
  }, 

  applicantView: {
    marginLeft: -15,
    marginRight: -15,
    marginBottom: -15,
  },
  applicantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15, 
    marginHorizontal: 15, 
    marginVertical: 10,
    borderRadius: 10,
    // Android shadow properties
    elevation: 5,
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
  },
  applicantStar: {
    marginTop: -3,
    marginLeft: 5,
  },
  applicantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  applicantBio: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    width: '80%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 7,
  },
  applicantRating: {
    fontSize: 14,
    marginLeft: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#f2f3f5',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 7,
    paddingRight: 9,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    marginLeft: 5,
  },

  jobProgressSection: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  progressBar: {
    height: 20,
  },
  jobStatus: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    marginTop: 10,
  },
  buttonText: {
    color: '#4683fc',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
