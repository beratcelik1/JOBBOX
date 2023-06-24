import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Marker } from 'react-native-maps'; 
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating'; // Remember to install this package
import { formatDateTime } from '../../utils/formatDateTime';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatScreen from './ChatScreen'; 
import { FlatList } from 'react-native';

const WorkPeriodDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { job } = route.params;
  
  // Extract the date and time from the startDateTime and endDateTime
  const [startDate, startTime] = formatDateTime(job.startDateTime);
  const [endDate, endTime] = formatDateTime(job.endDateTime);

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [starCount, setStarCount] = useState(4.3); // Replace 5 with actual job rating
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem('userId');
      console.log('user:', user);
      setUser(user);
    }
  
    console.log('job:', job._id);
  
    fetchUser();
  }, []);
  
  const handlePress = (title, content) => {
    setModalContent({title, content});
    setModalVisible(true);
  }

  const closeModal = () => {
    setModalVisible(false);
  }

  const onStarRatingPress = (rating) => {
    setStarCount(rating);
  }

  const scrollRef = useRef();


  const fetchConversationId = async (firstUserId, secondUserId) => {
    const response = await fetch(`https://tranquil-ocean-74659.herokuapp.com/conversations/find/${firstUserId}/${secondUserId}/${job._id}`);
    const data = await response.json();
  
    if (response.ok) {
      return data._id;  // Returns the conversation's id
    } else {
      // If not found, create a new conversation and return its id
      if (data.error === 'No valid conversation found') {
        const newConversationResponse = await fetch('https://tranquil-ocean-74659.herokuapp.com/conversations/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId: job._id,
            senderId: firstUserId,
            receiverId: secondUserId,
            // Other necessary fields for creating a new conversation
          }),
        });
        const newConversationData = await newConversationResponse.json();
        if (newConversationResponse.ok) {
          return newConversationData._id;  // Returns the newly created conversation's id
        } else {
          throw new Error(newConversationData.error);
        }
      } else {
        throw new Error(data.error);
      }
    }
  };
  
  const handleChatNavigation = async () => {
    if (user && job) {
      let firstUserId = user;
      let secondUserId = job.postedBy && job.postedBy._id === user ? job.hiredApplicant && job.hiredApplicant._id : job.postedBy && job.postedBy._id;
      console.log('firstUserId:', firstUserId);
      console.log('secondUserId:', secondUserId);
      
      if (firstUserId === secondUserId) {
        // You can handle this error however you want, maybe show a message to the user
        console.error('Cannot start a conversation with yourself.');
        return;
      }
  
      try {
        const conversationId = await fetchConversationId(firstUserId, secondUserId);
        console.log('converstaionID:', conversationId);  // Move this line here
        navigation.navigate('ChatScreen', { jobId: job._id, senderId: user, conversationId,  receiverId: secondUserId});
      } catch (error) {
        // handle error here
        console.error('Failed to get conversation:', error);
      }
    }
  };
  
  
  return (
    <ScrollView 
      ref={scrollRef}
      onContentSizeChange={() => scrollRef.current.scrollToEnd({animated: true})}
      contentContainerStyle={[styles.container, {marginTop: 30}]}
    >

        <View style={styles.jobCard}> 
        <Text style={styles.jobTitle}>{job.title}</Text>
          <View style={[
              styles.jobStatusContainer,
              job.status === 'Applied' && { backgroundColor: '#5ec949' },
              job.status === 'in progress' && { backgroundColor: '#4683fc' },
              job.status === 'Completed' && { backgroundColor: '#c7c7c7'}
          ]}>
              <Text style={styles.jobStatus}>{job.status}</Text>
          </View>
      </View> 
      <MapView 
        style={styles.map}
        initialRegion={{ 
          latitude: 49.939137625826056,
          longitude: -119.39467990636201,
          latitudeDelta: 0.0922, 
          longitudeDelta: 0.0421,
        }}
      >
        <Marker 
          coordinate={job.myLocation}
          title="My Location"
        />
        <Marker 
          coordinate={job.employerLocation}
          title="Employer Location"
        />
      </MapView>
      
       {/* Start and End Times */} 

      <View style={styles.timeContainer}>
        <View style={styles.timeBox}>
          <Text style={styles.timeTitle}>Start</Text>
          <Text style={styles.timeText}>{startDate}</Text>
          <Text style={styles.timeText}>{startTime}</Text>
        </View>
        <View style={styles.timeBox} marginLeft='2%'>
          <Text style={styles.timeTitle}>End</Text>
          <Text style={styles.timeText}>{endDate}</Text>
          <Text style={styles.timeText}>{endTime}</Text>
        </View>
      </View> 
      
     {/* Start of Job Description */}
      <TouchableOpacity onPress={() => handlePress('Job Description', 'This is a sample job description... ')}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#4683fc" marginLeft ="2%" marginRight ="2%" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Job Description</Text>
            <Text style={styles.infoText}>This is a sample job description...</Text>
          </View>
        </View>
      </TouchableOpacity>
      {/* End of Job Description */}

      {/* Start of Message your Employer */}
      <TouchableOpacity onPress={handleChatNavigation}>
        <View style={styles.infoCard}>
          <Ionicons name="chatbubble" size={24} color="#4683fc" marginLeft ="2%" marginRight ="2%" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Message your employer</Text>
            <Text style={styles.infoText}>John Doe</Text>
          </View>
        </View>
      </TouchableOpacity>
      {/* End of Message your Employer/EMPLOYEE */}

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalText}>{modalContent.content}</Text>

            <TouchableOpacity style={styles.buttonClose} onPress={closeModal}>
              <Text style={{ color: 'white', marginLeft: 5 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> 
      {/*End of Modal*/}

      {/* Start of Employer Info */}
      
      {/* Start of Employer Info */}
      <View style={styles.infoCard2}>
        <View><Text style={styles.infoTitle}>Employed By: John Doe</Text></View>
        <View><Text style={styles.infoSubtitle}>About Employer</Text></View>
        <View><Text style={styles.infoText}>This is a brief about for the dummy employer... the dummy employer is not a dummy employer</Text></View>
        <View style = {{flexDirection: 'row', marginTop: 10}}> 
          <Text>Employer Rating:  4.3  </Text>
          <StarRating
              // disabled={false}
              maxStars={5}
              rating={starCount}
              selectedStar={(rating) => onStarRatingPress(rating)}
              starSize={17}
              fullStarColor='#4683fc'
          />

        </View> 
          <TouchableOpacity style={styles.buttonClose2} onPress={() => { console.log("Button Pressed!") }}>
            <Text style={{ color: 'white', marginLeft: 5 }}>Mark as Complete</Text>
          </TouchableOpacity>
      </View> 
      {/* End of Employer Info */}  
  

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalText}>{modalContent.content}</Text>

            <TouchableOpacity style={styles.buttonClose} onPress={closeModal}>
              <Text style={{ color: 'white', marginLeft: 5 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> 
      {/*End of Modal*/} 
    </ScrollView> 
  );
};

const styles = { 
  buttonClose2: {
    // flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4683fc',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
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
    marginTop: 10, // Add this line
    alignSelf: 'center',  // center the button in the card
  },
  infoSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 5,
  },
  buttonComplete: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    marginTop: 20,
  },
  
  container: {
    flex: 1, 
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '30%',
    borderRadius: 5,
  },
  jobCard: {
    flexDirection: 'row',
    flex: '0',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 8,
    marginLeft: 5,
    marginTop: 0,
    marginRight: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  jobTitle: {
    fontSize: 18,
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
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  timeBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 7, 
  },
  timeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 16,
  },
  infoCard: {
    flexDirection: 'row', // updated from 'row'
    alignItems: 'flex-start', // updated from 'center'
    padding: 10,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, 
    marginHorizontal: 5,
  },   
  infoCard2: {
    flexDirection: 'column', // updated from 'row'
    alignItems: 'flex-start', // updated from 'center'
    padding: 10,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, 
    marginHorizontal: 5, 
    marginBottom: 5,
  },
  infoTextContainer: {
    marginLeft: 10,
  },
  infoTitle: {
    fontSize: 18,
  },
  infoText: {
    fontSize: 16,
    marginTop: 2.5,
  }, 

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    
  },
  modalView: {
    height: '80%', // This will cover 80% of the screen height
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -7
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
    elevation: 5
  },
  buttonClose: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginLeft: 10,
    backgroundColor: '#4683fc',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
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
    position: 'absolute',
    bottom: 40,
    marginBottom: 10, 
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  modalText: {
    marginTop: 15
  },
  
  
  
};
export default WorkPeriodDetails;

