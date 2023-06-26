import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Marker } from 'react-native-maps'; 
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating'; // Remember to install this package
import { formatDateTime } from '../../utils/formatDateTime';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatScreen from './ChatScreen';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { showMessage } from "react-native-flash-message";

const WorkPeriodDetails = ({ job: jobProp, closeModal }) => {  
  const navigation = useNavigation();
  const [job, setJob] = useState(jobProp);
  const [startDate, startTime] = formatDateTime(job.startDateTime);
  const [endDate, endTime] = formatDateTime(job.endDateTime);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [starCountRating, setStarCountRating] = useState(0);

  const [starCount, setStarCount] = useState(4.3); // Replace 5 with actual job rating
  const [user, setUser] = useState(null); 
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isJobPoster, setIsJobPoster] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [jobDescription, setJobDescription] = useState(job.description);
  const [editableJobDescription, setEditableJobDescription] = useState(job.description);
  const [hiredApplicant, setHiredApplicant] = useState();

  

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem('userId');
      console.log('AsyncStorage user:', user); // This will log the result of AsyncStorage.getItem('userId')
      
      // User id should be a string, no need to parse
      console.log('Parsed user:', user); // This will log the parsed user
      setUser(user);
    }
    
    console.log('job:', job._id);
    fetchUser();
  }, []);
  
  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem('userId');
      console.log('AsyncStorage user:', user); // This will log the result of AsyncStorage.getItem('userId')
      
      // User id should be a string, no need to parse
      console.log('Parsed user:', user); // This will log the parsed user
      setIsJobPoster(String(user) === String(job.postedBy._id));
    }
  
    checkUser();
  }, []);  

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const fetchJob = async () => {
    const response = await fetch('https://tranquil-ocean-74659.herokuapp.com/jobs/' + job._id);
    const data = await response.json();
    if (response.ok) {
        setJob(data); // set the fetched job
    } else {
        throw new Error(data.error);
    }
}

  useEffect(() => {
    fetchJob(); // fetch job details when the component mounts
    }, []);



  const saveEditedJobDescription = async () => {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await fetch('https://tranquil-ocean-74659.herokuapp.com/jobs/' + job._id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // replace token with your actual token
        },
        body: JSON.stringify({
          description: editableJobDescription,
        }),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.error);
      }
  
      // If save successful, update the jobDescription state
      setJobDescription(editableJobDescription);
      setEditModalVisible(false);
      fetchJob();
    } catch (error) {
      console.log('Failed to save job description:', error);
    }
  };
  
  
  const handlePress = (title, content) => {
    setModalContent({title, content});
    setModalVisible(true);
  }

  const closeModalFun = () => {
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
  

  const [secondUser, setSecondUser] = useState(null);

const handleChatNavigation = async () => {
  if (user && job) {
    let firstUserId = user;
    let secondUserId = job.postedBy._id && job.postedBy._id === user ? job.hiredApplicant._id : job.postedBy._id;

    if (firstUserId === secondUserId) {
      // You can handle this error however you want, maybe show a message to the user
      console.error('Cannot start a conversation with yourself.');
      return;
    }

    try {
      const convId = await fetchConversationId(firstUserId, secondUserId);
      console.log('converstaionID:', convId); // Move this line here
      setConversationId(convId); // Store the conversationId in the state
      setChatModalVisible(true); // Open the chat modal
      setSecondUser(secondUserId); // Set the second user
    } catch (error) {
      // handle error here
      console.error('Failed to get conversation:', error);
    }
  }
};

const patchStatusComplete = async () => {
  try {
    const response = await fetch(`https://tranquil-ocean-74659.herokuapp.com/jobs/${job._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'Completed',
      }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Job marked as completed:', data);
      navigation.navigate('Box');
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Failed to mark job as completed:', error);
  }
};

const handleConfirmMarkAsComplete = async () => {
  setStarCountRating(0);

  if(starCountRating === 0) {
    Alert.alert(
      "Please rate the job",
      "Please rate the job before marking it as complete",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
      ],
      { cancelable: false }
    );
    return;
  } 

  patchStatusComplete();
  setAlertModalVisible(false);
};


  return (
    <View style={styles.container}>
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
      <TouchableOpacity onPress={() => handlePress('Job Description', job.description)}>
          <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color="#4683fc"/>
              <View style={{...styles.infoTextContainer, flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 1}}>
                      <Text style={styles.infoTitle}>Job Description</Text>
                      <Text style={styles.infoText}>
                      {job.description.length > 20 
                        ? `${job.description.substring(0, 20)}...` 
                        : job.description}
                      </Text>
                  </View>
                  {isJobPoster && 
                      <View>
                          <TouchableOpacity onPress={handleEdit}>
                              <Ionicons name="pencil-outline" size={24} color="#4683fc" />
                          </TouchableOpacity>
                      </View>
                  }
              </View>
          </View>
      </TouchableOpacity>
      {/* End of Job Description */}

      {/* Edit Job Description Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Job Description</Text>
            <TextInput 
              style={styles.input}
              multiline
              value={editableJobDescription}
              onChangeText={setEditableJobDescription}
            />
            <Button title="Save" onPress={saveEditedJobDescription} />
            <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
          </View>
        </View>
      </Modal>
      {/* End of Edit Job Description Modal */}

      {/* Start of Message your Employer */}
      <TouchableOpacity onPress={handleChatNavigation}>
      <View style={styles.infoCard}>
        <Ionicons name="chatbubble" size={24} color="#4683fc" marginLeft ="2%" marginRight ="2%" />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>
            {user === job.postedBy._id ? 'Message your Employee' : 'Message your Employer'}
          </Text>
          <Text style={styles.infoText}>
            {user === job.postedBy._id ? `${String(job.hiredApplicant.firstname)} ${String(job.hiredApplicant.lastname)}` :`${String(job.postedBy.firstname)} ${String(job.postedBy.lastname)}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
      {/* End of Message your Employer/EMPLOYEE */}

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModalFun}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalText}>{modalContent.content}</Text>

            <TouchableOpacity style={styles.buttonClose} onPress={closeModalFun}>
              <Text style={{ color: 'white', marginLeft: 5 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> 
      {/*End of Modal*/}

      {/* Start of Employer Info */}
      {user === job.postedBy._id ? 
        // Show Employee Information
        <View style={styles.infoCard2}>
          <View><Text style={styles.infoTitle}>Employee: {job.hiredApplicant?.firstname} {job.hiredApplicant?.lastname}</Text></View>
          <View><Text style={styles.infoSubtitle}>About Employee</Text></View>
          <View><View>
                {job.hiredApplicant.about.map((item, index) => (
                  <Text key={index} style={styles.infoText}>{item.description}</Text>
                ))}
              </View>
            </View>
          <View style = {{flexDirection: 'row', marginTop: 10}}> 
            <Text>Employee Rating:  4.3  </Text>
            <StarRating
                // disabled={false}
                maxStars={5}
                rating={starCount}
                selectedStar={(rating) => onStarRatingPress(rating)}
                starSize={17}
                fullStarColor='#4683fc'
            />

        </View> 
          <TouchableOpacity style={styles.buttonClose2} onPress={() => setAlertModalVisible(true)}>
            <Text style={{ color: 'white', marginLeft: 5 }}>Mark as Complete</Text>
          </TouchableOpacity>
        </View> 
      :
        // Show Employer Information
        <View style={styles.infoCard2}>
          <View><Text style={styles.infoTitle}>Employer: {job.postedBy.firstname} {job.postedBy.lastname}</Text></View>
          <View><Text style={styles.infoSubtitle}>About Employer</Text></View>
          <View>
          <View>
          {job.postedBy.about.map((item, index) => (
            <Text key={index} style={styles.infoText}>{item.description}</Text>
          ))}
        </View>
            </View>
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
      }
      {/* End of Employer Info */}  

      <View style = {{flex:1}}> 
      </View>
        <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
            <Text style={{ color: '#4683fc', marginLeft: 5 }}>Close</Text>
        </TouchableOpacity>
      
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModalFun}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalText}>{modalContent.content}</Text>

            <TouchableOpacity style={styles.buttonClose} onPress={closeModalFun}>
              <Text style={{ color: 'white', marginLeft: 5 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>  
      {/*End of Modal*/}   

      {/* chat Modal */}
      
  <Modal
    animationType="slide"
    transparent={true}
    visible={chatModalVisible}
    onRequestClose={() => setChatModalVisible(false)} // This will close the modal when back is pressed
  >
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      <PanGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.oldState === State.ACTIVE) {
            setChatModalVisible(false);
          }
        }}
        direction="down"
      >
        <View style={{ height: '92%', backgroundColor: 'white', shadowColor: '#000',
        shadowOffset: {width: 0,height: 2,},
        shadowOpacity: 0.25,
        shadowRadius: 6.84,
        elevation: 5, borderRadius: 10 }}>
          <View style = {{height: 55, marginTop: 10}}>
            <TouchableOpacity style={styles.closeBtn2} onPress={closeModal}>
               <Ionicons name="close-circle" size={24} color="#4683fc" marginLeft = "1%"/>
            </TouchableOpacity>
          </View>
          <ChatScreen jobId={job._id} senderId={user} conversationId={conversationId} closeModal={() => setChatModalVisible(false)} />
        </View>
      </PanGestureHandler>
    </View>
  </Modal>

      {/*End of Modal*/}

      {/* Start of Mark as Complete Alert */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertModalVisible}
      >
        <View style={styles.alertModal}>
          <View style={styles.alertModalView}>
            <Text style={styles.alertModalText}>Mark as complete</Text>
            <Text style={styles.alertModalSubText}>Please rate your employer before marking the job as complete.</Text>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={starCountRating}
              selectedStar={(rating) => setStarCountRating(rating)}
            />
            <View style={styles.alertModalActionButtons}>
              <TouchableOpacity style={styles.alertModalButton} onPress={() => setAlertModalVisible(false)}>
                <Text style={styles.alertModalTextStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.alertModalButton} onPress={handleConfirmMarkAsComplete}>
                <Text style={styles.alertModalTextStyle}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* End of Mark as Complete Alert */}

    </View> 
  );
};

const styles = { 
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '5%',  // adjust this value for your needs
    backgroundColor: 'white',
    borderRadius: 20,
},
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
    marginTop: 70
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
    marginBottom: 10,
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
  closeBtn2: { 
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginLeft: 10,
    backgroundColor: '#fff',
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
    bottom: 40,
    marginBottom: -5, 
    marginTop: 20,
    alignSelf: 'center'
  }, 
  closeBtn: { 
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginLeft: 10,
    backgroundColor: '#fff',
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
    bottom: 40,
    marginBottom: -5, 
    marginTop: 20,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  modalText: {
    marginTop: 15
  },
  
  // alert modal
  alertModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  alertModalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  alertModalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
    marginTop: 15,
  },
  alertModalTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  alertModalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  alertModalSubText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  alertModalActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '50%'
  }
};
export default WorkPeriodDetails;

