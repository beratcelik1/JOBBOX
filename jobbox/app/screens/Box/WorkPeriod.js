import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const WorkPeriodDetails = () => {
  const route = useRoute();
  const { job } = route.params;
  const startTime = 'June 1, 2023';
  const startTimestamp = '8:00 AM';
  const endTime = 'June 30, 2023';
  const endTimestamp = '5:00 PM';

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handlePress = (title, content) => {
    setModalContent({title, content});
    setModalVisible(true);
  }

  const closeModal = () => {
    setModalVisible(false);
  }

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

          // latitude: job.myLocation.latitude,
          // longitude: job.myLocation.longitude,
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
          <Text style={styles.timeText}>{startTime}</Text>
          <Text style={styles.timeText}>{startTimestamp}</Text>
        </View>
        <View style={styles.timeBox} marginLeft='2%'>
          <Text style={styles.timeTitle}>End</Text>
          <Text style={styles.timeText}>{endTime}</Text>
          <Text style={styles.timeText}>{endTimestamp}</Text>
        </View>
      </View> 
      

     {/* Start of Job Description */}
     <TouchableOpacity onPress={() => handlePress('Job Description', 'This is a sample job description...')}>
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
      <TouchableOpacity onPress={() => handlePress('Message your Employer', 'John Doe')}>
        <View style={styles.infoCard}>
          <Ionicons name="chatbubble" size={24} color="#4683fc" marginLeft ="2%" marginRight ="2%" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Message your employer</Text>
            <Text style={styles.infoText}>John Doe</Text>
          </View>
        </View>
      </TouchableOpacity>
      {/* End of Message your Employer */}

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
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '40%',
    borderRadius: 5,
  },
  jobCard: {
    flexDirection: 'row',
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
    marginTop: 15,
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoTextContainer: {
    marginLeft: 10,
  },
  infoTitle: {
    fontSize: 18,
  },
  infoText: {
    fontSize: 16,
  }, 


  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.1)',
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonClose: {
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

