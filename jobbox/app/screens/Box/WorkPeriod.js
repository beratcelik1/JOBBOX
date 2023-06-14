import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

const WorkPeriodDetails = () => {
  const route = useRoute();
  const { job } = route.params;

  return (
    <View style={styles.container}>
        <View style={styles.jobCard}> 
        <Text style={styles.jobTitle}>{job.title}</Text>
            <View style={[
                styles.jobStatusContainer,
                job.status === 'Applied' && { backgroundColor: '#5ec949' },
                job.status === 'In Progress' && { backgroundColor: '#4683fc' },
                job.status === 'Completed' && { backgroundColor: '#c7c7c7'}
            ]}>
                <Text style={styles.jobStatus}>{job.status}</Text>
            </View>
        </View> 

      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: job.myLocation.latitude,
          longitude: job.myLocation.longitude,
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
      {/* Here you can display more job details */}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '40%',  // Adjust this as needed
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
    shadowOffset: {
      width: 0,
      height: 2,
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

export default WorkPeriodDetails;

